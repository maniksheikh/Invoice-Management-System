const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    client: { type: String, required: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'unpaid', 'overdue'], default: 'unpaid' },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
