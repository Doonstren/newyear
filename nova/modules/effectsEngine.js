const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

// This map now only defines which months have an effect.
export const effectsMap = {
    0: { effect: "particles_snow" }, // Jan
    1: { effect: "particles_snow" }, // Feb
    8: { effect: "autumn_rain" },  // Sep
    9: { effect: "autumn_rain" },  // Oct
    10: { effect: "autumn_rain" }, // Nov
    11: { effect: "particles_snow" }  // Dec
};

// This is the only effect available in the app now.
export const allEffects = ["particles_snow", "autumn_rain"];

async function loadParticles(configPath) {
    try {
        const response = await fetch(configPath);
        if (!response.ok) {
            throw new Error(`Failed to load particle config: ${response.statusText}`);
        }
        const config = await response.json();
        if (window.tsParticles) {
            await window.tsParticles.load("tsparticles", config);
        }
    } catch (error) {
        console.error("Error loading particles:", error);
    }
}

export function loadScene(override = {}) {
    const now = new Date();
    const month = override.month !== undefined ? override.month : now.getMonth();
    const timeOfDay = override.timeOfDay || ((now.getHours() > 6 && now.getHours() < 20) ? 'day' : 'night');
    
    const monthName = monthNames[month];
    const backgroundName = `${monthName}-${timeOfDay}`;

    // Set background
    document.body.className = document.body.className.replace(/bg-\S+/g, '');
    document.body.classList.add(`bg-${backgroundName}`);

    // If an effect is manually chosen in debug, use it. Otherwise, use the one for the month.
    const effectName = override.effect !== undefined ? override.effect : effectsMap[month]?.effect;

    if (effectName) {
        loadParticles(`./effects/${effectName}.json`);
    } else {
        // If no effect, destroy any existing particles instance
        if (window.tsParticles) {
            const container = window.tsParticles.domItem(0);
            if (container) {
                container.destroy();
            }
        }
    }
}
