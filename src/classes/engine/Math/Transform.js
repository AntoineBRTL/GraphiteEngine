import { RotationMatrix } from "./RotationMatrix.js";
import { ScalingMatrix } from "./ScalingMatrix.js";
import { TranslationMatrix } from "./TranslationMatrix.js";
import { Vector3 } from "./Vector3.js";
export class Transform {
    constructor() {
        this.location = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1.0, 1.0, 1.0);
    }
    getViewTransformationMatrix() {
        let tm = new TranslationMatrix(this.location);
        let rm = new RotationMatrix(this.rotation);
        let sm = new ScalingMatrix(this.scale);
        return sm.product(tm).product(rm);
    }
    getTransformationMatrix() {
        let tm = new TranslationMatrix(this.location);
        let rm = new RotationMatrix(this.rotation);
        let sm = new ScalingMatrix(this.scale);
        return rm.product(tm).product(sm);
    }
    setLocation(location) {
        this.location = location;
    }
    setRotation(rotation) {
        this.rotation = rotation;
    }
    setScale(scale) {
        this.scale = scale;
    }
    getLocation() {
        return this.location;
    }
    getRotation() {
        return this.rotation;
    }
    getScale() {
        return this.scale;
    }
    getForward() {
        return new Vector3(Math.cos(this.rotation.z * Math.PI / 180.0) * Math.sin(this.rotation.y * Math.PI / 180.0), -Math.sin(this.rotation.z * Math.PI / 180.0), Math.cos(this.rotation.z * Math.PI / 180.0) * Math.cos(this.rotation.y * Math.PI / 180.0));
    }
    getRight() {
        return new Vector3(Math.cos(this.rotation.y * Math.PI / 180.0), 0.0, -Math.sin(this.rotation.y * Math.PI / 180.0));
    }
    getBackward() {
        return this.getForward().scale(-1);
    }
    getLeft() {
        return this.getRight().scale(-1);
    }
    getUp() {
        return this.getForward().cross(this.getRight());
    }
    getDown() {
        return this.getUp().scale(-1);
    }
}
