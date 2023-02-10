import { Matrix4 } from "./Matrix4.js";
import { Vector3 } from "./Vector3.js";

export class ScalingMatrix extends Matrix4
{
    public constructor(scale: Vector3)
    {
        super();

        this.a11 = scale.x;
        this.a22 = scale.y;
        this.a33 = scale.z;
    }
}