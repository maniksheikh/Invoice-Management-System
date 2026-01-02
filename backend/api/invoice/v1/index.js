const express = require('express');
const router = express.Router();
const Invoice = require('../../../models/Invoice');

// Create Invoice
router.post('/', async (req, res) => {
    try {
        const { number, client, date, amount, status } = req.body;
        const invoice = new Invoice({ number, client, date, amount, status });
        await invoice.save();
        res.status(201).json({ message: 'Invoice created successfully', invoice });
    } catch (error) {
        res.status(500).json({ message: 'Error creating invoice', error: error.message });
    }
});

// List Invoices
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoices', error: error.message });
    }
});

// Get Single Invoice by Number
router.get('/number/:number', async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ number: req.params.number });
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoice', error: error.message });
    }
});

// Get Single Invoice
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoice', error: error.message });
    }
});

// Update Invoice Status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['paid', 'unpaid', 'overdue'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json({ message: 'Invoice status updated successfully', invoice });
    } catch (error) {
        res.status(500).json({ message: 'Error updating invoice status', error: error.message });
    }
});

// Update Invoice
router.put('/:id', async (req, res) => {
    try {
        const { number, client, date, amount, status } = req.body;
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { number, client, date, amount, status },
            { new: true }
        );
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json({ message: 'Invoice updated successfully', invoice });
    } catch (error) {
        res.status(500).json({ message: 'Error updating invoice', error: error.message });
    }
});

// Delete Invoice
router.delete('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting invoice', error: error.message });
    }
});

module.exports = router;
