document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const countdownElement = document.getElementById('countdown');
    const snowflakesContainer = document.getElementById('snowflakes-container');

    // --- Настройки ---
    const SNOWFLAKE_IMAGE_SRC = 'snow1.png'; // Путь к изображению снежинки
    const NUM_SNOWFLAKES = calculateSnowflakeCount(); // Количество снежинок (зависит от ширины экрана)
    const MIN_SPEED_Y = 1;      // Минимальная вертикальная скорость
    const MAX_SPEED_Y = 2;      // Максимальная вертикальная скорость
    const MIN_AMPLITUDE = 5;    // Минимальная амплитуда горизонтального колебания
    const MAX_AMPLITUDE = 20;   // Максимальная амплитуда
    const MIN_FREQ = 0.01;      // Минимальная частота колебания
    const MAX_FREQ = 0.05;      // Максимальная частота
    const SNOWFLAKE_SIZE_MIN = 8; // Минимальный размер снежинки (px)
    const SNOWFLAKE_SIZE_MAX = 20; // Максимальный размер снежинки (px)

    let snowflakes = [];
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    // --- Логика обратного отсчета ---
    function updateCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();
        // Определяем дату следующего Нового Года
        let nextYearDate = new Date(currentYear + 1, 0, 1, 0, 0, 0);

        // Если уже наступил НГ текущего года, но еще не 2 января
        // (чтобы 1 января показывало "С Новым Годом!")
        if (now.getMonth() === 0 && now.getDate() === 1) {
           countdownElement.textContent = `С Новым ${currentYear} Годом! 🎉`;
           return; // Останавливаем обновление каждую секунду, если уже НГ
        }

        // Если сейчас декабрь, а следующий НГ еще не наступил
        // (или любой другой месяц)
        const timeRemaining = nextYearDate.getTime() - now.getTime();

        if (timeRemaining <= 0) {
             // Это может случиться 1 января до первого обновления
             countdownElement.textContent = `С Новым ${currentYear} Годом! 🎉`;
             return;
        }


        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        countdownElement.textContent = `До Нового ${currentYear + 1} года осталось: ${days}д ${hours}ч ${minutes}м ${seconds}с`;
    }

    // --- Логика снежинок ---
    function createSnowflake(index) {
        const snowflake = document.createElement('div'); // Используем div вместо img для гибкости
        snowflake.className = 'snowflake';
        // snowflake.style.backgroundImage = `url(${SNOWFLAKE_IMAGE_SRC})`; // Можно задать и здесь, но лучше в CSS

        const size = Math.random() * (SNOWFLAKE_SIZE_MAX - SNOWFLAKE_SIZE_MIN) + SNOWFLAKE_SIZE_MIN;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.opacity = Math.random() * 0.5 + 0.3; // Разная прозрачность
        snowflake.style.zIndex = index; // Для разной глубины (хотя не сильно заметно)

        snowflakesContainer.appendChild(snowflake);

        return {
            element: snowflake,
            x: Math.random() * viewportWidth,
            y: Math.random() * viewportHeight - viewportHeight, // Начать сверху, за экраном
            speedY: Math.random() * (MAX_SPEED_Y - MIN_SPEED_Y) + MIN_SPEED_Y,
            amplitude: Math.random() * (MAX_AMPLITUDE - MIN_AMPLITUDE) + MIN_AMPLITUDE,
            frequency: Math.random() * (MAX_FREQ - MIN_FREQ) + MIN_FREQ,
            deltaX: Math.random() * Math.PI * 2 // Начальная фаза для синуса
        };
    }

    function animateSnowflakes() {
        for (let i = 0; i < snowflakes.length; i++) {
            const flake = snowflakes[i];

            // Обновляем позицию
            flake.y += flake.speedY;
            flake.deltaX += flake.frequency;
            const currentX = flake.x + flake.amplitude * Math.sin(flake.deltaX);

            // Если снежинка ушла за нижний край
            if (flake.y > viewportHeight) {
                flake.x = Math.random() * viewportWidth;
                flake.y = -SNOWFLAKE_SIZE_MAX; // Сбросить чуть выше верха экрана
            }

            // Применяем трансформацию (производительнее, чем top/left)
            flake.element.style.transform = `translate(${currentX}px, ${flake.y}px)`;
        }

        // Запрашиваем следующий кадр анимации
        requestAnimationFrame(animateSnowflakes);
    }

    function calculateSnowflakeCount() {
        // Пример: 1 снежинка на каждые 15px ширины, но не более 200
        return Math.min(200, Math.max(30, Math.round(window.innerWidth / 15)));
    }

    function initSnowflakes() {
         // Очистить старые снежинки, если они есть (при ресайзе)
         snowflakesContainer.innerHTML = '';
         snowflakes = [];
         const count = calculateSnowflakeCount();
         for (let i = 0; i < count; i++) {
            snowflakes.push(createSnowflake(i));
        }
    }

    function handleResize() {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
        // Пересоздаем снежинки при ресайзе, чтобы адаптировать количество и начальные позиции
        initSnowflakes();
    }

    // --- Инициализация ---
    updateCountdown(); // Первый запуск для отображения сразу
    setInterval(updateCountdown, 1000); // Обновлять каждую секунду

    initSnowflakes(); // Создаем снежинки
    animateSnowflakes(); // Запускаем анимацию

    // Слушатель на изменение размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Дебаунс: ждем окончания ресайза перед перерисовкой
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
});