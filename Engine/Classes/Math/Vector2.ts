export class Vector2 extends Float32Array
{
    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }

    public set x(x:number) { this[0] = x; }
    public set y(y:number) { this[1] = y; }

    public constructor();
    public constructor(x: number, y: number);
    public constructor(x?: number, y?: number)
    {
        super(2);
        this[0] = x || 0.0;
        this[1] = y || 0.0;
    }

    public dot(vector: Vector2): number
    {
        return this[0] * vector[0] + this[1] * vector[1];
    }

    public getMagnitude(): number
    {
        return Math.sqrt(this.dot(this));
    }

    public add(vector: Vector2): Vector2
    {
        return new Vector2(this[0] + vector[0], this[1] + vector[1]);
    }

    public scale(x: number): Vector2
    {
        return new Vector2(this[0] * x, this[1] * x);
    }

    public substract(vector: Vector2): Vector2
    {
        return this.add(vector.scale(-1));
    }

    public divide(x: number): Vector2
    {
        return this.scale(1 / x);
    }

    public product(vector: Vector2): Vector2
    {
        return new Vector2(this[0] * vector[0], this[1] * vector[1]);
    }

    public normalize(): Vector2
    {
        return this.divide(this.getMagnitude());
    }

    public cross(vector: Vector2): Vector2
    {
        return new Vector2(
            this[0] * vector[1] - this[1] * vector[0], 
            this[1] * vector[0] - this[0] * vector[1],
        );
    }

    public distance(u: Vector2): number
    {
        return this.substract(u).getMagnitude();
    }
}