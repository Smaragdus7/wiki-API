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

//DB Connection
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
mongoose.set('strictQuery', false);

//Schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

//Model
const Article = mongoose.model('Article', articleSchema);

// C R U D    O P E R A T I O N S
//All articles
app.route('/articles')
.get((req, res) => { 
  Article.find({}, function(err, foundArticles) {
    if(!err) {
      res.send(foundArticles);
    }
    else {
      res.send(err);
    }  
  });
})
.post((req, res) => {
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
})
.delete((req, res) => {
  Article.deleteMany(function(err){
    if(!err) {
      res.send("Articles successfully deleted!");
    }
    else {
      res.send(err);
    }
  });
});

//A specific article
app.route('/articles/:articleTitle')
.get((req, res) => { 
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
    if(!err) {
      res.send(foundArticle);
    }
    else {
      res.send(err);
    }  
  });
})
.put((req, res) => {
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content:req.body.content},
    {overwrite: true},
    function(err) {
    if(!err) {
      res.send("Article successfully updated!");
    }
    else {
      res.send(err);
    }  
  });
})
.patch((req, res) => {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err) {
    if(!err) {
      res.send("Article successfully patched!");
    }
    else {
      res.send(err);
    }  
  });
})
.delete((req, res) => {
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err) {
    if(!err) {
      res.send("Article successfully deleted!");
    }
    else {
      res.send(err);
    }  
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
