import { objLoader } from "../../GraphicEngine.js";
import { Vector3 } from "../Math/Vector3.js";

export class WebGPUMesh
{
    private vertices: number[];
    private normals: number[];
    private uvs: number[];
    private indices: number[] | null;

    private vertexBuffer: GPUBuffer | null;

    public constructor()
    {
        this.vertices = new Array();
        this.normals = new Array();
        this.uvs = new Array();
        this.indices = null;

        this.vertexBuffer = null;
    }

    public getVertexBuffer(device: GPUDevice): GPUBuffer
    {
        let vertexBuffer = this.vertexBuffer;
        if(!vertexBuffer)
            vertexBuffer = this.generateVertexBuffer(device, this.vertices);
        return vertexBuffer;
    }

    private generateVertexBuffer(device: GPUDevice, t: number[]): GPUBuffer
    {
        let tf = new Float32Array(t);
        let buffer = device.createBuffer(
            {
                size: tf.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
                // mappedAtCreation: true
            }
        );
        // new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
        // vertexBuffer.unmap();
        device.queue.writeBuffer(buffer, 0, tf);

        this.vertexBuffer = buffer;
        return buffer;
    }

    public addVertexAsNumbers(...x: number[]): void
    {
        this.vertices.push(...x);
    }

    public addUVAsNumbers(...x: number[]): void
    {
        this.uvs.push(...x);
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

    protected from(path: string): void
    {
        // this.reset();

        objLoader.load(path, this, function(this:WebGPUMesh)
        {
            this.vertexBuffer = null;
            // this.consolidateVertices();
            // this.consolidateNormals();
        }.bind(this));
    }
}