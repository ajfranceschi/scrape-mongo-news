const db = require("../models/index");

module.exports = app => {
  app.get("/", (req, res) => {
    db.Article.find()
      .sort({ hoursAgoPublished: 1, title: 1 })
      .then(dbArticles => {
        res.render("index", { articlesArray: dbArticles });
      });
  });

  app.get("/comments/:id", (req, res) => {
    const articleId = req.params.id;

    db.Article.findOne({_id: articleId}).populate('comments').then(article => {
      // const commentsArray = article.comments.map(comment => comment.content);
        res.render("comments", {
          title: article.title,
          link: article.link,
          articleId: article._id,
          comments: article.comments
        });
    }).catch(() => res.render("404"));
  });
};
