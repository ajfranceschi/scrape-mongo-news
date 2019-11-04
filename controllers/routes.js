const db = require("../models/index");
const moment = require("moment");

module.exports = app => {
  app.get("/", (req, res) => {
    db.Article.find()
      .sort({ published: -1, title: 1 })
      .then(dbArticles => {
        const articlesArray = dbArticles.map(article => {
          const published = moment(article.published);

        return {
          _id: article.id,
          title: article.title,
          summary: article.summary,
          link: article.link,
          comments: article.comments,
          published: `${published.format('l')} @ ${published.format('LT')}`
          }
        });
        res.render("index", { articlesArray: articlesArray });
      });
  });

  app.get("/comments/:id", (req, res) => {
    const articleId = req.params.id;

    db.Article.findOne({ _id: articleId })
      .populate("comments")
      .then(article => {
        const comments = article.comments.map(comment => {
          const published = moment(comment.published);
          return {
            _id: comment._id,
            content: comment.content,
            published: `${published.format("l")} @ ${published.format('LT')}`
          }
          }
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
