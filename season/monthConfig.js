export const MONTH_EFFECTS = {
    0: { // Январь
        name: 'Январь',
        icon: '❄️',
        season: 'winter',
        variants: [
            { weight: 0.4, type: 'crystal_snow', name: 'Кристаллический снег' },
            { weight: 0.3, type: 'ice_storm', name: 'Ледяная буря (осколки льда)' },
            { weight: 0.3, type: 'frost_patterns', name: 'Морозные узоры' }
        ]
    },
    1: { // Февраль
        name: 'Февраль',
        icon: '🌨️',
        season: 'winter',
        variants: [
            { weight: 0.5, type: 'heavy_blizzard', name: 'Сильная метель' },
            { weight: 0.3, type: 'snow_tornado', name: 'Снежные вихри' },
            { weight: 0.2, type: 'diamond_dust', name: 'Алмазная пыль (мерцающий иней)' }
        ]
    },
    2: { // Март
        name: 'Март',
        icon: '🌱',
        season: 'spring',
        variants: [
            { weight: 0.4, type: 'melting_icicles', name: 'Тающие сосульки и капель' },
            { weight: 0.3, type: 'spring_breeze', name: 'Весенний ветерок (линии и пыльца)' },
            { weight: 0.3, type: 'first_flowers', name: 'Ранние цветы (подснежники)' }
        ]
    },
    3: { // Апрель
        name: 'Апрель',
        icon: '🌷',
        season: 'spring',
        variants: [
            { weight: 0.4, type: 'cherry_blossoms', name: 'Цветение вишни (лепестки)' },
            { weight: 0.3, type: 'rainbow_rain', name: 'Дождь с радугой' },
            { weight: 0.3, type: 'tulip_field', name: 'Поле тюльпанов (внизу)' }
        ]
    },
    4: { // Май
        name: 'Май',
        icon: '🌸',
        season: 'spring',
        variants: [
            { weight: 0.4, type: 'apple_blossoms', name: 'Цветение яблонь (лепестки)' },
            { weight: 0.3, type: 'may_storm', name: 'Майская гроза (дождь, молнии)' },
            { weight: 0.3, type: 'lilac_bloom', name: 'Цветение сирени (падающие соцветия)' }
        ]
    },
    5: { // Июнь
        name: 'Июнь',
        icon: '☀️',
        season: 'summer',
        variants: [
            { weight: 0.4, type: 'fireflies', name: 'Светлячки (вечер/ночь)' },
            { weight: 0.3, type: 'poplar_fluff', name: 'Тополиный пух' },
            { weight: 0.3, type: 'dandelion_seeds', name: 'Семена одуванчика' }
        ]
    },
    6: { // Июль
        name: 'Июль',
        icon: '🏖️',
        season: 'summer',
        variants: [
            { weight: 0.4, type: 'sea_breeze', name: 'Морской бриз (волны, чайки)' },
            { weight: 0.3, type: 'sunflower_field', name: 'Поле подсолнухов (внизу)' },
            { weight: 0.3, type: 'butterfly_meadow', name: 'Летние бабочки' }
        ]
    },
    7: { // Август
        name: 'Август',
        icon: '🌞',
        season: 'summer',
        variants: [
            { weight: 0.4, type: 'meteor_shower', name: 'Звездопад (ночью)' },
            { weight: 0.3, type: 'wheat_waves', name: 'Пшеничное поле (внизу)' },
            { weight: 0.3, type: 'sunset_clouds', name: 'Закатные облака' }
        ]
    },
    8: { // Сентябрь
        name: 'Сентябрь',
        icon: '🍁',
        season: 'autumn',
        variants: [
            { weight: 0.4, type: 'golden_leaves', name: 'Золотые листья' },
            { weight: 0.3, type: 'morning_fog', name: 'Утренний туман (рассвет)' },
            { weight: 0.3, type: 'spider_silk', name: 'Паутинки в росе' }
        ]
    },
    9: { // Октябрь
        name: 'Октябрь',
        icon: '🍂',
        season: 'autumn',
        variants: [
            { weight: 0.5, type: 'maple_rain', name: 'Дождь из кленовых листьев' },
            { weight: 0.3, type: 'acorn_fall', name: 'Падающие жёлуди' },
            { weight: 0.2, type: 'migrating_birds', name: 'Стаи перелётных птиц' }
        ]
    },
    10: { // Ноябрь
        name: 'Ноябрь',
        icon: '🌫️',
        season: 'autumn',
        variants: [
            { weight: 0.5, type: 'november_rain', name: 'Холодный ноябрьский дождь' },
            { weight: 0.3, type: 'bare_branches_fall', name: 'Падающие голые ветви' },
            { weight: 0.2, type: 'first_frost_particles', name: 'Частички первого инея' }
        ]
    },
    11: { // Декабрь
        name: 'Декабрь',
        icon: '🎄',
        season: 'winter',
        variants: [
            { weight: 0.4, type: 'gentle_snowfall', name: 'Нежный снегопад' },
            { weight: 0.3, type: 'northern_lights', name: 'Северное сияние (ночь)' },
            { weight: 0.3, type: 'ice_glitter', name: 'Сверкающие ледяные кристаллы' }
        ]
    }
};

export const SPECIAL_DATES = {
    newYear: {
        variants: [
            { weight: 1.0, type: 'new_year_magic', name: 'Новогоднее волшебство' }
        ]
    }
};

function selectVariantByWeight(variants) {
    if (!variants || variants.length === 0) return null;
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    let random = Math.random() * totalWeight;

    for (const variant of variants) {
        random -= variant.weight;
        if (random <= 0) {
            return variant;
        }
    }
    return variants[0];
}

export function getCurrentMonthEffect(month, day) {
    const isNewYear = (month === 11 && day === 31) || (month === 0 && day === 1);
    if (isNewYear) {
        return selectVariantByWeight(SPECIAL_DATES.newYear.variants);
    }

    const monthConfig = MONTH_EFFECTS[month];
    if (!monthConfig) return null;

    return selectVariantByWeight(monthConfig.variants);
}
