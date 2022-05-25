const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("dotenv").config();
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Give every day the change to become the most beautiful day of your life."
const aboutContent = "Basically this web app helps us daily tasks which need to be completed. And we can delete the task after it gets completed.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const blogSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  {
    timestamps: true,
  }
);
const Blog = mongoose.model("blog", blogSchema);

app.get("/", function (req, res) {
  // The res.render() function is used to render a view and sends the rendered HTML string to the client.
  Blog.find({}, function (err, blogs) {
    res.render("home", { content: homeStartingContent, postArr: blogs });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { content: aboutContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/compose", function (req, res) {
  //JS Object
  const blog = new Blog({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  blog.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

let blogId;
app.get("/posts/:postId", function (req, res) {
  blogId = req.params.postId;
  Blog.findOne({ _id: blogId }, function (err, blog) {
    res.render("post", { postTitle: blog.title, postContent: blog.content });
  });
});

app.post("/deleteBlog", (req, res) => {

  Blog.deleteOne({ _id: blogId }, function (err) {
    res.redirect("/");
  });
});

let port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server Started at PORT : ${port}`);
});
