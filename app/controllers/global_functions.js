const sql = require("../models/db.js");

exports.getUserTopicsById = (request, result) => {
  sql.query('SELECT ut.*, utq.quiz_id, IFNULL(utq.score, 0) as score FROM `user_topics` as ut LEFT JOIN user_topics_quiz as utq ON ut.id = utq.user_topic_id WHERE ut.user_id = '+request.params.user_id+';', (err, res) => {
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
    SELECT u.id, u.first_name, u.last_name, SUM(IFNULL(utq.score,0)) as score
    FROM users u
    LEFT JOIN user_topics_quiz utq ON utq.user_id = u.id
    WHERE u.role_id != 0
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

exports.getUsersCount = (request, result) => {
  sql.query(`
    SELECT COUNT(*) as users_count
    FROM users WHERE role_id != 0
  `, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send(res[0]);
  });
}

exports.getUsersWithTopicsDone = (request, result) => {
  sql.query(`
    SELECT MAX(ut.user_id) as id, COUNT(IFNULL(ut.user_id,0)) as topics_done
    FROM user_topics ut
    LEFT JOIN users u ON u.id = ut.user_id
    WHERE u.role_id != 0
    GROUP BY ut.user_id    
  `, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send(res);
  });
}

exports.getUserTopicsQuiz = (request, result) => {
  sql.query(`
    SELECT * FROM user_topics_quiz 
    WHERE user_id = '${request.params.user_id}' 
    AND user_topic_id = '${request.params.user_topic_id}' 
    AND quiz_type = '${request.params.quiz_type}'
    LIMIT 1
  `, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    if (res.length <= 0) {
      return result.send({status: false});
    }

    return result.send(res[0]);
  });
}

exports.topicQuizList = (request, result) => {
  sql.query(`
    SELECT * FROM quizzes WHERE topic_id = '${request.params.topic_id}' AND quiz_type = '${request.params.quiz_type}'
  `, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send(res);
  });
}

exports.getLeaderboardsLists = (request, result) => {
  sql.query(`
    SELECT u.id, u.first_name, u.last_name, SUM(IFNULL(utq.score, 0)) as score
    FROM users u
    LEFT JOIN user_topics_quiz utq ON utq.user_id = u.id
    WHERE u.role_id != 0
    GROUP BY u.id
    ORDER BY score DESC
    ${(request.params.limit == "all") ? '' : 'LIMIT ' + request.params.limit}
  `, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send(res);
  });
}