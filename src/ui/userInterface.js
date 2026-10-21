import { allStellarSystems, findSystemById } from "../data/all-systems.js";
import { focusOnStellarObject, clearFocus, clearSelection } from "./interactions.js";
import { userSettings, recordNavigation } from "../data/userSettings.js";
import { showSystemInfoPanel } from "./infoPanels.js";
import { setElementHidden } from "./dom.js";

const NO_SELECTION = '-1';

function createScannerOption(name, selectionValue, isSelected) {
    const option = document.createElement('option');
    option.textContent = name;
    option.value = selectionValue;
    option.selected = isSelected;
    return option;
}

function createScannerOptions(scannerSelect, childrenObjects) {
    if(childrenObjects) {
        childrenObjects.forEach((objData) => {
            const objId = objData.id;
            if(objId){
                scannerSelect.appendChild(createScannerOption(objData.name, objId, objId == userSettings.currentSelection));
            }
            createScannerOptions(scannerSelect, objData.children); // recursive call
        });
    }
}

function updateScannerList(stellarObjects = []) {
    const scannerSelect = document.getElementById('planet-select');
    scannerSelect.innerHTML = "";

    scannerSelect.appendChild(createScannerOption("-- Select --", NO_SELECTION, true));
    createScannerOptions(scannerSelect, stellarObjects);

    scannerSelect.value = NO_SELECTION;
}

// shows which system is loaded, in the title and the system drop-down
function setCurrentSystem(system) {
    document.getElementById('system-name').textContent = system.name;
    document.getElementById('system-selector').value = system.id;
}

function copySelectionLink() {
    const url = new URL(window.location.href);
    url.searchParams.set('planet', userSettings.currentSelection);
    navigator.clipboard?.writeText(url.toString())
        .catch((err) => console.warn('Could not copy link to clipboard', err));
}

// onSystemSelected(systemData) is called when the user picks a different stellar system
function init({ onSystemSelected }) {

    // planetary selection drop-down
    const planetSelect = document.getElementById('planet-select');
    planetSelect.addEventListener('change', (e) => {
        const stellarObjectId = e.target.value;
        if(stellarObjectId === NO_SELECTION) {
            clearFocus();
        } else {
            focusOnStellarObject({selectedId: stellarObjectId});
        }
    });

    document.getElementById('previous-planet').addEventListener('click', () => {
        planetSelect.selectedIndex--;
        if(planetSelect.selectedIndex <= 0) {
            planetSelect.selectedIndex = planetSelect.options.length - 1;
        }
        planetSelect.dispatchEvent(new Event('change'));
    });

    document.getElementById('next-planet').addEventListener('click', () => {
        if(planetSelect.selectedIndex >= planetSelect.options.length - 1) {
            planetSelect.selectedIndex = 1; // not zero, the first item in the list is always "select a planet"
        } else {
            planetSelect.selectedIndex++;
        }
        planetSelect.dispatchEvent(new Event('change'));
    });

    document.getElementById('btn-system-info').addEventListener('click', () => {
        const systemData = findSystemById(userSettings.currentSystem);
        if(systemData) {
            recordNavigation(clearSelection);
            showSystemInfoPanel(systemData);
        }
    });

    // info panel buttons are re-rendered with the panel, so handle them by delegation
    document.getElementById('info-panel').addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]')?.dataset.action;
        if(action === 'close') {
            clearFocus();
        } else if(action === 'copy-link') {
            copySelectionLink();
        }
    });

    // populate the stellar system selector options
    const systemSelector = document.getElementById('system-selector');
    systemSelector.innerHTML = "";
    const selectedId = userSettings.currentSystem;
    allStellarSystems.forEach((system) => {
        const newOption = document.createElement('option');
        newOption.value = system.id;
        newOption.selected = system.id == selectedId;
        newOption.textContent = system.name;
        systemSelector.appendChild(newOption);
    });

    // handle switching stellar systems
    systemSelector.addEventListener('change', (e) => {
        const selectedSystem = findSystemById(e.target.value);
        if(selectedSystem) {
            recordNavigation(() => {
                userSettings.currentSystem = selectedSystem.id;
                userSettings.currentSelection = null;
            });
            onSystemSelected(selectedSystem);
        }
    });

}

function resetUi() {
    setElementHidden('info-panel', true);
}


const ui = {
    init,
    updateScannerList,
    setCurrentSystem,
    resetUi,
};
export { ui };
