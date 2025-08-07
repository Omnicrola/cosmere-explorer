import { createPlanetData } from "./stellarData.js";

const ashyn = createPlanetData({
    planetRadius : 1.2,
    planetColor : 0x88ff88,
    orbitalRadius : 40,
    orbitalSpeed : 10,
    orbitalStart : 10,
    radius: 0.9,
    gravity: 0.8,
    axialTilt : 21.5,
    name : "Ashyn",
    icon : "icon-planet.svg",
    description : `Ashyn, formerly known as Alaswha, is the closest planet to the Rosharan system's sun. An ecological catastrophe in the past has destroyed most of the planet, annihilating its biosphere. In the present day, the planet is mostly barren, with a few fertile patches. There are some reptiles on it. The planet is called "the burning planet" but it is unknown what this means for its geography. The Listener Song of Histories describes Ashyn as "warm", though it is unknown whether this is describing the planet before or after the disaster.`,
    coppermind : "https://coppermind.net/wiki/Ashyn"
});

const roshar = createPlanetData({
    planetRadius : 1,
    planetColor : 0x8888ff,
    textureMap : 'Roshar/p_rosharan_roshar.jpg',
    orbitalRadius : 100,
    orbitalEccentricity: 0.0167,
    orbitalSpeed : 8,
    orbitalStart : 30,
    axialTilt : 0,
    name : "Roshar",
    description : "Roshar is the second planet and is the eponymous planet of Greater Roshar. The Shards of Honor and Cultivation can be found here. Roshar features a single supercontinent, also called Roshar, on which its inhabitants live.",
    coppermind : "https://coppermind.net/wiki/Roshar"
});

const braize = createPlanetData({
    planetRadius : 1.15,
    planetColor : 0xff8888,
    orbitalRadius : 150,
    orbitalSpeed : 6,
    orbitalStart : 90,
    axialTilt : 0,
    name : "Braize",
    description : "Braize is the third planet from the Rosharn system's sun. It is a cold planet, perhaps outside the habitable zone. While no humans live here, there do exist self-aware Splinters that inhabit either the planet or its Cognitive manifestation. Braize is where the Shard of Odium resides, and its name is derived from that of the Shard's first Vessel, Rayse. In Rosharan mythology, Braize is referred to as Damnation, and is where Rosharan Heralds returned to between Desolations. Braize is a cold, barren and inhospitable world that is farther out from the sun than Roshar. It contains no biological life on its surface. Though it is habitable, albeit barely. Instead, the planet is full of nothing more than a broken, rocky landscape full of crags and chasms with no sources of light available. Even the sky is described as being dark at all times. The planet does contain an atmosphere, albeit a weak one.",
    coppermind : "https://coppermind.net/wiki/Braize"
});

const jes = createPlanetData({orbitalRadius : 250, planetRadius : 5, name : "Jes", orbitalSpeed : 4, orbitalStart : 80, planetColor : 0x666666,
    description : `Jes is the 4th planet from the Rosharan system's sun. It's name is derived from the Herald "Jezrien" in Vorin mythology.`,
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const nan = createPlanetData({orbitalRadius : 300, planetRadius : 6, name : "Nan", orbitalSpeed : 3, orbitalStart : 150, planetColor : 0x655666,
    description : `Nan is the 5th planet from the Rosharan system's sun. It's name is derived from the Herald "Nale" in Vorin mythology.`,
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const chach = createPlanetData({orbitalRadius : 350, planetRadius : 5.5, name : "Chach", orbitalSpeed : 2, orbitalStart : 200, planetColor : 0x673666,
    description : `Chach is the 6th planet from the Rosharan system's sun. It's name is derived from the Herald "Chanarach" in Vorin mythology.`,
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const vev = createPlanetData({orbitalRadius : 400, planetRadius : 5.1, name : "Vev", orbitalSpeed : 1, orbitalStart : 90, planetColor : 0x666726,
    description : `Vev is the 7th planet from the Rosharan system's sun. It's name is derived from the Herald "Vedel" in Vorin mythology.`,
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const palah = createPlanetData({orbitalRadius : 500, planetRadius : 6.15, name : "Palah", orbitalSpeed : 0.8, orbitalStart : 300, planetColor : 0x64666,
    description : `Palah is the 8th planet from the Rosharan system's sun. It's name is derived from the Herald "Pralla" in Vorin mythology.`,
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const shash = createPlanetData({orbitalRadius : 620, planetRadius : 7.5, name : "Shash", orbitalSpeed : 0.7, orbitalStart : 250, planetColor : 0x660366,
    description : `Shash is the 9th planet from the Rosharan system's sun. It's name is derived from the Herald "Shalash" in Vorin mythology.`,
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const betab = createPlanetData({orbitalRadius : 750, planetRadius : 3.5, name : "Betab", orbitalSpeed : 0.6, orbitalStart :190, planetColor : 0x667366,
    description : `Betab is the 10th planet from the Rosharan system's sun. It's name is derived from the Herald "Battar" in Vorin mythology.`,
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const kak = createPlanetData({orbitalRadius : 880, planetRadius : 6.25, name : "Kak", orbitalSpeed : 0.5, orbitalStart : 220, planetColor : 0x662866,
    description : `Kak is the 11th planet from the Rosharan system's sun. It's name is derived from the Herald "Kalak" in Vorin mythology.`,
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const tanat = createPlanetData({orbitalRadius : 990, planetRadius : 4.78, name : "Tanat", orbitalSpeed : 0.4, orbitalStart : 45, planetColor : 0x602666,
    description : `Tanat is the 12th planet from the Rosharan system's sun. It's name is derived from the Herald "Talenel" in Vorin mythology.`,
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});
const ishi = createPlanetData({orbitalRadius : 1200, planetRadius : 7.5, name : "Ishi", orbitalSpeed : 0.3, orbitalStart : 60, planetColor : 0x667666,
    description : `Ishi is the 13th planet from the Rosharan system's sun. It's name is derived from the Herald "Ishar" in Vorin mythology.`,
    coppermind : 'https://coppermind.net/wiki/Rosharan_system#Gas_Giants'
});

const rosharStellarSystem = {
    starRadius : 10,
    starColor: 0xEEEEFF,
    name : "Rosharan System",
    icon : "icon-stellar-system.svg",
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