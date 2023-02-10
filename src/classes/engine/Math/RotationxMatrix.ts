import { Matrix4 } from "./Matrix4.js";

export class RotationxMatrix extends Matrix4
{
    public constructor(theta: number)
    {
        super();

        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        this.a22 = cos;
        this.a23 = -sin;
        this.a32 = sin;
        this.a33 = cos;
    }
}