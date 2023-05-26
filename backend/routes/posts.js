const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    var answer;
    var answerObject={option:null, response:null};
    var correctChoices=0;
    var numberOfChoices = req.body.answer.length /2;
    answer=[];
    for (let i=0, j=0; i < req.body.answer.length; i=i+2, j++) {
      answerObject['option']=req.body.answer[i];
      if(parseInt(req.body.answer[i+1]) >0){
        answerObject['response'] = parseInt(req.body.answer[i+1]);
      }else{
        if(req.body.answer[i+1] === 'true'){
          answerObject['response'] = true; 
          correctChoices++;
        }else{
          if(req.body.answer[i+1] === 'false'){
            answerObject['response'] = false;
          }else{
            answerObject['response'] = req.body.answer[i+1];
          }
        }
      }
      answer[j] = answerObject;
      answerObject={option:null, response:null};
      console.log("answer[",j,"] = ",answer[j]);
      console.log(answerObject);
    }
    console.log("answer",answer);
      var post = new Post({
        title:   req.body.title,
        feedback:req.body.feedback,
        type:    req.body.type,
        answer:  answer,
        imagePath: url + "/images/" + req.file.filename,
        correctChoices: correctChoices,
        numberOfChoices: numberOfChoices,
        quiz:    req.body.quiz,
        creator: req.userData.userId
      });
      console.log(req.body);
      post
        .save()
        .then(createdPost => {
          res.status(201).json({
            message: "Post added successfully",
            post: {
              ...createdPost,
              id: createdPost._id
            }
          });
        })
        .catch(error => {
          res.status(500).json({
            message: "Creating a post failed!" + error
          });
        })
      ;
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    var correctChoices=0;
    var numberOfChoices=req.body.answer.length;
    var answer = [];
    var obj ={option:null,response:null};
    for (let i = 0; i < req.body.answer.length; i++) {
      obj.option=req.body.answer[i].option;
      if(req.body.answer[i].response == "true"){
        obj.response = true;
      }
      else{
        if(req.body.answer[i].response == "false"){
          obj.response = false;
        }else{
          if(parseInt(req.body.answer[i].response) > 0){
            obj.response=parseInt(req.body.answer[i].response);
          }else{
            obj.response=req.body.answer[i].response;
          }
        }
      }
      answer.push(obj);
      obj ={option:null,response:null};
    }
    for (let i = 0; i < answer.length; i++) {
      if(answer[i].response == true){
        correctChoices++;
      }
    }
    console.log("11) answer=",answer);
      const post = new Post({
        _id:     req.body.id,
        title:   req.body.title,
        feedback:req.body.feedback,
        type:    req.body.type,
        answer:  answer,
        imagePath: imagePath,
        correctChoices: correctChoices,
        numberOfChoices: numberOfChoices,
        quiz:    req.body.quiz,
        creator: req.userData.userId
      }); 
      console.log("11) post=",post);

      Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
        .then(result => {
          if (result.nModified > 0) {
            res.status(200).json({ message: "Update successful!" });
          } else {
            res.status(401).json({ message: "Not authorized!" });
          }
        })
        .catch(error => {
          res.status(500).json({
            message: "Couldn't udpate post!" + error
          });
        });
  } 
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      console.log("post = ",post);
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"+ error
      });
    });
});

module.exports = router;
