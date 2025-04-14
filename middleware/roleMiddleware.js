const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next(); //user has the role
    } else {
      return res
        .status(403)
        .json({ message: 'Access denied: Insufficient role' });
    }
  };
};

module.exports = checkRole;
