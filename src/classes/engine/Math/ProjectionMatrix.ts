import { Matrix4 } from "./Matrix4.js";

export class ProjectionMatrix extends Matrix4
{
    public constructor(fov: number, aspect: number, near: number, far: number)
    {
        super();

        let f = 1.0 / Math.tan(fov / 2.0);
        let nf = 1.0 / (near - far);

        this.a11 = -f / aspect;
        this.a22 = -f;
        this.a33 = (far + near) * nf;
        this.a34 = -1;
        this.a43 = (2.0 * far * near) * nf;
    }
}