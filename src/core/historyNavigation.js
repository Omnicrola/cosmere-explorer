import { userSettings, isValidId } from "../data/userSettings.js";
import { allStellarSystems, findSystemById } from "../data/all-systems.js";
import { focusOnStellarObject, clearFocus } from "../ui/interactions.js";

// Brings the app in line with the URL after the user presses back or forward.
// loadSystem(system) rebuilds the scene; when the system changes, the planet in the URL
// is focused by the new system's warp-in.
function restoreFromUrl({ currentSystem, loadSystem }) {
    const system = findSystemById(userSettings.currentSystem) ?? allStellarSystems[0];
    // re-saving keeps localStorage in step with the URL (and fixes an unknown system id)
    userSettings.currentSystem = system.id;

    if(system !== currentSystem) {
        loadSystem(system);
        return;
    }

    const selection = userSettings.currentSelection;
    if(isValidId(selection)) {
        focusOnStellarObject({ selectedId: selection });
    } else {
        clearFocus();
    }
}

export { restoreFromUrl };
