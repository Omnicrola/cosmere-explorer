import * as THREE from 'three';
import { createMoonData, createPlanetData, createStellarData, createRingData, createAsteroidBeltData, createStarData } from "./stellarData.js";

const scadrial = createPlanetData({
    id: 'scadrial',
    name : "Scadrial",
    planetRadius : 1,
    color : 0x8888ff,
    icon : 'Scadrial/icon-scadrial.png',
    // textureMap : 'Scadrial/p_scadrian_scadrial.png',
    // oceanMap : 'Scadrial/p_scadrian_scadrial_ocean.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 175,
    orbitStart: 89,
    orbitalEccentricity: 0.0167,
    orbitalSpeed : 7,
    axialTilt : 0,
    description : `Scadrial is unique among worlds in that it did not exist prior to the Shattering. It was created from scratch by the cooperation of the Shards of Ruin and Preservation. 
        Scadrial is the only known inhabited planet in the Scadrian system and Scadrial has no moon, but there is an extremely bright patch of stars visible in the night sky. The planet is the home of several metal-related manifestations of Investiture, referred to locally as Allomancy, Feruchemy, and Hemalurgy.
        Scadrial is home to Harmony, who holds the combined Shards of Ruin and Preservation. 
        Scadrial is the origin of several of the Cosmere's cosmological units of measurement. Hence why it has a surface gravity and planetary radius of exactly 1.0`,
    coppermind : "https://coppermind.net/wiki/Scadrial",
});

const aagalNod = createPlanetData({
    id: 'aagal-nod',
    name: 'Aagal Nod',
    planetRadius : 9.2,
    color: 0x5588FF,
    textureMap: 'Scadrial/p_scadrian_aagal_nod.png',
    icon : 'Scadrial/icon-aagal-nod.png',
    atmosphericColor: new THREE.Vector3(0.2, 0.2, 1.0),
    orbitalRadius: 800,
    orbitStart: -89,
    orbitalEccentricity: 0.0921,
    orbitalSpeed: 5,
    axialTilt: 1.2572,
    description: `Aagal Nod is a blue colored gas giant and the largest planet in the Scadrian system, orbiting just outside the system's stellar frost line.`,
    coppermind: 'https://coppermind.net/wiki/Scadrian_system#Planets',
    children : [
        createMoonData({
            id: 'nod-m-1',
            icon : 'Scadrial/icon-nod-m-1.png',
            name : 'Nod-1',
            radius : 0.05435987,
            color : 0xdecfa6,
            textureMap: 'Scadrial/p_scadrian_aagal_nod_moon_1.png',  
            orbitalRadius : 14,
            orbitStart: 56,
            orbitalEccentricity : 0.1,
            orbitalIncline: 0.27,
            orbitalSpeed : 0.9,
            description : `This is one of Aagal Nod's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Scadrian_system#Planets'
        }),
        createMoonData({
            id: 'nod-m-2',
            icon : 'Scadrial/icon-nod-m-2.png',
            name : 'Nod-2',
            radius : 0.062773,
            color : 0xb58362,
            textureMap: 'Scadrial/p_scadrian_aagal_nod_moon_2.png',  
            orbitalRadius : 21.27,
            orbitStart: 156,
            orbitalEccentricity : 0.1,
            orbitalIncline: 6.27,
            orbitalSpeed : 0.9,
            description : `This is one of Aagal Nod's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Scadrian_system#Planets'
        }),
        createMoonData({
            id: 'nod-m-3',
            icon : 'Scadrial/icon-nod-m-3.png',
            name : 'Nod-3',
            radius : 0.0737752,
            color : 0xdecfa6,
            textureMap: 'Scadrial/p_scadrian_aagal_nod_moon_3.png',  
            orbitalRadius : 32.27,
            orbitStart: 230,
            orbitalEccentricity : 0.1,
            orbitalIncline: 2.98,
            orbitalSpeed : 0.9,
            description : `This is one of Aagal Nod's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Scadrian_system#Planets'
        }),
        createMoonData({
            id: 'nod-m-4',
            icon : 'Scadrial/icon-nod-m-4.png',
            name : 'Nod-4',
            radius : 0.055712,
            color : 0xdecfa6,
            textureMap: 'Scadrial/p_scadrian_aagal_nod_moon_4.png',  
            orbitalRadius : 39.271,
            orbitStart: 264,
            orbitalEccentricity : 0.1,
            orbitalIncline: 1.27,
            orbitalSpeed : 0.9,
            description : `This is one of Aagal Nod's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Scadrian_system#Planets'
        }),
        createMoonData({
            id: 'nod-m-5',
            icon : 'Scadrial/icon-nod-m-5.png',
            name : 'Nod-5',
            radius : 0.04771,
            color : 0x7a7d5b,
            textureMap: 'Scadrial/p_scadrian_aagal_nod_moon_5.png',  
            orbitalRadius : 48.271,
            orbitStart: -93,
            orbitalEccentricity : 0.1,
            orbitalIncline: -5.27,
            orbitalSpeed : 0.9,
            description : `This is one of Aagal Nod's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Scadrian_system#Planets'
        }),
        createMoonData({
            id: 'nod-m-6',
            icon : 'Scadrial/icon-nod-m-6.png',
            name : 'Nod-6',
            radius : 0.058275,
            color : 0xdecfa6,
            textureMap: 'Scadrial/p_scadrian_aagal_nod_moon_6.png',  
            orbitalRadius : 55.16,
            orbitStart: -155,
            orbitalEccentricity : 0.1,
            orbitalIncline: -3.2,
            orbitalSpeed : 0.9,
            description : `This is one of Aagal Nod's 6 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Scadrian_system#Planets'
        }),
    ]
});

