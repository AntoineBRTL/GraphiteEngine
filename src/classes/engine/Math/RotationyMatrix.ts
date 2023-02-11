import { Matrix4 } from "./Matrix4.js";

export class RotationyMatrix extends Matrix4
{
    public constructor(theta: number)
    {
        super();

        let cos = Math.cos(theta);
        let sin = Math.sin(theta);

        this[0] = cos;
        this[2] = sin;
        this[8] = -sin;
        this[10] = cos;
    }
}