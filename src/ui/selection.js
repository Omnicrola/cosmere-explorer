// Pure helpers for turning pointer input into a stellar-object selection.

// pointer movement (in px) between pointerdown and pointerup that still counts as a click
const CLICK_DRAG_TOLERANCE = 5;

// Walks up from an object to the nearest ancestor (or itself) flagged as selectable.
// Hits on child meshes such as atmospheres or rings resolve to their planet.
function findSelectableAncestor(obj) {
    for(let current = obj; current; current = current.parent) {
        if(current.userData?.isSelectable) {
            return current;
        }
    }
    return null;
}

// Raycaster intersections are sorted nearest-first; return the nearest selectable object.
function findNearestSelectable(intersects = []) {
    for(const hit of intersects) {
        const selectable = findSelectableAncestor(hit.object);
        if(selectable) {
            return selectable;
        }
    }
    return null;
}

// Collects every selectable object in a scene graph, for use as raycast targets.
function collectSelectableObjects(root) {
    const selectables = [];
    root.traverse((obj) => {
        if(obj.userData?.isSelectable) {
            selectables.push(obj);
        }
    });
    return selectables;
}

// true when the pointer barely moved, i.e. the user clicked rather than dragged the camera
function isClickGesture(down, up, tolerance = CLICK_DRAG_TOLERANCE) {
    if(!down || !up) {
        return false;
    }
    return Math.hypot(up.x - down.x, up.y - down.y) <= tolerance;
}

// converts a client-space pointer position into normalized device coordinates (-1 to +1)
function toNormalizedDeviceCoords(clientX, clientY, rect, target) {
    target.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    target.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    return target;
}

export {
    findSelectableAncestor,
    findNearestSelectable,
    collectSelectableObjects,
    isClickGesture,
    toNormalizedDeviceCoords,
    CLICK_DRAG_TOLERANCE,
};
