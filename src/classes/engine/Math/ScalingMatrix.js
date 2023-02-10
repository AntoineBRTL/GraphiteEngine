import { Matrix4 } from "./Matrix4.js";
export class ScalingMatrix extends Matrix4 {
    constructor(scale) {
        super();
        this.a11 = scale.x;
        this.a22 = scale.y;
        this.a33 = scale.z;
    }
}
