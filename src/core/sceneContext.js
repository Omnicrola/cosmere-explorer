// Shared references to the live three.js objects, populated by mainScene.init().
// Other modules read from here instead of importing mainScene.js, which keeps the
// import graph free of cycles and lets tests supply their own scene/camera/controls.
const sceneContext = {
    scene: null,
    camera: null,
    orbitControls: null,
    renderer: null,
};

export { sceneContext };
