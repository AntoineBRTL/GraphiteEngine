import { Vector3 } from "../Math/Vector3.js";

export class Vertex
{
    private position: Vector3;
    private normal: Vector3;
    private uv: Vector3;

    public constructor(position: Vector3);
    public constructor(position: Vector3, normal?: Vector3);
    public constructor(position: Vector3, normal?: Vector3, uv?: Vector3);
    public constructor(position: Vector3, normal?: Vector3, uv?: Vector3)
    {
        this.position = position;
        this.normal = normal || new Vector3();
        this.uv = uv || new Vector3();
    }

    public getPosition(): Vector3 { return this.position; }
    public getNormal(): Vector3 { return this.normal; }
    public getUV(): Vector3 { return this.uv; }
}