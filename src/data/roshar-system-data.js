import * as THREE from 'three';
import { createAsteroidBeltData, createMoonData, createPlanetData,createStellarData } from "./stellarData.js";

const ashyn = createPlanetData({
    planetRadius : 1.2,
    planetColor : 0x88ff88,
    icon : 'Roshar/icon-ashyn.png',
    textureMap : 'Roshar/p_rosharan_ashyn.png',
    atmosphericColor : new THREE.Vector3(0.6, 0.6, 0.4),
    orbitalRadius : 100,
    orbitalSpeed : 10,
    orbitalStart : 10,
    radius: 0.9,
    gravity: 0.8,
    axialTilt : 21.5,
    name : "Ashyn",
    description : `Ashyn, formerly known as Alaswha, is the closest planet to the Rosharan system's sun. An ecological catastrophe in the past has destroyed most of the planet, annihilating its biosphere. In the present day, the planet is mostly barren, with a few fertile patches. There are some reptiles on it. The planet is called "the burning planet" but it is unknown what this means for its geography. The Listener Song of Histories describes Ashyn as "warm", though it is unknown whether this is describing the planet before or after the disaster.`,
    coppermind : "https://coppermind.net/wiki/Ashyn"
});

const roshar = createPlanetData({
    planetRadius : 1,
    planetColor : 0x8888ff,
    icon : 'Roshar/icon-roshar.png',
   textureMap : 'Roshar/p_rosharan_roshar.png',
    oceanMap : 'Roshar/p_rosharan_roshar_ocean.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 175,
    orbitalEccentricity: 0.0167,
    orbitalSpeed : 8,
    orbitalStart : 30,
    axialTilt : 0,
    name : "Roshar",
    description : `Roshar is the second planet and is the eponymous planet of Greater Roshar. The Shards of Honor and Cultivation can be found here. Roshar features a single supercontinent, also called Roshar, on which its inhabitants live. Its semi-major axis is such that it has an orbital period of approximately 1.1 years.
Roshar has a surface gravity of approximately 0.7g, and a radius of approximately 5663 kilometres, just under 0.9 cosmere standard. The planet has a substantial atmosphere, and has a partial pressure of oxygen that is higher than standard cosmere.
Roshar has no axial tilt. It has a solar day of twenty Rosharan hours, and rotates around five-hundred times every orbit.
Three moons, Salas, Nomon, and Mishim, orbit the planet in unstable, highly eccentric orbits. The planet also used to have a fourth moon, which died and fell before Honor's arrival in the system, though fragments of it landed on Roshar.`,
    coppermind : "https://coppermind.net/wiki/Roshar",
    moons : [
        createMoonData({
            name : 'Salas',
            radius : 0.05,
            color : 0xffccff,
            orbitalRadius : 3,
            orbitalEccentricity : 0.1,
            orbitalSpeed : 0.9,
            description : `Sals is the first and smallest of Roshar's 3 moons and appears to be a light violet color in the night sky.`,
            coppermind : 'https://coppermind.net/wiki/Roshar#Planetary_System'
        }),
        createMoonData({
            name : 'Nomon',
            radius : 0.08,
            color : 0xaaaaff,
            orbitalRadius : 3.5,
            orbitalEccentricity : 0.1,
            description : `Nomon is the second and largest of Roshar's 3 moons and appears to be a pale blue color in the night sky.`,
            coppermind : 'https://coppermind.net/wiki/Roshar#Planetary_System'
        }),
        createMoonData({
            name : 'Mishim',
            radius : 0.06,
            color : 0xccffff,
            orbitalRadius : 4,
            orbitalEccentricity : 0.1,
            description : `Mishim is the third moon and most distant of Roshar's 3 moons, and appears as a light green color in the night sky. `,
            coppermind : 'https://coppermind.net/wiki/Roshar#Planetary_System'
        })
    ]
});

const braize = createPlanetData({
    planetRadius : 1.15,
    planetColor : 0xff8888,
    icon : 'Roshar/icon-braise.png',
    textureMap : 'Roshar/p_rosharan_braize.png',
    atmosphericColor : new THREE.Vector3(1.0, 0.4, 0.4),
    orbitalRadius : 290,
    orbitalSpeed : 6,
    orbitalStart : 90,
    axialTilt : 0,
    name : "Braize",
    description : "Braize is the third planet from the Rosharn system's sun. It is a cold planet, perhaps outside the habitable zone. While no humans live here, there do exist self-aware Splinters that inhabit either the planet or its Cognitive manifestation. Braize is where the Shard of Odium resides, and its name is derived from that of the Shard's first Vessel, Rayse. In Rosharan mythology, Braize is referred to as Damnation, and is where Rosharan Heralds returned to between Desolations. Braize is a cold, barren and inhospitable world that is farther out from the sun than Roshar. It contains no biological life on its surface. Though it is habitable, albeit barely. Instead, the planet is full of nothing more than a broken, rocky landscape full of crags and chasms with no sources of light available. Even the sky is described as being dark at all times. The planet does contain an atmosphere, albeit a weak one.",
    coppermind : "https://coppermind.net/wiki/Braize"
});

const asteroidBelt = createAsteroidBeltData({
    orbitalRadius : 370,
    orbitalSpread : 25,
    density : 100
});

