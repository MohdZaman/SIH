import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Please provide a name'], trim: true },
        email: { type: String, required: [true, 'Please provide an email'], unique: true, lowercase: true },
        password: { type: String, required: [true, 'Please provide a password'], minlength: 6, select: false },
        role: { type: String, enum: ['user', 'admin', 'msme'], default: 'user' }
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);