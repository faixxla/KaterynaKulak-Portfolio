// 1. Оголошуємо глобальні змінні один раз на самому початку
let totalSeconds = 0;
let currentSection = "";
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');
const timerElement = document.getElementById('reading-timer');

// Таймер (без змін)
function updateTimer() {
    totalSeconds++;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    timerElement.textContent = 
        String(hours).padStart(2, '0') + ":" + 
        String(minutes).padStart(2, '0') + ":" + 
        String(seconds).padStart(2, '0');
}
setInterval(updateTimer, 1000);

// Функція завантаження коментарів (використовує глобальні змінні)
async function loadComments(bId, sId) {
    const list = document.querySelector('.reviews-list');
    if (!list) return;
    
    list.innerHTML = '<li>Завантаження...</li>';

    try {
        const res = await fetch(`/api/comments?bookId=${bId}&sectionId=${encodeURIComponent(sId)}`);
        const comments = await res.json();

        list.innerHTML = ''; 
        if (comments.length === 0) {
            list.innerHTML = '<li>Тут ще немає коментарів. Будьте першим!</li>';
            return;
        }

    comments.forEach(c => {
        const li = document.createElement('li');
        
        // Форматуємо дату (день.місяць.рік години:хвилини)
        const commentDate = new Date(c.date).toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        li.innerHTML = `
            <div class="comment-item">
                <div class="comment-meta">
                    <strong>${c.username}</strong>
                    <span class="comment-date">${commentDate}</span>
                </div>
                <p class="comment-text">"${c.content}"</p>
            </div>
        `;
        list.appendChild(li);
    });
    } catch (err) {
        console.error("Помилка коментарів:", err);
    }
}

// Логіка кнопки додавання коментаря (+)
document.querySelector('.add-btn').onclick = async () => {
    if (!currentSection) {
        alert("Зачекайте, поки розділ завантажиться");
        return;
    }

    const content = prompt("Ваш коментар:");
    if (!content) return;

    try {
        const res = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookId: bookId,
                sectionId: currentSection, // Тепер тут буде актуальний шлях
                content: content
            })
        });

        if (res.status === 401) {
            alert("Тільки зареєстровані користувачі можуть залишати коментарі!");
        } else if (res.ok) {
            // Перевантажуємо список після додавання
            loadComments(bookId, currentSection);
        }
    } catch (err) {
        console.error("Не вдалося відправити коментар:", err);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    if (!bookId) {
        console.error("ID не знайдено!");
        return;
    }

    const backLink = document.querySelector('.header-controls a');
    if (backLink) {
        backLink.href = `book-details.html?id=${bookId}`;
    }

    try {
        const response = await fetch(`/api/books/${bookId}`);
        const book = await response.json();

        document.querySelector('.header-info h1').textContent = book.name;
        document.querySelector('.header-info .author').textContent = book.authorname;

        const rendition = ePub(book.filepath).renderTo("viewer", {
            width: "100%",
            height: "100%",
            flow: "paginated",
            manager: "default"
        });

        rendition.themes.default({
            "body": {
                "padding": "40px !important",
                "font-family": "'Georgia', serif !important",
                "color": "#1a1a1a !important"
            }
        });

        rendition.display();
        const sectionToJump = urlParams.get('section');
        if (sectionToJump) {
            rendition.display(sectionToJump);
            console.log("Стрибок до закладинки:", sectionToJump);
        }
        
        // Масштаб
        const zoomSlider = document.querySelector('#page-zoom');
        zoomSlider.addEventListener('input', () => {
            rendition.themes.fontSize(`${zoomSlider.value}%`);
            document.querySelector('#zoom-value').textContent = `${zoomSlider.value}%`;
        });

        // Навігація
        const [prevBtn, nextBtn] = document.querySelectorAll('.reader-nav a');
        prevBtn.onclick = (e) => { e.preventDefault(); rendition.prev(); };
        nextBtn.onclick = (e) => { e.preventDefault(); rendition.next(); };

        // ВІДСТЕЖЕННЯ РОЗДІЛІВ
        rendition.on("relocated", (location) => {
            const percent = Math.round(location.start.percentage * 100);
            const progressBadge = document.querySelector('.bookmark-info .badge');
            if (progressBadge) progressBadge.textContent = `${percent}%`;

            const newSection = location.start.href;

            // ОНОВЛЮЄМО ГЛОБАЛЬНУ ЗМІННУ (без let!)
            if (currentSection !== newSection) {
                currentSection = newSection;
                console.log("Перейшли в новий розділ:", currentSection);
                loadComments(bookId, currentSection);
            }
        });

    } catch (error) {
        console.error('Помилка читалки:', error);
    }
});

document.querySelector('.bookmark-btn').onclick = async () => {
    if (!currentSection) return alert("Зачекайте завантаження книги");
    
    // Викликаємо вікно для введення тексту замітки
    const label = prompt("Введіть коротку замітку для цієї закладинки:");
    if (label === null) return; // Якщо натиснуто "Скасувати"

    try {
        const res = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookId: bookId,
                sectionId: currentSection,
                label: label
            })
        });

        if (res.status === 401) alert("Увійдіть у профіль!");
        else if (res.ok) alert("Закладинку успішно додано!");
    } catch (err) {
        console.error("Помилка збереження закладинки:", err);
    }
};