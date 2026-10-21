const questScript = [
    { name: "???", text: "...", slide: "0.png" },
    { name: "???", text: "...", slide: "1.png" },
    { name: "???", text: "...", slide: "2.png" },
    { name: "???", text: "...", slide: "3.png" },
    { name: "???", text: "Йой..", slide: "4.png" },
    { name: "???", text: "здається, сайт знову зламали...", slide: "5.png" },
    { name: "???", text: "Знову?", slide: "6.png" },
    { name: "???", text: "Агх... Як мені це вже набридло", slide: "7.png" },
    { name: "???", text: "...", slide: "8.png" },
    { name: "Перша", text: "Та що ви собі думаєте!!", slide: "9.png" },
    { name: "Перша", text: "Клацаєте куди не треба, а нам це потім лагодити!!", slide: "10.png" },
    { name: "Друга", text: "Я не думаю що користувач зробив це навмисно...", slide: "11.png" },
    { name: "Друга", text: "Давай не будемо злитись, Перша...", slide: "12.png" },
    { name: "Перша", text: "...", slide: "13.png" },
    { name: "Перша", text: "...", slide: "14.png" },
    { name: "Перша", text: "Ну... Добре", slide: "15.png" },
    { name: "Перша", text: "Як ти розумієш, мій ,,любий'' користувач, я не збираюся в котрий раз самостійно лагодити сайт.", slide: "16.png" },
    { name: "Перша", text: "Але й залишати його в такому стані теж не можу.", slide: "17.png" },
    { name: "Перша", text: "Тому зараз ти будеш лагодити його самостійно.", slide: "18.png" },
    { name: "Друга", text: "Вибач, але нам дійсно потрібна твоя допомога...", slide: "19.png" },
    { name: "Перша", text: "Ні за що вибачатись, він сам винен, тому повинен там допомогти", slide: "20.png" },
    { name: "Друга", text: "   ", slide: "21.png" }
];

let currentStep = 0;
let isTyping = false;

// 1. Початкова пауза
window.onload = () => {
    // Тримаємо чорний екран 3 секунди
    setTimeout(() => {
        document.getElementById('game-container').classList.remove('black-screen');
        showNextStep();
    }, 3000); 
};

function showNextStep() {
    if (currentStep >= questScript.length) {
        prepareForGame(); // Замість startCorrectorGame()
        return;
    }

    const step = questScript[currentStep];
    const slideDisplay = document.getElementById('slide-display');
    const wrapper = document.getElementById('dialog-wrapper');
    const nameTag = document.querySelector('.name-tag');

    // Оновлюємо фон-кадр аніматіка
    slideDisplay.style.backgroundImage = `url('images/quest/${step.slide}')`;
    
    wrapper.classList.remove('hidden');
    nameTag.textContent = step.name;
    
    // Запускаємо друк тексту
    typeWriter('typewriter-text', step.text, 40);
    
    currentStep++;
}
function prepareForGame() {
    // 1. Повністю приховуємо новелу
    document.getElementById('game-container').classList.add('hidden');
    
    // 2. Показуємо контейнер гри
    const gameArea = document.getElementById('corrector-game');
    gameArea.classList.remove('hidden');
    gameArea.classList.add('dissipate-effect');

    // 3. Показуємо чібіків, але ХОВАЄМО інтерфейс (таймер/рахунок)
    document.querySelector('.chibi-container').classList.remove('hidden');
    document.querySelector('.game-ui').classList.add('hidden'); 

    // 4. Пояснення від Першої
    setTimeout(() => {
        showBubble('left', 'Так, слухай сюди. Це коректор. Треба замазати це кляте чорнило.', 'serious');
        
        setTimeout(() => {
            showBubble('left', 'Злови 30 капель за 20 секунд. Не змушуй мене чекати.', 'serious');

            setTimeout(() => {
                showBubble('left', 'ГОТОВИЙ? СТАРТ!', 'angry');
                
                setTimeout(() => {
                    document.querySelector('.game-ui').classList.remove('hidden');
                    startCorrectorGame(); 
                }, 1000);
            }, 4000);
        }, 4000);
    }, 1500);
}

// Функція друку з блокуванням кліку, поки текст не допишеться
function typeWriter(id, text, speed) {
    isTyping = true;
    let i = 0;
    const el = document.getElementById(id);
    el.innerHTML = "";
    
    function type() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            isTyping = false; // Текст закінчився, можна клікати далі
        }
    }
    type();
}

// 2. Гортання діалогів по кліку на будь-яку частину екрана
document.getElementById('game-container').onclick = () => {
    if (!isTyping) {
        showNextStep();
    }
};

let score = 0;
let timeLeft = 20;
let catchStreak = 0;
let missStreak = 0;
let gameInterval;
let dropInterval;
let clockInterval;

