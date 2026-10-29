import { MathUtils } from "three";
import { ModifierBase } from "./ModifierBase.js";

// Spins an object around it's Y axis
// "spinRate" parameter is in degrees per second
export class Spinner extends ModifierBase {
    constructor(spinRate, target) {
        super();
        this.spinRate = spinRate;
        this.target = target;
    }

    update(deltaTime) {
        this.target.rotation.y += deltaTime * this.spinRate * MathUtils.DEG2RAD;
    }
}
