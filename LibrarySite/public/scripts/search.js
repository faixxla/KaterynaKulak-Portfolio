document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBar = document.querySelector('.search-bar');

    // Створюємо контейнер для результатів ("штору") динамічно
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results';
    searchBar.appendChild(resultsContainer);

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();

        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`/api/books?search=${encodeURIComponent(query)}`);
            const books = await response.json();

            if (books.length > 0) {
                resultsContainer.innerHTML = '';
                books.forEach(book => {
                    const item = document.createElement('div');
                    item.className = 'search-item';
                    item.innerHTML = `
                        <img src="${book.coverpath}" alt="cover">
                        <span>${book.name} ‒ ${book.authorname || ''}</span>
                    `;
                    item.onclick = () => {
                        window.location.href = `book-details.html?id=${book.bookid}`;
                    };
                    resultsContainer.appendChild(item);
                });
                resultsContainer.style.display = 'block';
            } else {
                resultsContainer.style.display = 'none';
            }
        } catch (err) {
            console.error('Помилка живого пошуку:', err);
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
        console.error(err);
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

// 3. Вихід з акаунта
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send("Не вдалося вийти");
        res.clearCookie('connect.sid'); // Видаляємо куку сесії
        res.json({ success: true });
    });
});
    // Ховаємо штору, якщо клікнули поза нею
    document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
});