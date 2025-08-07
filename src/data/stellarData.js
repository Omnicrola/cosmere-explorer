function createPlanetData({
    system = '',
    planetRadius = 1,
    planetColor = 0xffffff,
    textureMap = null,
    orbitalRadius = 5,
    orbitalSpeed = 1,
    orbitalEccentricity = 0,
    orbitalStart = 0,
    axialTilt = 10,
    radius,
    gravity,
    perpendicularity,
    name = 'default',
    icon = 'icon-planet.svg',
    description = 'Lorem ipsum',
    coppermind = 'https://coppermind.net/wiki'
}){
    return {
        system,
        description,
        planetRadius,
        planetColor,
        textureMap,
        orbitalRadius,
        orbitalSpeed,
        orbitalStart,
        orbitalEccentricity,
        axialTilt,
        radius,
        gravity,
        perpendicularity,
        name,
        icon,
        description,
        coppermind
    };
}
function createStellarData({
    starRadius = 2,
    starColor = 0xffff99,
    name = "the star",
    icon = "icon-stellar-system.svg",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    coppermind = "https://coppermind.net/wiki",
    planets: [],
}){
    return {
        starRadius : starRadius,
        starColor : starColor,
        name : name,
        icon : icon,
        description : description,
        coppermind : coppermind,
        planets: [],
    };
}


export {
    createPlanetData,
    createStellarData,
};
