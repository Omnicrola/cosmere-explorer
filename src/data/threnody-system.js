import * as THREE from 'three';
import { createMoonData, createPlanetData, createStellarData, createRingData, createAsteroidBeltData, createBinarySet, createStarData } from "./stellarData.js";

const monody = createPlanetData({
    id: 'monody',
    name: 'Monody',
    orbitalRadius: 78,
    orbitalSpeed: 0.25,
    orbitStart: -17,
    orbitalIncline: new THREE.Vector2(-1.76, 27.2),
    planetRadius: 0.478,
    axialTilt: 21.37,
    color: 0xe28d0c,
    textureMap : 'Threnody/p_threnody_monody.png',
    icon: 'Threnody/icon-monody.png',
    atmosphericColor: new THREE.Vector3(0.3, 0.02, 0.1),
    description: `Monody is the planet closest to the central star of the Threnodite system.`,
    coppermind: 'https://coppermind.net/wiki/Threnody'
});

const elegy = createPlanetData({
    id: 'elegy',
    name: 'Elegy', 
    orbitalRadius: 187,
    orbitalSpeed: .87,
    orbitStart: 184,
    orbitalIncline: new THREE.Vector2(1.56, 96.1),
    planetRadius: 0.78,
    axialTilt: 9.17,
    color: 0x0d91b9,
    textureMap : 'Threnody/p_threnody_elegy.jpg',
    icon: 'Threnody/icon-elegy.png',
    atmosphericColor: new THREE.Vector3(0.12, 0.2, 0.71),
    description: `Elegy is the second closest to the central star, and posesses the system's only moon.`,
    coppermind: 'https://coppermind.net/wiki/Threnody',
    children: [
        createMoonData({
            id: 'coronach',
            name: 'Coronach',
            icon: 'Threnody/icon-coronach.png',
            textureMap: 'Threnody/p_threnody_coronach.jpg',
            radius: .173,
            color: 0x0d91c9,
            orbitalRadius: 3.7,
            orbitalEccentricity: 0.1767,
            orbitalSpeed: 0.834,
            description: `The only moon of the Threnodite system, Coronach orbits Elegy.`,
            coppermind: 'https://coppermind.net/wiki/Threnody'
        })
    ]
});

const threnody = createPlanetData({
    id: 'threnody',
    name: 'Threnody',
    orbitalRadius: 268,
    orbitalSpeed: 1.37,
    orbitStart: 92,
    orbitalIncline: new THREE.Vector2(0.17, 46.2),
    planetRadius: 1.025,
    axialTilt: 2.274,
    color: 0x1a3655,
    textureMap : 'Threnody/p_threnody_threnody.jpg',
    icon: 'Threnody/icon-threnody.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    description: `Threnody is the single inhabited planet in the Threnody system. It posesses a very strong ambient Investiture presence due to the cataclysmic fight between the Shards of Ambition and Odium.
        This clash resulted in the local Investiture being changed and warped, causing it to manifest in unique and terrifying ways. In addition since there is no intact Shard inhabiting the system, the Threnodite people posesses no native Invested Art despite their being an unusually high concentration of it.`,
    coppermind: 'https://coppermind.net/wiki/Threnody'
});

const purity = createPlanetData({
    id: 'purity',
    name: 'Purity',
    orbitalRadius: 571,
    orbitalSpeed: 15,
    orbitStart: -117,
    orbitalIncline: new THREE.Vector2(1.47, 17),
    planetRadius: 6.2,
    axialTilt: 8.17,
    color: 0x8b0421,
    textureMap : 'Threnody/p_threnody_purity.png',
    icon: 'Threnody/icon-purity.png',
    atmosphericColor: new THREE.Vector3(0.5, 0.1, 0.1),
    description: `Purity is the only gas giant in the Threnodite system, though it is likely there used to be several others before the clash between Odium and Ambition.`,
    coppermind: 'https://coppermind.net/wiki/Threnody'
})

// IRL reference - Alpha Centauri A
const star = createStarData({
    id: 'threnody-star',
    name: 'Threnodite Star',
    colorIndex: 0.71,
    axialTilt: 28.3,
    icon: 'icon-star.png',
    radius: 8.4,
    absoluteMagnitude: 4.38,
    planets: 4,
    coppermind: 'https://coppermind.net/wiki/Threnodite_system',
    description: `The central star of the Threnodite system is a relatively unremarkable main-sequence star of average size and luminosity.`
});

const threnodySystemData = createStellarData({
    id: 'threnodite-system',
    name: 'Threnodite System',
    skyboxTexture: 'Threnody/sky_threnody',
    icon: 'Threnody/icon-system-threnody.png',
    description: `The Threnodite system currently contains four planets, with an unknown number having been destroyed as a result of the conflict between Ambition and Odium.`,
    shards: 'Ambition (splintered)',
    inhabitedPlanets: 1,
    investedArts: 'None',
    coppermind: 'https://coppermind.net/wiki/Threnodite_system',
    stellarObjects: [
        star,
        monody,
        elegy,
        threnody,
        purity
    ]
})

export { threnodySystemData };