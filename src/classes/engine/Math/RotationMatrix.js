import { Matrix4 } from "./Matrix4.js";
import { RotationxMatrix } from "./RotationxMatrix.js";
import { RotationyMatrix } from "./RotationyMatrix.js";
import { RotationzMatrix } from "./RotationzMatrix.js";
export class RotationMatrix extends Matrix4 {
    constructor(rotation) {
        super();
        let rx = new RotationxMatrix((Math.PI / 180) * rotation.x);
        let ry = new RotationyMatrix((Math.PI / 180) * rotation.y);
        let rz = new RotationzMatrix((Math.PI / 180) * rotation.z);
        this.set(this.product(rz).product(ry).product(rx));
    }
}
