const sql = require("./db.js");

// constructor
const Chapter = function(chapter) {
    this.chapter_name = chapter.chapter_name;
    this.chapter_details = chapter.chapter_details;
    this.photo_url = chapter.photo_url;
};

Chapter.create = (newChapter, result) => {
  sql.query("INSERT INTO chapters SET ?", newChapter, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created chapter: ", { id: res.insertId, ...newChapter });
    result(null, { id: res.insertId, ...newChapter });
    return;
  });
};

Chapter.findById = (id, result) => {
  sql.query(`SELECT * FROM chapters WHERE id = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found chapter: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
    return;
  });
};

Chapter.getAll = (result) => {
  let query = `SELECT c.*, (SELECT COUNT(id) FROM lessons WHERE chapter_id = c.id) as lesson_count
    FROM chapters c
  `;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("chapters: ", res);
    result(null, res);
  });
};

Chapter.updateById = (id, chapter, result) => {
  sql.query(
    `UPDATE chapters SET 
        chapter_name = ?, chapter_details = ?, photo_url = ?
    WHERE id = ?`,
    [
        chapter.chapter_name
        ,chapter.chapter_details
        ,chapter.photo_url
        ,id
    ],
    (err, res) => {
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

      console.log("updated chapter: ", { id: id, ...tutorial });
      result(null, { id: id, ...tutorial });
    }
  );
};

Chapter.remove = (id, result) => {
  sql.query("DELETE FROM chapters WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Chapter with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted chapter with id: ", id);
    result(null, res);
  });
};

module.exports = Chapter;
