import * as THREE from 'three';
import { createMoonData, createPlanetData, createStellarData, createRingData, createAsteroidBeltData, createCognitiveAnomolyData } from "./stellarData.js";



const first = createPlanetData({
    id: 'first',
    name : "First of the Sun",
    planetRadius : 1.156,
    color : 0x8888ff,
    icon : 'Drominad/icon-first.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 155,
    orbitStart: 298,
    orbitalEccentricity: 0.0162,
    orbitalIncline : new THREE.Vector2(2,290),
    orbitalSpeed : 5,
    axialTilt : 2.57,
    description : `First of the Sun is the first planet in the Drominad system, with the majority of it's surface covered by water with a large number of islands. 
                The primary human inhabitants refer to themselves as the Eelakin, and inhabit a large archipelago of around 40 islands referred to as The Pantheon.
                First of the sun is notable for two reasons, the first is that it possesses a perpendicularity even though no Shard currently occupies the system. The second is the presence of Aviar, which are birds that can bestow magical talents on their owners.`,
    coppermind : "https://coppermind.net/wiki/First_of_the_Sun",
    children: [
        createMoonData({
            id: 'first-of-first',
            name : 'First of the First',
            icon : 'Drominad/icon-first-of-first.png',
            radius : 0.156,
            color : 0xffccff,
            orbitalRadius : 3.57,
            orbitStart: 172,
            orbitalEccentricity : 2.65,
            orbitalSpeed : 0.952,
            description : `First of the First is the only moon that orbits First of the Sun.`,
            coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets'
        }),    
    ]
});

const second = createPlanetData({
    id: 'second',
    name : "Second of the Sun",
    icon : 'Drominad/icon-second.png',
    planetRadius : 0.97,
    color : 0x8888ff,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 221,
    orbitStart: 91.9,
    orbitalEccentricity: 0.0162,
    orbitalIncline : new THREE.Vector2(1.154, 48),
    orbitalSpeed : 4.5,
    axialTilt : -2.56,
    description : `Like the other 3 habital planets in the system, Second of the Sun is primarly covered in water.`,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    children: [
    ]
});

const third = createPlanetData({
    id: 'third',
    name : "Third of the Sun",
    icon : 'Drominad/icon-third.png',
    planetRadius : 0.81,
    color : 0x8888ff,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 304,
    orbitStart: 48,
    orbitalEccentricity: 0.0162,
    orbitalIncline : new THREE.Vector2(0.67, -21.5),
    orbitalSpeed : 4.5,
    axialTilt : -2.56,
    description : `Like the other 3 habital planets in the system, Third of the Sun is primarly covered in water.`,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    children: [
    ]
});

const fourth = createPlanetData({
    id: 'fourth',
    name : "Fourth of the Sun",
    icon : 'Drominad/icon-fourth.png',
    planetRadius : 1.05,
    color : 0x8888ff,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 415,
    orbitStart: 261,
    orbitalIncline : new THREE.Vector2(1.62, -65.5),
    orbitalEccentricity: 0.0162,
    orbitalSpeed : 4.5,
    axialTilt : -2.56,
    rings: createRingData({ 
        visible: true, 
        radius: 2.47, 
        spread: 0.17, 
        inclination: 12.6, 
        albedoMap: 'planetary-rings-03.png',
        alphaMap: 'planetary-rings-03-alpha.png'
    }), 
    description : `Like the other 3 habital planets in the system, Fourth of the Sun is primarly covered in water.`,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    children: [
    ]
});


const fifth = createPlanetData({
    id: 'fifth',
    name : "Fifth of the Sun",
    icon : 'Drominad/icon-fifth.png',
    planetRadius : 5.27,
    color : 0x8bffd8,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 987,
    orbitStart: 57,
    orbitalEccentricity: 0.0162,
    orbitalIncline : new THREE.Vector2(-1.12, 15.84),
    orbitalSpeed : 1,
    axialTilt : -10.27,
    rings: createRingData({ 
        visible: true, 
        radius: 2.54, 
        spread: 0.6, 
        inclination: -5.6, 
        albedoMap: 'planetary-rings-02.png',
        alphaMap: 'planetary-rings-02-alpha.png'
    }), 
    description : ``,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    children: [
    ]
});

const sixth = createPlanetData({
    id: 'sixth',
    name : "Sixth of the Sun",
    icon : 'Drominad/icon-sixth.png',
    planetRadius : 8.48,
    color : 0x52fd9f,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 1574,
    orbitStart: 29,
    orbitalEccentricity: 0.0162,
    orbitalIncline : new THREE.Vector2(-4.12, -58.84),
    orbitalSpeed : 1,
    axialTilt : -10.27,
    rings: createRingData({ 
        visible: true, 
        radius: 2.16, 
        spread: 0.7, 
        inclination: -2.7, 
        albedoMap: 'planetary-rings-04.png',
        alphaMap: 'planetary-rings-04-alpha.png'
    }), 
    description : ``,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    children: [
    ]
});

const seventh = createPlanetData({
    id: 'seventh',
    name : "Seventh of the Sun",
    icon : 'Drominad/icon-seventh.png',
    planetRadius : 6.62,
    color : 0x33aef5,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 2257,
    orbitStart: 97,
    orbitalEccentricity: 0.0162,
    orbitalIncline : new THREE.Vector2(16.12, 78.81),
    orbitalSpeed : 1,
    axialTilt : -10.27,
    description : ``,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    children: [
    ]
});

const asteroidBelt = createAsteroidBeltData({
        density: 200,
        orbitalRadius: 527,
        orbitalSpread: 50,
        orbitalSpeed: 1,
    });

const drominadSystemData = createStellarData({
    id: 'drominad-star',
    key: 'drominad',
    name: 'Drominad System',
    luminosity: 3.565,
    starRadius: 4.526,
    starColor: 0xFFEAEE,
    skyboxTexture: 'Drominad/sky_drominad',
    icon: 'icon-stellar-system.svg',
    description: '',
    coppermind: 'https://coppermind.net/wiki/Drominad_system',
    stellarObjects: [
        first,
        second,
        third,
        fourth,
        fifth,
        sixth,
        seventh,
        asteroidBelt,
    ],

});

export { drominadSystemData };