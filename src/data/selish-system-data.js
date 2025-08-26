import * as THREE from 'three';
import { createMoonData, createPlanetData, createStellarData, createAsteroidBeltData, createRingData } from "./stellarData.js";

const donne = createPlanetData({
    id: 'donne',
    name : "Donne",
    orbitalRadius: 150,
    orbitalSpeed: 2,
    orbitStart: 17,
    orbitalIncline: new THREE.Vector2(-2.72, 140),
    planetRadius : 0.96,
    color : 0xaf8b55,
    icon : 'Sel/icon-donne.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    axialTilt : -7.27,
    description : `Donne, also known as "Doo", is the planet closest to the Selish central star. Despite it lying within the system's habitable zone it is a barren lifeless planet pront to intense dust storms.`,
    coppermind : "https://coppermind.net/wiki/Selish_system",
});

const sel = createPlanetData({
    id: 'sel',
    name : "Sel",
    orbitalRadius: 242,
    orbitalSpeed: 1.75,
    orbitStart: 56,    
    orbitalIncline: new THREE.Vector2(0.62, 21),
    planetRadius : 1.025,
    color : 0x59b3f0,
    icon : 'Sel/icon-sel.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    axialTilt : 9.67,
    description : `Sel is the only inhabited planet in the Selish system, and is home to a large variety of human civilizations including the Rose Empire, Fjordell Empire, and Elantris. 
                The planet was once home to the Shards of Devotion and Dominion, but were both Splintered by Odium. The remains of their collective power are trapped in the Cognitive Realm, making travel to Sel via the Cognitive Realm extremely hazardous. 
                The trapped Investiture is referred to by the inhabitants as the Dor, and is used to fuel a variety of local Invested Arts including AonDor, ChayShan, Forgery, and Bloodsealing.`,
    coppermind : "https://coppermind.net/wiki/Sel",
    children: [
        createMoonData({
            id: 'oem',
            name : 'Oem',
            radius : 0.216,
            color : 0xffccff,
            orbitalRadius : 3,
            orbitalEccentricity : 0.2671,
            orbitalSpeed : 0.968,
            description : `Oem is a pale white mooon orbiting Sel.`,
            coppermind : 'https://coppermind.net/wiki/Selish_system'
        })
    ]
});


const asteroidBelt = createAsteroidBeltData({ 
        density: 500,
        orbitalRadius: 500,
        orbitalSpread: 50,
        orbitalSpeed: 0.1,
});

const ky = createPlanetData({
    id: 'ky',
    name : 'Ky',
    planetRadius : 5.27,
    orbitalRadius: 790,
    orbitalSpeed: 2,
    orbitStart: 17,    
    orbitalIncline: new THREE.Vector2(-1.7737, 16),
    color : 0x735fa3,
    icon : 'Sel/icon-ky.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    axialTilt : 18.57,
    description : `Ky is gas giant, with four known moons. Ky is also referred to as 'Kii', which is the Aon for "justice".`,
    coppermind : "https://coppermind.net/wiki/Selish_system",
    children: [
        createMoonData({
            id: 'ky-m-1',
            name : 'Ky - 1',
            radius : 0.516,
            color : 0xffccff,
            orbitalRadius : 12,
            orbitalEccentricity : 0.2671,
            orbitalInclination : new THREE.Vector2(1.284, 27),
            orbitalSpeed : 0.968,
            orbitStart: -321,
            description : `This is one of Ky's 4 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Selish_system'
        }),        
        createMoonData({
            id: 'ky-m-2',
            name : 'Ky - 2',
            radius : 0.789,
            color : 0xffccff,
            orbitalRadius : 25,
            orbitalEccentricity : 0.2671,
            orbitalInclination : new THREE.Vector2(-1.345, 53),
            orbitalSpeed : 0.968,
            orbitStart: 275,
            description : `This is one of Ky's 4 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Selish_system'
        }),        
        createMoonData({
            id: 'ky-m-3',
            name : 'Ky - 3',
            radius : 0.8788,
            color : 0xffccff,
            orbitalRadius : 34,
            orbitalEccentricity : 0.2671,
            orbitalInclination : new THREE.Vector2(1.5872, 148),
            orbitalSpeed : 0.968,
            orbitStart: 12,
            description : `This is one of Ky's 4 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Selish_system'
        }),        
        createMoonData({
            id: 'ky-m-4',
            name : 'Ky - 4',
            radius : 0.7374,
            color : 0xffccff,
            orbitalRadius : 48,
            orbitalEccentricity : 0.2671,
            orbitalInclination : new THREE.Vector2(1.8542, 94),
            orbitalSpeed : 0.968,
            orbitStart: 234,
            description : `This is one of Ky's 4 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Selish_system'
        }),             
    ]
});

