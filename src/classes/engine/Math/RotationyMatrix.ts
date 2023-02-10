import { Matrix4 } from "./Matrix4.js";

export class RotationyMatrix extends Matrix4
{
    public constructor(theta: number)
    {
        super();

        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        this.a11 = cos;
        this.a13 = sin;
        this.a31 = -sin;
        this.a33 = cos;
    }
}