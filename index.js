require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI);

app.use('/api', require('./routes/api'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on port ${port}`));