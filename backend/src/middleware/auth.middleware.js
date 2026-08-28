import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
    let token;

    // Check if the token exists in the headers and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token using the secret key from .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user in DB and attach it to the request (hiding password)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move to the actual route controller
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};