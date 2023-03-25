const Quiz = require("../models/quiz.model.js");

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (req.headers['content-type'] === 'application/json;') {
        req.headers['content-type'] = 'application/json';
    }

    if (!req.body || req.body == "") {
      return res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    var params = req.body;
    // Create a Quiz
    const quiz = new Quiz({
        quiz_type : params.quiz_type,
        quiz_question : params.quiz_question,
        quiz_answer : params.quiz_answer,
        quiz_choices : params.quiz_choices,
        timer : params.timer,
        topic_id : params.topic_id,
        answer_type: params.answer_type
    });
  
    // Save Quiz in the database
    Quiz.create(quiz, (err, data) => {
      if (err)
        return res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Quiz."
        });
      else return res.send(data);
    });
};

exports.findAll = (req, res) => {
    Quiz.getAll((err, data) => {
      if (err)
        return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Quiz."
        });
      else return res.send(data);
    });
};

exports.findOne = (req, res) => {
  console.log(req);
  Quiz.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Quiz with id ${req.params.id}`,
          status: false
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Quiz with id " + req.params.id,
          status: false
        });
      }
    } else res.send(data);
  });
};

// Update a Quiz identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    Quiz.updateById(
      req.params.id,
      new Quiz(req.body),
      (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                message: `Not found Quiz with id ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                message: "Error updating Quiz with id " + req.params.id
                });
            }
        } else return res.send(data);
      }
    );
  };

exports.remove = (req, res) => {
  Quiz.remove(
    req.params.id,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Not found Quiz with id ${req.params.id}.`
          });
        } else {
          return res.status(500).send({
            message: "Error deleting Quiz with id " + req.params.id
          });
        }
      } else return res.send({ message: `Quiz was deleted successfully!`, status: true });
    }
  );
}