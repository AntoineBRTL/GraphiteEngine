import { Matrix4 } from "./Matrix4.js";

export class RotationzMatrix extends Matrix4
{
    public constructor(theta: number)
    {
        super();

        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        this.a11 = cos;
        this.a12 = -sin;
        this.a21 = sin;
        this.a22 = cos;
    }
}