const User = require('../model/userModel');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const asyncHandler = require('express-async-handler');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports.uploadAvatar = upload.single('avatar');

module.exports.authMe = asyncHandler(async (req, res) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ msg: 'Not authenticated' });
    }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ user });
    
});


module.exports.register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) return res.status(400).json({ msg: 'Username already exists', status: false });
    if( username.length < 3) return res.status(400).json({msg: 'Minimum length of username should be 3.'});
    const emailCheck = await User.findOne({ email });
    if (emailCheck) return res.status(400).json({ msg: 'Email already exists', status: false });
    if( password.length < 8 ) return res.status(400).json({msg: 'Minimum length of the password should be 8.'});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash( password, salt );
    const user = await User.create({
        email,
        username,
        password: hashedPassword
    });

    delete user.password;
        
    if (user) {
        generateToken(res, user._id);
        res.status(201).json({ status: true, user });
        
      } else {
        res.status(400);
        throw new Error('Invalid user data');
      }
    
});

module.exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ msg: 'Incorrect Username or Password.', status: false });
    }

    generateToken(res, user._id);
    delete user.password;
    res.json({ _id : user._id, username: user.username, email: user.email, isAvatarImageSet: user.isAvatarImageSet , avatarImage: user.avatarImage });
});

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  };

module.exports.setAvatar = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const avatarImage = req.file.buffer.toString('base64');
    const userData = await User.findByIdAndUpdate(userId, { isAvatarImageSet: true, avatarImage }, { new: true });

    if (!userData) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
});

module.exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user.id } }).select(['email', 'username', 'avatarImage', '_id']);
    res.json(users);
});

// module.exports.protect = asyncHandler((req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) {
//         return res.status(401).json({ msg: 'Not authenticated' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ msg: 'Invalid token' });
//     }
// });
