import { Matrix4 } from "./Matrix4.js";
import { Vector3 } from "./Vector3.js";

export class TranslationMatrix extends Matrix4
{
    public constructor(location: Vector3)
    {
        super();
        this.identity();

        this[12] = location.x;
        this[13] = location.y;
        this[14] = location.z;
    }
}