const authForm = document.getElementById('auth-form');
const usernameGroup = document.getElementById('username-group');
const authSubmit = document.getElementById('auth-submit');
const loginBtn = document.getElementById('show-login');
const registerBtn = document.getElementById('show-register');
let isLogin = false;
//вхід
loginBtn.onclick = () => {
    isLogin = true;
    const lang = localStorage.getItem('preferredLang') || 'en';
    usernameGroup.style.display = 'none';
    authSubmit.textContent = translations[lang]['submit_login'];
    loginBtn.classList.add('active');
    registerBtn.classList.remove('active');
};
// РеєстраціЯ
registerBtn.onclick = () => {
    isLogin = false;
    const lang = localStorage.getItem('preferredLang') || 'en';
    usernameGroup.style.display = 'block';
    authSubmit.textContent = translations[lang]['submit_reg'];
    registerBtn.classList.add('active');
    loginBtn.classList.remove('active');
};

authForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const formData = new FormData(authForm);
    const data = Object.fromEntries(formData.entries());

    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert(isLogin ? 'З поверненням!' : 'Реєстрація успішна!');
            window.location.href = 'profile.html';
        } else {
            alert(result.error || 'Помилка авторизації');
        }
    } catch (err) {
        console.error('Помилка:', err);
        alert('Сервер не відповідає');
    }
});