import * as THREE from 'three';
import { createMoonData, createPlanetData, createStellarData, createRingData, createAsteroidBeltData, createCognitiveAnomolyData } from "./stellarData.js";

const nalthis = createPlanetData({
    id: 'nalthis',
    name : "Nalthis",
    planetRadius : 1,
    planetColor : 0x8888ff,
    icon : 'Nalthis/icon-nalthis.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 175,
    orbitalEccentricity: 0.0156,
    orbitalSpeed : 7,
    axialTilt : 5.27,
    description : `Nalthis is the single inhabited planet in the Nalthian system, and it's namesake. It is currently inhabited by a single Shard, Endowment.
    Endowment directly created humans on the planet some time after the Shattering, and gives each human born on Nalthis a single Breath which can be used to power the local magic system referred to as Awakening. `,
    coppermind : "https://coppermind.net/wiki/Nalthis",
    moons: [
        createMoonData({
            id: 'rrendos',
            name : 'Rrendos',
            radius : 0.1,
            color : 0xffccff,
            orbitalRadius : 3,
            orbitalEccentricity : 1.25,
            orbitalSpeed : 0.9452,
            description : `Rrendros is the only moon of Nalthis.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),    ]
});

const cognitiveAnomoly = createCognitiveAnomolyData({
    id: 'nalthis-anomoly',
    name: 'Cognitive Anomoly',
    radius: 2,
    orbitalRadius: 175,
    orbitalSpeed: 0,
    orbitalEccentricity: 0.0156,
    icon: 'Nalthis/icon-cognitive-anomoly.png',
    description: `This unexplored cognitive anomoly occupies the same orbital path as Nalthis.`,
    coppermind : "https://coppermind.net/wiki/Nalthis",
});


const farkeeper = createPlanetData({
    id: 'farkeeper',
    name: 'Farkeeper the Bright',
    planetRadius : 7.42,
    planetColor: 0xFF5555,
    textureMap: 'Nalthis/p_nalthis_farkeeper.png',
    icon : 'Nalthis/icon-farkeeper.png',
    atmosphericColor: new THREE.Vector3(0.7, 0.2, 0.2),
    orbitalRadius: 400,
    orbitalEccentricity: 0.0921,
    orbitalSpeed: 5,
    axialTilt: 1.2572,
    description: ``,
    coppermind: 'https://coppermind.net/wiki/Nalthian_system#Planets',
    moons: [
        createMoonData({
            id: 'farkeeper-m-1',
            name : 'Farkeeper-1',
            radius : 0.05435987,
            color : 0xdecfa6,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_1.png',  
            orbitalRadius : 13.14,
            orbitalEccentricity : 0.1,
            orbitalInclination: 0.27,
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
        createMoonData({
            id: 'farkeeper-m-2',
            name : 'Farkeeper-2',
            radius : 0.062773,
            color : 0xb58362,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_2.png',  
            orbitalRadius : 25.27,
            orbitalEccentricity : 0.1,
            orbitalInclination: 6.27,
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
        createMoonData({
            id: 'farkeeper-m-3',
            name : 'Farkeeper-3',
            radius : 0.0737752,
            color : 0xdecfa6,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_3.png',  
            orbitalRadius : 31.27,
            orbitalEccentricity : 0.1,
            orbitalInclination: 2.98,
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
        createMoonData({
            id: 'farkeeper-m-4',
            name : 'Farkeeper-4',
            radius : 0.055712,
            color : 0xdecfa6,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_4.png',  
            orbitalRadius : 41.271,
            orbitalEccentricity : 0.1,
            orbitalInclination: 1.27,
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
        createMoonData({
            id: 'farkeeper-m-5',
            name : 'Farkeeper-5',
            radius : 0.04771,
            color : 0x7a7d5b,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_5.png',  
            orbitalRadius : 49.52,
            orbitalEccentricity : 0.1,
            orbitalInclination: -5.27,
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
        createMoonData({
            id: 'farkeeper-m-6',
            name : 'Farkeeper-6',
            radius : 0.058275,
            color : 0xdecfa6,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_6.png',  
            orbitalRadius : 54.516,
            orbitalEccentricity : 0.1,
            orbitalInclination: -3.2,
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
    ]
});

const nightstar = createPlanetData({
    id: 'nightstar-m-3',
    name: 'Nightstar the Hidden',
    planetRadius : 1.52,
    planetColor: 0xFF44FF,
    textureMap: 'Nalthis/p_nalthis_nightstar.png',
    icon : 'Scadrial/icon-nightstar.png',
    atmosphericColor: new THREE.Vector3(0.7, 0.2, 0.7),
    orbitalRadius: 1200,
    orbitalEccentricity: 0.0921,
    orbitalSpeed: 1,
    axialTilt: 0.274,
    description: ``,
    coppermind: 'https://coppermind.net/wiki/Nalthian_system#Planets',
});

const cometBelt = createAsteroidBeltData({ // going to pretend asteroids are a "comet belt" for now
        density: 2000,
        orbitalRadius: 2000,
        orbitalSpread: 200,
        orbitalSpeed: 1,
    });

const nalthisSystemData = createStellarData({
    id: 'nalthis-star',
    key: 'nalthis',
    name: 'Nalthian System',
    luminosity: 3.45,
    starRadius: 4.471,
    starColor: 0xFFEFEE,
    skyboxTexture: 'Nalthis/sky_nalthis',
    icon: 'icon-stellar-system.svg',
    description: '',
    coppermind: 'https://coppermind.net/wiki/Nalthian_system',
    stellarObjects: [
        cometBelt,
        cognitiveAnomoly
    ],
    planets: [
        nalthis, 
        farkeeper,
        nightstar
    ],

});

export { nalthisSystemData };