import { MathUtils } from "three/src/Three.Core.js";
import { ModifierBase } from "./ModifierBase";

// Spins a planet/star/whatever around it's Y axis
// "spinRate" parameter is in degrees
export class Spinner extends ModifierBase {
    constructor(spinRate) {
        super();
        this.spinRate = spinRate;
    }

    update(deltaTime, parentObj) {
        parentObj.rotation.y += deltaTime * MathUtils.DEG2RAD(this.spinRate);
    }
}