import { STELLAR_OBJECT } from "../data/stellarData.js";
import { stopFollowingStellarObject } from "./interactions.js";
import { ui } from "./userInterface.js";
import { userSettings } from "../data/userSettings.js";


const STATS = {
    planetCount : (objs=[]) => {
        console.log(objs);
        objs.filter(o=>o.stellarObjectType===STELLAR_OBJECT.PLANET).length;
    }
}

function showInfoPanel(sceneObject) {
    const info = sceneObject.userData.info;


    switch(info.stellarObjectType) {
        case STELLAR_OBJECT.STAR : {
            const stats = makeStarStats(info);
            buildPanel(info, stats);
            break;
        }
        case STELLAR_OBJECT.PLANET :
        case STELLAR_OBJECT.MOON : {
            const stats = makePlanetStats(info);
            buildPanel(info, stats);
            break;
        }
        case STELLAR_OBJECT.COGNITIVE_ANOMOLY : {
            const stats = makeCognitiveAnomolyStats(info);
            buildPanel(info, stats);
            break;
        }
        default : {}
    }

    // unhide the info panel 
    ui.setElementHidden('info-panel', false);
    

}

function buildPanel(info, statsContent) {
    let infoPanel = document.getElementById('info-panel');
    let description = info.description.split('\n')
        .map((substr) => `<p>${substr}</p>`)
        .join(" ");

        infoPanel.innerHTML = `
        <h1 class="name">${info.name} 
            <button id="btn-copy-planet-link" class="btn-copy-link" title="Copy stellar object URL">
              <img src="resources/icons/icon-link.png" class="copy-link"/>
            </button>
            <button id="close-info-panel" class="close" title="Close info panel">X</button>
        </h1>
        <div class="description"><img class="planet-icon" src="resources/Textures/${info.icon}"/>${description}</div>
        ${statsContent}
        `;
        
        let closeInfoPanel = document.getElementById('close-info-panel');
        closeInfoPanel.addEventListener('click', (e) => {
            ui.setElementHidden('info-panel', true);
            stopFollowingStellarObject();
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

// S3M - Scadrian Standard Solar Mass
function makeStarStats(info) {
    return `
    <ul class="stats">
        <li><b><a href="https://en.wikipedia.org/wiki/Absolute_magnitude">Absolute Magnitude:</a> <b> ${info.absoluteMagnitude??0.0} </li>
        <li><b>Mass:<b> ${info.mass??0.0} S3M</li>
        <li><b><a href="https://en.wikipedia.org/wiki/Color_index">Color Index (B-V)</a>:<b> ${info.colorIndex??0.0} </li>
        <li><b>Axial Tilt:</b> ${info.axialTilt??0.0} (ecliptic)</li>
        <li><b>Equatorial Radius:</b> ${(info.radius*100000).toLocaleString()??'??'} km</li>
        <li><b>Planets: <b> ${info.planets}</li>
        <li><a href="${info.coppermind}" target="_new">Coppermind Link</a></li>
    </ul>
    `; 
}

function makePlanetStats(info) {
    return `
    <ul class="stats">
        <li><b>Orbital Distance:</b> ${info.orbitalRadius}</li>
        <li><b>Orbital Eccentricity:</b> ${info.orbitalEccentricity??0.0}</li>
        <li><b>Axial Tilt:</b> ${info.axialTilt??0.0} (ecliptic)</li>
        <li><b>Radius:</b> ${info.radius??'??'} standard</li>
        <li><b>Surface Gravity:</b> ${info.gravity??'??'} standard</li>
        <li><b>Known Perpendicularities:</b> ${info.perpendicularities??0}</li>
        <li><a href="${info.coppermind}" target="_new">Coppermind Link</a></li>
    </ul>
    `;
}

function makeCognitiveAnomolyStats(info) {
    return `
    <ul class="stats">
        <li><b>Location:</b> ${info.orbitalRadius * 1000} million km from primary star</li>
        <li><b>Radius:</b>Approximately ${(info.radius * 100)??'??'}k kilometers</li>
        <li><a href="${info.coppermind}" target="_new">Coppermind Link</a></li>
    </ul>
    `;
}


export { showInfoPanel };