import * as THREE from 'three';
import { createMoonData, createPlanetData, createStellarData, createRingData, createAsteroidBeltData, createCognitiveAnomolyData } from "./stellarData.js";



const first = createPlanetData({
    id: 'first',
    name : "First of the Sun",
    planetRadius : 1.156,
    planetColor : 0x8888ff,
    // icon : 'Drominad/icon-drominad.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 155,
    orbitalEccentricity: 0.0162,
    orbitalIncline: -1.77,
    orbitalSpeed : 5,
    axialTilt : 2.57,
    description : `First of the Sun is the first planet in the Drominad system, with the majority of it's surface covered by water with a large number of islands. 
                The primary human inhabitants refer to themselves as the Eelakin, and inhabit a large archipelago of around 40 islands referred to as The Pantheon.
                First of the sun is notable for two reasons, the first is that it possesses a perpendicularity even though no Shard currently occupies the system. The second is the presence of Aviar, which are birds that can bestow magical talents on their owners.`,
    coppermind : "https://coppermind.net/wiki/First_of_the_Sun",
    moons: [
        createMoonData({
            id: 'first-of-first',
            name : 'First of the First',
            radius : 0.156,
            color : 0xffccff,
            orbitalRadius : 3.57,
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
    planetRadius : 0.97,
    planetColor : 0x8888ff,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 221,
    orbitalEccentricity: 0.0162,
    orbitalIncline: 1.11,
    orbitalSpeed : 4.5,
    axialTilt : -2.56,
    description : `Like the other 3 habital planets in the system, Second of the Sun is primarly covered in water.`,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    moons: [
    ]
});

const third = createPlanetData({
    id: 'third',
    name : "Third of the Sun",
    planetRadius : 0.81,
    planetColor : 0x8888ff,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 304,
    orbitalEccentricity: 0.0162,
    orbitalIncline: 0.67,
    orbitalSpeed : 4.5,
    axialTilt : -2.56,
    description : `Like the other 3 habital planets in the system, Third of the Sun is primarly covered in water.`,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    moons: [
    ]
});

const fourth = createPlanetData({
    id: 'fourth',
    name : "Fourth of the Sun",
    planetRadius : 1.05,
    planetColor : 0x8888ff,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 415,
    orbitalIncline: 1.87,
    orbitalEccentricity: 0.0162,
    orbitalSpeed : 4.5,
    axialTilt : -2.56,
    description : `Like the other 3 habital planets in the system, Fourth of the Sun is primarly covered in water.`,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    moons: [
    ]
});


const fifth = createPlanetData({
    id: 'fifth',
    name : "Fifth of the Sun",
    planetRadius : 5.27,
    planetColor : 0x8bffd8,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 987,
    orbitalEccentricity: 0.0162,
    orbitalIncline: -1.67,
    orbitalSpeed : 1,
    axialTilt : -10.27,
    description : ``,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    moons: [
    ]
});

const sixth = createPlanetData({
    id: 'sixth',
    name : "Sixth of the Sun",
    planetRadius : 8.48,
    planetColor : 0x52fd9f,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 1574,
    orbitalEccentricity: 0.0162,
    orbitalIncline: 2.57,
    orbitalSpeed : 1,
    axialTilt : -10.27,
    description : ``,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    moons: [
    ]
});

const seventh = createPlanetData({
    id: 'seventh',
    name : "Seventh of the Sun",
    planetRadius : 6.62,
    planetColor : 0x33aef5,
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 2257,
    orbitalEccentricity: 0.0162,
    orbitalIncline: 2.57,
    orbitalSpeed : 1,
    axialTilt : -10.27,
    description : ``,
    coppermind : 'https://coppermind.net/wiki/Drominad_system#Planets',
    moons: [
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
        asteroidBelt,
    ],
    planets: [
        first,
        // second,
        // third,
        // fourth,
        // fifth,
        // sixth,
        // seventh
    ],

});

export { drominadSystemData };