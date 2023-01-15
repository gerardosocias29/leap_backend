const UserTopicQuiz = require("../models/user_topic_quiz.model.js");

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
    const userTopicQuiz = new UserTopicQuiz({
        user_id: params.user_id,
        user_topic_id : params.user_topic_id,
        quiz_id : params.quiz_id,
        quiz_type : params.quiz_type,
        score : params.score,
        status : params.status
    });
  
    // Save Quiz in the database
    UserTopicQuiz.create(userTopicQuiz, (err, data) => {
      if (err)
        return res.status(500).send({
        message:
          err.message || "Some error occurred while creating the UserTopicQuiz."
        });
      else return res.send(data);
    });
};

exports.findAll = (req, res) => {
    UserTopicQuiz.getAll((err, data) => {
      if (err)
        return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserTopicQuiz."
        });
      else return res.send(data);
    });
};

exports.findOne = (req, res) => {
  console.log(req);
  UserTopicQuiz.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserTopicQuiz with id ${req.params.id}`,
          status: false
        });
      } else {
        res.status(500).send({
          message: "Error retrieving UserTopicQuiz with id " + req.params.id,
          status: false
        });
      }
    } else res.send(data);
  });
};

// Update a UserTopicQuiz identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    UserTopicQuiz.updateById(
      req.params.id,
      new UserTopicQuiz(req.body),
      (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                message: `Not found UserTopicQuiz with id ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                message: "Error updating UserTopicQuiz with id " + req.params.id
                });
            }
        } else return res.send(data);
      }
    );
  };