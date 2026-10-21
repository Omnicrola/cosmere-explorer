import { MathUtils } from "three";
import { ModifierBase } from "./ModifierBase.js";

// Spins a planet/star/whatever around it's Y axis
// "spinRate" parameter is in degrees per second
export class Spinner extends ModifierBase {
    constructor(spinRate) {
        super();
        this.spinRate = spinRate;
    }

    update(deltaTime, { parentObj }) {
        parentObj.rotation.y += deltaTime * this.spinRate * MathUtils.DEG2RAD;
    }
}
