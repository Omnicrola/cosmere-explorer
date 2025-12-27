import * as THREE from 'three';


const STELLAR_OBJECT = {
    get STAR () {return 1;},
    get PLANET () {return 2;},
    get MOON () {return 3;},
    get ASTEROID_BELT  ()  {return 4;},
    get COGNITIVE_ANOMOLY () {return 5;},
    get BINARY_SET () {return 6;},
}

const MODIFIER_NAME = {
    get AUTO_FACE () {return 1;},
    get SPINNER () {return 2;},
}

function assertValidId(id) {
    if(id === null || id === undefined || id < 0) {
        throw new Error('Invalid stellar ID : '+ id);
    }
}

// data creation
function createStarData({
    id,
    name,                   // usually the same as the system name
    colorIndex,             // B-V stellar color index
    mass,                   // in standard stellar masses (or in our case, Scadrian stellar masses)
    axialTilt,              // in relation to the system ecliptic plane
    orbitalIncline = new THREE.Vector2(0,0),
    icon,
    orbitalRadius = 0,      // usually zero, except for binary systems
    coronaStyle = {         // just for visual styling, controls how 'tall' the turbulence goes
        noiseIntensity : 4.0,
        noiseSpeed : 4.0,
        noiseScale : 3.0
    }, 
    orbitalSpeed = 0,       // in Scadrian years
    radius,                 // in 100km 
    showOrbitalPath = false,// most stars don't orbit, so don't bother creating their orbital path
    absoluteMagnitude,      // using terran absolute magnitude distance of 10 parsecs
    planets,                // just a number
    description,
    coppermind,
    modifiers = [],
}) {
    return {
        id,
        stellarObjectType: STELLAR_OBJECT.STAR,
        name,
        colorIndex,
        mass,
        orbitalRadius,
        coronaStyle,
        orbitalSpeed,
        axialTilt,
        orbitalIncline,
        icon,
        radius,
        showOrbitalPath,
        absoluteMagnitude,
        planets,
        description,
        coppermind,
        modifiers
    };
}

function createMoonData({
    id,
    name = 'moon',
    color = 0xffffff,
    textureMap = null,
    orbitalRadius = 1,
    showOrbitalPath = true,
    orbitStart = 0,
    orbitalEccentricity = 0,
    orbitalIncline = new THREE.Vector2(0,0),
    axialTilt = 0,
    radius = 1.0,
    orbitalSpeed = 1.0,
    gravity = 0,
    icon = 'icon-planet.svg',
    description = 'Lorem Ipsum',
    coppermind = "",
    children = [],
    modifiers = [],
}) {
    assertValidId(id);
    return {
        id,
        stellarObjectType: STELLAR_OBJECT.MOON,
        name,
        color,
        textureMap,
        orbitalRadius,
        showOrbitalPath,
        orbitStart,
        orbitalEccentricity,
        orbitalIncline,
        axialTilt,
        radius,
        gravity,
        orbitalSpeed,
        icon,
        description,
        coppermind,
        children,
        modifiers
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
    orbitalIncline = new THREE.Vector2(0,0),
    icon = null,
    description = '',
    coppermind = '',
    noiseStyle = {         
        noiseIntensity : 4.0,
        noiseSpeed : 4.0,
        noiseScale : 3.0
    }, 
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
        orbitalIncline,
        icon,
        description,
        noiseStyle,
        coppermind,
    };
}

function createPlanetData({
    id,
    system = '',
    planetRadius = 1,
    showOrbitalPath = true,
    color = 0xffffff,
    textureMap = null,
    atmosphericColor = new THREE.Vector3(0.4, 0.4, 1.0),
    oceanMap = null,
    orbitalRadius = 5,
    orbitStart = 0,
    orbitalSpeed = 1,               // in Scadrian years
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
    modifiers = [],
}){
    assertValidId(id);
    return {
        id,
        stellarObjectType: STELLAR_OBJECT.PLANET,
        showOrbitalPath,
        system,
        description,
        planetRadius,
        orbitStart,
        color,
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
        modifiers
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
    orbitalRadius = 100,
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
        orbitalRadius,
        orbitalEccentricity,
        orbitalSpeed,
        orbitalIncline
    };
}

function createStellarData({
    id,
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
        skyboxTexture,
        name,
        icon,
        description,
        coppermind,
        stellarObjects
    };
}

export {
    createStarData,
    createMoonData,
    createAsteroidBeltData,
    createPlanetData,
    createStellarData,
    createRingData,
    createCognitiveAnomolyData,
    createBinarySet,
    STELLAR_OBJECT,
    MODIFIER_NAME
};
