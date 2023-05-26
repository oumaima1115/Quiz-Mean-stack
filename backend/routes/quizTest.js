const express = require("express");
const QuizTest = require("../models/quizTest");
const router = express.Router();

router.post(
    "",
    (req, res, next) => {
      const quizTest = new QuizTest({
        nbrEssay:         req.body.nbrEssay,
        score:            req.body.score,
        correctAnswer:    req.body.correctAnswer,
        incorrectAnswer:  req.body.incorrectAnswer,
        UnAnswered:       req.body.UnAnswered,
        passingGrade:     req.body.passingGrade,
        timeTaken:        req.body.timeTaken,
        quizId:           req.body.quizId,
        userId:           req.body.userId
      });
      console.log("quizTest = ",quizTest );
      quizTest
        .save()
        .then(createdQuizTest => {
          res.status(201).json({
            message: "QuizTest added successfully",
            post: {
              ...createdQuizTest,
              id: createdQuizTest._id
            }
          });
          console.log("createdQuizTest = ",createdQuizTest);
        })
        .catch(error => {
          res.status(500).json({
            message: "Creating a quizTest failed! " + error
          });
        })
      ;
    }
  );
  /*
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
*/
module.exports = router;