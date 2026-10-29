import { STELLAR_OBJECT } from "../data/stellarData.js";
import { escapeHtml, safeUrl, formatStat } from "../util/html.js";
import { setElementHidden } from "./dom.js";

// Builds the contents of the info panel. All stellar data is escaped before being
// inserted, so a stray '<' or quote in a description can never inject markup.
// The panel's buttons are wired up once, via event delegation, in userInterface.init().

const TEXTURE_PATH = 'resources/textures/';
const DEFAULT_ICON = 'resources/icons/icon-planet.svg';

// resolves a data 'icon' value to a URL; icons are stored relative to the textures folder
function iconUrl(icon) {
    if(!icon) {
        return DEFAULT_ICON;
    }
    return icon.startsWith('resources/') ? icon : TEXTURE_PATH + icon;
}

function formatDescription(description = '') {
    return description.split('\n')
        .map((substr) => `<p>${escapeHtml(substr.trim())}</p>`)
        .join(" ");
}

// objects without a known Coppermind page get no link, rather than a dead one
function coppermindLink(info) {
    if(!info.coppermind) {
        return '';
    }
    return `<li><a href="${escapeHtml(safeUrl(info.coppermind))}" target="_blank" rel="noopener noreferrer">Coppermind Link</a></li>`;
}

function statLine(label, value) {
    return `<li><b>${label}:</b> ${escapeHtml(value)}</li>`;
}

// S3M - Scadrian Standard Solar Mass
function makeStarStats(info) {
    return `
    <ul class="stats">
        <li><b><a href="https://en.wikipedia.org/wiki/Absolute_magnitude" target="_blank" rel="noopener noreferrer">Absolute Magnitude</a>:</b> ${escapeHtml(formatStat(info.absoluteMagnitude))}</li>
        ${statLine('Mass', `${formatStat(info.mass)} S3M`)}
        <li><b><a href="https://en.wikipedia.org/wiki/Color_index" target="_blank" rel="noopener noreferrer">Color Index (B-V)</a>:</b> ${escapeHtml(formatStat(info.colorIndex))}</li>
        ${statLine('Axial Tilt', `${formatStat(info.axialTilt)} (ecliptic)`)}
        ${statLine('Equatorial Radius', `${formatStat(info.radius, { scale: 100000, locale: true })} km`)}
        ${statLine('Planets', formatStat(info.planets))}
        ${coppermindLink(info)}
    </ul>
    `;
}

function makePlanetStats(info) {
    return `
    <ul class="stats">
        ${statLine('Orbital Distance', formatStat(info.orbitalRadius))}
        ${statLine('Orbital Eccentricity', formatStat(info.orbitalEccentricity))}
        ${statLine('Axial Tilt', `${formatStat(info.axialTilt)} (ecliptic)`)}
        ${statLine('Radius', `${formatStat(info.radius)} standard`)}
        ${statLine('Surface Gravity', `${formatStat(info.gravity)} standard`)}
        ${statLine('Known Perpendicularities', formatStat(info.perpendicularity))}
        ${coppermindLink(info)}
    </ul>
    `;
}

function makeCognitiveAnomalyStats(info) {
    return `
    <ul class="stats">
        ${statLine('Location', `${formatStat(info.orbitalRadius, { scale: 1000 })} million km from primary star`)}
        ${statLine('Radius', `Approximately ${formatStat(info.radius, { scale: 100 })}k kilometers`)}
        ${coppermindLink(info)}
    </ul>
    `;
}

function makeGenericDescriptionPanel(info) {
    return `
    <ul class="stats">
        ${coppermindLink(info)}
    </ul>
    `;
}

function makeSystemStats(info) {
    return `
    <ul class="stats">
        ${statLine('Shards', info.shards ?? '??')}
        ${statLine('Invested Arts', info.investedArts ?? '??')}
        ${statLine('Inhabited Planets', info.inhabitedPlanets ?? '??')}
        ${coppermindLink(info)}
    </ul>
    `;
}

function makeStatsForObject(info) {
    switch(info.stellarObjectType) {
        case STELLAR_OBJECT.STAR :
            return makeStarStats(info);
        case STELLAR_OBJECT.PLANET :
        case STELLAR_OBJECT.MOON :
            return makePlanetStats(info);
        case STELLAR_OBJECT.COGNITIVE_ANOMALY :
            return makeCognitiveAnomalyStats(info);
        default :
            return makeGenericDescriptionPanel(info);
    }
}

function renderPanelHtml(info, statsContent) {
    return `
        <h1 class="name">${escapeHtml(info.name)}
            <button data-action="copy-link" class="btn-copy-link" title="Copy stellar object URL">
              <img src="resources/icons/icon-link.png" class="copy-link" alt="Copy link"/>
            </button>
            <button data-action="close" class="close" title="Close info panel">X</button>
        </h1>
        <div class="description"><img class="planet-icon" src="${escapeHtml(iconUrl(info.icon))}" alt=""/>${formatDescription(info.description)}</div>
        ${statsContent}
        `;
}

function buildPanel(info, statsContent) {
    const infoPanel = document.getElementById('info-panel');
    infoPanel.innerHTML = renderPanelHtml(info, statsContent);
    setElementHidden('info-panel', false);
}

function showInfoPanel(sceneObject) {
    const info = sceneObject.userData.info;
    buildPanel(info, makeStatsForObject(info));
}

function showSystemInfoPanel(info) {
    buildPanel(info, makeSystemStats(info));
}

export {
    showInfoPanel,
    showSystemInfoPanel,
    renderPanelHtml,
    makeStatsForObject,
    makeSystemStats,
    iconUrl,
};
