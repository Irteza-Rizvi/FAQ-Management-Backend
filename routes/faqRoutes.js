const express = require('express');
const router = express.Router();
const { addFaq, getFaqs } = require('../controllers/faqController');
const protect = require('../middleware/authMiddleware');

//POST / add-faq
router.post('/add-faq', protect, addFaq);

//UPDATE FAQ
router.put('/update-faq/:id', protect, updateFaq);

//DELETE FAQ
router.delete('/delete-faq/:id', protect, deleteFaq);

//GET /faq
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json(faqs);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching FAQs', error: err.message });
  }
});

module.exports = router;
