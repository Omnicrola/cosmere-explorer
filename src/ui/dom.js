// Small DOM helpers shared by the UI modules.

function setElementHidden(id, isHidden) {
    const element = document.getElementById(id);
    element.classList.toggle('hidden', isHidden);
}

export { setElementHidden };
