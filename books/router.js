var express = require('express');
require('dotenv').config()
var router = express.Router();
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.url;


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const path = require('path');
var Publisher = require(path.join(__dirname+ '/editoriales'));
var Book = require(path.join(__dirname+ '/libros'));

router.get('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    Book.find({}, (err, book) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando todas las peliculas"});
        res.status(200).send(book);
    });
});


router.get('/libro/:titulo', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    var titulo = req.params.titulo 
    Book.findOne({ title: titulo.replace("_"," ") }, (err, book) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando todos los libros"});
        if (!book) return res.status(404).send({"error":"404"});
        res.status(200).send(book);
    });
});

router.get('/isbn/:isbn', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    var isbn = req.params.isbn
    Book.findOne({ isbn: isbn}, (err, book) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando todos los libros"});
        if (!book) return res.status(404).send({"error":"404"});
        res.status(200).send(book);
    });
});

router.get('/autor/:autor', function (req, res) {
res.header('Access-Control-Allow-Origin', '*');

MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
    const dbo = db.db('libreria');  
    var libros = [];
    dbo.collection('libros').find().forEach((datos) => {
    for (book of datos.authors){ 
    if (book === req.params.autor.replace("_"," ")){  		
        libros.push(datos);
    }}}, ()=>{
        if (libros.length>0){res.status(200).send(libros)}
        else{res.status(404).send("Autor no encontrado: " + req.params.autor.replace("_"," "))}
    });
  });

});

router.get('/editorial', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    Publisher.find({}, (err, book) =>{
        if (err) return res.status(500).send({"error":"Problemas buscando todas las peliculas"});
        res.status(200).send(book);
    });
});

router.get('/editorial/:editorial', function (req, res) {


    MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("libreria");
        dbo.collection('libros').aggregate([
            { $lookup:
                {
                from: 'editoriales',
                localField: 'IDpublisher',
                foreignField: 'id',
                as: 'editoriales'
                }
                },
            {$unwind:'$editoriales'},
                {$project:{            
                "_id": 0,
                "title": 1,
                "isbn":1,
                "editoriales.publisher":1     
                }}
        ]).toArray(function(err, data) {
        if (err) return res.status(500).send({"error":"Problemas buscando los autores"});
        var libros = []
        for (editorial of data){
        var editoriales = req.params.editorial.toLowerCase()
        if (editorial.editoriales.publisher.toLowerCase() === editoriales.replace("_"," ")){
        libros.push(editorial)
        }
        }
        if (libros.length>0) return res.status(200).send(libros);
        else {res.status(404).send("Editorial no encontrada: " + editoriales.replace("_"," "))};
        
        db.close();
        });
        });


});



module.exports = router;