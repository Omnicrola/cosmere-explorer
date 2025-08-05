function updateInteractions(raycaster, scene) {
    const intersects = raycaster.intersectObjects( scene.children );

    var userData;
	for ( let i = 0; i < intersects.length; i ++ ) {
        userData = intersects[i].object.userData;
        userData.hoverState = true;
        console.log(intersects[i].object);
	}
}

export { updateInteractions };