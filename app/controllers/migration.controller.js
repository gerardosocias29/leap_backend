const Migration = require("../models/migration.model.js");

exports.migrate = (res) => {
    const queries = [
        'ALTER TABLE `quizzes` ADD `choices` TEXT NULL DEFAULT NULL AFTER `quiz_answer`;',
        'ALTER TABLE `users` CHANGE `course` `course` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL;',
        'ALTER TABLE `users` ADD `school_user_id` VARCHAR(50) NULL DEFAULT NULL AFTER `deleted_at`;',
        'UPDATE `quizzes` SET `quiz_type` = "1" WHERE quiz_type = "easy"',
        'UPDATE `quizzes` SET `quiz_type` = "1" WHERE quiz_type = "medium"',
        'UPDATE `quizzes` SET `quiz_type` = "1" WHERE quiz_type = "hard"',
    ];

    const migration = new Topic({
        queries : queries
    });

    Migration.migrate(migration, (err, data) => {
        if (err)
            return res.status(500).send({
            message:
                err.message || "Some error occurred while migrating database."
            });
        else return res.send(data);
    });
};