const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { notFound , errorHandler } = require('./Middlewares/errorMiddleware.js');

const quizRoutes = require('./routes/quizRoutes.js');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connection successful.");
}).catch((err) => {
    console.log(err.message);   
});

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', userRoutes);
app.use('/api/test', quizRoutes );

app.use( notFound );
app.use(errorHandler);
const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Server started at ${port}`));

module.exports = app;