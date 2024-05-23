const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.get('/',(req, res)=> res.send('hello world this is new text.'));
const port = process.env.PORT || 5000 ;
app.listen(port, ()=> console.log('server started'));