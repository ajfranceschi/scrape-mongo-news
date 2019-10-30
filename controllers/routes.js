const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models/index");

module.exports = app => {
  app.get("/", (req, res) => {
    console.log("request started");
    axios
      .get("https://www.bbc.com/news/technology")
      .then(response => {
        console.log("axios started");
        const results = [];

        const $ = cheerio.load(response.data);
        $("div.gs-c-promo-body").each((i, element) => {
          console.log("cheerio each started");
          const title = $(element)
            .find("a.gs-c-promo-heading")
            .text();
          const link = $(element)
            .find("a.gs-c-promo-heading")
            .text();
          const summary = $(element)
            .find("p.gs-c-promo-summary")
            .text();

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
              results.push({
                title,
                summary,
                link
              });
            }
          }
        });
        console.log(results.length);
        return results;
      })
      .then(fetchedArticles => {
        console.log("db.find to test");
        const filteredArticles = [];
        db.Article.find({}).then(dbArticles => {
          // if Articles collection is empty
          if (!dbArticles.length) {
            db.Article.create(fetchedArticles)
              .then(dbArticles => {
                res.render("index", { articlesArray: dbArticles });
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            // checking article exists?
            fetchedArticles.find(fetchedArticle => {
              if (
                dbArticles.filter(
                  dbArticle => dbArticle.title === fetchedArticle.title
                ).length
              ) {
                console.log("found");
              } else {
                filteredArticles.push(fetchedArticle);
              }
            });

            if (filteredArticles.length) {
              db.Article.create(filteredArticles)
                .then(() => {
                  db.Article.find({}).then(dbArticles => {
                    res.render("index", { articlesArray: dbArticles });
                  });
                })
                .catch(error => {
                  console.log(error);
                });
            } else {
              db.Article.find({}).then(dbArticles =>
                res.render("index", { articlesArray: dbArticles })
              );
            }
          }
        });
      });
  });
};
