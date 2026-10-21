document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Завантажуємо дані
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
            window.location.href = 'index.html';
            return;
        }
        const user = await response.json();

        document.getElementById('user-name').textContent = user.username;
        document.getElementById('user-status').textContent = user.bio || "Вовк не той хто вовк...";
        document.getElementById('user-avatar').src = user.avatarpath || 'images/default-avatar.jpg';
        
        const progress = user.level ? (user.totalxp % 100) : 0; 
        document.getElementById('level-progress').value = progress;
        document.getElementById('level-text').textContent = `${progress}%`;

        document.getElementById('display-name').value = user.username;
        document.getElementById('bio-input').value = user.bio || '';
        document.getElementById('avatar-path').value = user.avatarpath || '';
        if (user.birhday) {
            document.getElementById('birhday').value = user.birhday.split('T')[0];
        }
        loadWishlist();
        loadBookmarks();
        async function loadWishlist() {
            const listContainer = document.getElementById('wishlist-items');
            if (!listContainer) return;

            try {
                const res = await fetch('/api/user/wishlist');
                const books = await res.json();

                if (books.length === 0) {
                    listContainer.innerHTML = '<li>Твій список поки порожній. Час додати щось цікаве!</li>';
                    return;
                }

                // Створюємо список посилань
                listContainer.innerHTML = books.map(book => `
                    <li>
                        <a href="book-details.html?id=${book.bookid}" class="wishlist-link">
                            ${book.name}
                        </a>
                    </li>
                `).join('');

            } catch (err) {
                console.error("Не вдалося завантажити вішліст:", err);
            }
        }

    } catch (err) {
        console.error("Помилка профілю:", err);
    }
});

// Обробка збереження змін
document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Дані оновлено!");
        location.reload();
    }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    const res = await fetch('/api/logout', { method: 'POST' });
    if (res.ok) window.location.href = 'index.html';
});

async function loadBookmarks() {
    const tableBody = document.querySelector('#bookmarks-table tbody');
    if (!tableBody) return;

    try {
        const res = await fetch('/api/user/bookmarks');
        const bookmarks = await res.json();

        if (bookmarks.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="2">У вас ще немає закладинок.</td></tr>';
            return;
        }

        tableBody.innerHTML = bookmarks.map(bm => `
            <tr>
                <td>
                    <a href="reader.html?id=${bm.bookid}&section=${encodeURIComponent(bm.sectionid)}">
                        📖 ${bm.bookname}
                    </a>
                </td>
                <td>${bm.label || '—'}</td>
            </tr>
        `).join('');

    } catch (err) {
        console.error("Не вдалося завантажити закладинки:", err);
    }
}