const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Person Schema
const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Person = mongoose.models.Person || mongoose.model('Person', personSchema);

// Register Person
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const person = new Person({ name, email, password: hashedPassword });
        await person.save();
        res.status(201).json({ message: 'Person registered successfully', person: { name, email } });
    } catch (error) {
        res.status(500).json({ message: 'Error registering person', error: error.message });
    }
});

// Login Person
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const person = await Person.findOne({ email });
        if (!person || !(await bcrypt.compare(password, person.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.json({ message: 'Login successful', person: { name: person.name, email: person.email } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Logout Person
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
