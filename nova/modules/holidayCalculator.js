import { getLocalization } from './localization.js';

function getOrthodoxEaster(year) {
    const a = year % 4;
    const b = year % 7;
    const c = year % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;
    const julianDate = new Date(year, month - 1, day);
    julianDate.setDate(julianDate.getDate() + 13);
    return julianDate;
}

// This is now a function that returns the holidays object based on the current language
export function getHolidays() {
    const { l } = getLocalization();
    return {
        newYear: { title_nominative: l.holidays_nominative.newYear, title_genitive: l.holidays_genitive.newYear, getDate: (year) => new Date(year, 0, 1) },
        christmas: { title_nominative: l.holidays_nominative.christmas, title_genitive: l.holidays_genitive.christmas, getDate: (year) => new Date(year, 0, 7) },
        valentinesDay: { title_nominative: l.holidays_nominative.valentinesDay, title_genitive: l.holidays_genitive.valentinesDay, getDate: (year) => new Date(year, 1, 14) },
        easter: { title_nominative: l.holidays_nominative.easter, title_genitive: l.holidays_genitive.easter, getDate: (year) => getOrthodoxEaster(year) },
        halloween: { title_nominative: l.holidays_nominative.halloween, title_genitive: l.holidays_genitive.halloween, getDate: (year) => new Date(year, 9, 31) }
    };
}