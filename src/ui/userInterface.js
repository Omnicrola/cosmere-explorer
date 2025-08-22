import * as THREE from "three";
import { resetScene } from "../mainScene.js";
import { allStellarSystems } from "../data/all-systems.js";
import { focusOnStellarObject } from "./interactions.js";
import { userSettings } from "../data/userSettings.js";
import { showInfoPanel } from "./infoPanels.js";


function createPlanetOption(planetData, name, selectionValue, isSelected) {
    let option = document.createElement('option');
    option.innerText = name;
    option.value = selectionValue;
    option.selected = isSelected;
    option.planet = planetData;
    return option;
}

function createPlanetList(planetData = []) {
    let planetSelect = document.getElementById('planet-select');
    planetSelect.innerHTML = "";

    let emptyOption = document.createElement('option');
    emptyOption.innerText = "-- Select a Planet --";
    emptyOption.value = -1;
    emptyOption.selected = true;
    planetSelect.appendChild(emptyOption);
    
    planetData.forEach((planet) => {
        const planetId = planet.id;
        planetSelect.appendChild(createPlanetOption(planet, planet.name, planetId, planetId==userSettings.currentSelection));
        planet.moons.forEach((moon) => {
            const moonId = moon.id;
            planetSelect.appendChild(createPlanetOption(moon, '- '+moon.name, moonId, moonId==userSettings.currentSelection));
        });
    });

    planetSelect.value = -1;
}

function updateAutoNavigation() {
    const selection = Number(userSettings.currentSelection);
    if(selection >= 0) {
        let planetSelect = document.getElementById('planet-select');
        planetSelect.value = selection;
        planetSelect.dispatchEvent(new Event('change'));
        console.log('hi')
    }
}

function setSystemName(name) {
    let title = document.getElementById('system-name');
    title.textContent = name;
}

function setElementHidden(id, isHidden){
    let systemPanel = document.getElementById(id);
    if(isHidden) {
        systemPanel.classList.add('hidden');
    } else {
        systemPanel.classList.remove('hidden');
    }
}

function init() {

    // planetary selection drop-down
    let planetSelect = document.getElementById('planet-select');
    
    planetSelect.addEventListener('change', (e) => {
        let stellarObjectId = e.target.value;
        userSettings.currentSelection = stellarObjectId;
        if(stellarObjectId) {
            focusOnStellarObject({selectedId: stellarObjectId});
        }        
    });

    document.getElementById('previous-planet').addEventListener('click', (e) => {
        let planetSelect = document.getElementById('planet-select');
        if(planetSelect.value > 0) {
            planetSelect.value = Number(planetSelect.value) -1;
            planetSelect.dispatchEvent(new Event('change'));
        }
    });

     document.getElementById('next-planet').addEventListener('click', (e) => {
        let planetSelect = document.getElementById('planet-select');
        if(planetSelect.value < planetSelect.options.length -1) {
            planetSelect.value = Number(planetSelect.value) +1;
            planetSelect.dispatchEvent(new Event('change'));
        }
    });

    // populate the stellar system selector options
    let systemSelector = document.getElementById('system-selector');
    systemSelector.innerHTML = "";
    let newOption = null;
    const selectedKey = userSettings.currentSystem;
    allStellarSystems.forEach((system, index) => {
        newOption = document.createElement('option');
        newOption.value = system.key;
        newOption.selected = system.key == selectedKey;
        newOption.textContent = system.name;
        systemSelector.appendChild(newOption);
    });

    // handle switching stellar systems
    systemSelector.addEventListener('change', (e) => {
        const systemKey = e.target.value;
        let selectedSystem = allStellarSystems.find(s=>s.key==systemKey);
        if(selectedSystem) {
            userSettings.currentSystem = selectedSystem.key;
            userSettings.currentSelection = null;
            resetScene(selectedSystem);
        }
    });

}

function resetUi() {
    setElementHidden('info-panel', true);
}


let ui = {
    init,
    createPlanetList,
    setSystemName,
    resetUi,
    showInfoPanel,
    setElementHidden,
    checkAutoNavigation: updateAutoNavigation,
};
export { ui }