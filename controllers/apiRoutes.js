const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models/index");
const moment = require('moment');

module.exports = app => {
  app.get("/api/scrape", (req, res) => {
    axios
      .get("https://www.bbc.com/news/technology")
      .then(response => {
        const results = [];
        const $ = cheerio.load(response.data);
        $("div.gs-c-promo-body").each((i, element) => {
          const title = $(element)
            .find("a.gs-c-promo-heading")
            .text();
          const link = `https://www.bbc.com${$(element)
            .find("a.gs-c-promo-heading")
            .attr("href")}`;
          const summary = $(element)
            .find("p.gs-c-promo-summary")
            .text();
          const published = $(element)
              .find("time")
              .attr('datetime');

          if (
            $(element)
              .find("span.qa-offscreen")
              .text() === "" &&
            summary !== "" &&
            link !== ""
          ) {
            if (
              !results.length ||
              !results.find(article => article.title === title)
            ) {
              results.push({ title, summary, link, published });
            }
          }
        });
        res.json(results);
      })
      .catch(error => res.json(error));
  });

  app.post("/api/insertArticles", (req, res) => {
    const articles = req.body.data;

    // get database contents to check if exists
    db.Article.create(articles)
      .then(dbArticles => {
        res.json(dbArticles);
      })
      .catch(() => {
        res.json("Error Creating Articles");
      });
  });

  app.post("/api/addComment", (req, res) => {
    const comment = req.body.comment;

    db.Comment.create({ content: comment})
      .then(articleComment => {
        return db.Article.findOneAndUpdate({_id: req.body.articleId},
          { $push: { comments: articleComment._id } },
          {new: true}
        )
          .then(article => res.json(article))
          .catch(error => res.json(error));
      })
      .catch(error => console.log(error));
  });

  app.delete('/api/rmComment',  (req, res) => {
    let noteId = req.body.id;

    db.Comment.deleteOne({_id: noteId}).then(notes => {
      res.json(notes);
    }).catch(error => res.json(error));
  })
};
