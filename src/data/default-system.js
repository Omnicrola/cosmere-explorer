import { createPlanetData,createStellarData } from "./stellarData.js";


let planet1 = createPlanetData({
    id: 'd-1',
    name: 'default 1', 
    orbitalRadius: 50, 
    orbitalSpeed: 1, 
    radius: 2, 
    textureMap: 'test-map.png'
});

let planet2 = createPlanetData({
    id: 'd-2',
    name: 'default 2', 
    orbitalRadius: 75, 
    orbitalSpeed: 1, 
    radius: 2, 
    textureMap: 'test-map.png'
});

let planet3 = createPlanetData({
    id: 'd-3',
    name: 'default 3', 
    orbitalRadius: 100, 
    orbitalSpeed: 1, 
    radius: 2, 
    textureMap: 'test-map.png'
});


let defaultStellarSystem = createStellarData({
    id: 'd-4',
    key: 'default',
    name : 'Default System',
    description : 'This is a default for testing purposes',
    starColor : 0xccffcc,
    starRadius : 5,
    planets : [
        planet1,
        planet2,
        planet3
    ]
});
export { defaultStellarSystem };