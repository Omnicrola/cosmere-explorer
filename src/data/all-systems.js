import { drominadSystemData } from "./drominad-system-data.js";
import { lumarSystemData } from "./lumar-system.js";
import { nalthisSystemData } from "./nalthis-system-data.js";
import { rosharStellarSystem } from "./roshar-system-data.js"
import { scadrialSystemData } from "./scadrial-system-data.js";
import { selishSystemData } from "./selish-system-data.js";
import { taldainSystemData } from "./taldain-system-data.js";
import { threnodySystemData } from "./threnody-system.js";
import { utolSystemData } from "./utol-system-data.js";

// default-system.js holds a test system with placeholder textures; it is not listed here.
const allStellarSystems = [
    drominadSystemData,
    lumarSystemData,
    nalthisSystemData,
    rosharStellarSystem,
    scadrialSystemData,
    selishSystemData,
    taldainSystemData,
    threnodySystemData,
    utolSystemData,
];

function findSystemById(id) {
    return allStellarSystems.find(s => s.id == id) ?? null;
}

export { allStellarSystems, findSystemById };
