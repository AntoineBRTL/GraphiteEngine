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
        this.x = x || 0.0;
        this.y = y || 0.0;
        this.z = z || 0.0;
    }

    public dot(vector: Vector3): number
    {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    public getMagnitude(): number
    {
        return Math.sqrt(this.dot(this));
    }

    public add(vector: Vector3): Vector3
    {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    public scale(x: number): Vector3
    {
        return new Vector3(this.x * x, this.y * x, this.z * x);
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
        return new Vector3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
    }

    public matrixProduct(matrix: Matrix4): Vector3
    {
		let w = 1 / ( matrix[ 3 ] * this.x + matrix[ 7 ] * this.y + matrix[ 11 ] * this.z + matrix[ 15 ] );

        return new Vector3(
            ( matrix[ 0 ] * this.x + matrix[ 4 ] * this.y + matrix[ 8 ] * this.z + matrix[ 12 ] ) * w,
            ( matrix[ 1 ] * this.x + matrix[ 5 ] * this.y + matrix[ 9 ] * this.z + matrix[ 13 ] ) * w,
            ( matrix[ 2 ] * this.x + matrix[ 6 ] * this.y + matrix[ 10 ] * this.z + matrix[ 14 ] ) * w
        );
    }

    public cross(vector: Vector3): Vector3
    {
        return new Vector3(
            this.y * vector.z - this.z * vector.y, 
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
    }
}