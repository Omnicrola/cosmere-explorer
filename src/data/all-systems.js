import { defaultStellarSystem } from "./default-system.js"
import { drominadSystemData } from "./drominad-system-data.js";
import { nalthisSystemData } from "./nalthis-system-data.js";
import { rosharStellarSystem } from "./roshar-system-data.js"
import { scadrialSystemData } from "./scadrial-system-data.js";
import { selishSystemData } from "./selish-system-data.js";
import { utolSystemData } from "./utol-system-data.js";

const allStellarSystems = [
    drominadSystemData, 
    nalthisSystemData, 
    rosharStellarSystem, 
    scadrialSystemData, 
    selishSystemData,
    utolSystemData,
    // defaultStellarSystem
];

export { allStellarSystems };