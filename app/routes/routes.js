module.exports = app => {
  const migrations = require("../controllers/migration.controller.js");

  const users = require("../controllers/user.controller.js");
  const chapters = require("../controllers/chapter.controller.js");
  const lessons = require("../controllers/lesson.controller.js");
  const topics = require("../controllers/topic.controller.js");
  const quiz = require("../controllers/quiz.controller.js");

  const userTopic = require("../controllers/user_topic.controller.js");
  const userTopicQuiz = require("../controllers/user_topic_quiz.controller.js");

  const global = require("../controllers/global_functions.js");

  var router = require("express").Router();

  // router.post("/", tutorials.create);
  // router.get("/", tutorials.findAll);
  // router.put("/:id", tutorials.update);
  // router.delete("/:id", tutorials.delete);
  router.get("/migrations/run/migrate", migrations.migrate);

  router.get("/users/all", users.findAll);
  router.get("/users/:uid", users.findOne);
  router.post("/users/create", users.create);
  router.put("/users/update/:id", users.update);

  router.get("/chapters/all", chapters.findAll);
  router.get("/chapters/:id", chapters.findOne);
  router.post("/chapters/create", chapters.create);
  router.put("/chapters/update/:id", chapters.update);

  router.get("/lessons/all", lessons.findAll);
  router.get("/lessons/:id", lessons.findOne);
  router.post("/lessons/create", lessons.create);
  router.put("/lessons/update/:id", lessons.update);

  router.get("/topics/all", topics.findAll);
  router.get("/topics/:id", topics.findOne);
  router.post("/topics/create", topics.create);
  router.put("/topics/update/:id", topics.update);

  router.get("/quizzes/all", quiz.findAll);
  router.get("/quizzes/:id", quiz.findOne);
  router.post("/quizzes/create", quiz.create);
  router.put("/quizzes/update/:id", quiz.update);

  router.get("/user_topic/all", userTopic.findAll);
  router.get("/user_topic/:id", userTopic.findOne);
  router.post("/user_topic/create", userTopic.create);
  router.put("/user_topic/update/:id", userTopic.update);

  router.get("/user_topic_quiz/all", userTopicQuiz.findAll);
  router.get("/user_topic_quiz/:id", userTopicQuiz.findOne);
  router.post("/user_topic_quiz/create", userTopicQuiz.create);
  router.put("/user_topic_quiz/update/:id", userTopicQuiz.update);

  router.get("/user_topics_detailed/:user_id", global.getUserTopicsById);
  router.get("/scored_users_list/all", global.getUserListWithScore);
  router.get("/user_topics_quiz/:user_id/:user_topic_id/:quiz_type", global.getUserTopicsQuiz);
  router.get("/topic_quiz_list/:topic_id/:quiz_type", global.topicQuizList);
  router.get("/users_count", global.getUsersCount);
  router.get("/users_with_topics_done", global.getUsersWithTopicsDone);
  router.get("/leaderboards_lists/:limit", global.getLeaderboardsLists);
  router.get('/lessons_list/:chapter_id', global.getLessonsByChapterId);

  router.get('/achievements/list', global.getAchivementsList);
  // router.get('/achievement/calculate_finished_lessons/:achievement_id/:chapter_id/:user_id', global.calculateAchievementsFinishedLessons);
  router.post('/achievement/calculate_finished_lessons', global.calculateAchievementsFinishedLessons);
  router.post('/achievement/calculate_all_quizzes', global.calculateAchievementsAllQuizzes);

  app.use('/api', router);
};
