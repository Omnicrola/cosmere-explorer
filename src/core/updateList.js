// The objects with a per-frame userData.update function, so the render loop doesn't have to
// search the whole scene every frame. The list is rebuilt only when the scene graph changes:
// switching systems invalidates it, and code that adds updatable objects later (e.g. asteroid
// belts once their meshes load) calls markSceneGraphChanged().

let sceneGraphVersion = 0;

function markSceneGraphChanged() {
    sceneGraphVersion++;
}

function collectUpdatables(root) {
    const updatables = [];
    root.traverse((obj) => {
        if(obj.userData.update) {
            updatables.push(obj);
        }
    });
    return updatables;
}

function createUpdateList() {
    let cached = null;
    let cachedVersion = -1;

    return {
        // the updatable objects under root, rebuilt only if the scene graph changed
        get(root) {
            if(!cached || cachedVersion !== sceneGraphVersion) {
                cached = collectUpdatables(root);
                cachedVersion = sceneGraphVersion;
            }
            return cached;
        },
        invalidate() {
            cached = null;
        },
    };
}

export { createUpdateList, markSceneGraphChanged, collectUpdatables };
