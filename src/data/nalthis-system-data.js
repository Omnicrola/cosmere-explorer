import * as THREE from 'three';
import { createMoonData, createPlanetData, createStellarData, createRingData, createAsteroidBeltData } from "./stellarData.js";

const nalthis = createPlanetData({
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
});


const farkeeper = createPlanetData({
    name: 'Farkeeper the Bright',
    planetRadius : 7.42,
    planetColor: 0xFF5555,
    // textureMap: 'Nalthis/p_nalthis_farkeeper.png',
    icon : 'Scadrial/icon-farkeeper.png',
    atmosphericColor: new THREE.Vector3(0.7, 0.2, 0.2),
    orbitalRadius: 400,
    orbitalEccentricity: 0.0921,
    orbitalSpeed: 5,
    axialTilt: 1.2572,
    description: ``,
    coppermind: 'https://coppermind.net/wiki/Nalthian_system#Planets',
});

const nightstar = createPlanetData({
    name: 'Nightstar the Hidden',
    planetRadius : 1.52,
    planetColor: 0xFF44FF,
    // textureMap: 'Nalthis/p_nalthis_farkeeper.png',
    icon : 'Scadrial/icon-nightstar.png',
    atmosphericColor: new THREE.Vector3(0.7, 0.2, 0.7),
    orbitalRadius: 1200,
    orbitalEccentricity: 0.0921,
    orbitalSpeed: 1,
    axialTilt: 0.274,
    description: ``,
    coppermind: 'https://coppermind.net/wiki/Nalthian_system#Planets',
});

const nalthisSystemData = createStellarData({
    key: 'nalthis',
    name: 'Nalthian System',
    luminosity: 3.45,
    starRadius: 4.471,
    starColor: 0xFFEFEE,
    skyboxTexture: 'Nalthis/sky_nalthis',
    icon: 'icon-stellar-system.svg',
    description: '',
    coppermind: 'https://coppermind.net/wiki/Nalthian_system',
    asteroidBelt: createAsteroidBeltData({ // going to pretend asteroids are a "comet belt" for now
        density: 2000,
        orbitalRadius: 2000,
        orbitalSpread: 200,
        orbitalSpeed: 1,
    }),
    planets: [
        nalthis, 
        farkeeper,
        nightstar
    ]
});

export { nalthisSystemData };