// Persists the current system and selection in both the URL (so links can be shared)
// and localStorage (so a returning visitor lands where they left off).
// The URL takes priority over localStorage.

// retrival keys
const CURRENT_SYSTEM = 'system';
const CURRENT_SELECTION = 'planet';


const userSettings = {
    get currentSystem() {
        return getValueByKey(CURRENT_SYSTEM);
    },
    set currentSystem(val) {
        setValue(CURRENT_SYSTEM, val);
    },
    get currentSelection() {
        return getValueByKey(CURRENT_SELECTION);
    },
    set currentSelection(val) {
        setValue(CURRENT_SELECTION, val);
    }
};

function isValidId(val) {
    const isEmpty = val === "" || val === 'null' || val === 'undefined' || val === null || val === undefined;
    return !isEmpty;
}

function setValue(key, val) {
    const value = isValidId(val) ? String(val) : null;
    setUrlParam(key, value);
    try {
        if(value === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, value);
        }
    } catch {
        // storage can be unavailable (private browsing, blocked site data); the URL still works
    }
}

function setUrlParam(key, val) {
    const params = new URLSearchParams(window.location.search);
    if(val === null) {
        params.delete(key);
    } else {
        params.set(key, val);
    }
    // replace rather than push, so selecting planets doesn't fill the back-button history
    const query = params.toString();
    history.replaceState(null, '', query ? "?" + query : window.location.pathname);
}

function getValueByKey(key) {
    let value = new URLSearchParams(window.location.search).get(key);
    if(!isValidId(value)) {
        try {
            value = localStorage.getItem(key);
        } catch {
            value = null;
        }
    }
    return isValidId(value) ? value : null;
}

export { userSettings, isValidId };
