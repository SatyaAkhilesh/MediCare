const News = require('../models/news');

const getNews = async (req, res) => {
    // 默认页数 
    let page = req.query.page || 1;
    // 默认一页五条 或使用传过来的一页N条
    let pageList = req.query.list || 5;
    News.find((err, result) => {
        if (result.length <= page * pageList) {
            res.send({ data: result })
        } else {
            res.send({ data: result.splice((page - 1) * pageList, pageList) })
        }

    })
}
const delNews = async (req, res) => {
    try {
        const deletedPatient = await News.deleteOne({ _id: req.body.id });
        res.status(200).json(deletedPatient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const addNews = async (req, res) => {
    let news = req.body;
    News.create(news, (error, userDetails) => {
        if (error) {
            res.status(400).json({ message: "error", errors: [error.message] });
        } else {
            res.send({ message: 'ok' })
        }
    })
}
module.exports = {
    getNews,
    addNews,
    delNews
}