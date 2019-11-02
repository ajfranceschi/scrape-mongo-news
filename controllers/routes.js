const db = require("../models/index");

module.exports = app => {
  app.get("/", (req, res) => {
    db.Article.find().sort({hoursAgoPublished:1, title: 1}).then(dbArticles => {
      res.render('index', {articlesArray: dbArticles});
    });
  });
};
