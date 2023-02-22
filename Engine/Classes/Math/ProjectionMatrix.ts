import { Matrix4 } from "./Matrix4.js";

export class ProjectionMatrix extends Matrix4
{
    public constructor(fov: number, aspect: number, near: number, far: number)
    {
        super();

        let f = 1.0 / Math.tan(fov / 2);
        this[0] = f / aspect;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = f;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[11] = -1;
        this[12] = 0;
        this[13] = 0;
        this[15] = 0;
        
        if (far != null && far !== Infinity) 
        {
            let nf = 1 / (near - far);

            this[10] = far * nf;
            this[14] = far * near * nf;
        } 
        else 
        {
            this[10] = -1;
            this[14] = -near;
        }
    }
}