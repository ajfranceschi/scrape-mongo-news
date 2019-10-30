const mongoose = require("mongoose");

module.exports = mongoose.connect("mongodb://localhost/articlesTest", {
  useNewUrlParser: true
});
