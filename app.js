//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////////////////API for all the articles////////////////////////////

app.route("/articles")

.get(function(req, res){
    Article.find({}, function(err, foundArticles){
        console.log(foundArticles);
        res.send(foundArticles);
    });
})

.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully saved the article to DB.")
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("All documents deleted successfully.")
        }
        else{
            res.send(err);
        }
    });
});

////////////////////////////////////for specific aticle//////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No article found with searched title");
        }
    });
})

.put(function(req, res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated the article.");
            }
            else{
                res.send(err);
            }
        }
    );
})

.patch(function(req, res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated the article.");
            }
            else{
                res.send(err);
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("deleted successfully");
            }
            else{
                res.send(err);
            }
        }
    );
});


app.listen(3000, function(){
    console.log("Sever started at port 3000.");
});