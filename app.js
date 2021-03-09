//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();


mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: String
});

const Blog = mongoose.model("blog", blogSchema);



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){

  Blog.find({}, (err, blogResult)=>{
    if (err) {
      console.log(err);
    }else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: blogResult
        });
    }
  });



});

app.post("/delete", (req, res)=>{
  const appID = req.body.delItem;
  console.log(appID);
  Blog.findByIdAndRemove(appID, (err)=>{
    if (!err) {
      console.log("removed");

    }
    res.redirect("/");
  });

  Blog.findOne({_id: appID}, (err, result)=>{
    if (!err) {

    }
  });
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Blog({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save();

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
  console.log(requestedTitle);
  Blog.findOne({title: req.params.postName}, (err, blogResult)=>{
    if (err) {
      console.log(err);
    }else {
      res.render("post", {
        title: blogResult.title,
        content: blogResult.content
      });
    }
  });

});

let port = 3000//process.env.PORT;
app.listen(port, function() {
  console.log("Server started on port 3000");
});
