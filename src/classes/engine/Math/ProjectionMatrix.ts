import { Matrix4 } from "./Matrix4.js";

export class ProjectionMatrix extends Matrix4
{
    public constructor(fov: number, aspect: number, near: number, far: number)
    {
        super();

        let f = 1.0 / Math.tan(fov / 2.0);
        let nf = 1.0 / (near - far);

        this[0] = -f / aspect;
        this[5] = -f;
        this[10] = (far + near) * nf;
        this[11] = -1;
        this[14] = (2.0 * far * near) * nf;

        // let t = Math.tan(fov / 2.0);
        // this[0] = 1.0 / (aspect * t);
        // this[5] = 1.0 / t;
        // this[10] = -(far + near) / (far - near);
        // this[14] = (-2 * (far + near)) / (far - near);
        // this[11] = -1;

        // let f = Math.tan(fov / 2.0);

        // this[0] = f / aspect;
        // this[5] = f;
        // this[10] = (far + near) / (far - near);
        // this[11] = (2 * (far + near)) / (far - near);
        // this[14] = -1;

        // this[0] = f / aspect;
        // this[5] = f;
        // this[10] = far * nf;
        // this[11] = -1;
        // this[14] = far * near * nf;
    }
}