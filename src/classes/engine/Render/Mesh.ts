import { objLoader } from "../../GraphicEngine.js";
import { Vector3 } from "../Math/Vector3.js";

export class Mesh
{
    private vertices: number[];
    private normals: number[];
    private indices: number[] | null;

    public constructor()
    {
        this.vertices = new Array();
        this.normals = new Array();
        this.indices = null;
    }

    public addVertexAsNumbers(...x: number[]): void
    {
        this.vertices.push(...x);
    }

    public addNormalAsNumbers(...x: number[]): void
    {
        this.normals.push(...x);
    }

    public addIndice(i: number): void
    {
        if(!this.indices)
            this.indices = new Array();
        this.indices.push(i);
    }

    public addVertex(...vertex: Vector3[]): void
    {
        for(let vert of vertex)
        {
            this.vertices.push(vert.x);
            this.vertices.push(vert.y);
            this.vertices.push(vert.z);
        }
    }

    public addNormal(...normal: Vector3[]): void
    {
        for(let norm of normal)
        {
            this.normals.push(norm.x);
            this.normals.push(norm.y);
            this.normals.push(norm.z);
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

    private reset(): void
    {
        this.vertices = new Array();
        this.indices = null;
    }

    public from(path: string): void
    {
        this.reset();

        objLoader.load(path, this);
    }
}