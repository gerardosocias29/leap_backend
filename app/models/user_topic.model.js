const sql = require("./db.js");

// constructor
const UserTopic = function(userTopic) {
    this.user_id = userTopic.user_id;
    this.topic_id = userTopic.topic_id;
    this.status = userTopic.status;
};

UserTopic.create = (newUserTopic, result) => {
  sql.query("INSERT INTO user_topics SET ?", newUserTopic, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created UserTopic: ", { id: res.insertId, ...newUserTopic });
    result(null, { id: res.insertId, ...newUserTopic });
    return;
  });
};

UserTopic.findById = (id, result) => {
  sql.query(`SELECT * FROM user_topics WHERE id = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found UserTopic: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
    return;
  });
};

UserTopic.getAll = (result) => {
  let query = "SELECT * FROM user_topics";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("user_topics: ", res);
    result(null, res);
  });
};

UserTopic.updateById = (id, userTopic, result) => {
  sql.query(
    `UPDATE user_topics SET 
    user_id = ?, topic_id = ?, status = ?
    WHERE id = ?`,
    [
        userTopic.user_id
        ,userTopic.topic_id
        ,userTopic.status
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

      console.log("updated UserTopic: ", { id: id, ...quiz });
      result(null, { id: id, ...quiz });
    }
  );
};

UserTopic.remove = (id, result) => {
  sql.query("DELETE FROM user_topics WHERE id = ?", id, (err, res) => {
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

    console.log("deleted UserTopic with id: ", id);
    result(null, res);
  });
};

module.exports = UserTopic;
