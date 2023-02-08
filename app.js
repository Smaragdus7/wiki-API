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

//Get all articles
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

//Get a specific article
app.get('/articles/:id', (req, res) => { 
  Article.findOne({_id: req.params.id}, function(err, foundArticle) {
    if(!err) {
      res.send(foundArticle);
    }
    else {
      res.send(err);
    }  
  });
});

//Post an article
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

//Delete all articles
app.delete('/articles', (req, res) => {
  Article.deleteMany(function(err){
    if(!err) {
      res.send("Articles Successfully deleted!");
    }
    else {
      res.send(err);
    }
  });
});

//Delete a specific article***********
app.delete('/articles/:id', (req, res) => {
  Article.findByIdAndRemove({_id: req.params.id}, function(err) {
    if(!err) {
      res.send("Article Successfully deleted!");
    }
    else {
      res.send(err);
    }
  });
});

//Put a specific article******
app.put("/articles/:id", async (req, res) => {
  const { id } = req.params;
  Article.updateOne({ id }, req.body);
  const updatedArticle = Article.findById(id);
  return res.status(200).json(updatedArticle);
});

//Path a specific article*********
app.patch('/articles/:id', (req, res) => {
  Article.findByIdAndUpdate(req.params.id, req.body, {new: true}).then((article) => {
    if (!article) {
      return res.status(404).send();
    }
    res.send(article);
  }).catch((error) => {
    res.status(500).send(error);
  })
});

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
