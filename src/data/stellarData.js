import * as THREE from 'three';

function createMoonData({
    name = 'moon',
    color = 0xffffff,
    textureMap = null,
    orbitalRadius = 1,
    orbitalEccentricity = 0,
    orbitalInclination = 0,
    axialTilt = 0,
    radius = 1.0,
    orbitalSpeed = 1.0,
    gravity = 0,
    icon = 'icon-planet.svg',
    description = 'Lorem Ipsum',
    coppermind = ""
}) {
    return {
        name,
        color,
        textureMap,
        orbitalRadius,
        orbitalEccentricity,
        orbitalInclination,
        axialTilt,
        radius,
        gravity,
        orbitalSpeed,
        icon,
        description,
        coppermind,
    };
}

function createAsteroidBeltData({
    orbitalRadius = 50,
    orbitalSpread = 5,
    orbitalSpeed = 1,
    density = 100,
}) {
    return {
        orbitalRadius,
        orbitalSpread,
        orbitalSpeed,
        density
    };
}

function createPlanetData({
    system = '',
    planetRadius = 1,
    planetColor = 0xffffff,
    textureMap = null,
    atmosphericColor = new THREE.Vector3(0.4, 0.4, 1.0),
    oceanMap = null,
    orbitalRadius = 5,
    orbitalSpeed = 1,
    orbitalEccentricity = 0,
    axialTilt = 10,
    orbitalIncline = new THREE.Vector2(0,0),
    spinRate = 1,
    radius,
    gravity,
    perpendicularity,
    name = 'default',
    icon = 'resources/icons/icon-planet.svg',
    description = 'Lorem ipsum',
    coppermind = 'https://coppermind.net/wiki',
    moons = [],
    rings = {},
}){
    return {
        system,
        description,
        planetRadius,
        planetColor,
        textureMap,
        atmosphericColor,
        oceanMap,
        orbitalRadius,
        orbitalSpeed,
        orbitalEccentricity,
        axialTilt,
        orbitalIncline,
        spinRate,
        radius,
        gravity,
        perpendicularity,
        name,
        icon,
        description,
        coppermind,
        moons,
        rings,
    };
}

function createRingData({ 
    visible = false,
    density = 1.0, 
    radius = 1.5, 
    spread = 0.5 
}) {
    return {
        visible,
        density,
        radius,
        spread
    };
}


function createStellarData({
    key = 'key',
    starRadius = 2,
    luminosity = 1,
    starColor = 0xffff99,
    skyboxTexture = null,
    name = "the star",
    icon = "icon-stellar-system.svg",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    coppermind = "https://coppermind.net/wiki",
    planets = [],
    asteroidBelt = null,
}){
    planets.forEach((p, index) => p.planetIndex = index);
    return {
        key,
        starRadius,
        luminosity,
        starColor,
        skyboxTexture,
        name,
        icon,
        description,
        coppermind,
        planets,
        asteroidBelt
    };
}

export {
    createMoonData,
    createAsteroidBeltData,
    createPlanetData,
    createStellarData,
    createRingData
};
