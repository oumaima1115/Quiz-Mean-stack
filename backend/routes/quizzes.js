const express = require("express");
const multer = require("multer");
const Quiz = require("../models/quiz");
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
      const quiz = new Quiz({
        name:   req.body.name,
        type:   req.body.type,
        IDquestion: [],
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.email
      });
      console.log("quiz = ",quiz);
      quiz
        .save()
        .then(createdQuiz => {
          res.status(201).json({
            message: "Quiz added successfully",
            post: {
              ...createdQuiz,
              id: createdQuiz._id
            }
          });
          console.log("createdQuiz = ",createdQuiz);
        })
        .catch(error => {
          res.status(500).json({
            message: "Creating a quiz failed! " + error
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
      const quiz = new Quiz({
        _id:        req.body.id,
        name:       req.body.name,
        type:       req.body.type,
        IDquestion: req.body.IDquestion,
        imagePath:  imagePath,
        creator:    req.userData.email
      }); 
      console.log("quizUp=",quiz);
      Quiz.updateOne({ _id: req.params.id, creator: req.userData.email }, quiz)
        .then(result => {
          if (result.nModified > 0) {
            res.status(200).json({ message: "Update successful!" });
          } else {
            res.status(401).json({ message: "Not authorized!" });
          }
        })
        .catch(error => {
          res.status(500).json({
            message: "Couldn't udpate quiz!"+error
          });
        });
    }
  );

  router.get("", (req, res, next) => {
    Quiz.find().then(documents => {
      res.status(200).json({
        message: "Quizzes fetched successfully!",
        quizzes: documents
      });
    });
  });

  router.get("/:id", (req, res, next) => {
    Quiz.findById(req.params.id)
      .then(quiz => {
        console.log("quiz = ",quiz);
        if (quiz) {
          res.status(200).json(quiz);
        } else {
          res.status(404).json({ message: "Quiz not found!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching quiz failed!"
        });
      });
  });

  router.delete("/:id", (req, res, next) => {
    Quiz.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);
      res.status(200).json({ message: "Quiz deleted!" });
    });
  });

module.exports = router;