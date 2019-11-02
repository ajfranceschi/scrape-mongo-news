const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models/index");

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
          const hoursAgoPublished = parseInt(
            $(element)
              .find("span.gs-u-vh")
              .text()
              .substr(0, 2)
          );

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
              results.push({ title, summary, link, hoursAgoPublished });
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
        console.log("db.create");
        res.json(dbArticles);
      })
      .catch(() => {
        res.json("Error Creating Articles");
      });
  });
};
