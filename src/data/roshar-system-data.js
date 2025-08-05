import { createPlanetData } from "./stellarData.js";

const ashyn = createPlanetData({
    planetRadius : 1.2,
    planetColor : 0x88ff88,
    orbitalRadius : 18,
    orbitalSpeed : 10,
    orbitalStart : 10,
    axialTilt : 21.5,
    name : "Ashyn",
    icon : "",
    description : "Ashyn, formerly known as Alaswha, is the closest planet to the Rosharan system's sun. ",
    coppermind : ""
});

const roshar = createPlanetData({
    planetRadius : 1,
    planetColor : 0x8888ff,
    orbitalRadius : 30,
    orbitalSpeed : 8,
    orbitalStart : 30,
    axialTilt : 0,
    name : "Roshar",
    icon : "",
    description : "Roshar is the second planet and is the eponymous planet of Greater Roshar. The Shards of Honor and Cultivation can be found here. Roshar features a single supercontinent, also called Roshar, on which its inhabitants live.",
    coppermind : ""
});

const braize = createPlanetData({
    planetRadius : 1.15,
    planetColor : 0xff8888,
    orbitalRadius : 40,
    orbitalSpeed : 6,
    orbitalStart : 90,
    axialTilt : 0,
    name : "Braize",
    icon : "",
    description : "Braize is the third planet from the Rosharn system's sun. It is a cold planet, perhaps outside the habitable zone. While no humans live here, there do exist self-aware Splinters that inhabit either the planet or its Cognitive manifestation. Braize is where the Shard of Odium resides, and its name is derived from that of the Shard's first Vessel, Rayse. In Rosharan mythology, Braize is referred to as Damnation, and is where Rosharan Heralds returned to between Desolations.",
    coppermind : ""
});

const jes = createPlanetData({orbitalRadius : 80, planetRadius : 5, name : "Jes", orbitalSpeed : 4, orbitalStart : 80, planetColor : 0x666666});
const nan = createPlanetData({orbitalRadius : 120, planetRadius : 6, name : "Nan", orbitalSpeed : 3, orbitalStart : 150, planetColor : 0x655666});
const chach = createPlanetData({orbitalRadius : 160, planetRadius : 5.5, name : "Chach", orbitalSpeed : 2, orbitalStart : 200, planetColor : 0x673666});
const vev = createPlanetData({orbitalRadius : 200, planetRadius : 5.1, name : "Vev", orbitalSpeed : 1, orbitalStart : 90, planetColor : 0x666726});
const palah = createPlanetData({orbitalRadius : 240, planetRadius : 6.15, name : "Palah", orbitalSpeed : 0.8, orbitalStart : 300, planetColor : 0x64666});
const shash = createPlanetData({orbitalRadius : 280, planetRadius : 7.5, name : "Shash", orbitalSpeed : 0.7, orbitalStart : 250, planetColor : 0x660366});
const betab = createPlanetData({orbitalRadius : 320, planetRadius : 3.5, name : "Betab", orbitalSpeed : 0.6, orbitalStart :190, planetColor : 0x667366});
const kak = createPlanetData({orbitalRadius : 360, planetRadius : 6.25, name : "Kak", orbitalSpeed : 0.5, orbitalStart : 220, planetColor : 0x662866});
const tanat = createPlanetData({orbitalRadius : 400, planetRadius : 4.78, name : "Tanat", orbitalSpeed : 0.4, orbitalStart : 45, planetColor : 0x602666});
const ishi = createPlanetData({orbitalRadius : 440, planetRadius : 7.5, name : "Ishi", orbitalSpeed : 0.3, orbitalStart : 60, planetColor : 0x667666});

const rosharStellarSystem = {
    starRadius : 10,
    starColor: 0xEEEEFF,
    name : "Star",
    icon : "",
    description : "The Rosharan system's central star is a large white sun.",
    coppermind : "https://coppermind.net/wiki/Rosharan_system#The_Sun",
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
}

export { rosharStellarSystem };