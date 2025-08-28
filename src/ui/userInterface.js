import * as THREE from "three";
import { resetScene } from "../mainScene.js";
import { allStellarSystems } from "../data/all-systems.js";
import { focusOnStellarObject } from "./interactions.js";
import { userSettings } from "../data/userSettings.js";
import { showInfoPanel } from "./infoPanels.js";


function createScannerOption(planetData, name, selectionValue, isSelected) {
    let option = document.createElement('option');
    option.innerText = name;
    option.value = selectionValue;
    option.selected = isSelected;
    option.planet = planetData;
    return option;
}

function createScannerOptions(scannerSelect, childrenObjects) {
    if(childrenObjects) {
        childrenObjects.forEach((objData) => {
            const objId = objData.id;
            if(objId){
                scannerSelect.appendChild(createScannerOption(objData, objData.name, objId, objId==userSettings.currentSelection));
            }
            createScannerOptions(scannerSelect, objData.children); // recursive call
        });
    }
}

function updateScannerList(stellarObjects = []) {
    let scannerSelect = document.getElementById('planet-select');
    scannerSelect.innerHTML = "";

    let emptyOption = document.createElement('option');
    emptyOption.innerText = "-- Select --";
    emptyOption.value = -1;
    emptyOption.selected = true;
    scannerSelect.appendChild(emptyOption);
    
    createScannerOptions(scannerSelect, stellarObjects);

    scannerSelect.value = -1;
}

function updateAutoNavigation() {
    const selection = Number(userSettings.currentSelection);
    if(selection >= 0) {
        let planetSelect = document.getElementById('planet-select');
        planetSelect.value = selection;
        planetSelect.dispatchEvent(new Event('change'));
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

        planetSelect.selectedIndex--;
        if(planetSelect.selectedIndex <= 0) {
            planetSelect.selectedIndex = planetSelect.options.length - 1;
        }
        planetSelect.dispatchEvent(new Event('change'));
    });

     document.getElementById('next-planet').addEventListener('click', (e) => {
        let planetSelect = document.getElementById('planet-select');
        
        if(planetSelect.selectedIndex >= planetSelect.options.length - 1) {
            planetSelect.selectedIndex = 1; // not zero, the first item in the list is always "select a planet"
        } else {
            planetSelect.selectedIndex++;
        }
        planetSelect.dispatchEvent(new Event('change'));
    });

    // populate the stellar system selector options
    let systemSelector = document.getElementById('system-selector');
    systemSelector.innerHTML = "";
    let newOption = null;
    const selectedId = userSettings.currentSystem;
    allStellarSystems.forEach((system, index) => {
        newOption = document.createElement('option');
        newOption.value = system.id;
        newOption.selected = system.id == selectedId;
        newOption.textContent = system.name;
        systemSelector.appendChild(newOption);
    });

    // handle switching stellar systems
    systemSelector.addEventListener('change', (e) => {
        const systemId = e.target.value;
        let selectedSystem = allStellarSystems.find(s=>s.id==systemId);
        if(selectedSystem) {
            userSettings.currentSystem = selectedSystem.id;
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
    updateScannerList,
    setSystemName,
    resetUi,
    showInfoPanel,
    setElementHidden,
    checkAutoNavigation: updateAutoNavigation,
};
export { ui }