const ralen = createPlanetData({
    id: 'ralen',
    name : 'Ralen',
    planetRadius : 11.27,
    orbitalRadius: 978,
    orbitalSpeed: 1.52,
    orbitalIncline: new THREE.Vector2(1.57, 16),
    orbitStart: -28,    
    color : 0xa043b3,
    icon : 'Sel/icon-ralen.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    axialTilt : 9.72,
    description : `Ralen is the largest planet in the Selish system, and posseses a ring system and 5 known moons. It is also referred to as "Raa". `,
    coppermind : "https://coppermind.net/wiki/Selish_system",
    rings: createRingData({ 
        visible: true, 
        radius: 1.87, 
        spread: 0.44, 
        inclination: 9.6, 
        albedoMap: 'planetary-rings-02.png',
        alphaMap: 'planetary-rings-02-alpha.png'
    }), 
    children: [
        createMoonData({
            id: 'ralen-m-1',
            name : 'Ralen - 1',
            radius : 0.5644,
            color : 0xffccff,
            orbitalRadius : 47,
            orbitalEccentricity : 0.2671,
            orbitalInclination : new THREE.Vector2(1.3653, 27),
            orbitalSpeed : 0.968,
            orbitStart: -321,
            description : `This is one of Ralen's 5 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Selish_system'
        }),        
        createMoonData({
            id: 'ralen-m-2',
            name : 'Ralen - 2',
            radius : 0.672,
            color : 0xffccff,
            orbitalRadius : 59,
            orbitalEccentricity : 0.2671,
            orbitalInclination : new THREE.Vector2(-1.1234, 53),
            orbitalSpeed : 0.968,
            orbitStart: 275,
            description : `This is one of Ralen's 5 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Selish_system'
        }),        
        createMoonData({
            id: 'ralen-m-3',
            name : 'Ralen - 3',
            radius : 0.4942,
            color : 0xffccff,
            orbitalRadius : 76,
            orbitalEccentricity : 0.2671,
            orbitalInclination : new THREE.Vector2(2.345, 148),
            orbitalSpeed : 0.968,
            orbitStart: 12,
            description : `This is one of Ralen's 5 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Selish_system'
        }),        
        createMoonData({
            id: 'ralen-m-4',
            name : 'Ralen - 4',
            radius : 0.7712,
            color : 0xffccff,
            orbitalRadius : 87,
            orbitalEccentricity : 0.2671,
            orbitalInclination : new THREE.Vector2(3.5423, 94),
            orbitalSpeed : 0.968,
            orbitStart: 234,
            description : `This is one of Ralen's 5 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Selish_system'
        }),             
        createMoonData({
            id: 'ralen-m-5',
            name : 'Ralen - 5',
            radius : 0.324587,
            color : 0xffccff,
            orbitalRadius : 98,
            orbitalEccentricity : 0.2671,
            orbitalInclination : new THREE.Vector2(3.234, 94),
            orbitalSpeed : 0.968,
            orbitStart: 234,
            description : `This is one of Ralen's 5 known moons.`,
            coppermind : 'https://coppermind.net/wiki/Selish_system'
        }),             
    ]
});

const dwarf1 = createPlanetData({
    id: 'dwarf-1',
    name : 'Dwarf 1',
    planetRadius : .56,
    orbitalRadius: 2235,
    orbitalIncline: new THREE.Vector2(12.57, 175),
    orbitalSpeed: 2,
    orbitStart: 17,    
    color : 0x5d6458,
    icon : 'Sel/icon-dwarf-1.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    axialTilt : 53.72,
    description : `This unnamed dwarf planet lies outside the system's comet belt and is likely a former moon of one of the gas giants that was gravitationally ejected, or captured from intersteller space by the primary star.`,
    coppermind : "https://coppermind.net/wiki/Selish_system",
});


const cometBelt = createAsteroidBeltData({ // going to pretend asteroids are a "comet belt" for now
        density: 2000,
        orbitalRadius: 1548,
        orbitalSpread: 200,
        orbitalSpeed: 0.1,
});

const selishSystemData = createStellarData({
    id: 'sel-star',
    key: 'selish',
    name: 'Selish System',
    luminosity: 4.16,
    starRadius: 3.96,
    starColor: 0xffaaaa,
    skyboxTexture: 'Sel/sky_sel',
    icon: 'icon-stellar-system.svg',
    description: ``,
    coppermind: 'https://coppermind.net/wiki/Selish_system',
    stellarObjects: [
        donne,
        sel,
        asteroidBelt,
        ky,
        ralen,
        cometBelt,
        dwarf1
    ],

});

export { selishSystemData };