const jes = createPlanetData({orbitalRadius : 500, planetRadius : 5, name : "Jes", orbitalSpeed : 4, orbitalStart : 80, planetColor : 0x666666,
    description : `Jes is the 4th planet from the Rosharan system's sun. It's name is derived from the Herald "Jezrien" in Vorin mythology.`,
    icon : 'Roshar/icon-jes.png',
    textureMap : 'Roshar/p_rosharan_jes.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.8, 1.0),
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const nan = createPlanetData({orbitalRadius : 800, planetRadius : 6, name : "Nan", orbitalSpeed : 3, orbitalStart : 150, planetColor : 0x655666,
    description : `Nan is the 5th planet from the Rosharan system's sun. It's name is derived from the Herald "Nale" in Vorin mythology.`,
    icon : 'Roshar/icon-nan.png',
    textureMap : 'Roshar/p_rosharan_nan.png',
    atmosphericColor : new THREE.Vector3(0.6, 0.4, 0.8),
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const chach = createPlanetData({orbitalRadius : 1200, planetRadius : 5.5, name : "Chach", orbitalSpeed : 2, orbitalStart : 200, planetColor : 0x673666,
    description : `Chach is the 6th planet from the Rosharan system's sun. It's name is derived from the Herald "Chanarach" in Vorin mythology.`,
    icon : 'Roshar/icon-chach.png',
    textureMap : 'Roshar/p_rosharan_chach.png',
    atmosphericColor : new THREE.Vector3(1.0, 0.4, 0.4),
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const vev = createPlanetData({orbitalRadius : 1557, planetRadius : 5.1, name : "Vev", orbitalSpeed : 1, orbitalStart : 90, planetColor : 0x666726,
    description : `Vev is the 7th planet from the Rosharan system's sun. It's name is derived from the Herald "Vedel" in Vorin mythology.`,
    icon : 'Roshar/icon-vev.png',
    textureMap : 'Roshar/p_rosharan_vev.png',
    atmosphericColor : new THREE.Vector3(1.0, 0.8, 0.8),
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const palah = createPlanetData({orbitalRadius : 1853, planetRadius : 6.15, name : "Palah", orbitalSpeed : 0.8, orbitalStart : 300, planetColor : 0x64666,
    description : `Palah is the 8th planet from the Rosharan system's sun. It's name is derived from the Herald "Pralla" in Vorin mythology.`,
    icon : 'Roshar/icon-palah.png',
    textureMap : 'Roshar/p_rosharan_palah.png',
    atmosphericColor : new THREE.Vector3(0.5, 0.9, 0.8),
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const shash = createPlanetData({orbitalRadius : 2468, planetRadius : 7.5, name : "Shash", orbitalSpeed : 0.7, orbitalStart : 250, planetColor : 0x660366,
    description : `Shash is the 9th planet from the Rosharan system's sun. It's name is derived from the Herald "Shalash" in Vorin mythology.`,
    icon : 'Roshar/icon-shash.png',
    textureMap : 'Roshar/p_rosharan_shash.png',
    atmosphericColor : new THREE.Vector3(1.0, 0.9, 0.8),
   coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const betab = createPlanetData({orbitalRadius : 2935, planetRadius : 3.5, name : "Betab", orbitalSpeed : 0.6, orbitalStart :190, planetColor : 0x667366,
    description : `Betab is the 10th planet from the Rosharan system's sun. It's name is derived from the Herald "Battar" in Vorin mythology.`,
    icon : 'Roshar/icon-betab.png',
    textureMap : 'Roshar/p_rosharan_betab.png',
    atmosphericColor : new THREE.Vector3(0.8, 1.0, 0.8),
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const kak = createPlanetData({orbitalRadius : 3510, planetRadius : 6.25, name : "Kak", orbitalSpeed : 0.5, orbitalStart : 220, planetColor : 0x662866,
    description : `Kak is the 11th planet from the Rosharan system's sun. It's name is derived from the Herald "Kalak" in Vorin mythology.`,
    icon : 'Roshar/icon-kak.png',
    textureMap : 'Roshar/p_rosharan_kak.png',
    atmosphericColor : new THREE.Vector3(0.8, 0.9, 0.8),
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const tanat = createPlanetData({orbitalRadius : 4838, planetRadius : 4.78, name : "Tanat", orbitalSpeed : 0.4, orbitalStart : 45, planetColor : 0x602666,
    description : `Tanat is the 12th planet from the Rosharan system's sun. It's name is derived from the Herald "Talenel" in Vorin mythology.`,
    icon : 'Roshar/icon-tanat.png',
    textureMap : 'Roshar/p_rosharan_tanat.png',
    atmosphericColor : new THREE.Vector3(0.2, 0.9, 0.8),
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const ishi = createPlanetData({orbitalRadius : 5506, planetRadius : 7.5, name : "Ishi", orbitalSpeed : 0.3, orbitalStart : 60, planetColor : 0x667666,
    description : `Ishi is the 13th planet from the Rosharan system's sun. It's name is derived from the Herald "Ishar" in Vorin mythology.`,
    icon : 'Roshar/icon-ishi.png',
    textureMap : 'Roshar/p_rosharan_ishi.png',
    atmosphericColor : new THREE.Vector3(0.5, 0.5, 0.8),
   coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});

const rosharStellarSystem = createStellarData({
    starRadius : 5,
    luminosity : 5,
    starColor: 0xEEEEFF,
    skyboxTexture : 'Roshar/sky_roshar',
    name : "Rosharan System",
    icon : "icon-stellar-system.svg",
    description : "The Rosharan system's central star is a large white sun.",
    coppermind : "https://coppermind.net/wiki/Rosharan_system#The_Sun",
    asteroidBelt : asteroidBelt,
    planets : [
        ashyn,
        roshar,
        braize,
        jes,
        nan,
        chach,
        vev,
        palah,
        shash,
        betab,
        kak,
        tanat,
        ishi
    ]
});

export { rosharStellarSystem };