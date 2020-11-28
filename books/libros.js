var mongoose = require('mongoose');  
var BookSchema  = new mongoose.Schema({  
  title: String,
  isbn: String,
  pageCount: Number,
  IDpublisher: Number,
  language: String,
  country: String,
  publishedDate: Date,
  description: String,
  status: String,
  authors: Array,
  categories: Array
});
mongoose.model('libros', BookSchema);
// Exportamos como módulo
module.exports = mongoose.model('libros');


