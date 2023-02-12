import { objLoader } from "../../GraphicEngine.js";
import { Vector3 } from "../Math/Vector3.js";

export class WebGPUMesh
{
    private vertices: number[];
    private normals: number[];
    private indices: number[] | null;

    private vertexBuffer: GPUBuffer | null;

    public constructor()
    {
        this.vertices = new Array();
        this.normals = new Array();
        this.indices = null;

        this.vertexBuffer = null;
    }

    public getVertexBuffer(device: GPUDevice): GPUBuffer
    {
        let vertexBuffer = this.vertexBuffer;
        if(!vertexBuffer)
            vertexBuffer = this.generateVertexBuffer(device);
        return vertexBuffer;
    }

    private generateVertexBuffer(device: GPUDevice): GPUBuffer
    {
        let vertices = new Float32Array(this.vertices);
        let vertexBuffer = device.createBuffer(
            {
                size: vertices.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
                // mappedAtCreation: true
            }
        );
        // new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
        // vertexBuffer.unmap();
        device.queue.writeBuffer(vertexBuffer, 0, vertices);

        this.vertexBuffer = vertexBuffer;
        return vertexBuffer;
    }

    public addVertexAsNumbers(...x: number[]): void
    {
        this.vertices.push(...x);
    }

    public addNormalAsNumbers(...x: number[]): void
    {
        this.normals.push(...x);
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

    public addIndice(i: number): void
    {
        if(!this.indices)
            this.indices = new Array();
        this.indices.push(i);
    }

    public setVertices(vertices: number[]): void
    {
        this.vertices = vertices;
    }

    public setNormals(normals: number[]): void
    {
        this.normals = normals;
    }

    public setIndices(indices: number[]): void
    {
        this.indices = indices;
    }


    public getVertices(): number[]
    {
        return this.vertices;
    }

    public getNormals(): number[]
    {
        return this.normals;
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

    protected from(path: string): void
    {
        this.reset();

        objLoader.load(path, this, function(this:WebGPUMesh)
        {
            this.vertexBuffer = null;
            // this.consolidateVertices();
            // this.consolidateNormals();
        }.bind(this));
    }
}