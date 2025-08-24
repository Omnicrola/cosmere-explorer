import * as THREE from 'three';
import { createMoonData, createPlanetData, createStellarData, createRingData, createAsteroidBeltData, createBinarySet } from "./stellarData.js";

const utol = createPlanetData({
    id: 'utol',
    name : "UTol",
    planetRadius : 1.15,
    planetColor : 0x8888ff,
    icon : 'UTol/icon-utol.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    axialTilt : 5.27,
    description : ` `,
    coppermind : "https://coppermind.net/wiki/Nalthis",
    moons: [
    ]
});

const komashi = createPlanetData({
    id: 'komashi',
    name: 'Komashi',
    planetRadius : 1.12,
    planetColor: 0x333333,
    icon : 'UTol/icon-komashi.png',
    atmosphericColor: new THREE.Vector3(0.7, 0.2, 0.7),
    axialTilt: 0.274,
    description: ``, 
    coppermind: 'https://coppermind.net/wiki/Nalthian_system#Planets',
});

const binaryPlanetSet = createBinarySet({
    binaryPair: [utol, komashi],
    separationDistance: 18,
    orbitalDistance: 136,
    orbitalEccentricity: 0.0571,
    orbitalSpeed: 5,
    orbitalIncline: new THREE.Vector2(1.57, 95),
});

const cometBelt = createAsteroidBeltData({ // going to pretend asteroids are a "comet belt" for now
        density: 2000,
        orbitalRadius: 2000,
        orbitalSpread: 200,
        orbitalSpeed: 0.1,
    });

const utolSystemData = createStellarData({
    id: 'utol-star',
    key: 'utol',
    name: 'UTol System',
    luminosity: 5.15,
    starRadius: 5.141,
    starColor: 0xff8464,
    skyboxTexture: 'UTol/sky_utol',
    icon: 'icon-stellar-system.svg',
    description: '',
    coppermind: 'https://coppermind.net/wiki/UTol_system',
    stellarObjects: [
        binaryPlanetSet,
        cometBelt
    ],
    planets: [
    ],

});

export { utolSystemData };