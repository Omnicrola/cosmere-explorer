import { resetScene } from "../mainScene.js";
import { allStellarSystems } from "../data/all-systems.js";
import { createStellarSystem } from "../generators/createStellarSystem.js";
import { focusOnPlanet, stopFollowingPlanet } from "./interactions.js";


function showPlanetInfo(planet) {
    setElementHidden('info-panel', false);

    let infoPanel = document.getElementById('info-panel');
    let info = planet.userData.info;

    infoPanel.innerHTML = `
      <h1 class="name">${info.name} <button id="close-info-panel" class="close">X</button></h1>
      <p class="description"><img class="planet-icon" src="resources/textures/${info.icon}"/>${info.description}</p>
      <ul class="stats">
        <li><b>Orbital Distance:</b> ${info.orbitalRadius}</li>
        <li><b>Orbital Eccentricity:</b> ${info.orbitalEccentricity??0.0}</li>
        <li><b>Axial Tilt:</b> ${info.axialTilt??0.0}</li>
        <li><b>Radius:</b> ${info.radius??'??'} standard</li>
        <li><b>Surface Gravity:</b> ${info.gravity??'??'} standard</li>
        <li><b>Known Perpendicularities:</b> ${info.perpendicularities??0}</li>
        <li><a href="${info.coppermind}" target="_new">Coppermind Link</a></li>
      </ul>
        `;

    let closeInfoPanel = document.getElementById('close-info-panel');
    closeInfoPanel.addEventListener('click', (e) => {
        setElementHidden('info-panel', true);
        stopFollowingPlanet();
        let planetSelect = document.getElementById('planet-select');
        planetSelect.value = -1;
    });

}

function createPlanetOption(planetData, index) {
    let option = document.createElement('option');
    option.innerText = planetData.name;
    option.value = index;
    option.planet = planetData;
    return option;
}

function createPlanetList(planetData = []) {
    let planetSelect = document.getElementById('planet-select');
    planetSelect.innerHTML = "";

    let emptyOption = document.createElement('option');
    emptyOption.innerText = "-- Select a Planet --";
    emptyOption.value = -1;
    planetSelect.appendChild(emptyOption);
    
    planetData.forEach((p, index) => {
        planetSelect.appendChild(createPlanetOption(p, index));
    });

    planetSelect.value = -1;
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
        let planetIndex = e.target.value;
        if(planetIndex) {
            focusOnPlanet({planetIndex});
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
    allStellarSystems.forEach((system, index) => {
        newOption = document.createElement('option');
        newOption.value = index;
        newOption.textContent = system.name;
        systemSelector.appendChild(newOption);
    });

    // handle switching stellar systems
    systemSelector.addEventListener('change', (e) => {
        let selectedSystem = allStellarSystems[e.target.value];
        if(selectedSystem) {
            resetScene(selectedSystem);
        }
    });

    // trigger initial load by simulating a selection from the system select dropdown
    systemSelector.dispatchEvent(new Event('change'));

}

function resetUi() {
    setElementHidden('info-panel', true);
}


let ui = {
    init,
    createPlanetList,
    setSystemName,
    showPlanetInfo,
    resetUi
};
export { ui }