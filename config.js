// --- Глобальные конфигурационные настройки приложения ---

// --- Настройки отображения даты и сезонов ---
const MONTHS_CONFIG = [
    // Каждый объект описывает месяц: название, CSS-класс для фона, сезон, иконка и описание (пока не используется в UI)
    { name: 'Январь', class: 'january', season: 'winter', icon: '❄️', description: 'Морозный январь' },
    { name: 'Февраль', class: 'february', season: 'winter', icon: '🌨️', description: 'Снежный февраль' },
    { name: 'Март', class: 'march', season: 'spring', icon: '🌱', description: 'Пробуждение весны' },
    { name: 'Апрель', class: 'april', season: 'spring', icon: '🌷', description: 'Весенние дожди' },
    { name: 'Май', class: 'may', season: 'spring', icon: '🌸', description: 'Цветущий май' },
    { name: 'Июнь', class: 'june', season: 'summer', icon: '☀️', description: 'Начало лета' },
    { name: 'Июль', class: 'july', season: 'summer', icon: '🏖️', description: 'Разгар лета' },
    { name: 'Август', class: 'august', season: 'summer', icon: '🌞', description: 'Знойный август' },
    { name: 'Сентябрь', class: 'september', season: 'autumn', icon: '🍁', description: 'Начало осени' },
    { name: 'Октябрь', class: 'october', season: 'autumn', icon: '🍂', description: 'Золотая осень' },
    { name: 'Ноябрь', class: 'november', season: 'autumn', icon: '🌫️', description: 'Поздняя осень' },
    { name: 'Декабрь', class: 'december', season: 'winter', icon: '🎄', description: 'Предновогодний месяц' }
];

const SEASONS_CONFIG = {
    // Названия сезонов для отображения
    winter: { name: 'Зима' },
    spring: { name: 'Весна' },
    summer: { name: 'Лето' },
    autumn: { name: 'Осень' }
};

// --- Общие настройки сезонных частиц ---
const PARTICLE_SYSTEM_SETTINGS = {
    // Плотность частиц: количество частиц = (ширина_экрана * высота_экрана) / BASE_COUNT_DIVIDER
    // Меньше значение -> больше частиц.
    BASE_COUNT_DIVIDER: 12000, // Ранее было PARTICLE_SETTINGS.BASE_COUNT_FACTOR
    MIN_PARTICLES: 30,         // Минимальное количество частиц на экране
    MAX_PARTICLES: 180,        // Максимальное количество частиц на экране
    // Интервал в миллисекундах для добавления новой порции частиц, если их стало мало
    CREATION_INTERVAL_MS: 100,
    // Доля от базового количества частиц, добавляемая за один раз (0.05 = 5%)
    ADD_PARTICLES_RATIO: 0.05,
    // Множитель для буферной зоны за экраном, после выхода за которую частица удаляется
    // (размер_частицы * SCREEN_EXIT_BUFFER_MULTIPLIER)
    SCREEN_EXIT_BUFFER_MULTIPLIER: 2,
    // Множитель максимального количества частиц, до которого система может "дорастить" их число
    MAX_PARTICLE_BUFFER_MULTIPLIER: 1.2 // 1.2 = не более 120% от baseSeasonalParticleCount
};

