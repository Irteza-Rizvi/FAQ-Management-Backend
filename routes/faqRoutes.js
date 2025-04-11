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
router.get('/faqs', getFaqs);

module.exports = router;
