import { Matrix4 } from "./Matrix4.js";
import { RotationxMatrix } from "./RotationxMatrix.js";
import { RotationyMatrix } from "./RotationyMatrix.js";
import { RotationzMatrix } from "./RotationzMatrix.js";
import { ScalingMatrix } from "./ScalingMatrix.js";
import { TranslationMatrix } from "./TranslationMatrix.js";
import { Vector3 } from "./Vector3.js";

export class Transform
{
    private location: Vector3;
    private rotation: Vector3;
    private scale: Vector3;

    public constructor()
    {
        this.location = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1.0, 1.0, 1.0);
    }

    public getViewTransformationMatrix(): Matrix4
    {
        let rm = this.getRotationMatrix();
        let tm = new TranslationMatrix(this.location);
        let sm = new ScalingMatrix(this.scale);
        return sm.product(tm).product(rm);
    }

    public getTransformationMatrix(): Matrix4
    {
        let rm = this.getRotationMatrix();
        let tm = new TranslationMatrix(this.location);
        let sm = new ScalingMatrix(this.scale);
        return rm.product(tm).product(sm);
    }

    public getRotationMatrix(): Matrix4
    {
        let rx = new RotationxMatrix((Math.PI / 180) * this.rotation.x);
        let ry = new RotationyMatrix((Math.PI / 180) * this.rotation.y);
        let rz = new RotationzMatrix((Math.PI / 180) * this.rotation.z);
        let rm = rz.product(ry).product(rx);
        return rm;
    }

    public setLocation(location: Vector3): void
    {
        this.location = location;
    }

    public setRotation(rotation: Vector3): void
    {
        this.rotation = rotation;
    }

    public setScale(scale: Vector3): void
    {
        this.scale = scale;
    }

    public getLocation(): Vector3
    {
        return this.location;
    }

    public getRotation(): Vector3
    {
        return this.rotation;
    }

    public getScale(): Vector3
    {
        return this.scale;
    }

    public getForward(): Vector3
    {
        return new Vector3(
            Math.cos(this.rotation.z * Math.PI / 180.0) * Math.sin(this.rotation.y * Math.PI / 180.0),
            -Math.sin(this.rotation.z * Math.PI / 180.0),
            Math.cos(this.rotation.z * Math.PI / 180.0) * Math.cos(this.rotation.y * Math.PI / 180.0),
        );
    }

    public getRight(): Vector3
    {
        return new Vector3(
            Math.cos(this.rotation.y * Math.PI / 180.0),
            0.0,
            -Math.sin(this.rotation.y * Math.PI / 180.0),
        );
    }

    public getBackward(): Vector3
    {
        return this.getForward().scale(-1);
    }

    public getLeft(): Vector3
    {
        return this.getRight().scale(-1);
    }

    public getUp(): Vector3
    {
        return this.getForward().cross(this.getRight());
    }

    public getDown(): Vector3
    {
        return this.getUp().scale(-1);
    }
}