const sql = require("./db.js");

// constructor
const Quiz = function(quiz) {
    this.quiz_type = quiz.quiz_type;
    this.quiz_question = quiz.quiz_question;
    this.quiz_answer = quiz.quiz_answer;
    this.quiz_choices = quiz.quiz_choices;
    this.timer = quiz.timer;
    this.topic_id = quiz.topic_id;
    this.answer_type = quiz.answer_type;
};

Quiz.create = (newQuiz, result) => {
  sql.query("INSERT INTO quizzes SET ?", newQuiz, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created quiz: ", { id: res.insertId, ...newQuiz });
    result(null, { id: res.insertId, ...newQuiz });
    return;
  });
};

Quiz.findById = (id, result) => {
  sql.query(`SELECT * FROM quizzes WHERE id = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found quiz: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
    return;
  });
};

Quiz.getAll = (result) => {
  let query = "SELECT * FROM quizzes WHERE deleted_at IS NULL";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("quizzes: ", res);
    result(null, res);
  });
};

Quiz.updateById = (id, quiz, result) => {
  sql.query(
    `UPDATE quizzes SET 
    quiz_type = ?, quiz_question = ?, quiz_answer = ?, quiz_choices = ?, timer = ?, answer_type = ?
    WHERE id = ?`,
    [
        quiz.quiz_type
        ,quiz.quiz_question
        ,quiz.quiz_answer
        ,quiz.quiz_choices
        ,quiz.timer
        ,quiz.answer_type
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

      console.log("updated quiz: ", { id: id, ...quiz });
      result(null, { id: id, ...quiz });
    }
  );
};

Quiz.remove = (id, result) => {
  sql.query("UPDATE quizzes SET deleted_at=NOW() WHERE id = ?", id, (err, res) => {
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

    console.log("deleted quiz with id: ", id);
    result(null, res);
  });
};

module.exports = Quiz;
