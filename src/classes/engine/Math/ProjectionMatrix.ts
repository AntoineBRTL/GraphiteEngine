import { Matrix4 } from "./Matrix4.js";

export class ProjectionMatrix extends Matrix4
{
    public constructor(fov: number, aspect: number, near: number, far: number)
    {
        super();

        let f = 1.0 / Math.tan(fov / 2.0);
        let f2 = 1.0 / (Math.tan(fov / 2.0) * aspect);
        let nf = 1.0 / (near - far);

        this[0] = -f / aspect;
        this[5] = -f;
        this[10] = (far + near) * nf;
        this[11] = -1;
        this[14] = (2.0 * far * near) * nf;
    }
}