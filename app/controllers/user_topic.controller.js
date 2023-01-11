const UserTopic = require("../models/user_topic.model.js");

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
    const userTopic = new UserTopic({
        user_id : params.user_id,
        topic_id : params.topic_id,
        status : params.status
    });
  
    // Save Quiz in the database
    UserTopic.create(userTopic, (err, data) => {
      if (err)
        return res.status(500).send({
        message:
          err.message || "Some error occurred while creating the UserTopic."
        });
      else return res.send(data);
    });
};

exports.findAll = (req, res) => {
    UserTopic.getAll((err, data) => {
      if (err)
        return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserTopic."
        });
      else return res.send(data);
    });
};

exports.findOne = (req, res) => {
  console.log(req);
  UserTopic.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserTopic with id ${req.params.id}`,
          status: false
        });
      } else {
        res.status(500).send({
          message: "Error retrieving UserTopic with id " + req.params.id,
          status: false
        });
      }
    } else res.send(data);
  });
};

// Update a UserTopic identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    UserTopic.updateById(
      req.params.id,
      new UserTopic(req.body),
      (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                message: `Not found UserTopic with id ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                message: "Error updating UserTopic with id " + req.params.id
                });
            }
        } else return res.send(data);
      }
    );
  };