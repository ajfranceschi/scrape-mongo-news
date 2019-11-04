const mongoose = require("mongoose");
const MONGOOSE_URI = process.env.MONGOOSE_URI || "mongodb://localhost/articles_db";


module.exports = mongoose.connect(MONGOOSE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
