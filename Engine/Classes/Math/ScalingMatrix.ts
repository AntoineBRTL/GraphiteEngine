import { Matrix4 } from "./Matrix4.js";
import { Vector3 } from "./Vector3.js";

export class ScalingMatrix extends Matrix4
{
    public constructor(scale: Vector3)
    {
        super();

        this[0] = scale.x;
        this[1] = 0.0;
        this[2] = 0.0;
        this[3] = 0.0;
        this[4] = 0.0;
        this[5] = scale.y;
        this[6] = 0.0;
        this[7] = 0.0;
        this[8] = 0.0;
        this[9] = 0.0;
        this[10] = scale.z;
        this[11] = 0.0;
        this[12] = 0.0;
        this[13] = 0.0;
        this[14] = 0.0;
        this[15] = 1.0;
    }
}