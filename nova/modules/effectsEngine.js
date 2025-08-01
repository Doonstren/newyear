const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

const effectsMap = {
    0: { effect: "snow" }, // Jan
    1: { effect: "snow" }, // Feb
    11: { effect: "snow" }  // Dec
};

export function loadScene(override = {}) {
    const now = new Date();
    const month = override.month !== undefined ? override.month : now.getMonth();
    const hour = now.getHours();
    const timeOfDay = override.timeOfDay || ((hour > 6 && hour < 20) ? 'day' : 'night');
    
    const monthName = monthNames[month];
    const backgroundName = `${monthName}-${timeOfDay}`;

    // Set background
    document.body.className = document.body.className.replace(/bg-\S+/g, '');
    document.body.classList.add(`bg-${backgroundName}`);

    // Load particles
    const effectName = override.effect || effectsMap[month]?.effect;
    if (effectName) {
        const configUrl = `./effects/${effectName}.json`;
        fetch(configUrl)
            .then(response => response.ok ? response.json() : Promise.reject(`File not found: ${configUrl}`))
            .then(config => tsParticles.load("tsparticles", config))
            .catch(error => {
                console.error("Error loading particle effect:", error);
                tsParticles.load("tsparticles", {}); // Clear particles on error
            });
    } else {
        tsParticles.load("tsparticles", {}); // Clear particles if no effect
    }
}

export const allBackgrounds = monthNames.flatMap(m => [`${m}-day`, `${m}-night`]);
export const allEffects = ["snow"];