const aagalUch = createPlanetData({
    id: 'aagal-uch',
    icon : 'Scadrial/icon-aagal-uch.png',
    name: 'Aagal Uch',
    planetRadius : 8.6,
    color: 0xFF5555,
    textureMap: 'Scadrial/p_scadrian_aagal_uch.png',
    atmosphericColor: new THREE.Vector3(0.5, 0.1, 0.1),
    orbitalRadius: 1400,
    orbitStart: -67,
    orbitalEccentricity: 0.0921,
    orbitalSpeed: 5,
    axialTilt: 6.2572,
    description: `Aagal Uch is a redish colored gas giant and 3rd in order from the Scadrian central star.  It is the only planet in the system to currently possess a ring system.`,
    rings: createRingData({ 
        visible: true, 
        radius: 2.17, 
        spread: 0.827, 
        inclination: 20.47, 
        albedoMap: 'rings-01.png',
        alphaMap: 'rings-01-alpha.png'
    }), 
    coppermind: 'https://coppermind.net/wiki/Scadrian_system#Planets',
    children: [
        createMoonData({
            id: 'uch-m-1',
            icon : 'Scadrial/icon-uch-m-1.png',
            name : 'Uch-1',
            radius : 0.07147,
            color : 0xdecfa6,
            textureMap: 'Scadrial/p_scadrian_aagal_uch_moon_1.png',  
            orbitalRadius : 36.52,
            orbitStart: 44,
            orbitalEccentricity : 0.1,
            orbitalIncline: 12.17,
            orbitalSpeed : 0.9,
            description : `This is one of Aagal Uch's 5 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Scadrian_system#Planets'
        }),
        createMoonData({
            id: 'uch-m-2',
            icon : 'Scadrial/icon-uch-m-2.png',
            name : 'Uch-2',
            radius : 0.09147,
            color : 0xdecfa6,
            textureMap: 'Scadrial/p_scadrian_aagal_uch_moon_2.png',  
            orbitalRadius : 42.25,
            orbitStart: 95,
            orbitalEccentricity : 0.1,
            orbitalIncline: 0.14,
            orbitalSpeed : 0.9,
            description : `This is one of Aagal Uch's 5 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Scadrian_system#Planets'
        }),
        createMoonData({
            id: 'uch-m-3',
            icon : 'Scadrial/icon-uch-m-3.png',
            name : 'Uch-3',
            radius : 0.07147,
            color : 0xdecfa6,
            textureMap: 'Scadrial/p_scadrian_aagal_uch_moon_3.png',  
            orbitalRadius : 54.14,
            orbitStart: 14,
            orbitalEccentricity : 0.1,
            orbitalIncline: -4.14,
            orbitalSpeed : 0.9,
            description : `This is one of Aagal Uch's 5 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Scadrian_system#Planets'
        }),
        createMoonData({
            id: 'uch-m-4',
            icon : 'Scadrial/icon-uch-m-4.png',
            name : 'Uch-4',
            radius : 0.07147,
            color : 0xdecfa6,
            textureMap: 'Scadrial/p_scadrian_aagal_uch_moon_4.png',  
            orbitalRadius : 68.21,
            orbitStart: 84,
            orbitalEccentricity : 0.1,
            orbitalIncline: 0.24,
            orbitalSpeed : 0.9,
            description : `This is one of Aagal Uch's 5 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Scadrian_system#Planets'
        }),
        createMoonData({
            id: 'uch-m-5',
            icon : 'Scadrial/icon-uch-m-5.png',
            name : 'Uch-5',
            radius : 0.07147,
            color : 0xdecfa6,
            textureMap: 'Scadrial/p_scadrian_aagal_uch_moon_5.png',  
            orbitalRadius : 81.24,
            orbitStart: 144,
            orbitalEccentricity : 0.1,
            orbitalIncline: -2.55,
            orbitalSpeed : 0.9,
            description : `This is one of Aagal Uch's 5 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Scadrian_system#Planets'
        }),

    ]
});

const dwarf1 = createPlanetData({
    id: 'dwarf-1',
    icon : 'Scadrial/icon-dwarf-1.png',
    name: 'Dwarf 1', 
    planetRadius: 0.1987,
    color: 0x937fa7,
    textureMap: 'Scadrial/p_scadrian_dwarf_1.png',
    icon: 'Scadrial/icon-dwarf-1.png',
    atmosphericColor: new THREE.Vector3(.5, .6, .8),
    orbitalRadius: 2400,
    orbitStart: 278,
    orbitalEccentricity: 0.2721,
    orbitalSpeed: 0.2,
    axialTilt: -2.2572,
    description: `This dwarf planet is the closer of the 2 unnamed dwarf planets in the Scadrian system, existing outside the comet formation belt.`,
    coppermind: 'https://coppermind.net/wiki/Scadrian_system#Planets'
});

const dwarf2 = createPlanetData({
    id: 'dwarf-2',
    icon : 'Scadrial/icon-dwarf-2.png',
    name: 'Dwarf 2', 
    planetRadius: 0.1877,
    color: 0x937fa7,
    textureMap: 'Scadrial/p_scadrian_dwarf_2.png',
    icon: 'Scadrial/icon-dwarf-2.png',
    atmosphericColor: new THREE.Vector3(.5, .6, .8),
    orbitalRadius: 2900,
    orbitStart: -283,
    orbitalEccentricity: 0.2721,
    orbitalSpeed: 0.1,
    axialTilt: 1.2572,
    description: `This dwarf planet is the more distant of the 2 unnamed dwarf planets in the Scadrian system, existing outside the comet formation belt.`,
    coppermind: 'https://coppermind.net/wiki/Scadrian_system#Planets'
});


const cometBelt = createAsteroidBeltData({ // going to pretend asteroids are a "comet belt" for now
        density: 2000,
        orbitalRadius: 2000,
        orbitalSpread: 200,
        orbitalSpeed: 1,
    });

const star = createStarData({
    id: 'scadrial-star',
    name: 'Scadrian Star',
    colorIndex: 0.656,
    mass: 1.0,
    axialTilt: 7.25,
    icon: 'Scadrial/icon-star.png',
    radius: 6.957,
    absoluteMagnitude: 4.62,
    planets: 5,
    description: `The Scadrian star is a main sequence star of average mass and luminosity. 
    Like the planet Scadrial itself, it is often used as the baseline unit for measuring other stellar objects. For this reason it has a mass of exactly 1.0 solar masses.`
});

const scadrialSystemData = createStellarData({
    id: 'scadrial-star',
    name: 'Scadrian System',
    skyboxTexture: 'Scadrial/sky_scadrial',
    icon: 'icon-stellar-system.svg',
    description: '',
    coppermind: 'https://coppermind.net/wiki/Scadrian_system',
    stellarObjects: [
        star,
        cometBelt,
        scadrial, 
        aagalNod, 
        aagalUch, 
        dwarf1, 
        dwarf2
    ]
});

export { scadrialSystemData };