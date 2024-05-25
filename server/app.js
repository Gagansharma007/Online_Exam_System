const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Database connection successful.");
}).catch((err)=>{
    console.log(err.message);
});
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth',userRoutes);
const port = process.env.PORT || 5000 ;
const server = app.listen(port, ()=> console.log(`server started at ${port}`));