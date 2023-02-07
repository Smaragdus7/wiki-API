const express = require("express");
const bodyParser = require("body-parser");
const { Router } = require("express");
//var _ = require('lodash');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connection
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
mongoose.set('strictQuery', false);

//Schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

//Model
const Article = mongoose.model('Article', articleSchema);

app.get('/articles', (req, res) => { 
    Article.find({}, function(err, foundArticles) {
        if(!err) {
            res.send(foundArticles);
        }
        else {
            res.send(err);
        }  
  });
});

app.post('/articles', (req, res) => {
  const newArticle = Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err) {
    if(!err) {
      res.send('Successfully saved!');
    }
    else {
      res.send(err);
    }
  });
});

app.delete('/articles', (req, res) => {
  Article.deleteMany(function(err){
    if(!err) {
      res.send("Successfully deleted!");
    }
    else {
      res.send(err);
    }
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
