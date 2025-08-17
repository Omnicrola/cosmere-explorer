import { resetScene } from "../mainScene.js";
import { allStellarSystems } from "../data/all-systems.js";
import { createStellarSystem } from "../generators/createStellarSystem.js";
import { focusOnPlanet, stopFollowingPlanet } from "./interactions.js";
import { userSettings } from "../data/userSettings.js";


function showPlanetInfo(planet) {
    setElementHidden('info-panel', false);

    let infoPanel = document.getElementById('info-panel');
    let info = planet.userData.info;

    let description = info.description.split('\n')
        .map((substr) => `<p>${substr}</p>`)
        .join(" ");

        infoPanel.innerHTML = `
      <h1 class="name">${info.name} 
        <button id="btn-copy-planet-link" class="btn-copy-link" title="Copy planet URL">
            <img src="resources/icons/icon-link.png" class="copy-link"/>
        </button>
        <button id="close-info-panel" class="close" title="Close info panel">X</button>
      </h1>
      <div class="description"><img class="planet-icon" src="resources/textures/${info.icon}"/>${description}</div>
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
        userSettings.currentSelection = null;
    });

    document.getElementById('btn-copy-planet-link').addEventListener('click', (e) => {
        const url = new URL(window.location.href);
        url.searchParams.set('planet', userSettings.currentSelection);
        navigator.clipboard.writeText(url.toString());
    });

}

function createPlanetOption(planetData, name, index, isSelected) {
    let option = document.createElement('option');
    option.innerText = name;
    option.value = index;
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
    planetSelect.appendChild(emptyOption);
    
    planetData.forEach((planet, index) => {
        planetSelect.appendChild(createPlanetOption(planet, planet.name, index, index==userSettings.currentSelection));
        planet.moons.forEach((moon, moonIndex) => {
            planetSelect.appendChild(createPlanetOption(moon, '- '+moon.name, moonIndex+100, moonIndex==userSettings.currentSelection));
        });
    });

    planetSelect.value = 3;
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
        let planetIndex = e.target.value;
        userSettings.currentSelection = planetIndex;
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
    showPlanetInfo,
    resetUi,
    checkAutoNavigation: updateAutoNavigation
};
export { ui }