// --- Настройки для конкретных типов сезонных частиц ---
// Для каждого типа можно определить диапазоны скоростей, размеров, цветов и т.д.
// min/max используются для генерации случайного значения в диапазоне.
const SEASONAL_PARTICLES_CONFIG = {
    snow: {
        // Множители для количества частиц относительно baseSeasonalParticleCount
        countMultiplier: { january: 0.8, february: 1.5, march: 0.3, december: 0.9, default: 1.0, newYear: 0.4 },
        radius: { min: 1.5, max: 4 },       // Радиус снежинки
        speed: { min: 0.6, max: 2.0 },       // Скорость падения
        drift: { min: 0.4, max: 1.8 },       // Горизонтальное смещение (дрейф)
        opacity: { min: 0.4, max: 0.8 },     // Прозрачность
        arms: { min: 5, max: 8 },            // Количество лучей (для детализированных)
        detailChance: 0.6,                   // Шанс (0-1), что снежинка будет детализированной
        turbulence: { min: 0.2, max: 0.7 },  // Сила турбулентности для метели (февраль)
        meltingChance: 0.03                  // Шанс уменьшения размера/прозрачности для тающего снега
    },
    rain: {
        countMultiplier: { march: 0.7, april: 0.4, may_storm: 1.5, november: 0.8 },
        length: { min: 6, max: 25 },         // Длина капли
        speed: { min: 10, max: 25 },         // Скорость падения
        opacity: { min: 0.15, max: 0.35 }    // Прозрачность
    },
    petal: {
        countMultiplier: { april: 0.25, may_calm: 0.1 },
        radius: { min: 3, max: 5 },
        drift: { min: 0.3, max: 0.7 },
        speed: { min: 0.7, max: 1.2 },
        colors: ['#FFB7C5', '#FF7BAC', '#FFC0CB', '#FFDBF1', '#ffffff'], // Цвета лепестков
        rotationSpeed: { min: -0.02, max: 0.02 } // Скорость вращения
    },
    bud: { // Почки растений
        countMultiplier: { april: 0.15 },
        radius: { min: 1, max: 2.5 },
        color: '#90EE90',
        opacity: { min: 0.6, max: 0.9 },
        speed: { min: 0.1, max: 0.3 },
        drift: { min: 0.1, max: 0.3 }
    },
    lightning: { // Молния
        count: { min: 2, max: 4 },           // Количество одновременных "основных" разрядов
        opacity: 0.9,
        // Время до следующего удара повторяющейся молнии (в мс)
        nextStrikeDelay: { min: 3000, max: 8000 },
        // Начальная задержка для первой серии молний (в мс)
        initialStrikeDelayMax: 3000
    },
    butterfly: {
        countMultiplier: { may_calm: 0.1, june: 0.1 },
        size: { min: 5, max: 12 },
        speed: { min: 1, max: 2.2 },
        wingSpeed: { min: 0.1, max: 0.22 }, // Скорость махания крыльями
        colors: ['#FFD700', '#FF6347', '#9370DB', '#20B2AA', '#FFB6C1', '#87CEEB']
    },
    ladybug: { // Божья коровка
        countMultiplier: { may_calm: 0.05 },
        size: { min: 3, max: 8 },
        speed: { min: 0.7, max: 1.5 },
        spots: { min: 3, max: 7 },           // Количество точек
        wiggleSpeedFactor: { min: 0.005, max: 0.01 }, // Скорость "покачивания"
        wiggleAmountFactor: { min: 0.3, max: 0.5 }   // Амплитуда "покачивания"
    },
    pollen: { // Пыльца
        countMultiplier: { may_calm: 0.15 },
        radius: { min: 0.5, max: 1.5 },
        speed: { min: 0.2, max: 0.5 }, // Здесь speed - это скорее интенсивность хаотичного движения
        drift: { min: 0.2, max: 0.5 },
        opacity: { min: 0.3, max: 0.7 },
        color: '#FFFF99'
    },
    sunflare: { // Солнечные блики
        countMultiplier: { june: 0.2, july: 0.25, august: 0.22 },
        radius: { min: 1.5, max: 4 },
        opacity: { min: 0.1, max: 0.45 },
        // speed здесь - это частота мерцания для Math.sin(Date.now() * p.speed ...)
        twinkleSpeedBase: { min: 0.0008, max: 0.002 },
        colorDay: '#FFFFFF',
        colorEvening: '#FFFFCC', // Для июля/августа
        eveningColorChance: 0.3 // Шанс желтоватого блика
    },
    dandelion: { // Пушинки одуванчика
        countMultiplier: { june: 0.15 },
        radius: { min: 1, max: 3 }, // Радиус центральной части
        opacity: { min: 0.6, max: 1.0 },
        speed: { min: 0.3, max: 0.6 },
        drift: { min: 0.5, max: 1.0 }
    },
    cloud: { // Облака
        // countMultiplier не используется, количество облаков фиксировано (или мало)
        countMax: 3, // Максимальное количество облаков на экране
        width: { min: 120, max: 300 },
        height: { min: 60, max: 150 },
        speed: { min: 0.3, max: 0.8 },
        opacity: { min: 0.6, max: 1.0 }
    },
    dragonfly: { // Стрекозы
        countMultiplier: { july: 0.02, august: 0.04 }, // Было 0.02 для июля
        size: { min: 8, max: 20 },
        speed: { min: 2, max: 3.5 },
        wingSpeed: { min: 0.3, max: 0.45 }
    },
    heat: { // Марево
        countMultiplier: { august: 0.3 },
        radius: { min: 30, max: 80 },
        opacity: { min: 0.03, max: 0.07 },
        speed: { min: 0.1, max: 0.25 } // Скорость подъема
    },
    leaf: { // Листья
        countMultiplier: { september: 0.3, october: 0.8, november: 0.4 },
        radius: { min: 4, max: 12 }, // Основной размер листа
        speed: { min: 0.8, max: 2.2 },
        drift: { min: 0.5, max: 1.8 },
        rotationSpeed: { min: -0.02, max: 0.02 },
        swingFactor: { min: 0.1, max: 0.35 }, // Фактор "качания" листа при падении
        colors: {
            september: ['#FFAA33', '#FFCC66', '#FF9900', '#FFBB33'],
            october: ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#F4A460', '#B8860B', '#DAA520'],
            november: ['#805A46', '#7D4427', '#5C4033', '#8B5A2B', '#654321']
        },
        shapeVariety: 3 // Количество вариаций формы листа (0 до shapeVariety-1)
    },
    mist: { // Туман (осенний)
        countMultiplier: { march: 0.2, november: 0.4 },
        radius: { min: 40, max: 80 },
        opacity: { min: 0.05, max: 0.1 },
        speed: { min: 0.05, max: 0.15 } // Скорость горизонтального движения
    },
    twinkle: { // Новогодние огоньки/блестки
        countMultiplier: { newYear: 0.3 }, // Только для Нового Года
        radius: { min: 1, max: 3 },
        opacity: { min: 0.4, max: 1.0 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'],
        // speed здесь - это интенсивность хаотичного движения
        moveSpeedFactor: { min: 0.001, max: 0.002 },
        // twinkleSpeed - частота мерцания для Math.sin
        twinkleFrequency: { min: 0.03, max: 0.06 }
    },
    confetti: { // Новогоднее конфетти
        countMultiplier: { newYear: 0.3 }, // Только для Нового Года
        radius: { min: 2, max: 6 }, // Размер элемента конфетти
        speed: { min: 1, max: 4 },   // Начальная скорость падения
        drift: { min: 0.5, max: 1.5 },
        rotationSpeed: { min: -0.05, max: 0.05 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff9900'],
        shapeVariety: 3 // Количество форм конфетти (0 до shapeVariety-1)
    }
};

// --- Настройки системы фейерверков ---
const FIREWORK_SYSTEM_SETTINGS = { // Ранее FIREWORK_SETTINGS
    // Интервал автоматического запуска новых ракет фейерверков (в миллисекундах)
    ROCKET_LAUNCH_INTERVAL_MS: 850,
    // Частота обновления кадров для анимации фейерверков
    FRAME_RATE: 60.0,
    // Предопределенные яркие цвета для взрывов фейерверков
    EXPLOSION_COLORS: ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffac00', '#ff3377', '#33ff77', '#9900ff'],
    // Параметры ракеты
    rocket: {
        speed: { min: 800, max: 1200 },     // Начальная скорость ракеты
        gravity: 0.5,                       // Влияние гравитации на ракету
        trailLength: 10,                    // Максимальная длина следа от ракеты
        size: 3,                            // Размер "головы" ракеты
        // Доля пути до цели (0-1), на которой ракета взрывается (0.8 = на 80% пути)
        explosionPointRatio: 0.8
    },
    // Параметры частиц взрыва
    explosionParticle: {
        count: { min: 30, max: 70 },        // Количество частиц при одном взрыве
        speed: { min: 300, max: 600 },      // Начальная скорость разлета частиц
        gravity: 0.8,                       // Влияние гравитации на частицы
        opacityDecay: 0.03,                 // Скорость затухания прозрачности частиц
        // Время в тиках (1 тик = 1 кадр), после которого начинается затухание
        // (1200 / ms_per_frame). При 60fps, ms_per_frame ~16.67. 1200/16.67 ~ 72 тика.
        decayStartTicksThresholdFactor: 1200,
        trailLength: 5,                     // Длина следа для частиц типа 3 и 4
        size: 2.5,                          // Базовый размер частицы (для круглых)
        lineWidth: 2                        // Толщина линий для частиц типа 3
    },
    // Параметры искр (для типа взрыва "бенгальский огонь")
    sparkler: {
        speedFactor: 1.5,                   // Множитель скорости разлета искр
        lifeTicks: { min: 5, max: 12 }      // Время жизни искры в тиках
    }
};

// --- Настройки для гирлянд ---
const GARLAND_SETTINGS = {
    // Цвета лампочек для гирлянд
    LIGHT_COLORS: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'],
    // Плотность лампочек: одна лампочка на LIGHT_DENSITY_DIVIDER пикселей
    LIGHT_DENSITY_DIVIDER: 40,
    // Параметры анимации мерцания лампочек (CSS animation 'gentleTwinkle')
    twinkleAnimation: {
        durationSeconds: 2
        // Другие параметры анимации (масштаб, прозрачность) задаются в CSS
    }
};

// --- Вспомогательная функция для получения случайного значения из диапазона ---
// Будет использоваться для применения настроек min/max
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomIntInRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}