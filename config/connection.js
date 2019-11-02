const mongoose = require("mongoose");

module.exports = mongoose.connect("mongodb://localhost/articles_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
