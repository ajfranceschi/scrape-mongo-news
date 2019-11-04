const db = require("../models/index");
const moment = require("moment");

module.exports = app => {
  app.get("/", (req, res) => {
    db.Article.find()
      .sort({ hoursAgoPublished: 1, title: 1 })
      .then(dbArticles => {
        console.log(dbArticles);
        res.render("index", { articlesArray: dbArticles });
      });
  });

  app.get("/comments/:id", (req, res) => {
    const articleId = req.params.id;

    db.Article.findOne({ _id: articleId })
      .populate("comments")
      .then(article => {
        const comments = article.comments.map(comment => ({
            _id: comment._id,
            content: comment.content,
            published: moment(comment.published).format("llll")
          })
        );
        res.render("comments", {
          title: article.title,
          link: article.link,
          articleId: article._id,
          comments: comments
        });
      })
      .catch(error => res.render("404", {error}));
  });
};
