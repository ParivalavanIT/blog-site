//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent =
  "Welcome to our blog! Explore the latest thoughts, stories, and news from our vibrant community. Engage, learn, and share your perspectives with fellow readers.";
const aboutContent =
  "Our journey began with a passion for storytelling. We strive to provide a platform for diverse voices, inspiring narratives, and insightful discussions.";
const contactContent =
  "Have any questions or feedback? We'd love to hear from you! Reach out to us through the form below or connect via our social media channels.";

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({})
    .then((foundPosts) => {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: foundPosts,
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("error");
    });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postTitle", function (req, res) {
  const requestedTitle = req.params.postTitle;

  Post.findOne({ title: requestedTitle })
    .then((foundPost) => {
      if (foundPost) {
        res.render("post", {
          postTitle: foundPost.title,
          postBody: foundPost.body,
        });
      } else {
        res.render("postNotFound");
      }
    })
    .catch((err) => {
      console.error(err);
      res.render("error");
    });
});

app.post("/compose", async function (req, res) {
  try {
    const post = new Post({
      title: req.body.postTitle,
      body: req.body.postBody,
    });

    await post.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
   
    res.render("error");
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
