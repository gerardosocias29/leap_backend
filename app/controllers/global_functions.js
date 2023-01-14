const sql = require("../models/db.js");

exports.getUserTopicsById = (request, result) => {
  sql.query('SELECT ut.*, utq.quiz_id, ISNULL(utq.score, 0) FROM `user_topics` as ut LEFT JOIN user_topics_quiz as utq ON ut.id = utq.user_topic_id WHERE ut.user_id = '+request.params.user_id+';', (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send(res);
  });
}

exports.getUserListWithScore = (request, result) => {
  sql.query(`
    SELECT u.id, u.first_name, u.last_name, SUM(ifnull(utq.score,0)) as score
    FROM users u
    LEFT JOIN user_topics_quiz utq ON utq.user_id = u.id
    GROUP BY u.id
  `, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send(res);
  });
}