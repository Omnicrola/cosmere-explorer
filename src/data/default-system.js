import * as THREE from 'three';
import { createPlanetData,createRingData,createStellarData } from "./stellarData.js";


let mercury = createPlanetData({
    id: 'mercury',
    name: 'Mercury', 
    orbitalRadius: 46,  // millions of km
    orbitalSpeed: 1,  
    radius: 2439,       // in kilometers 
    axialTilt: 2.04,
    textureMap: 'test-map.png'
});

let venus = createPlanetData({
    id: 'venus',
    name: 'Venus', 
    orbitalRadius: 107.48, 
    orbitalSpeed: 1, 
    radius: 6051.8, 
    axialTilt: 2.64,
    textureMap: 'test-map.png'
});


let earth = createPlanetData({
    id: 'earth',
    name: 'Earth', 
    orbitalRadius: 150, 
    orbitalSpeed: 1, 
    radius: 6371, 
    orbitalEccentricity: 0.0167086,
    orbitalSpeed: 29.7827, // km/s
    orbitalIncline: new THREE.Vector2(7.155, 0),
    axialTilt: 23.439,
    textureMap: 'test-map.png'
});

let mars = createPlanetData({
    id: 'mars',
    name: 'Mars', 
    orbitalRadius: 225, 
    orbitalSpeed: 1, 
    radius: 3396, 
    orbitalEccentricity: 0.0934,
    orbitalIncline: new THREE.Vector2(5.65, 0),
    axialTilt: 25.19,
    textureMap: 'test-map.png'
});

let jupiter = createPlanetData({
    id: 'jupiter',
    name: 'Jupiter', 
    orbitalRadius: 778, 
    orbitalSpeed: 1, 
    radius: 69911, 
    orbitalEccentricity: 0.0489,
    orbitalIncline: new THREE.Vector2(6.09, 0),
    axialTilt: 3.13,
    textureMap: 'test-map.png'
});

let saturn = createPlanetData({
    id: 'saturn',
    name: 'Saturn', 
    orbitalRadius: 1434, 
    orbitalSpeed: 1, 
    radius: 58232, 
    orbitalEccentricity: 0.0565,
    orbitalIncline: new THREE.Vector2(5.51, 0),
    axialTilt: 26.73,
    textureMap: 'test-map.png',
    rings: createRingData({ 
        visible: true, 
        radius: 2.16, 
        spread: 0.7, 
        inclination: -2.7, 
        albedoMap: 'planetary-rings-04.png',
        alphaMap: 'planetary-rings-04-alpha.png'
    }), 
});

let uranus = createPlanetData({
    id: 'uranus',
    name: 'Uranus', 
    orbitalRadius: 2870, 
    orbitalSpeed: 1, 
    radius: 25362, 
    orbitalEccentricity: 0.04717,
    orbitalIncline: new THREE.Vector2(6.48, 0),
    axialTilt: 82.23,
    textureMap: 'test-map.png'
});

let neptune = createPlanetData({
    id: 'neptune',
    name: 'Neptune', 
    orbitalRadius: 4500, 
    orbitalSpeed: 1, 
    radius: 24622, 
    orbitalEccentricity: 0.008678,
    orbitalIncline: new THREE.Vector2(6.43, 0),
    axialTilt: 28.32,
    textureMap: 'test-map.png'
});

let pluto = createPlanetData({
    id: 'pluto',
    name: 'Pluto', 
    orbitalRadius: 5906, 
    orbitalSpeed: 1, 
    radius: 1188, 
    orbitalEccentricity: 0.2488,
    orbitalIncline: new THREE.Vector2(11.88, 0),
    axialTilt: 119.51,
    textureMap: 'test-map.png'
});



let defaultStellarSystem = createStellarData({
    id: 'terran',
    key: 'terran',
    name : 'Terran System (test)',
    description : 'This is a default for testing purposes',
    skyboxTexture: 'Drominad/sky_drominad',
    starColor : 0xccffcc,
    starRadius : 700, // thousands of km
    stellarObjects : [
        mercury,
        venus,
        earth,
        mars,
        jupiter,
        saturn,
        uranus,
        neptune,
        pluto
    ]
});
export { defaultStellarSystem };