import { focusOnPlanet } from "../mainScene.js";

function createPlanetElement(planet, index) {
    let listItem = document.createElement('li');
    listItem.innerHTML = 
    `<div class="planet">
        <img class="planet-icon" src="icons/${planet.icon}" />
        <p class="name">${planet.name}</p>
    </div>
    `;
    
    listItem.onclick = () => {
        focusOnPlanet(index)
    }
    return listItem;
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

let ui = {
    createPlanetList,
    setSystemName
};
export { ui }