const express = require("express");
const checkAuth = require("../middleware/check-auth");
const Response = require("../models/response");
const router = express.Router();

router.post(
    "",
    (req, res, next) => {
      const response = new Response({
        userId:    req.body.userId,
        quizId:    req.body.quizId,
        timeTaken: req.body.timeTaken,
        nbrEssay:  req.body.nbrEssay,
        answer:    req.body.answer
      });
      console.log("1) response = ",response );
      response
        .save()
        .then(createdResponse => {
          res.status(201).json({
            message: "Response added successfully",
            post: {
              ...createdResponse,
              id: createdResponse._id
            }
          });
          console.log("createdResponse = ",createdResponse);
        })
        .catch(error => {
          res.status(500).json({
            message: "Creating a response failed! " + error
          });
        })
      ;
    }
  );


  router.put(
    "/:id",
    checkAuth,
    (req, res, next) => {
      const response = new Response({
        _id:       req.body.id,
        userId:    req.body.userId,
        quizId:    req.body.quizId,
        timeTaken: req.body.timeTaken,
        nbrEssay:  req.body.nbrEssay,
        answer:    req.body.answer
      }); 
      console.log("response=",response);
      Response.updateOne({ _id: req.params.id}, response)
        .then(result => {
          if (result.nModified > 0) {
            res.status(200).json({ message: "Update successful!" });
          } else {
            res.status(401).json({ message: "Not authorized!" });
          }
        })
        .catch(error => {
          res.status(500).json({
            message: "Couldn't udpate response!"+error
          });
        });
    }
  );

  router.get("", (req, res, next) => {
    Response.find().then(documents => {
      res.status(200).json({
        message: "Responses fetched successfully!",
        answers: documents
      });
    });
  });

  router.delete("/:id", (req, res, next) => {
    Response.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);
      res.status(200).json({ message: "Response deleted!" });
    });
  });

module.exports = router;