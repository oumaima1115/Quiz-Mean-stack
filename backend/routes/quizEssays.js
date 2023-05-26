const express = require("express");
const QuizEssay = require("../models/quizEssay");
const router = express.Router();

router.post(
    "",
    (req, res, next) => {
      const quizEssay = new QuizEssay({
        nbrEssay:  req.body.nbrEssay,
        score:    req.body.score,
        correctAnswer: req.body.correctAnswer,
        incorrectAnswer:  req.body.incorrectAnswer,
        UnAnswered:    req.body.UnAnswered,
        passingGrade: req.body.passingGrade,
        timeTaken:  req.body.timeTaken,
        IDResponse: req.body.IDResponse
      });
      console.log("quizEssay = ",quizEssay );
      quizEssay
        .save()
        .then(createdQuizEssay => {
          res.status(201).json({
            message: "QuizEssay added successfully",
            post: {
              ...createdQuizEssay,
              id: createdQuizEssay._id
            }
          });
          console.log("createdQuizEssay = ",createdQuizEssay);
        })
        .catch(error => {
          res.status(500).json({
            message: "Creating a quizEssay failed! " + error
          });
        })
      ;
    }
  );
  
  router.get("", (req, res, next) => {
    QuizEssay.find().then(documents => {
      res.status(200).json({
        message: "QuizEssay fetched successfully!",
        quizEssays: documents
      });
    });
  });

  router.delete("/:id", (req, res, next) => {
    QuizEssay.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);
      res.status(200).json({ message: "Quiz Essay deleted!" });
    });
  });

module.exports = router;