function startCorrectorGame() {
    score = 0;
    timeLeft = 20;
    catchStreak = 0;
    missStreak = 0;
    
    document.getElementById('counter').textContent = `Зловлено: 0/30`;
    document.getElementById('timer').textContent = `Час: 20`;

    // Зупиняємо старі інтервали, якщо вони раптом завалялися
    if (clockInterval) clearInterval(clockInterval);
    if (dropInterval) clearInterval(dropInterval);

    clockInterval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            timeLeft = 0; // Щоб не було мінусів
            document.getElementById('timer').textContent = `Час: ${timeLeft}`;
            endGame();
        } else {
            document.getElementById('timer').textContent = `Час: ${timeLeft}`;
        }
    }, 1000);

    dropInterval = setInterval(() => {
        spawnDrop();
    }, 400); 
}

function spawnDrop() {
    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.style.left = Math.random() * (window.innerWidth - 30) + 'px';
    drop.style.top = '-50px';
    
    document.getElementById('drop-zone').appendChild(drop);

    // Анімація падіння
    let pos = -50;
    const fall = setInterval(() => {
        if (pos > window.innerHeight) {
            clearInterval(fall);
            if (drop.parentElement) {
                drop.remove();
                handleMiss();
            }
        } else {
            pos += 5; // Швидкість падіння
            drop.style.top = pos + 'px';
        }
    }, 20);

    drop.onclick = () => {
        clearInterval(fall);
        handleCatch(drop.style.left, drop.style.top);
        drop.remove();
    };
}

function handleCatch(x, y) {
    score++;
    catchStreak++;
    missStreak = 0;
    document.getElementById('counter').textContent = `Зловлено: ${score}/30`;
    
    // Створюємо кляксу
    const blot = document.createElement('div');
    blot.className = 'blot';
    blot.style.left = `calc(${x} - 85px)`;
    blot.style.top = `calc(${y} - 85px)`;
    document.getElementById('drop-zone').appendChild(blot);

    if (catchStreak === 10) {
        showBubble('left', 'Ти молодець! Так тримати!', 'happy');
        catchStreak = 0;
    }
}

function handleMiss() {
    catchStreak = 0;
    missStreak++;
    if (missStreak === 3) {
        showBubble('right', 'Навіть хробак краще за тебе...', 'smirk');
        missStreak = 0;
    }
}

function showBubble(side, text, emotion) {
    const bubbleId = side === 'left' ? 'bubble-left' : 'bubble-right';
    const bubble = document.getElementById(bubbleId);
    const chibiId = side === 'left' ? 'chibi-first' : 'chibi-second';
    const chibi = document.getElementById(chibiId);
    
    bubble.textContent = text;
    bubble.classList.remove('hidden');
    
    const baseName = side === 'left' ? 'first' : 'second';
    chibi.src = `images/chibi_${baseName}_${emotion}.png`;

    setTimeout(() => {
        bubble.classList.add('hidden');
        chibi.src = `images/chibi_${baseName}_idle.png`;
    }, 3500);
}

const skipBtn = document.getElementById('skip-btn');

skipBtn.onclick = (e) => {
    e.stopPropagation();
    isTyping = false;

    if (typeof animationInterval !== 'undefined' && animationInterval) {
        clearInterval(animationInterval);
    }
    skipBtn.classList.add('hidden');
    prepareForGame();
};

function endGame() {
    clearInterval(clockInterval);
    clearInterval(dropInterval);
    
    // Прибираємо каплі, що залишилися на екрані
    const drops = document.querySelectorAll('.drop');
    drops.forEach(d => d.remove());

    if (score >= 30) {
        // ГІЛКА ПЕРЕМОГИ
        document.getElementById('corrector-game').style.backgroundColor = '#e5e5da';
        
        showBubble('right', 'Ми це зробили! Ти справжній майстер!', 'happy');
        
        setTimeout(() => {
            showBubble('left', 'Ну... принаймні тепер це не схоже на катастрофу. Це було не так вже й важко, правда?', 'serious');
            
            // Тут можна додати затримку і перехід до наступного квесту
            setTimeout(() => {
                alert("Перемога! Наступний етап скоро..."); 
            }, 4000);
        }, 3000);

    } else {
        // ГІЛКА ПРОГРАШУ
        showBubble('left', 'Я ж казала... Навіть з коректором ти примудрився все зіпсувати. Жах.', 'smirk');
        
        setTimeout(() => {
            showBubble('right', 'Ой, не зважай на неї... Не сумуй! Давай спробуємо ще раз? У тебе обов\'язково вийде!', 'happy');
            
            // Показуємо кнопку рестарту через 3 секунди
            setTimeout(() => {
                showRetryButton();
            }, 3000);
        }, 3500);
    }
}
function showRetryButton() {
    const btn = document.getElementById('retry-btn');
    btn.classList.remove('hidden');
    
    btn.onclick = () => {
        btn.classList.add('hidden');
        // Очищаємо клякси перед новою грою
        document.getElementById('drop-zone').innerHTML = '';
        document.getElementById('corrector-game').style.backgroundColor = '#000';
        startCorrectorGame();
    };
}