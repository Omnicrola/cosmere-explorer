import * as THREE from 'three';


const STELLAR_OBJECT = {
    get STAR () {return 1;},
    get PLANET () {return 2;},
    get MOON () {return 3;},
    get ASTEROID_BELT  ()  {return 4;},
    get COGNITIVE_ANOMOLY () {return 5;},
    get BINARY_SET () {return 6;},
}

function assertValidId(id) {
    if(id === null || id === undefined || id < 0) {
        throw new Error('Invalid stellar ID : '+ id);
    }
}

// data creation
function createMoonData({
    id,
    name = 'moon',
    color = 0xffffff,
    textureMap = null,
    orbitalRadius = 1,
    orbitStart = 0,
    orbitalEccentricity = 0,
    orbitalInclination = 0,
    axialTilt = 0,
    radius = 1.0,
    orbitalSpeed = 1.0,
    gravity = 0,
    icon = 'icon-planet.svg',
    description = 'Lorem Ipsum',
    coppermind = "",
    children = [],
}) {
    assertValidId(id);
    return {
        id,
        stellarObjectType: STELLAR_OBJECT.MOON,
        name,
        color,
        textureMap,
        orbitalRadius,
        orbitStart,
        orbitalEccentricity,
        orbitalInclination,
        axialTilt,
        radius,
        gravity,
        orbitalSpeed,
        icon,
        description,
        coppermind,
        children,
    };
}

function createAsteroidBeltData({
    orbitalRadius = 50,
    orbitalSpread = 5,
    orbitalSpeed = 1,
    density = 100,
}) {
    return {
        stellarObjectType : STELLAR_OBJECT.ASTEROID_BELT,
        orbitalRadius,
        orbitalSpread,
        orbitalSpeed,
        density
    };
}

function createCognitiveAnomolyData({
    id,
    name = 'anomoly',
    radius = 1,
    orbitalRadius = 10,
    orbitalSpeed = 1,
    orbitStart = 0,
    orbitalEccentricity,
    icon = null,
    description = '',
    coppermind = '',
}) {
    assertValidId(id);
    return {
        id,
        stellarObjectType : STELLAR_OBJECT.COGNITIVE_ANOMOLY,
        name,
        radius,
        orbitalRadius,
        orbitalSpeed,
        orbitStart,
        orbitalEccentricity,
        icon,
        description,
        coppermind,
    };
}

function createPlanetData({
    id,
    system = '',
    planetRadius = 1,
    planetColor = 0xffffff,
    textureMap = null,
    atmosphericColor = new THREE.Vector3(0.4, 0.4, 1.0),
    oceanMap = null,
    orbitalRadius = 5,
    orbitStart = 0,
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
    children = [],
    rings = {},
}){
    assertValidId(id);
    return {
        id,
        stellarObjectType: STELLAR_OBJECT.PLANET,
        system,
        description,
        planetRadius,
        orbitStart,
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
        children,
        rings,
    };
}

function createRingData({ 
    visible = false,
    albedoMap = null,
    alphaMap = null,
    opacity = 1.0, 
    radius = 1.5, 
    spread = 0.5,
    inclination = 0,
}) {
    return {
        visible,
        albedoMap,
        alphaMap,
        opacity,
        radius,
        spread,
        inclination
    };
}

function createBinarySet({
    children = [],
    separationDistance = 5,
    orbitalDistance = 100,
    orbitStart = 0,
    orbitalEccentricity = 0.0,
    orbitalSpeed = 1,
    orbitalIncline = new THREE.Vector2(0,0),
}) {
    return {
        stellarObjectType: STELLAR_OBJECT.BINARY_SET,
        children,
        separationDistance,
        orbitStart,
        orbitalDistance,
        orbitalEccentricity,
        orbitalSpeed,
        orbitalIncline
    };
}

function createStellarData({
    id,
    key = 'key',
    starRadius = 2,
    luminosity = 1,
    starColor = 0xffff99,
    skyboxTexture = null,
    name = "the star",
    icon = "icon-stellar-system.svg",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    coppermind = "https://coppermind.net/wiki",
    stellarObjects = [],
}){
    assertValidId(id);
    return {
        id,
        stellarObjectType: STELLAR_OBJECT.STAR,
        key,
        starRadius,
        luminosity,
        starColor,
        skyboxTexture,
        name,
        icon,
        description,
        coppermind,
        stellarObjects
    };
}

export {
    createMoonData,
    createAsteroidBeltData,
    createPlanetData,
    createStellarData,
    createRingData,
    createCognitiveAnomolyData,
    createBinarySet,
    STELLAR_OBJECT
};
