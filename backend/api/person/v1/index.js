const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Person = require('../../../models/Person');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Register Person
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if person already exists
        const existingPerson = await Person.findOne({ email });
        if (existingPerson) {
            return res.status(400).json({ message: 'Person with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const person = new Person({ name, email, password: hashedPassword });
        await person.save();

        res.status(201).json({
            message: 'Person registered successfully',
            person: { name, email }
        });
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

        // Generate JWT
        const token = jwt.sign(
            { id: person._id, email: person.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            person: { id: person._id, name: person.name, email: person.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Logout Person
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
