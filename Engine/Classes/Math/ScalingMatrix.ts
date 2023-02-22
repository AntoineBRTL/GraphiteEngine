import { Matrix4 } from "./Matrix4.js";
import { Vector3 } from "./Vector3.js";

export class ScalingMatrix extends Matrix4
{
    public constructor(scale: Vector3)
    {
        super();
        this.identity();

        this[0] = scale.x;
        this[5] = scale.y;
        this[10] = scale.z;
    }
}