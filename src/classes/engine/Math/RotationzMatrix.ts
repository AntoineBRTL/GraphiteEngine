import { Matrix4 } from "./Matrix4.js";

export class RotationzMatrix extends Matrix4
{
    public constructor(theta: number)
    {
        super();

        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        this[0] = cos;
        this[1] = -sin;
        this[4] = sin;
        this[5] = cos;
    }
}