const Faq = require('../model/Faq');

//ADD FAQS (CREATE)
exports.addFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFaq = new Faq({ question, answer });
    await newFaq.save();
    res.status(201).json({ message: 'FAQ added' });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
};

//get all FAQS (READ)
exports.getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching FAQs' });
  }
};

//UPDATE
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const updatedFaq = await Faq.findByIdUpdate(
      id,
      { question, answer },
      { new: true }
    );
    if (!updatedFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json({ message: 'FAQ updated', faq: updatedFaq });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
};

//DELETE FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFaq = await Faq.findByIdAndDelete(id);
    if (!deletedFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json({ message: 'FAQ Deleted!' });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
};
