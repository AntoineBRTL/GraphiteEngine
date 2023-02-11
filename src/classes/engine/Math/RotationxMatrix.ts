import { Matrix4 } from "./Matrix4.js";

export class RotationxMatrix extends Matrix4
{
    public constructor(theta: number)
    {
        super();

        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        this[5] = cos;
        this[6] = -sin;
        this[9] = sin;
        this[10] = cos;
    }
}