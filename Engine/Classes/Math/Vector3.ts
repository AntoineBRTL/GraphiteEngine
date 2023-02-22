import { Matrix4 } from "./Matrix4.js";

export class Vector3 extends Float32Array
{
    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public get z(): number { return this[2]; }

    public set x(x:number) { this[0] = x; }
    public set y(y:number) { this[1] = y; }
    public set z(z:number) { this[2] = z; }

    public constructor();
    public constructor(x: number, y: number, z: number);
    public constructor(x?: number, y?: number, z?: number)
    {
        super(3);
        this[0] = x || 0.0;
        this[1] = y || 0.0;
        this[2] = z || 0.0;
    }

    public dot(vector: Vector3): number
    {
        return this[0] * vector[0] + this[1] * vector[1] + this[2] * vector[2];
    }

    public getMagnitude(): number
    {
        return Math.sqrt(this.dot(this));
    }

    public add(vector: Vector3): Vector3
    {
        return new Vector3(this[0] + vector[0], this[1] + vector[1], this[2] + vector[2]);
    }

    public scale(x: number): Vector3
    {
        return new Vector3(this[0] * x, this[1] * x, this[2] * x);
    }

    public substract(vector: Vector3): Vector3
    {
        return this.add(vector.scale(-1));
    }

    public divide(x: number): Vector3
    {
        return this.scale(1 / x);
    }

    public product(vector: Vector3): Vector3
    {
        return new Vector3(this[0] * vector[0], this[1] * vector[1], this[2] * vector[2]);
    }

    public matrixProduct(matrix: Matrix4): Vector3
    {
		let w = 1 / ( matrix[ 3 ] * this[0] + matrix[ 7 ] * this[1] + matrix[ 11 ] * this[2] + matrix[ 15 ] );

        return new Vector3(
            (matrix[ 0 ] * this[0] + matrix[ 4 ] * this[1] + matrix[ 8 ] * this[2] + matrix[ 12 ]) * w,
            (matrix[ 1 ] * this[0] + matrix[ 5 ] * this[1] + matrix[ 9 ] * this[2] + matrix[ 13 ]) * w,
            (matrix[ 2 ] * this[0] + matrix[ 6 ] * this[1] + matrix[ 10 ] * this[2] + matrix[ 14 ]) * w
        );
    }

    public cross(vector: Vector3): Vector3
    {
        return new Vector3(
            this[1] * vector[2] - this[2] * vector[1], 
            this[2] * vector[0] - this[0] * vector[2],
            this[0] * vector[1] - this[1] * vector[0]
        );
    }
}