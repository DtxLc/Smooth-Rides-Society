const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20, },
    password: { type: String, required: true, minlength:6, },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, },
    profilePicture: { type: String, default: "/images/default-profile.png", },
    bio: { type: String, maxlength: 200, default: "", },
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
});

//Compare passwords
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
