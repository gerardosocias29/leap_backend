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
    SELECT * FROM quizzes 
    WHERE topic_id = '${request.params.topic_id}' ${(request.params.quiz_type == "all") ? '' : "AND quiz_type = '" + request.params.quiz_type + "'" }
    AND deleted_at IS NULL
    ORDER BY CASE 
      WHEN quiz_type = 'easy' then 1 
      WHEN quiz_type = 'medium' then 2
      WHEN quiz_type = 'hard' then 3
      END ASC 
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

exports.getLessonsByChapterId = (request, result) => {
  sql.query(`
    SELECT * FROM lessons WHERE chapter_id = ${request.params.chapter_id} AND deleted_at IS NULL
  `, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send(res);
  });
}

exports.getAchivementsList = (request, result) => {
  sql.query(`
  SELECT * FROM achievements `, async (err, achievements) => {  if (err) { return result.status(500).send({ message: err.message || "Some error occurred while retrieving data." }); }
    return result.send(achievements);
  }
)
}

exports.getAchivementsListWithProgress = (request, result) => {
  sql.query(`
    SELECT a.*, IFNULL(ua.progress, 0) as progress, ua.status
    FROM achievements a
    LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ${request.params.user_id}
    `, async (err, achievements) => {  if (err) { return result.status(500).send({ message: err.message || "Some error occurred while retrieving data." }); }
      return result.send(achievements);
    }
  )
}

exports.getAchivementsListWithFullProgress = (request, result) => {
  sql.query(`
    SELECT a.*, IFNULL(ua.progress, 0) as progress, ua.status
    FROM achievements a
    LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ${request.params.user_id}
    WHERE ua.progress != null
    `, async (err, achievements) => {  if (err) { return result.status(500).send({ message: err.message || "Some error occurred while retrieving data." }); }
      return result.send(achievements);
    }
  )
}

exports.calculateAchievementsFinishedLessons = (req, result) => {
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

  var achievement_id = params.achievement_id;
  var achievement_score = params.achievement_achievement_score;
  var achievement_chapter_ids = params.achievement_chapter_ids;
  var user_id = params.user_id;

  let query = `SELECT
    c.id,
    l.lesson_name,
      (SELECT COUNT(*) FROM topics t WHERE t.lesson_id = l.id AND t.deleted_at IS NULL) as topic_count,
      IFNULL( 
      (tb1.topic_done
        / 
      (SELECT COUNT(*) FROM topics t WHERE t.lesson_id = l.id AND t.deleted_at IS NULL)) * 100 
      ,0) as percentage,
        IFNULL( tb1.topic_done, 0 ) as topic_done
    FROM lessons l
    LEFT JOIN chapters c ON c.id = l.chapter_id
    LEFT JOIN (SELECT COUNT(ut.id) as topic_done, t.lesson_id
      FROM user_topics ut
      LEFT JOIN topics t ON t.id = ut.topic_id
      WHERE ut.user_id = ${user_id}
      AND t.deleted_at IS NULL
        group by ut.id
    ) as tb1 ON tb1.lesson_id = l.id

    WHERE c.id IN (${achievement_chapter_ids})
    AND l.deleted_at IS NULL
    ORDER BY tb1.topic_done DESC
    ${ achievement_score == 5 ? 'LIMIT 5' : ''}
  `;
  sql.query(query, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    var percentage = 0.0;
    res.forEach((value, index) => {
      percentage += parseFloat(value.percentage);
    });
    percentage = parseFloat(percentage / res.length).toFixed(2);
    var notif = (percentage == 100) ? 'notify_ready' : 'notify_not_ready';
    var status = (notif == 'notify_ready') ? ', status = "' + notif +'"' : ', status = "' + notif +'"';
    sql.query(`
      INSERT INTO user_achievements (user_id, achievement_id, status, progress) VALUES (${user_id},${achievement_id},'${notif}',${percentage})
      ON DUPLICATE KEY UPDATE progress = ${percentage} ${status}
    `, (err, ua) => {
      if (err) {
        console.log("error: ", err);
        return;
      }
      return;
    });
    return result.send({status: 'success'});
  });
  
}

