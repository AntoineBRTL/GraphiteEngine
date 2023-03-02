import { Matrix4 } from "./Matrix4.js";

export class Vector4 extends Float32Array
{
    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public get z(): number { return this[2]; }
    public get w(): number { return this[3]; }

    public set x(x:number) { this[0] = x; }
    public set y(y:number) { this[1] = y; }
    public set z(z:number) { this[2] = z; }
    public set w(w:number) { this[3] = w; }

    public constructor();
    public constructor(x: number, y: number, z: number, w: number);
    public constructor(x?: number, y?: number, z?: number, w?: number)
    {
        super(4);
        this[0] = x || 0.0;
        this[1] = y || 0.0;
        this[2] = z || 0.0;
        this[3] = w || 0.0;
    }

    public dot(vector: Vector4): number
    {
        return this[0] * vector[0] + this[1] * vector[1] + this[2] * vector[2] + this[3] * vector[3];
    }

    public getMagnitude(): number
    {
        return Math.sqrt(this.dot(this));
    }

    public add(vector: Vector4): Vector4
    {
        return new Vector4(this[0] + vector[0], this[1] + vector[1], this[2] + vector[2], this[3] + vector[3]);
    }

    public scale(x: number): Vector4
    {
        return new Vector4(this[0] * x, this[1] * x, this[2] * x, this[3] * x);
    }

    public substract(vector: Vector4): Vector4
    {
        return this.add(vector.scale(-1));
    }

    public divide(x: number): Vector4
    {
        return this.scale(1 / x);
    }

    public product(vector: Vector4): Vector4
    {
        return new Vector4(this[0] * vector[0], this[1] * vector[1], this[2] * vector[2], this[3] * vector[3]);
    }

    public distance(u: Vector4): number
    {
        return this.substract(u).getMagnitude();
    }

    public matrixProduct(m: Matrix4): Vector4
    {
        return new Vector4(
            this[0]*m[0] + this[1]*m[4] + this[2]*m[8] + this[3]*m[12],
            this[0]*m[1] + this[1]*m[5] + this[2]*m[9] + this[3]*m[13],
            this[0]*m[2] + this[1]*m[6] + this[2]*m[10] + this[3]*m[14],
            this[0]*m[3] + this[1]*m[7] + this[2]*m[11] + this[3]*m[15]
        );   
    }
}