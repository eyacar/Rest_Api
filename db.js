var mongoose = require('mongoose');
require('dotenv').config()
const conexion = process.env.url;
mongoose.connect(conexion ,{useNewUrlParser: true, useUnifiedTopology: true});