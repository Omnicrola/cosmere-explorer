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
    description : `UTol is a world almost entirely covered by oceans, with on a few land masses. It is primarily inhabited by the Sho Del, who are originally native to Yolish system.`,
    coppermind : "https://coppermind.net/wiki/Nalthis",
});

const komashi = createPlanetData({
    id: 'komashi',
    name: 'Komashi',
    planetRadius : 1.12,
    planetColor: 0x8888ff,
    icon : 'UTol/icon-komashi.png',
    atmosphericColor: new THREE.Vector3(0.4, 0.4, 1.0),
    axialTilt: 0.274,
    description: `Komashi is a human-inhabited world in a binary orbit with the planet UTol. It's primary inhabitants are the Torish and Nagadan people, who make use of the local Splinters of the Shard of Virtuosity called hijo. The hijo are used in turn to create the hion lines that underpin the technological base of the planet.`, 
    coppermind: 'https://coppermind.net/wiki/Nalthian_system#Planets',
});

const binaryPlanetSet = createBinarySet({
    children: [utol, komashi],
    separationDistance: 18,
    orbitalDistance: 166,
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
    description: `The UTol system contains a unique binary planet pair formed from the system's namesake UTol and the planet Komashi. This pair of planets orbit their mutual gravitational center, causing them to appear to dance around one another as they travel along their orbit around their parent star.
            The UTol sun is a larger red-orange star, with it's two main inhabited planets orbiting on the inner edges of the habitable zone.`,
    coppermind: 'https://coppermind.net/wiki/UTol_system',
    stellarObjects: [
        binaryPlanetSet,
        cometBelt
    ],
    planets: [
    ],

});

export { utolSystemData };