exports.calculateAchievementsAllQuizzes = (req, result) => {
  if (req.headers['content-type'] === 'application/json;') {
    req.headers['content-type'] = 'application/json';
  }

  if (!req.body || req.body == "") {
  return res.status(400).send({
    message: "Content can not be empty!"
  });
  }
  var params = req.body;
  var achievement_id = params.achievement_id;
  var achievement_score = params.achievement_achievement_score;
  var achievement_chapter_ids = params.achievement_chapter_ids;
  var user_id = params.user_id;

  let query = `
    SELECT 
      c.chapter_name,
      COUNT(tb1.quiz_done) as quiz_done,
      (SELECT COUNT(q.id) 
        FROM quizzes q 
        LEFT JOIN topics t ON t.id = q.topic_id 
        LEFT JOIN lessons les ON t.lesson_id = les.id
        WHERE les.chapter_id = c.id
        AND les.deleted_at IS NULL
        AND t.deleted_at IS NULL
        AND q.deleted_at IS NULL
        GROUP BY c.id
      ) as quiz_count
    FROM chapters c

    LEFT JOIN lessons l ON l.chapter_id = c.id

    LEFT JOIN (
      SELECT utq.id as quiz_done, topics.lesson_id    
        FROM user_topics_quiz utq
        LEFT JOIN user_topics ut ON ut.id = utq.user_topic_id
        LEFT JOIN topics ON topics.id = ut.topic_id
      WHERE utq.user_id = ${user_id}
      AND topics.deleted_at IS NULL
        GROUP BY utq.id
    ) as tb1 ON tb1.lesson_id = l.id

    WHERE c.id IN (${achievement_chapter_ids})
    AND l.deleted_at IS NULL
    GROUP BY c.chapter_name
  `;

  sql.query(query, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    var percentage = 0.0;
    res.forEach((value, index) => {
      percentage += parseFloat((value.quiz_done / value.quiz_count) * 100);
    });
    percentage = parseFloat(percentage / res.length).toFixed(2);
    var new_percentage = percentage >= (achievement_score*1) ? (achievement_score*1) : percentage;
    var notif = (percentage >= (achievement_score*1)) ? 'notify_ready' : 'notify_not_ready';
    var status = (notif == 'notify_ready') ? ', status = "' + notif +'"' : ', status = "' + notif +'"';
    sql.query(`
      INSERT INTO user_achievements (user_id, achievement_id, status, progress) VALUES (${user_id},${achievement_id},'${notif}',${new_percentage})
      ON DUPLICATE KEY UPDATE progress = ${new_percentage} ${status}
    `, (err, ua) => {
      if (err) {
        console.log("error: ", err);
        return;
      }
      return;
    });
    return result.send({status: 'success'});
  });
}

exports.updateSchool = (req, result) => {
  if (req.headers['content-type'] === 'application/json;') {
    req.headers['content-type'] = 'application/json';
  }

  if (!req.body || req.body == "") {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  var params = req.body;

  var school_name = params.school_name;
  var id = req.params.id;

  let query = `
    UPDATE schools SET school_name = '${school_name}' WHERE id = '${id}'
  `;

  sql.query(query, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send({status: true, message: "Succesfully Update!"});
  });
}

exports.getSchool = (request, result) => {
  sql.query(`
    SELECT school_name
    FROM schools WHERE id = 1
  `, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send(res[0]);
  });
}

exports.getCourses = (request, result) => {
  sql.query(`
    SELECT *
    FROM courses WHERE deleted_at IS NULL
  `, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send(res);
  });
}

exports.createCourses = (req, result) => {
  if (req.headers['content-type'] === 'application/json;') {
    req.headers['content-type'] = 'application/json';
  }

  if (!req.body || req.body == "") {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  var params = req.body;

  var course_name = params.course_name;

  let query = "INSERT INTO `courses` (`id`, `course_name`, `deleted_at`) VALUES (NULL, '"+course_name+"', NULL);";

  sql.query(query, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send({status: true, message: "Succesfully Created!"});
  });
}

exports.deleteCourses = (req, result) => {
  if (req.headers['content-type'] === 'application/json;') {
    req.headers['content-type'] = 'application/json';
  }

  if (!req.body || req.body == "") {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  var id = req.params.id;

  let query = `
    UPDATE courses SET deleted_at = NOW() WHERE id = '${id}'
  `;

  sql.query(query, (err, res) => {
    if (err) {
      return result.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    }
    return result.send({status: true, message: "Succesfully Deleted!"});
  });
}