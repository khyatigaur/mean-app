const express = require('express');
const bodyParser = require('body-parser');
const postsRoutes = require("./routes/posts");
const app = express();
// const Post = require('./models/post');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://khyati:Oveh8xW8YmERbzGl@cluster0-nwcjj.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("connection failed!")
  });




app.use(bodyParser.json());                                     //for parsing json request data
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE");
  next();
});


app.use("/api/posts", postsRoutes);







// app.use((req, res, next) => {
//   res.send('in second middleware');
// });

module.exports = app;       //exporting app to other files like server.js

