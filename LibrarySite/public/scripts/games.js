const oracleData = {
    when: [
        "«The timing is not yet written in the stars.»",
        "«Expect it when the moon reaches its peak.»",
        "«It will happen sooner than the ink dries on this page.»",
        "«Time is a flat circle; it has already happened.»"
    ],
    where: [
        "«Look where the shadows fall longest.»",
        "«In the place where you first felt at home.»",
        "«Between the covers of a forgotten book.»",
        "«Where the ink flows, there you shall find it.»"
    ],
    who: [
        "«A stranger with a story to tell.»",
        "«Someone you have already met but did not see.»",
        "«The one who holds the quill.»",
        "«The person you see in the mirror first thing in the morning.»"
    ],
    general: [
        "«The ink is still wet, the answer is unclear.»",
        "«Follow the signs hidden in the margins.»",
        "«It is not for the living to know yet.»",
        "«Silence is the best answer for now.»"
    ]
};

function openBibliomancy() {
    document.getElementById('game-modal').style.display = 'block';
}

function closeGame() {
    document.getElementById('game-modal').style.display = 'none';
}

function getPrediction() {
    const input = document.getElementById('user-question');
    const question = input.value.trim().toLowerCase();
    if (question === "") {
        alert("Ask the question first, seeker.");
        return;
    }
    let category = 'general';
    if (question.startsWith('when')) {
        category = 'when';
    } else if (question.startsWith('where')) {
        category = 'where';
    } else if (question.startsWith('who')) {
        category = 'who';
    }
    const resultBox = document.getElementById('prediction-result');
    const currentQuotes = oracleData[category];
    const randomQuote = currentQuotes[Math.floor(Math.random() * currentQuotes.length)];
    resultBox.style.opacity = 0;
    resultBox.innerText = randomQuote;
    let op = 0;
    let timer = setInterval(function () {
        if (op >= 1) clearInterval(timer);
        resultBox.style.opacity = op;
        op += 0.1;
    }, 50);
}



let catcherActive = false;
const canvas = document.getElementById('inkCanvas');
const ctx = canvas.getContext('2d');

// Налаштування гри
let score = 0;
let missed = 0;
let drops = [];
let player = { x: 200, y: 350, width: 60, height: 20 };

// Функція відкриття гри
function openCatcher() {
    document.getElementById('catcher-modal').style.display = 'block';
    // Налаштовуємо реальний розмір полотна
    canvas.width = 500;
    canvas.height = 400;
    score = 0;
    missed = 0;
    drops = [];
    catcherActive = true;
    updateGameUI();
    requestAnimationFrame(gameLoop);
}

function closeCatcher() {
    document.getElementById('catcher-modal').style.display = 'none';
    catcherActive = false;
}

// Керування (мишка + тач для телефону)
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    player.x = e.clientX - rect.left - player.width / 2;
});

canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    player.x = e.touches[0].clientX - rect.left - player.width / 2;
    e.preventDefault();
}, { passive: false });

function spawnDrop() {
    if (Math.random() < 0.03) { // Шанс появи нової краплі
        drops.push({
            x: Math.random() * (canvas.width - 10),
            y: 0,
            speed: 2 + Math.random() * 3,
            radius: 5 + Math.random() * 5
        });
    }
}

function updateGameUI() {
    document.getElementById('score-val').innerText = score;
    document.getElementById('missed-val').innerText = missed;
}

function gameLoop() {
    if (!catcherActive) return;

    // Очищення полотна
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Малюємо гравця (твоє "перо" або чорнильниця)
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Обробка крапель
    spawnDrop();
    for (let i = 0; i < drops.length; i++) {
        let d = drops[i];
        d.y += d.speed;

        // Малюємо краплю чорнила
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fill();

        // Перевірка зіткнення
        if (d.y + d.radius > player.y && d.x > player.x && d.x < player.x + player.width) {
            score++;
            drops.splice(i, 1);
            i--;
            updateGameUI();
        } 
        // Якщо пропустили
        else if (d.y > canvas.height) {
            missed++;
            drops.splice(i, 1);
            i--;
            updateGameUI();
            if (missed >= 15) {
                alert("Game Over! Your ink has spilled everywhere. Final Score: " + score);
                closeCatcher();
            }
        }
    }

    requestAnimationFrame(gameLoop);
}




