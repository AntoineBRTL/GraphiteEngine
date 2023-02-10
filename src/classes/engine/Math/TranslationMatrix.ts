import { Matrix4 } from "./Matrix4.js";
import { Vector3 } from "./Vector3.js";

export class TranslationMatrix extends Matrix4
{
    public constructor(location: Vector3)
    {
        super();

        this.a41 = location.x;
        this.a42 = location.y;
        this.a43 = location.z;
    }
}