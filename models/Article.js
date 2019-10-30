const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Create schema for an Article
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  }
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
