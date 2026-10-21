// 1. Оголошуємо змінні на самому початку, щоб їх бачили ВСІ функції
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', async () => {
    if (!bookId) return;

    try {
        const response = await fetch(`/api/books/${bookId}`);
        const book = await response.json();
        
        // Оновлюємо посилання на читалку
        const readLink = document.querySelector('.book-header a');
        if (readLink) {
            readLink.href = `reader.html?id=${bookId}`;
        }

        // Заповнюємо дані сторінки
        document.querySelector('.title-meta h1').textContent = book.name;
        document.querySelector('.author').textContent = book.authorname;
        document.querySelector('.main-cover').src = book.coverpath;
        document.querySelector('.book-description p').textContent = book.description;

        const genreList = document.querySelector('.genre-tags');
        genreList.innerHTML = ''; 
        if (book.genres && book.genres[0] !== null) {
            book.genres.forEach(g => {
                const li = document.createElement('li');
                li.textContent = g;
                genreList.appendChild(li);
            });
        }

        const statsCells = document.querySelectorAll('.book-stats tr:nth-child(2) td .badge');
        statsCells[0].textContent = book.year;
        statsCells[1].textContent = book.language;
        statsCells[2].textContent = book.pagesnum;

        document.querySelector('.author-wrap p').textContent = book.authorbio || "Біографія уточнюється...";
        document.querySelector('.calc-hint').textContent = `The system has analyzed ${book.pagesnum} pages. Average ink density: 250 words/page.`;

        const videoIframe = document.querySelector('.video-reviews iframe');
        if (book.videopath) {
            videoIframe.src = book.videopath;
            videoIframe.style.display = 'block';
        }

        initCalculator(book.pagesnum, book.avg_perception);
        loadBookReviews(bookId);

    } catch (error) {
        console.error('Помилка завантаження деталей:', error);
    }
});

// 2. Логіка зірочки (Вішліст)
const favoriteStar = document.querySelector('.favorite-star');

if (favoriteStar) {
    favoriteStar.onclick = async () => {
        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId: bookId })
            });

            if (res.status === 401) return alert("Увійдіть у профіль, щоб додавати книги!");

            const data = await res.json();
            if (data.status === 'added') {
                favoriteStar.classList.add('active');
                alert("Книгу додано до вішліста!");
            } else {
                favoriteStar.classList.remove('active');
                alert("Книгу видалено з вішліста.");
            }
        } catch (err) {
            console.error("Помилка вішліста:", err);
        }
    };
}

// 3. Калькулятор
function initCalculator(pages, perception) {
    const form = document.querySelector('#reading-calc');
    const timeOutput = document.querySelector('#time-prediction');
    const slider = document.querySelector('.devotion-slider');
    const calculate = () => {
        const moodElement = document.querySelector('input[name="mood"]:checked');
        const mode = moodElement ? moodElement.id : 'focused';
        const dailyQuotas = {
            'leisurely': 20,
            'focused': 60,
            'rushing': 140
        };
        const minsPerPage = parseFloat(slider.value);
        const complexity = perception || 1.0;
        const totalDays = Math.ceil(pages / dailyQuotas[mode]);
        const totalReadingMinutes = pages * minsPerPage * complexity;
        const totalReadingHours = totalReadingMinutes / 60;
        if (totalDays > 1 || totalReadingHours > 24) {
            timeOutput.textContent = `${totalDays} days`;
        } else {
            const h = Math.floor(totalReadingHours);
            const m = Math.round(totalReadingMinutes % 60);
            timeOutput.textContent = h > 0 ? `${h} hours ${m} min` : `${m} min`;
        }
    };

    slider.addEventListener('input', calculate);
    form.querySelectorAll('input[name="mood"]').forEach(r => r.addEventListener('change', calculate));
    
    calculate();
}

// 4. Завантаження відгуків
async function loadBookReviews(bId) {
    const list = document.querySelector('.reviews-list');
    if (!list) return;

    try {
        const res = await fetch(`/api/comments?bookId=${bId}`);
        const reviews = await res.json();
        list.innerHTML = ''; 

        if (reviews.length === 0) {
            list.innerHTML = '<li>Ще немає відгуків.</li>';
            return;
        }

        reviews.forEach(r => {
            const date = new Date(r.date).toLocaleString('uk-UA');
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="comment-item">
                    <div class="comment-meta">
                        <strong>${r.username}</strong>
                        <span class="comment-date">${date}</span>
                    </div>
                    <p class="comment-text">"${r.content}"</p>
                </div>`;
            list.appendChild(li);
        });
    } catch (err) {
        console.error("Помилка завантаження відгуків:", err);
    }
}

// 5. Кнопка "Leave review"
const leaveReviewBtn = document.querySelector('.leave-review');
if (leaveReviewBtn) {
    leaveReviewBtn.onclick = async () => {
        const content = prompt("Напишіть ваш відгук про книгу:");
        if (!content) return;

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId: bookId, sectionId: null, content: content })
            });

            if (res.status === 401) alert("Спочатку авторизуйтесь!");
            else if (res.ok) loadBookReviews(bookId);
        } catch (err) {
            console.error("Помилка відправки відгуку:", err);
        }
    };
}