import * as THREE from 'three';
import { createMoonData, createPlanetData, createStellarData, createStarData, createBinarySet, MODIFIER_NAME, createParticulateRing } from "./stellarData.js";


const taldain = createPlanetData({
    id: 'taldain',
    name : "Taldain",
    planetRadius : 1.521,
    color : 0x86684c, 
    icon : 'Taldain/icon-taldain.png',
    atmosphericColor : new THREE.Vector3(0.4, 0.4, 1.0),
    orbitalRadius : 10,
    showOrbitalPath: false,
    orbitStart: 180,
    orbitalEccentricity: 0.0014,
    orbitalIncline : new THREE.Vector2(1.57, 0),
    orbitalSpeed : 1.2,
    axialTilt : 0.017,
    description : `Taldain is the sole planet in the Taldain system, and occupies an unstable orbit around one of the Lagrange points between the two stars of this binary system.
    Taldain is tidally locked in such a way that one side of the planet always faces directly towards AisDa and the other side always faces toward the smaller Eye of Ridos.`,
    coppermind : "https://coppermind.net/wiki/Taldain",
    children: [
        createMoonData({
            id: 'nizh-da',
            name : 'Nizh Da',
            icon : 'Taldain/icon-nizh-da.png',
            radius : 0.176,
            color : 0xffccff,
            orbitalRadius : 3.57,
            orbitStart: 166,
            orbitalEccentricity : 1.65,
            orbitalIncline : new THREE.Vector2(90,0),
            orbitalSpeed : 1.852,
            modifiers: [MODIFIER_NAME.AUTO_FACE],
            description : `The only moon of Taldain occupies a perfect polar orbit over the terminator line. This orbit is constantly adjusted by the influence of Autonomy to keep the orientation over the terminator line as Taldain orbits AisDa.
            Since Taldain is tidally locked to the central star, the orbit of NizhDa is used by the inhabitants to define the length of the day.`,
            coppermind : 'https://coppermind.net/wiki/Taldain_system'
        }),    
    ]
});

// IRL reference : Rigel
const aisda = createStarData({
    id: 'ais-da',
    name: 'Ais Da',
    colorIndex: -0.03,
    orbitalRadius: 450,
    orbitStart: 0,
    mass: 21.61,
    axialTilt: 0,
    icon: 'Taldain/icon-star.png',
    radius: 74.41,
    coronaStyle: {
        noiseIntensity: 15,
        noiseScale: 10,
        noiseSpeed: 8
    },
    absoluteMagnitude: -0.34,
    planets: 1,
    showOrbitalPath: true,
    coppermind: 'https://coppermind.net/wiki/Taldain_system',
    description: `The primary star of the Taldain system is a massive blue-white supergiant star, and forms a binary pair with a white dwarf star.  
    The light from AisDa also charges the microflora that inhabit the sand of Taldain Dayside with Investiture, which in turn powers Sand Mastery, the dominant magical system of Dayside.`
});

const particulateRing = createParticulateRing({
    id:'particulate-ring',
    icon: 'Taldain/icon-particulate-ring.png',
    name : 'Particulate Ring',
    description : `The Particulate Ring surrounds the Eye of Ridos and plays a role in investing the users of the Starcarved Invested Art on the Darkside of Taldain. It's exact role is currently unclear and more research is needed.`,
    orbitalIncline: new THREE.Vector2(90,0),
    orbitalRadius: 450,
    orbitStart: 182,
    ringDiameter: 250,
    ringRadius: 75,
    color: 0x00ffaa,
    opacity: 0.5
});

// IRL reference : Procyon B
const ridos = createStarData({
    id: 'eye-of-ridos',
    name: 'The Eye of ridos',
    colorIndex: 0.42,
    orbitalRadius: 450,
    orbitStart: 182,
    mass: 0.6,
    axialTilt: 0,
    icon: 'icon-star.png',
    radius: 1.2,
    coronaStyle: {
        noiseIntensity: 0.2,
        noiseScale: 5.0,
        noiseSpeed: 10
    },
    absoluteMagnitude: 10.7,
    planets: 1,
    showOrbitalPath: true,
    orbitalSpeed: 0.1,
    children: [
        particulateRing
    ],
    coppermind: 'https://coppermind.net/wiki/Taldain_system',
    description: `The Eye of Ridos is the small white dwarf binary companion of the much larger AisDa, and orbits further out than Taldain itself. 
    Every seven orbits of AisDa it emits a pulse of light and Investiture, which powers the magic system used by the Starcarved on the Darkside of Taldain .`
});


const taldainSystemData = createStellarData({
    id: 'taldain-system',
    name: 'Taldain System',
    skyboxTexture: 'Taldain/sky_taldain',
    icon: 'Taldain/icon-system-taldain.png',
    description: `The Taldain system posesses the most unique stellar arrangement of all the known star systems. The single planet maintains an artificially stabilized orbit around the Lagrange point between a binary star pair composed of a supergiant and a white dwarf.
            Additionally, the single moon of Taldain maintains a polar orbit over the tidally-locked planet's terminator line. These unique features are not possible using standard physics model, and are assumed to be maintained by the direct influence of the resident Shard.`,
    shards: 'Autonomy',
    investedArts: 'Sand Mastery, Starmarks',
    inhabitedPlanets: 1,
    coppermind: 'https://coppermind.net/wiki/Taldain_system',
    stellarObjects: [
        aisda,
        taldain,
        ridos,
        particulateRing,
    ],
});


export { taldainSystemData };
