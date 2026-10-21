// Frees the GPU resources (geometries, materials, textures) held by a scene graph.
// three.js does not do this automatically when objects are removed from a scene.

function collectTextures(material, textures) {
    for(const value of Object.values(material)) {
        if(value?.isTexture) {
            textures.add(value);
        }
    }
    // shader materials keep their textures in uniforms
    if(material.uniforms) {
        for(const uniform of Object.values(material.uniforms)) {
            if(uniform?.value?.isTexture) {
                textures.add(uniform.value);
            }
        }
    }
}

function disposeObject3D(root) {
    const geometries = new Set();
    const materials = new Set();
    const textures = new Set();

    root.traverse((obj) => {
        if(obj.geometry) {
            geometries.add(obj.geometry);
        }
        if(obj.material) {
            const objMaterials = Array.isArray(obj.material) ? obj.material : [obj.material];
            objMaterials.forEach((m) => materials.add(m));
        }
    });
    if(root.background?.isTexture) {
        textures.add(root.background);
    }
    materials.forEach((m) => collectTextures(m, textures));

    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());

    return { geometries: geometries.size, materials: materials.size, textures: textures.size };
}

export { disposeObject3D };
