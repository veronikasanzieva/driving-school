document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // БАЗОВЫЕ ФУНКЦИИ (Темы, доступность)
    // ==========================================
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const contrastBtn = document.getElementById('contrast-toggle');
    const fontIncreaseBtn = document.getElementById('font-increase');
    const fontDecreaseBtn = document.getElementById('font-decrease');
    const speakBtn = document.getElementById('speak-btn');

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-theme');

    contrastBtn.addEventListener('click', () => {
        body.classList.toggle('high-contrast');
        if(body.classList.contains('high-contrast')) body.classList.remove('dark-theme');
    });

    let currentFontSize = 16;
    fontIncreaseBtn.addEventListener('click', () => {
        if (currentFontSize < 24) {
            currentFontSize += 2;
            document.documentElement.style.setProperty('--font-size-base', `${currentFontSize}px`);
        }
    });
    fontDecreaseBtn.addEventListener('click', () => {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            document.documentElement.style.setProperty('--font-size-base', `${currentFontSize}px`);
        }
    });

    // Озвучивание текста (с возможностью остановки)
    let isSpeaking = false;
    
    speakBtn.addEventListener('click', () => {
        if (isSpeaking) {
            // Если сейчас читает — останавливаем
            window.speechSynthesis.cancel();
            isSpeaking = false;
            speakBtn.textContent = '🔊 Озвучить';
            speakBtn.style.background = 'var(--bg-color)';
            speakBtn.style.color = 'var(--text-color)';
        } else {
            // Если не читает — запускаем
            window.speechSynthesis.cancel(); // очищаем очередь
            const textToRead = document.querySelector('main').innerText;
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = 'ru-RU';
            
            // Когда чтение закончится само, возвращаем кнопку в исходное состояние
            utterance.onend = () => {
                isSpeaking = false;
                speakBtn.textContent = '🔊 Озвучить';
                speakBtn.style.background = 'var(--bg-color)';
                speakBtn.style.color = 'var(--text-color)';
            };

            window.speechSynthesis.speak(utterance);
            
            // Меняем вид кнопки, пока она читает
            isSpeaking = true;
            speakBtn.textContent = '🛑 Стоп';
            speakBtn.style.background = 'var(--accent-color)';
            speakBtn.style.color = 'white';
        }
    });

    // ==========================================
    // 1. КНОПКА "НАВЕРХ"
    // ==========================================
    const scrollTopBtn = document.getElementById('scroll-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // 2. ПЛАВНАЯ ПРОКРУТКА ПО ЯКОРЯМ
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==========================================
    // 3. АНИМАЦИЯ ПОЯВЛЕНИЯ КАРТОЧЕК ПРИ СКРОЛЛЕ
    // ==========================================
    const cardsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    cardsToAnimate.forEach(card => observer.observe(card));

    // ==========================================
    // 7. ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА (RU/EN)
    // ==========================================
    const langBtn = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('lang') || 'ru';

    function setLanguage(lang) {
        document.querySelectorAll('[data-ru]').forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });
        langBtn.textContent = lang === 'ru' ? 'EN' : 'RU';
        localStorage.setItem('lang', lang);
    }
    
    if (currentLang === 'en') setLanguage('en');

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        setLanguage(currentLang);
    });

    // ==========================================
    // 8. ФИЛЬТР ЧЕРЕЗ ПОИСК
    // ==========================================
    const searchInput = document.getElementById('search-input');
    const serviceCards = document.querySelectorAll('#services-grid .card');

    searchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase();
        
        serviceCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const text = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchText) || text.includes(searchText)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });

    // ==========================================
    // 9. СЛАЙДЕР БЕЗ БИБЛИОТЕК
    // ==========================================
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlide = 0;

    function updateSlider() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    });

    // ==========================================
    // 10. МОДАЛЬНОЕ ОКНО
    // ==========================================
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const detailsBtns = document.querySelectorAll('.details-btn');

    detailsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            const title = card.querySelector('h3').textContent;
            const text = card.querySelector('p').textContent;

            modalTitle.textContent = title;
            modalText.textContent = `Подробная информация: ${text} Стоимость обучения уточняйте по телефону.`;
            
            modal.classList.add('show');
        });
    });

    closeModal.addEventListener('click', () => modal.classList.remove('show'));
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
    });

    // ==========================================
    // ВАРИАНТ 6: МИНИ-ТЕСТ ПО ПДД
    // ==========================================
    const quizData = [
        { question: "Какой знак разрешает движение только прямо?", options: ["Синий круг со стрелкой вправо", "Синий круг со стрелкой вверх", "Красный круг с белой полосой"], correct: 1 },
        { question: "С какой максимальной скоростью можно двигаться в жилой зоне?", options: ["20 км/ч", "40 км/ч", "60 км/ч"], correct: 0 },
        { question: "Разрешено ли вам пересечь сплошную линию разметки?", options: ["Да, если нет машин", "Нет, категорически запрещено", "Да, при обгоне тихоходного ТС"], correct: 1 }
    ];

    const quizContainer = document.getElementById('quiz-container');
    const checkBtn = document.getElementById('check-quiz-btn');
    const resultOutput = document.getElementById('quiz-result');

    quizData.forEach((item, index) => {
        const block = document.createElement('div');
        block.classList.add('question-block');
        block.innerHTML = `<h3>${index + 1}. ${item.question}</h3>` + 
            item.options.map((opt, i) => `<label><input type="radio" name="q${index}" value="${i}"> ${opt}</label>`).join('');
        quizContainer.appendChild(block);
    });

    checkBtn.addEventListener('click', () => {
        let score = 0;
        let answeredAll = true;

        quizData.forEach((item, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            if (selected) {
                if (parseInt(selected.value) === item.correct) score++;
            } else {
                answeredAll = false;
            }
        });

        if (!answeredAll) {
            resultOutput.textContent = "Пожалуйста, ответьте на все вопросы!";
            resultOutput.style.color = "#ff9800";
        } else {
            resultOutput.textContent = `Ваш результат: ${score} из ${quizData.length}. `;
            resultOutput.style.color = "var(--text-color)";
            resultOutput.textContent += score === quizData.length ? "Отлично!" : (score >= 2 ? "Хорошо." : "Нужно повторить ПДД.");
        }
    });
});