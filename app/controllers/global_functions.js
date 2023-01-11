const sql = require("../models/db.js");

exports.getUserTopicsById = (request, result) => {
  sql.query('SELECT ut.*, utq.quiz_id, utq.score FROM `user_topics` as ut LEFT JOIN user_topics_quiz as utq ON ut.topic_id = utq.user_topic_id WHERE ut.user_id = '+request.params.user_id+';', (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send(res);
  });
}