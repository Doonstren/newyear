const strings = {
    ru: {
        until_prefix: "До",
        calculating: "Расчёт...",
        holiday_greeting: "С Праздником!",
        holidays_nominative: { newYear: "Новый Год", christmas: "Рождество", valentinesDay: "День Св. Валентина", easter: "Пасха", halloween: "Хэллоуин" },
        holidays_genitive: { newYear: "Нового Года", christmas: "Рождества", valentinesDay: "Дня Св. Валентина", easter: "Пасхи", halloween: "Хэллоуина" },
        time_units_full: { d: ["день", "дня", "дней"], h: ["час", "часа", "часов"], m: ["минута", "минуты", "минут"], s: ["секунда", "секунды", "секунд"] },
        time_units_short: { d: "д", h: "ч", m: "м", s: "с" },
        settings_title: "Настройки",
        language: "Язык",
        date_format: "Формат даты",
        format_full: "Полный",
        format_short: "Короткий",
        debug_button: "Режим отладки",
        debug_title: "Отладка",
        month: "Месяц",
        time_of_day: "Время суток",
        day: "День",
        night: "Ночь",
        select_effect: "Эффект частиц",
        effect_none: "Ничего",
        effect_snow: "Снег",
        effect_autumn_rain: "Осенний дождь",
        select_background: "Фон",
        reset_button: "Сбросить",
        back_button: "Назад к настройкам"
    },
    en: {
        until_prefix: "Until",
        calculating: "Calculating...",
        holiday_greeting: "Happy Holiday!",
        holidays_nominative: { newYear: "New Year", christmas: "Christmas", valentinesDay: "Valentine's Day", easter: "Easter", halloween: "Halloween" },
        holidays_genitive: { newYear: "New Year", christmas: "Christmas", valentinesDay: "Valentine's Day", easter: "Easter", halloween: "Halloween" },
        time_units_full: { d: ["day", "days"], h: ["hour", "hours"], m: ["minute", "minutes"], s: ["second", "seconds"] },
        time_units_short: { d: "d", h: "h", m: "m", s: "s" },
        settings_title: "Settings",
        language: "Language",
        date_format: "Date Format",
        format_full: "Full",
        format_short: "Short",
        debug_button: "Debug Mode",
        debug_title: "Debug",
        month: "Month",
        time_of_day: "Time of Day",
        day: "Day",
        night: "Night",
        select_effect: "Particle Effect",
        effect_none: "None",
        effect_snow: "Snow",
        effect_autumn_rain: "Autumn Rain",
        select_background: "Background",
        reset_button: "Reset",
        back_button: "Back to Settings"
    }
};

let currentLang = localStorage.getItem('lang') || (navigator.language.split('-')[0] === 'ru' ? 'ru' : 'en');

export function setLanguage(lang) {
    if (strings[lang]) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
    }
}

export function getLocalization() {
    return { l: strings[currentLang], currentLang };
}

export function pluralize(count, forms) {
    if (currentLang === 'en') {
        return count === 1 ? forms[0] : forms[1];
    }
    const n = Math.abs(count) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
}