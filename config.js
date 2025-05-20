const MONTHS_CONFIG = [
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
    winter: { name: 'Зима' },
    spring: { name: 'Весна' },
    summer: { name: 'Лето' },
    autumn: { name: 'Осень' }
};

// Настройки для частиц, если нужно вынести
const PARTICLE_SETTINGS = {
    BASE_COUNT_FACTOR: 10000, // Чем меньше, тем больше частиц (делитель для width*height)
    MIN_PARTICLES: 40,
    MAX_PARTICLES: 150,
    CREATION_INTERVAL: 100, // ms
};

// Настройки для фейерверков
const FIREWORK_SETTINGS = {
    TIMED_FIREWORK_INTERVAL: 1000, // ms
    FRAME_RATE: 60.0,
};