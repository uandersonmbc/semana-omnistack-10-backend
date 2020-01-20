const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require('cors')
const routes = require('./routes');
const app = express();

dotenv.config()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-xopuw.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

app.use(cors());

app.use(express.json());

app.use(routes);

app.listen(process.env.PORT || 3333);
