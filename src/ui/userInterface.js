import { resetScene } from "../mainScene.js";
import { allStellarSystems } from "../data/all-systems.js";
import { createStellarSystem } from "../generators/createStellarSystem.js";
import { focusOnPlanet } from "./interactions.js";
import { FontLoader } from 'jsm/loaders/FontLoader.js';

const fontLoader = new FontLoader();

function fontPromise(path) {
    return new Promise((resolve, reject) => {
        fontLoader.load(path, resolve);
    });
}

const fonts = {
    RobotoRegular : fontPromise('resources/fonts/Roboto_Regular.json'),
    RobotoBold : fontPromise('resources/fonts/Roboto_Bold.json'),
}

function createPlanetElement(planet, index) {
    let listItem = document.createElement('li');
    listItem.innerHTML = 
    `<div class="planet">
        <img class="planet-icon" src="resources/icons/${planet.icon}" />
        <p class="name">${planet.name}</p>
    </div>
    `;
    
    listItem.onclick = () => {
        focusOnPlanet(index)
    }
    return listItem;
}


function showPlanetInfo(planet) {
    setElementHidden('system-toggle', true);
    setElementHidden('info-panel', false);

    let infoPanel = document.getElementById('info-panel');
    let info = planet.userData.info;

    infoPanel.innerHTML = `
      <h1 class="name">${info.name} <button id="close-info-panel" class="close">X</button></h1>
      <p class="description">${info.description}</p>
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
        setElementHidden('system-toggle', false);
        setElementHidden('info-panel', true);
    });

}

function createPlanetList(planetData = []) {
    let planetList = document.getElementById('planet-list');
    planetList.innerHTML = "";

    planetData.forEach((p, index) => {
        planetList.appendChild(createPlanetElement(p, index));
    });
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
    let systemPanelToggle = document.getElementById('system-flyout-toggle');
    let systemPanel = document.getElementById('system-toggle');
    
    systemPanelToggle.addEventListener('click', (e) => {
        setElementHidden('system-toggle', !systemPanel.classList.contains('hidden'));
    });

    let systemSelector = document.getElementById('system-selector');
    systemSelector.innerHTML = "";

    let newOption = null;
    allStellarSystems.forEach((system, index) => {
        newOption = document.createElement('option');
        newOption.value = index;
        newOption.textContent = system.name;
        systemSelector.appendChild(newOption);
    });

    systemSelector.addEventListener('change', (e) => {
        
        let selectedSystem = allStellarSystems[e.target.value];
        if(selectedSystem) {
            resetScene(selectedSystem);
        }
    });

    systemSelector.dispatchEvent(new Event('change'));

}

function resetUi() {
    setElementHidden('system-toggle', false);
    setElementHidden('info-panel', true);
}


let ui = {
    init,
    createPlanetList,
    setSystemName,
    showPlanetInfo,
    resetUi
};
export { ui, fonts }