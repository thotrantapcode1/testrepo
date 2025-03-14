const express = require('express');
const db = require('./database');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Cấu hình view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route: Trang chủ
app.get('/', (req, res) => {
    db.all('SELECT * FROM posts ORDER BY id DESC', (err, posts) => {
        if (err) return console.error(err);
        res.render('index', { posts });
    });
});

// Route: Trang chi tiết bài viết
app.get('/post/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM posts WHERE id = ?', [id], (err, post) => {
        if (err) return console.error(err);
        res.render('post', { post });
    });
});

// Route: Hiển thị form thêm bài viết
app.get('/new', (req, res) => {
    res.render('new');
});

// Route: Xử lý thêm bài viết
app.post('/new', (req, res) => {
    const { title, content } = req.body;
    db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], (err) => {
        if (err) return console.error(err);
        res.redirect('/');
    });
});

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
