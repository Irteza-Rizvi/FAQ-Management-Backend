const express = require('express');
const router = express.Router();
const {
  addFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
} = require('../controllers/faqController');
const protect = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

//POST / add-faq
router.post('/add-faq', protect, checkRole('admin'), addFaq);

//UPDATE FAQ
router.put('/update-faq/:id', protect, checkRole('admin'), updateFaq);

//DELETE FAQ
router.delete('/delete-faq/:id', protect, checkRole('admin'), deleteFaq);

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

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST /api/faqs/ask → Ask question to bot
router.post('/ask', async (req, res) => {
  const { question } = req.body;
  try {
    const faqs = await Faq.find();
    const faqText = faqs
      .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
      .join('\n\n');

    const prompt = `
You are a helpful FAQ bot. Based on the following FAQs, answer the user's question.

${faqText}

User Question: ${question}
Answer:
`;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.5,
    });

    const answer = response.data.choices[0].text.trim();
    res.json({ answer });
  } catch (err) {
    res
      .status(500)
      .json({ message: '❌ Error answering question', error: err.message });
  }
});

module.exports = router;
