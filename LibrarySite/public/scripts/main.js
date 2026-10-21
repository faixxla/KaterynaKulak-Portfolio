const translations = {
    'en': {
        'search_placeholder': 'Search',
        'find_btn': 'Find',
        'menu_title': 'Menu',
        'nav_catalog': 'Catalog',
        'nav_minigames': 'Minigames',
        'nav_profile': 'Profile',
        'video_error': 'Your browser does not support video.',
        'hero_title': 'Your personal',
        'hero_subtitle': 'library',
        'gallery_title': 'What can Inked offer?',
        'feat_1_title': 'Track your reading progress',
        'feat_1_desc': 'with bookmarks.',
        'feat_2_title': 'Make notes and comment documents',
        'feat_2_desc': 'you can write comments below every page!',
        'feat_3_title': 'Read anytime, anywhere',
        'feat_3_desc': 'just with a few clicks.',
        'auth_reg_tab': 'Registration',
        'auth_login_tab': 'Login',
        'label_name': 'Name:',
        'label_email': 'Email:',
        'label_password': 'Password:',
        'submit_reg': 'Sign Up',
        'submit_login': 'Sign In'
    },
    'uk': {
        'search_placeholder': 'Пошук',
        'find_btn': 'Знайти',
        'menu_title': 'Меню',
        'nav_catalog': 'Каталог',
        'nav_minigames': 'Міні-ігри',
        'nav_profile': 'Профіль',
        'video_error': 'Ваш браузер не підтримує відео.',
        'hero_title': 'Ваша персональна',
        'hero_subtitle': 'бібліотека',
        'gallery_title': 'Що пропонує Inked?',
        'feat_1_title': 'Відстежуйте прогрес читання',
        'feat_1_desc': 'за допомогою закладок.',
        'feat_2_title': 'Робіть нотатки та коментуйте документи',
        'feat_2_desc': 'ви можете залишати коментарі під кожною сторінкою!',
        'feat_3_title': 'Читайте в будь-який час і в будь-якому місці',
        'feat_3_desc': 'просто клацнувши кілька разів.',
        'auth_reg_tab': 'Реєстрація',
        'auth_login_tab': 'Вхід',
        'label_name': "Ім'я:",
        'label_email': 'Email:',
        'label_password': 'Пароль:',
        'submit_reg': 'Зареєструватися',
        'submit_login': 'Увійти'
    }
};

function changeLanguage(lang) {
    localStorage.setItem('preferredLang', lang);
    
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    document.documentElement.lang = lang;
const savedLang = localStorage.getItem('preferredLang') || 'en';
changeLanguage(savedLang);
}


// карусель
const images = [
    'images/cover1.jpg', 'images/cover2.jpg', 'images/cover3.jpg', 
    'images/cover4.jpg', 'images/cover5.jpg', 'images/cover6.jpg', 
    'images/cover7.jpg', 'images/cover8.jpg', 'images/cover9.jpg', 'images/cover10.jpg'
];

let currentIndex = 0;

function updateCarousel() {
    const mainImg = document.getElementById('main-img');
    const prevImg = document.getElementById('prev-img');
    const nextImg = document.getElementById('next-img');

    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;

    mainImg.src = images[currentIndex];
    prevImg.src = images[prevIndex];
    nextImg.src = images[nextIndex];
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
}
updateCarousel();

function scaleUp(element) {
    element.style.transform = "scale(1.1)";
}

function scaleDown(element) {
    element.style.transform = "scale(1)";
}

document.addEventListener("DOMContentLoaded", () => {
    const selectors = ['.main-img', '.side-img', '.search-bar button'];

    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.onmouseover = () => scaleUp(el);
            el.onmouseout = () => scaleDown(el);
        });
    });
});