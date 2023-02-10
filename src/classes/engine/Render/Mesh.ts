import { Vector3 } from "../Math/Vector3.js";

export class Mesh
{
    private vertices: number[];
    private indices: number[] | null;

    public constructor()
    {
        this.vertices = new Array();
        this.indices = null;
    }

    public add(...vertex: Vector3[]): void
    {
        for(let vert of vertex)
        {
            this.vertices.push(vert.x);
            this.vertices.push(vert.y);
            this.vertices.push(vert.z);
        }
    }

    public setIndices(indices: number[]): void
    {
        this.indices = indices;
    }

    public setVertices(vertices: number[]): void
    {
        this.vertices = vertices;
    }

    public getVertices(): number[]
    {
        return this.vertices;
    }

    public getIndices(): number[] | null
    {
        return this.indices;
    }
}