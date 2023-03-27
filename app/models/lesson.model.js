const sql = require("./db.js");

// constructor
const Lesson = function(lesson) {
    this.lesson_name = lesson.lesson_name;
    this.lesson_details = lesson.lesson_details;
    this.chapter_id = lesson.chapter_id;
};

Lesson.create = (newLesson, result) => {
  sql.query("INSERT INTO lessons SET ?", newLesson, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created lesson: ", { id: res.insertId, ...newLesson });
    result(null, { id: res.insertId, ...newLesson });
    return;
  });
};

Lesson.findById = (id, result) => {
  sql.query(`SELECT * FROM lessons WHERE id = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found lesson: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
    return;
  });
};

Lesson.getAll = (result) => {
  let query = "SELECT * FROM lessons WHERE deleted_at IS NULL";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("lessons: ", res);
    result(null, res);
  });
};

Lesson.updateById = (id, lesson, result) => {
  sql.query(
    `UPDATE lessons SET 
        lesson_name = ?, lesson_details = ?, chapter_id = ?
    WHERE id = ?`,
    [
        lesson.lesson_name
        ,lesson.lesson_details
        ,lesson.chapter_id
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

      console.log("updated chapter: ", { id: id, ...lesson });
      result(null, { id: id, ...lesson });
    }
  );
};

Lesson.remove = (id, result) => {
  sql.query("UPDATE lessons SET deleted_at=NOW() WHERE id = ?", id, (err, res) => {
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

    console.log("deleted lesson with id: ", id);
    result(null, res);
  });
};

module.exports = Lesson;
