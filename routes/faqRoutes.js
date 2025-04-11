const express = require('express');
const router = express.Router();
const { addFaq, getFaqs } = require('../controllers/faqController');

//POST / add-faq
router.post('/add-faq', addFaq);

//GET /faq
router.get('/faqs', getFaqs);

//UPDATE FAQ
router.put('/update-faq/:id', updateFaq);

//DELETE FAQ
router.delete('/delete-faq/:id', deleteFaq);

module.exports = router;
