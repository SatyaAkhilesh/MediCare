const express = require("express");
const adminAuth = require('./middlewares/adminAuth');
const router = express.Router();
const { getNews, delNews, addNews } = require('../controllers/NewsController')
router.get('/news', getNews);
router.post('/delnews', adminAuth, delNews);
router.post('/news', adminAuth, addNews)
module.exports = router