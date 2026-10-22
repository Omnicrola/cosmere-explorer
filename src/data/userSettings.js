// Persists the current system and selection in the URL (so links can be shared and the
// back button works) and in localStorage (so a returning visitor lands where they left off).
//
// The URL is the source of truth while the app runs. localStorage is only read once, at
// startup, by restoreSettingsIntoUrl().
//
// Setting a value replaces the current history entry. Wrap user navigation (picking a
// planet, switching systems, closing the panel) in recordNavigation() to give it its own
// history entry, so the back button can return to it.

// retrival keys
const CURRENT_SYSTEM = 'system';
const CURRENT_SELECTION = 'planet';


const userSettings = {
    get currentSystem() {
        return getUrlValue(CURRENT_SYSTEM);
    },
    set currentSystem(val) {
        setValue(CURRENT_SYSTEM, val);
    },
    get currentSelection() {
        return getUrlValue(CURRENT_SELECTION);
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

function urlForQuery(query) {
    return query ? "?" + query : window.location.pathname;
}

function setUrlParam(key, val) {
    const params = new URLSearchParams(window.location.search);
    if(val === null) {
        params.delete(key);
    } else {
        params.set(key, val);
    }
    history.replaceState(null, '', urlForQuery(params.toString()));
}

function getUrlValue(key) {
    const value = new URLSearchParams(window.location.search).get(key);
    return isValidId(value) ? value : null;
}

function getStoredValue(key) {
    try {
        const value = localStorage.getItem(key);
        return isValidId(value) ? value : null;
    } catch {
        return null;
    }
}

// Runs applyChanges (which updates settings) as a single navigation step: if the URL
// changed, the previous URL is kept as its own history entry so the back button returns to it.
function recordNavigation(applyChanges) {
    const before = window.location.search;
    applyChanges();
    const after = window.location.search;
    if(after !== before) {
        history.replaceState(null, '', urlForQuery(before.replace(/^\?/, '')));
        history.pushState(null, '', urlForQuery(after.replace(/^\?/, '')));
    }
}

// At startup, fill in anything the URL doesn't specify from the last visit.
// A remembered planet is only restored if it belongs to the system being shown.
function restoreSettingsIntoUrl() {
    const urlSystem = getUrlValue(CURRENT_SYSTEM);
    const storedSystem = getStoredValue(CURRENT_SYSTEM);

    if(!urlSystem && storedSystem) {
        setUrlParam(CURRENT_SYSTEM, storedSystem);
    }

    const sameSystem = !urlSystem || urlSystem === storedSystem;
    const storedSelection = getStoredValue(CURRENT_SELECTION);
    if(!getUrlValue(CURRENT_SELECTION) && sameSystem && storedSelection) {
        setUrlParam(CURRENT_SELECTION, storedSelection);
    }
}

export { userSettings, isValidId, recordNavigation, restoreSettingsIntoUrl };
