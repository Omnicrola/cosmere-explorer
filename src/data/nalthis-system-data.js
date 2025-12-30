import * as THREE from 'three';
import { createMoonData, createPlanetData, createStellarData, createRingData, createAsteroidBeltData, createCognitiveAnomolyData, createStarData } from "./stellarData.js";

const nalthis = createPlanetData({
    id: 'nalthis',
    name : "Nalthis",
    planetRadius : 1,
    color : 0x8888ff,
    icon : 'Nalthis/icon-nalthis.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 175,
    orbitStart: 31,
    orbitalEccentricity: 0.0156,
    orbitalSpeed : 7,
    axialTilt : 5.27,
    description : `Nalthis is the single inhabited planet in the Nalthian system, and it's namesake. It is currently inhabited by a single Shard, Endowment.
    Endowment directly created humans on the planet some time after the Shattering, and gives each human born on Nalthis a single Breath which can be used to power the local magic system referred to as Awakening. `,
    coppermind : "https://coppermind.net/wiki/Nalthis",
    children: [
        createMoonData({
            id: 'rrendos',
            name : 'Rrendos',
            icon: 'Nalthis/icon-rrendos.png',
            radius : 0.1,
            color : 0xffccff,
            orbitalRadius : 3,
            orbitStart: 48,
            orbitalEccentricity : 1.25,
            orbitalSpeed : 0.9452,
            description : `Rrendros is the only moon of Nalthis.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),    ]
});

const cognitiveAnomoly = createCognitiveAnomolyData({
    id: 'nalthis-anomoly',
    name: 'Cognitive Anomoly',
    icon : 'Nalthis/icon-anomoly.png',
    radius: 2,
    orbitalRadius: 175,
    orbitStart: 51,
    orbitalSpeed: 0,
    orbitalEccentricity: 0.0156,
    noiseStyle : {         
        noiseIntensity : 3.0,
        noiseSpeed : 8.0,
        noiseScale : 2.0
    }, 
    icon: 'Nalthis/icon-cognitive-anomoly.png',
    description: `This unexplored cognitive anomoly occupies the same orbital path as Nalthis.`,
    coppermind : "https://coppermind.net/wiki/Nalthis",
});


const farkeeper = createPlanetData({
    id: 'farkeeper',
    name: 'Farkeeper the Bright',
    icon : 'Nalthis/icon-farkeeper.png',
    planetRadius : 7.42,
    color: 0xFF5555,
    textureMap: 'Nalthis/p_nalthis_farkeeper.png',
    icon : 'Nalthis/icon-farkeeper.png',
    atmosphericColor: new THREE.Vector3(0.7, 0.2, 0.2),
    orbitalRadius: 400,
    orbitStart: -28,
    orbitalEccentricity: 0.0921,
    orbitalSpeed: 5,
    axialTilt: 1.2572,
    description: ``,
    coppermind: 'https://coppermind.net/wiki/Nalthian_system#Planets',
    children: [
        createMoonData({
            id: 'farkeeper-m-1',
            name : 'Farkeeper-1',
            icon : 'Nalthis/icon-farkeeper-m-1.png',
            radius : 0.05435987,
            color : 0xdecfa6,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_1.png',  
            orbitalRadius : 13.14,
            orbitStart: 26,
            orbitalEccentricity : 0.1,
            orbitalIncline: new THREE.Vector2(0.27, 17),
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
        createMoonData({
            id: 'farkeeper-m-2',
            name : 'Farkeeper-2',
            icon : 'Nalthis/icon-farkeeper-m-2.png',
            radius : 0.062773,
            color : 0xb58362,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_2.png',  
            orbitalRadius : 25.27,
            orbitStart: 72,
            orbitalEccentricity : 0.1,
            orbitalIncline: new THREE.Vector2(6.27, 42),
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
        createMoonData({
            id: 'farkeeper-m-3',
            name : 'Farkeeper-3',
            icon : 'Nalthis/icon-farkeeper-m-3.png',
            radius : 0.0737752,
            color : 0xdecfa6,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_3.png',  
            orbitalRadius : 31.27,
            orbitStart: 36,
            orbitalEccentricity : 0.1,
            orbitalIncline: new THREE.Vector2(2.98, -175),
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
        createMoonData({
            id: 'farkeeper-m-4',
            icon : 'Nalthis/icon-farkeeper-m-4.png',
            name : 'Farkeeper-4',
            radius : 0.055712,
            orbitStart: 256,
            color : 0xdecfa6,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_4.png',  
            orbitalRadius : 41.271,
            orbitalEccentricity : 0.1,
            orbitalIncline: new THREE.Vector2(1.27, 22),
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
        createMoonData({
            id: 'farkeeper-m-5',
            name : 'Farkeeper-5',
            icon : 'Nalthis/icon-farkeeper-m-5.png',
            radius : 0.04771,
            color : 0x7a7d5b,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_5.png',  
            orbitalRadius : 49.52,
            orbitStart: 247,
            orbitalEccentricity : 0.1,
            orbitalIncline: new THREE.Vector2(-5.27, -84),
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
        createMoonData({
            id: 'farkeeper-m-6',
            name : 'Farkeeper-6',
            icon : 'Nalthis/icon-farkeeper-m-6.png',
            radius : 0.058275,
            color : 0xdecfa6,
            textureMap: 'Nalthis/p_nalthis_farkeeper_moon_6.png',  
            orbitalRadius : 54.516,
            orbitStart: 250,
            orbitalEccentricity : 0.1,
            orbitalIncline: new THREE.Vector2(-3.2, 17),
            orbitalSpeed : 0.9,
            description : `This is one of Farkeeper the Bright's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Nalthian_system#Planets'
        }),
    ]
});

const nightstar = createPlanetData({
    id: 'nightstar',
    name: 'Nightstar the Hidden',
    icon : 'Nalthis/icon-nightstar.png',
    planetRadius : 1.52,
    color: 0xFF44FF,
    textureMap: 'Nalthis/p_nalthis_nightstar.png',
    icon : 'Nalthis/icon-nightstar.png',
    atmosphericColor: new THREE.Vector3(0.7, 0.2, 0.7),
    orbitalRadius: 1200,
    orbitStart: 226,
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

const star = createStarData({
    id: 'nalthis-star',
    name: 'Nalthis Star',
    colorIndex: 0.636,
    mass: 1.021,
    axialTilt: 4.259,
    icon: 'icon-star.png',
    radius: 6.7561,
    absoluteMagnitude: 4.21,
    planets: 3,
    coppermind: 'https://coppermind.net/wiki/Nalthian_system',
    description: `The Nalthian sun is a main sequence star of average size and luminosity, similar to those of Scadrial and Sel.`
});



const nalthisSystemData = createStellarData({
    id: 'nalthis-star',
    name: 'Nalthian System',
    skyboxTexture: 'Nalthis/sky_nalthis',
    icon: 'Nalthis/icon-system-nalthis.png',
    description: `The Nalthis system contains a single inhabited planet from which the system dervies it's name. A cognitive anomaly of unknown nature shares the orbit of the Nalthian homeworld, and warrants further investigation.
                The Nalthian subastral is popular with Worldhoppers and traders, and has a well maintained customs checkpoint near the local perpendicularity.`,
    shards: 'Endowment',
    investedArts: 'Awakening',
    inhabitedPlanets: 1,
    coppermind: 'https://coppermind.net/wiki/Nalthian_system',
    stellarObjects: [
        star,
        cometBelt,
        cognitiveAnomoly,
        nalthis, 
        farkeeper,
        nightstar
    ],

});

export { nalthisSystemData };