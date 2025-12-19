const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NewsModal = new Schema({
    title: String,
    content: String
})
const News = mongoose.model("News", NewsModal);
module.exports = News;