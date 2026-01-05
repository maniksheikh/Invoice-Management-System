const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    uid: { type: String },
    photoURL: { type: String },
    displayName: { type: String },
    isVerified: { type: Boolean, default: false },
    plan: { type: String, default: 'Free Plan' },
    createdAt: { type: Date, default: Date.now }
});

const Person = mongoose.models.Person || mongoose.model('Person', personSchema);

module.exports = Person;
