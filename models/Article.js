const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Create schema for an Article
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  published: {
    type: Date,
    required: true
  },
  comments: [
    {
      type: Schema.Types.ObjectID,
      ref: "Comment"
    }
  ]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
