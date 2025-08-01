document.addEventListener('DOMContentLoaded', () => {
    const modernContainer = document.getElementById('modern-version-container');
    const legacyContainer = document.getElementById('legacy-version-container');
    const mainStylesheet = document.getElementById('main-stylesheet');

    const countdownElement = document.getElementById('countdown');
    const snowflakesContainer = document.getElementById('snowflakes-container');

    let isModernVersion = true;
    let modernSnowflakes = [];
    let modernSnowAnimationId = null;
    let modernCountdownIntervalId = null;

    const styleToggle = document.createElement('img');
    styleToggle.id = 'style-toggle';
    styleToggle.src = 'favicon.ico';
    styleToggle.alt = 'Переключить версию';
    document.body.appendChild(styleToggle);

    const hoverArea = document.getElementById('toggle-hover-area');
    let toggleHideTimeout;
    let isToggleClicked = false;

    function showToggle() {
        clearTimeout(toggleHideTimeout);
        styleToggle.style.opacity = '1';
    }

    function hideToggle() {
        if (isToggleClicked) return;
        toggleHideTimeout = setTimeout(() => {
            styleToggle.style.opacity = '0';
        }, 300);
    }

    hoverArea.addEventListener('mouseenter', showToggle);
    styleToggle.addEventListener('mouseenter', showToggle);
    hoverArea.addEventListener('mouseleave', hideToggle);
    styleToggle.addEventListener('mouseleave', hideToggle);

    styleToggle.addEventListener('click', () => {
        isToggleClicked = true;
        toggleVersion();
        setTimeout(() => {
            isToggleClicked = false;
            if (!hoverArea.matches(':hover') && !styleToggle.matches(':hover')) {
                hideToggle();
            }
        }, 500);
    });

    function getDeclension(number, words) {
        const cases = [2, 0, 1, 1, 1, 2];
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]];
    }

    function updateModernCountdown() {
        if (!countdownElement) return;
        const now = new Date();
        const currentYear = now.getFullYear();
        let nextYearDate = new Date(currentYear + 1, 0, 1, 0, 0, 0);

        if ((now.getMonth() === 0 && now.getDate() === 1) || nextYearDate.getTime() - now.getTime() <= 0) {
           countdownElement.textContent = `С Новым ${currentYear} Годом! 🎉`;
           if (nextYearDate.getTime() - now.getTime() <= 0 && !(now.getMonth() === 0 && now.getDate() === 1)){
             countdownElement.textContent = `С Наступающим/Наступившим Новым ${currentYear + 1} Годом! 🎉`;
           }
           return;
        }

        const timeRemaining = nextYearDate.getTime() - now.getTime();
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        const daysText = getDeclension(days, ['день', 'дня', 'дней']);
        const hoursText = getDeclension(hours, ['час', 'часа', 'часов']);
        const minutesText = getDeclension(minutes, ['минута', 'минуты', 'минут']);
        const secondsText = getDeclension(seconds, ['секунда', 'секунды', 'секунд']);

        countdownElement.innerHTML = `До Нового ${currentYear + 1} года осталось: <br>${days} ${daysText} ${hours} ${hoursText} ${minutes} ${minutesText} ${seconds} ${secondsText}`;
    }

    function createModernSnowflake(index) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        const SNOWFLAKE_SIZE_MIN_VMIN = 0.8;
        const SNOWFLAKE_SIZE_MAX_VMIN = 2.3;
        
        const size = Math.random() * (SNOWFLAKE_SIZE_MAX_VMIN - SNOWFLAKE_SIZE_MIN_VMIN) + SNOWFLAKE_SIZE_MIN_VMIN;
        
        snowflake.style.width = `${size}vmin`;
        snowflake.style.height = `${size}vmin`;
        snowflake.style.opacity = String(Math.random() * 0.5 + 0.3);
        snowflake.style.zIndex = String(index);

        snowflakesContainer.appendChild(snowflake);

        return {
            element: snowflake,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight - window.innerHeight,
            speedY: Math.random() * (2 - 1) + 1,
            amplitude: Math.random() * (20 - 5) + 5,
            frequency: Math.random() * (0.05 - 0.01) + 0.01,
            deltaX: Math.random() * Math.PI * 2
        };
    }

    function animateModernSnowflakes() {
        if (!isModernVersion) return;

        for (let i = 0; i < modernSnowflakes.length; i++) {
            const flake = modernSnowflakes[i];
            flake.y += flake.speedY;
            flake.deltaX += flake.frequency;
            const currentX = flake.x + flake.amplitude * Math.sin(flake.deltaX);

            if (flake.y > window.innerHeight) {
                flake.x = Math.random() * window.innerWidth;
                flake.y = -20;
            }
            flake.element.style.transform = `translate(${currentX}px, ${flake.y}px)`;
        }
        modernSnowAnimationId = requestAnimationFrame(animateModernSnowflakes);
    }

    function calculateModernSnowflakeCount() {
        return Math.min(500, Math.max(50, Math.round(window.innerWidth / 10)));
    }

    function initModernSnowflakes() {
        snowflakesContainer.innerHTML = '';
        modernSnowflakes = [];
        const count = calculateModernSnowflakeCount();
        for (let i = 0; i < count; i++) {
            modernSnowflakes.push(createModernSnowflake(i));
        }
    }

    function startModernVersion() {
        modernContainer.style.display = 'flex';
        snowflakesContainer.style.display = 'block';
        mainStylesheet.href = 'style.css';

        updateModernCountdown();
        modernCountdownIntervalId = setInterval(updateModernCountdown, 1000);

        initModernSnowflakes();
        if (modernSnowAnimationId) cancelAnimationFrame(modernSnowAnimationId);
        animateModernSnowflakes();
    }

    function stopModernVersion() {
        modernContainer.style.display = 'none';
        snowflakesContainer.style.display = 'none';
        if (modernCountdownIntervalId) clearInterval(modernCountdownIntervalId);
        if (modernSnowAnimationId) cancelAnimationFrame(modernSnowAnimationId);
        modernSnowAnimationId = null;
    }


    let legacyScriptLoaded = false;

    function ensureLegacyScript(callback) {
        if (legacyScriptLoaded && typeof window.startLegacyVersion === 'function') {
            callback();
            return;
        }
        const scriptTag = document.createElement('script');
        scriptTag.src = 'script-old.js';
        scriptTag.onload = () => {
            legacyScriptLoaded = true;
            callback();
        };
        scriptTag.onerror = () => {
            console.error("Failed to load script-old.js");
        };
        document.body.appendChild(scriptTag);
    }

    function startLegacyVersionProxy() {
        legacyContainer.style.display = 'block';
        modernContainer.style.display = 'none';
        
        if (!document.getElementById('legacy-stylesheet')) {
            const legacyStyle = document.createElement('link');
            legacyStyle.id = 'legacy-stylesheet';
            legacyStyle.rel = 'stylesheet';
            legacyStyle.href = 'style-old.css';
            document.head.appendChild(legacyStyle);
        }

        ensureLegacyScript(() => {
            if (typeof window.startLegacyVersion === 'function') {
                setTimeout(() => {
                    window.startLegacyVersion();
                }, 50);
            }
        });
    }

    function stopLegacyVersionProxy() {
        legacyContainer.style.display = 'none';
        if (legacyScriptLoaded && typeof window.stopLegacyVersion === 'function') {
            window.stopLegacyVersion();
        }
        
        const legacyStyle = document.getElementById('legacy-stylesheet');
        if (legacyStyle) {
            legacyStyle.remove();
        }

        const legacySnowflakes = document.querySelectorAll('[id^="sn_legacy_"]');
        legacySnowflakes.forEach(flake => {
            if (flake.parentNode) {
                flake.parentNode.removeChild(flake);
            }
        });
    }

    function toggleVersion() {
        isModernVersion = !isModernVersion;
        if (isModernVersion) {
            stopLegacyVersionProxy();
            startModernVersion();
        } else {
            stopModernVersion();
            startLegacyVersionProxy();
        }
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isModernVersion) {
                initModernSnowflakes();
            } else {
                if (legacyScriptLoaded && typeof window.updateLegacyVersionOnResize === 'function') {
                    window.updateLegacyVersionOnResize();
                }
            }
        }, 250);
    });

    startModernVersion();

});