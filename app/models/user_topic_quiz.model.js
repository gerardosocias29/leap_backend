const sql = require("./db.js");

// constructor
const UserTopicQuiz = function(userTopicQuiz) {
    this.user_id = userTopicQuiz.user_id;
    this.user_topic_id = userTopicQuiz.user_topic_id;
    this.quiz_id = userTopicQuiz.quiz_id;
    this.score = userTopicQuiz.score;
    this.status = userTopicQuiz.status;
    this.quiz_type = userTopicQuiz.quiz_type;
};

UserTopicQuiz.create = (newUserTopicQuiz, result) => {
  sql.query("INSERT INTO user_topics_quiz SET ?", newUserTopicQuiz, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created UserTopicQuiz: ", { id: res.insertId, ...newUserTopicQuiz });
    result(null, { id: res.insertId, ...newUserTopicQuiz });
    return;
  });
};

UserTopicQuiz.findById = (id, result) => {
  sql.query(`SELECT * FROM user_topics_quiz WHERE id = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found UserTopicQuiz: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
    return;
  });
};

UserTopicQuiz.getAll = (result) => {
  let query = "SELECT * FROM user_topics_quiz";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("user_topics_quiz: ", res);
    result(null, res);
  });
};

UserTopicQuiz.updateById = (id, userTopicQuiz, result) => {
  sql.query(
    `UPDATE user_topics_quiz SET 
    user_id = ?, user_topic_id = ?, quiz_id = ?, score = ?, status = ?, quiz_type = ?
    WHERE id = ?`,
    [
        userTopicQuiz.user_id
        ,userTopicQuiz.user_topic_id
        ,userTopicQuiz.quiz_id
        ,userTopicQuiz.score
        ,userTopicQuiz.status
        ,userTopicQuiz.quiz_type
        ,id
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Lesson with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated UserTopicQuiz: ", { id: id, ...quiz });
      result(null, { id: id, ...quiz });
    }
  );
};

UserTopicQuiz.remove = (id, result) => {
  sql.query("DELETE FROM user_topics_quiz WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted UserTopicQuiz with id: ", id);
    result(null, res);
  });
};

module.exports = UserTopicQuiz;
