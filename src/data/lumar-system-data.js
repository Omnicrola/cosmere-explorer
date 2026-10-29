import * as THREE from 'three';
import { createMoonData, createPlanetData, createStellarData, createStarData } from "./stellarData.js";

const lumar = createPlanetData({
    id: 'lumar',
    name: 'Lumar', 
    gravity: 0.9831,
    radius: 1.014,
    color: 0xFFFFFF,
    textureMap: 'Lumar/p_lumar_lumar.png',
    description: `Lumar has one of the most unique astrophysical configurations in the Cosmere, owing to it's 12 moons. Each moon maintains a stationary equidistant position over the planet. Each moon is also home to an aether, which produce spores that rain down on the planet's surface. 
    The majority of the planet is covered in a sea of these spores, with each having unique properties when exposed to water.`,
    coppermind: 'https://coppermind.net/wiki/Lumar',
    orbitalRadius: 184,
    orbitStart: 10,
    orbitalSpeed: 1,
    spinRate: 1,
    children: [
        createMoonData({
            id: 'lumar-moon-1',
            name: 'Verdant Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(-20,0),
            color: 0x229209,
            orbitStart: 63,
            showOrbitalPath: false,
            description: `This moon produces Verdant spores, which grow into vines when exposed to water. `
        }),
        createMoonData({
            id: 'lumar-moon-2',
            name: 'Midnight Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(20,0),
            color: 0x111111,
            orbitStart: -63,
            showOrbitalPath: false,
            description: `This moon produces Midnight spores, which form into Midnight Essense when exposed to water, which are capable of forming Luhel bonds.`
        }),
        createMoonData({
            id: 'lumar-moon-3',
            name: 'Crimson Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(0,0),
            color: 0xFF1111,
            orbitStart: 0,
            showOrbitalPath: false,
            description: `This moon produces Crimson spores, which form large spikes when exposed to water.`
        }),
        createMoonData({
            id: 'lumar-moon-4',
            name: 'Yellow Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(-52,0),
            color: 0xFFFF00,
            orbitStart: -62,
            showOrbitalPath: false,
            description: `[Data missing]`
        }),
        createMoonData({
            id: 'lumar-moon-5',
            name: 'Orange Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(52,0),
            color: 0xc75500,
            orbitStart: 62,
            showOrbitalPath: false,
            description: `[Data missing]`
        }),
        createMoonData({
            id: 'lumar-moon-6',
            name: 'Mud Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(90,0),
            color: 0xa7951c,
            orbitStart: -62,
            showOrbitalPath: false,
            description: `[Data missing]`
        }),
        createMoonData({
            id: 'lumar-moon-7',
            name: 'White Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(90,0),
            color: 0xEEEEEE,
            orbitStart: 115,
            showOrbitalPath: false,
            description: `[Data missing]`
        }),
        createMoonData({
            id: 'lumar-moon-8',
            name: 'Zephyr Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(90,0),
            color: 0x3292cf,
            orbitStart: 180,
            showOrbitalPath: false,
            description: `This moon produces Zephyr spores, which transform into a burst of air when exposed to water. They are prized for their use as a propellant.`
        }),
        createMoonData({
            id: 'lumar-moon-9',
            name: 'Teal Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(-20,0),
            color: 0x13decd,
            orbitStart: -116,
            showOrbitalPath: false,
            description: `[Data missing]`
        }),
        createMoonData({
            id: 'lumar-moon-10',
            name: 'Sapphire Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(20,0),
            color: 0x00e893,
            orbitStart: 116,
            showOrbitalPath: false,
            description: `[Data missing]`
        }),
        createMoonData({
            id: 'lumar-moon-11',
            name: 'Roseite Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(-55,0),
            color: 0xe666d2,
            orbitStart: 118,
            showOrbitalPath: false,
            description: `This moon produces Roseite spores, which form into pink crystals when exposed to water.`
        }),
        createMoonData({
            id: 'lumar-moon-12',
            name: 'Purple Moon',
            radius: 0.15,
            orbitalRadius: 1.5,
            orbitalIncline: new THREE.Vector2(55,0),
            color: 0x6633cc,
            orbitStart: -118,
            showOrbitalPath: false,
            description: `[Data missing]`
        }),
    ]
});

const star = createStarData({
    id: 'lumar-star',
    name: 'Lumar Star',
    absoluteMagnitude: 1.27,
    axialTilt: 2.17,
    colorIndex: 0.71,
    coppermind: 'https://coppermind.net/wiki/Lumar',
    description: ``,
    icon: 'icon-star.png',
    mass: 0.91,
    planets: 1,
    radius: 7.187,
    description: `[Data missing]`
});

const lumarSystemData = createStellarData({
    id: 'lumar-system',
    name: 'Lumari System',
    icon: 'icon-system-generic.png',
    coppermind: 'https://coppermind.net/wiki/Lumar',
    inhabitedPlanets: 1,
    investedArts: 'Aethers',
    shards: 'None',
    skyboxTexture: 'Lumar/sky_lumar',
    description: `Data on the Lumar system is incomplete at this time.`,
    stellarObjects: [
        star,
        lumar,
    ]
});

export { lumarSystemData };