const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('.//utils/sendEmail');

//helper to create token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1d' });
};

//register
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: 'User already exists' });

    const newUser = await User.create({ email, password });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid Credentials!' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid Credentials!' });

    const token = generateToken(user);
    res.json({ message: 'Login successful', token });
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

//forget password
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = DataTransfer.now() + 15 * 60 * 1000; //15mins
  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/auth/reset-password/${resetToken}`;
  await sendEmail(user.email, 'Password Reset', `Reset link: ${resetUrl}`);

  res.status(200).json({ message: 'Password reset link sent!' });
};

//reset password
exports.resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: 'Invalid or Expired Token' });
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset Successfully!' });
};
