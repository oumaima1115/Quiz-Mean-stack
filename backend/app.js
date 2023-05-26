const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const postsRoutes = require("./routes/posts");
const quizzesRoutes = require("./routes/quizzes");
const responsesRoutes = require("./routes/responses");
const quizEssaysRoutes = require("./routes/quizEssays");
const quizTestRoutes = require("./routes/quizTest");

const app = express();

mongoose
    .connect(
        "mongodb+srv://max:kZzXVlqYQttuHUs6@cluster0.o316b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("connect to database!");
    })
    .catch(()=> {
        console.log("connection failed");
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use("/images", express.static(path.join("backend/images")));
    
    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
      );
      next();
    });
    
    app.use("/api/user", userRoutes);
    app.use("/api/posts", postsRoutes);
    app.use("/api/quizzes", quizzesRoutes);
    app.use("/api/responses", responsesRoutes);
    app.use("/api/quizEssays", quizEssaysRoutes);
    app.use("/api/quizTest", quizTestRoutes);
    
    
    module.exports = app;
    