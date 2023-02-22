import { Matrix4 } from "./Matrix4.js";
import { Vector3 } from "./Vector3.js";

export class TranslationMatrix extends Matrix4
{
    public constructor(location: Vector3)
    {
        super();

        this[0] = 1.0;
        this[1] = 0.0;
        this[2] = 0.0;
        this[3] = 0.0;
        this[4] = 0.0;
        this[5] = 1.0;
        this[6] = 0.0;
        this[7] = 0.0;
        this[8] = 0.0;
        this[9] = 0.0;
        this[10] = 1.0;
        this[11] = 0.0;
        this[12] = location.x;
        this[13] = location.y;
        this[14] = location.z;
        this[15] = 1.0;
    }
}