const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcrypt');
const pool = require('./db');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// nалаштування сесiй
app.use(session({
    store: new pgSession({
        pool: pool, 
        tableName: 'session' 
    }),
    secret: 'keyboard12keye', 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } 
}));
app.get('/api/books', async (req, res) => {
    const category = req.query.cat;
    const searchTerm = req.query.search; 

    try {
        let result;
        if (searchTerm) {
            const query = `
                SELECT b.* FROM Books b
                WHERE b.Name ILIKE $1 OR b.Description ILIKE $1
            `;
            result = await pool.query(query, [`%${searchTerm}%`]);
        } else if (category) {
            const query = `
                SELECT b.* FROM Books b
                JOIN Book_Genres bg ON b.BookID = bg.BookID
                JOIN Genre g ON bg.GenreID = g.GenreID
                WHERE g.GenreName ILIKE $1
            `;
            result = await pool.query(query, [category]);
        } else {
            result = await pool.query('SELECT * FROM Books');
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
});

app.get('/api/books/random', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Books ORDER BY RANDOM() LIMIT 1');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
});

app.get('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT b.*, 
                   a.AuthorName as authorname, 
                   a.Bio as authorbio,
                   ARRAY_AGG(g.GenreName) as genres,
                   AVG(g.Perception) as avg_perception
            FROM Books b
            LEFT JOIN Authors a ON b.AuthorID = a.AuthorID
            LEFT JOIN Book_Genres bg ON b.BookID = bg.BookID
            LEFT JOIN Genre g ON bg.GenreID = g.GenreID
            WHERE b.BookID = $1
            GROUP BY b.BookID, a.AuthorID, a.AuthorName, a.Bio;
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).send('Книгу не знайдено');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
    
});

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query(
            "INSERT INTO users (username, email, passwordhash, createdat) VALUES ($1, $2, $3, NOW()) RETURNING userid",
            [username, email, hashedPassword]
        );

        req.session.userId = newUser.rows[0].userid;
        res.json({ success: true });

    } catch (err) {
        console.error(err);
        if (err.code === '23505') { 
            res.status(400).json({ error: 'Цей email вже зареєстрований' });
        } else {
            res.status(500).json({ error: 'Помилка на сервері' });
        }
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Користувача не знайдено' });
        }

        const match = await bcrypt.compare(password, user.passwordhash);

        if (match) {
            req.session.userId = user.userid;
            req.session.username = user.username;
            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Невірний пароль' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});
app.get('/api/user/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Ви не авторизовані" });
    }

    try {
        const result = await pool.query(
            "SELECT username, email, bio, level, avatarpath, totalxp, birhday FROM users WHERE userid = $1",
            [req.session.userId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Помилка БД:", err);
        res.status(500).json({ error: "Помилка сервера" });
    }
});

app.post('/api/user/update', async (req, res) => {
    if (!req.session.userId) return res.status(401).send("Unauthorized");

    const { username, bio, avatarpath, birhday } = req.body;
    try {
        await pool.query(
            "UPDATE users SET username = $1, bio = $2, avatarpath = $3, birhday = $4 WHERE userid = $5",
            [username, bio, avatarpath, birhday, req.session.userId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send("Не вдалося вийти");
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});
app.get('/api/comments', async (req, res) => {
    const { bookId, sectionId } = req.query;
    try {
        let query;
        let params;

        if (sectionId) {
            query = `
                SELECT c.*, u.username FROM comments c 
                JOIN users u ON c.userid = u.userid 
                WHERE c.bookid = $1 AND c.sectionid = $2 
                ORDER BY c.date DESC`;
            params = [bookId, sectionId];
        } else {
            query = `
                SELECT c.*, u.username FROM comments c 
                JOIN users u ON c.userid = u.userid 
                WHERE c.bookid = $1 AND (c.sectionid IS NULL OR c.sectionid = '') 
                ORDER BY c.date DESC`;
            params = [bookId];
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Помилка завантаження коментарів:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/comments', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Ви не авторизовані" });
    }

    const { bookId, sectionId, content } = req.body;
    try {
        await pool.query(
            "INSERT INTO comments (userid, bookid, sectionid, content, date) VALUES ($1, $2, $3, $4, NOW())",
            [req.session.userId, bookId, sectionId, content]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("Помилка збереження коментаря:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/wishlist', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Авторизуйтесь" });
    const { bookId } = req.body;
    try {
        const check = await pool.query(
            "SELECT * FROM wishlist WHERE userid = $1 AND bookid = $2", 
            [req.session.userId, bookId]
        );

        if (check.rows.length > 0) {
            await pool.query("DELETE FROM wishlist WHERE userid = $1 AND bookid = $2", [req.session.userId, bookId]);
            res.json({ status: 'removed' });
        } else {
            await pool.query("INSERT INTO wishlist (userid, bookid, priority) VALUES ($1, $2, 1)", [req.session.userId, bookId]);
            res.json({ status: 'added' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/user/wishlist', async (req, res) => {
    if (!req.session.userId) return res.status(401).send("Unauthorized");
    try {
        const result = await pool.query(
            `SELECT b.bookid, b.name FROM Books b 
             JOIN wishlist w ON b.bookid = w.bookid 
             WHERE w.userid = $1`, 
            [req.session.userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.post('/api/bookmarks', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Авторизуйтесь" });
    const { bookId, sectionId, label } = req.body;
    try {
        await pool.query(
            "INSERT INTO bookmarks (userid, bookid, sectionid, label) VALUES ($1, $2, $3, $4)",
            [req.session.userId, bookId, sectionId, label]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/user/bookmarks', async (req, res) => {
    if (!req.session.userId) return res.status(401).send("Unauthorized");
    try {
        const result = await pool.query(
            `SELECT bm.*, b.name as bookname FROM bookmarks bm
             JOIN Books b ON bm.bookid = b.bookid
             WHERE bm.userid = $1
             ORDER BY bm.bookmarkid DESC`,
            [req.session.userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});



const port = 3000;
app.listen(port, () => {
    console.log(`Сервер летить на http://localhost:${port}`);
});