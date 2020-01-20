const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const PointSchema = require('./utils/PointSchema');

const DevsSchema = new mongoose.Schema({
    name: String,
    password: {
        type: String,
        required: true,
    },
    github_username: {
        type: String,
        unique: true,
        require: true
    },
    bio: String,
    avatar_url: String,
    techs: [String],
    location: {
        type: PointSchema,
        index: '2dsphere'
    }
});

DevsSchema.pre("save", async function hashPassword(next) {
    if (!this.isModified("password")) next();

    this.password = await bcrypt.hash(this.password, 8);
});

DevsSchema.methods = {
    compareHash(hash) {
        return bcrypt.compare(hash, this.password);
    },

    generateToken() {
        return jwt.sign({ id: this.id }, process.env.SECRET, {
            // expiresIn: 3600 * 24
            expiresIn: 3600
        });
    }
};

module.exports = mongoose.model('Dev', DevsSchema);