// Змінні гри
let memoryGameActive = false;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
const totalPairs = 8;
function openMemoryGame() {
    document.getElementById('memory-modal').style.display = 'block';
    resetMemoryGame();
}
function closeMemoryGame() {
    document.getElementById('memory-modal').style.display = 'none';
}
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');
    if (!hasFlippedCard) {
        // Перша картка
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.cover === secondCard.dataset.cover;
    isMatch ? disableCards() : unflipCards();
}

// Картки збіглися
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs++;
    if (matchedPairs === totalPairs) {
        setTimeout(() => alert("Congratulations! You found all pairs!"), 500);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function resetMemoryGame() {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = ''; // Очищаємо сітку
    matchedPairs = 0;
    resetBoard();

    const covers = [];
    for (let i = 1; i <= totalPairs; i++) {
        covers.push(`cover${i}`);
        covers.push(`cover${i}`);
    }

    for (let i = covers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [covers[i], covers[j]] = [covers[j], covers[i]];
    }

    covers.forEach(coverName => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.cover = coverName;

        const frontFace = document.createElement('img');
        frontFace.classList.add('front-face');
        frontFace.src = `images/${coverName}.jpg`;
        frontFace.alt = 'Book Cover';

        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        backFace.innerText = 'INK';

        card.appendChild(frontFace);
        card.appendChild(backFace);
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}






const quizData = [
    {
        quote: "«Big Brother is watching you.»",
        options: ["Winston Smith", "George Orwell", "O'Brien", "Julia"],
        correct: 0
    },
    {
        quote: "«I am no bird; and no net ensnares me.»",
        options: ["Elizabeth Bennet", "Jane Eyre", "Catherine Earnshaw", "Emma Woodhouse"],
        correct: 1
    },
    {
        quote: "«Stay Gold, Ponyboy. Stay Gold.»",
        options: ["Johnny Cade", "Dallas Winston", "Ponyboy Curtis", "Sodapop"],
        correct: 0
    },
    {
        quote: "«It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.»",
        options: ["Mr. Darcy", "Mr. Collins", "Narrator", "Elizabeth Bennet"],
        correct: 2
    },
    {
        quote: "«I've got a golden ticket!»",
        options: ["Willy Wonka", "Charlie Bucket", "Augustus Gloop", "Grandpa Joe"],
        correct: 1
    }
];

let currentStep = 0;
let userScore = 0;

function openCharacterMatch() {
    document.getElementById('character-modal').style.display = 'block';
    startQuiz();
}

function closeCharacterMatch() {
    document.getElementById('character-modal').style.display = 'none';
}

function startQuiz() {
    currentStep = 0;
    userScore = 0;
    document.getElementById('quiz-box').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
    showQuestion();
}

function showQuestion() {
    const data = quizData[currentStep];
    document.getElementById('question-text').innerText = data.quote;
    document.getElementById('current-q').innerText = currentStep + 1;
    
    const optionsBox = document.getElementById('options-box');
    optionsBox.innerHTML = ''; // Очищуємо старі кнопки

    data.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opt;
        btn.onclick = () => checkQuizAnswer(index, btn);
        optionsBox.appendChild(btn);
    });
}

function checkQuizAnswer(index, btn) {
    const correctIdx = quizData[currentStep].correct;
    
    // Блокуємо всі кнопки, щоб не клікали двічі
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (index === correctIdx) {
        userScore++;
        btn.classList.add('correct-flash');
    } else {
        btn.classList.add('wrong-flash');
        allBtns[correctIdx].classList.add('correct-flash');
    }

    setTimeout(() => {
        currentStep++;
        if (currentStep < quizData.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    document.getElementById('quiz-box').style.display = 'none';
    const res = document.getElementById('quiz-results');
    res.style.display = 'block';
    document.getElementById('final-result-text').innerHTML = 
        `Your wisdom level: <strong>${userScore} out of ${quizData.length}</strong> points.`;
}