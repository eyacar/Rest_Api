var mongoose = require('mongoose');  
var PublisherSchema  = new mongoose.Schema({  
  id: Number,
  publisher: String,
  country: String
});
mongoose.model('editoriales', PublisherSchema);
module.exports = mongoose.model('editoriales');