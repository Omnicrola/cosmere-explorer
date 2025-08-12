
// retrival keys
const CURRENT_SYSTEM = 'system';
const CURRENT_SELECTION = 'planet';


const userSettings = {
    get currentSystem() {
        return getValueByKey(CURRENT_SYSTEM);
    },
    set currentSystem(val) {
        setUrlParam(CURRENT_SYSTEM, val);
        localStorage.setItem(CURRENT_SYSTEM, val);
    },
    get currentSelection() {
        return getValueByKey(CURRENT_SELECTION);
    },
    set currentSelection(val) {
        setUrlParam(CURRENT_SELECTION, val);
        localStorage.setItem(CURRENT_SELECTION, val);
    }
};

function setUrlParam(key, val) {
    const params = new URLSearchParams(window.location.search);
    if(val === null) {
        params.delete(key);
    } else {
        params.set(key, val);
    }
    history. pushState(null, null, "?"+params.toString());
}

function getValueByKey(key) {
    let value = getUrlParam(key);
    if(value === null) {
        value = localStorage.getItem(key) ?? null;
    } 
    return value;
}

function getUrlParam(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}

export { userSettings };