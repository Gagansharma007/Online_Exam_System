const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports.uploadAvatar = upload.single('avatar');


module.exports.register = async (req, res, next ) =>{
    try{
        const {username , email, password} = req.body;
    const usernameCheck= await User.findOne({ username });
    if(usernameCheck)
    return res.json({msg: 'Username already exists', status: false});
    const emailCheck = await User.findOne({ email });
    if(emailCheck)
    return res.json({msg: 'Email already exists', status: false});
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        email,
        username, 
        password: hashedPassword
    });
    delete user.password;
    return res.json({status: true, user});
    }
    catch(err){
        next(err);
    }
};

module.exports.login = async (req, res, next ) =>{
    try{
        const {username , password} = req.body;
    const user = await User.findOne({ username });
    if(!user)
    return res.json({msg: 'Incorrect Username or Password.', status: false});
        const isPasswordValid = await bcrypt.compare(password , user.password);
    if (!isPasswordValid)
        return res.json({msg: 'Incorrect Username or Password.', status: false});
    delete user.password;
    return res.json({status: true, user});
    }
    catch(err){
        next(err);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const avatarImage = req.file.buffer.toString('base64');        
        const userData = await User.findByIdAndUpdate(userId, { isAvatarImageSet: true, avatarImage }, { new: true });

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the updated user data
        return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
    } catch (err) {
        console.error('Error setting avatar:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getAllUsers = async ( req, res, next ) => {
    try{
        const users = await User.find({_id: { $ne: req.params.id }}).select(['email', 'username', 'avatarImage' , '_id']);
        return res.json(users);

    } catch(err){
        next(err);
    }
};