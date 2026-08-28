import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            success: true,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};