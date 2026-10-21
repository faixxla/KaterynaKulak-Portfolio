document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

    const tableBody = document.querySelector('#books-table tbody');
    const searchTerm = urlParams.get('search');

    if (searchTerm) {
        performSearch(searchTerm, document.querySelector('#books-table tbody'));
        searchInput.value = searchTerm;
    }
    try {
        let apiUrl = '/api/books';
        if (category) {
            apiUrl += `?cat=${category}`;
        }

        const response = await fetch(apiUrl);
        const books = await response.json();
        tableBody.innerHTML = '';
        let currentRow;
        
        if (books.length === 0) {
            tableBody.innerHTML = '<tr><td>У цій категорії поки порожньо ‒‒ завантажте першу книгу!</td></tr>';
            return;
        }

        books.forEach((book, index) => {
            if (index % 3 === 0) {
                currentRow = document.createElement('tr');
                tableBody.appendChild(currentRow);
            }
            const td = document.createElement('td');
            td.innerHTML = `
                <a href="book-details.html?id=${book.bookid}">
                    <figure>
                        <img src="${book.coverpath}" width="110" height="160" alt="Cover">
                        <figcaption>${book.name}</figcaption>
                    </figure>
                </a>
            `;
            currentRow.appendChild(td);
        });
    } catch (error) {
        console.error('Помилка завантаження:', error);
    }
});
const randomBtn = document.querySelector('#random-btn');

randomBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/books/random');
        const book = await response.json();

        if (!book) return;

        const tableBody = document.querySelector('#books-table tbody');
        tableBody.innerHTML = '';

        const row = document.createElement('tr');
        const td = document.createElement('td');
        
        td.innerHTML = `
            <a href="book-details.html?id=${book.bookid}">
                <figure>
                    <img src="${book.coverpath}" width="110" height="160" alt="Cover">
                    <figcaption>${book.name} (Рандом дня!)</figcaption>
                </figure>
            </a>
        `;
        
        row.appendChild(td);
        tableBody.appendChild(row);

    } catch (error) {
        console.error('Не вдалося знайти випадкову книгу:', error);
    }
});

const glitchBtn = document.getElementById('glitch-trigger');

if (glitchBtn) {
    glitchBtn.onclick = () => {
        document.body.classList.add('minor-glitch');
        setTimeout(() => {
            document.body.classList.remove('minor-glitch');
        }, 2000);

        setTimeout(() => {
            document.body.classList.add('major-glitch');
            
            // const glitchSound = new Audio('sounds/glitch.mp3');
            // glitchSound.play();

            setTimeout(() => {
                const blackout = document.getElementById('blackout');
                blackout.classList.add('active');
                setTimeout(() => {
                    window.location.href = 'quest.html';
                }, 1500);
            }, 4000);
        }, 3500);
    };
}