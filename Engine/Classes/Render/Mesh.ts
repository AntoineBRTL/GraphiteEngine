import { fileReader, objLoader } from "../../Graphite.js";
import { Vertex } from "./Vertex.js";

export class Mesh
{
    /** POSITION, UV, NORMAL */
    private vertices: number[];

    private vertexBuffer: GPUBuffer | null;

    public constructor()
    {
        this.vertices = new Array();
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

    public addVertex(...vertex: Vertex[]): void
    {
        for(let vert of vertex)
        {
            this.vertices.push(...vert.getPosition());
            this.vertices.push(...vert.getUV());
            this.vertices.push(...vert.getNormal());
        }
    }

    public setVertices(vertices: number[]): void
    {
        this.vertices = vertices;
    }

    public getVertices(): number[]
    {
        return this.vertices;
    }

    private reset(): void
    {
        this.vertexBuffer = null;
    }

    protected async from(path: string): Promise<void>
    {
        let obj: string = await fileReader.readFileAsync(path);
        objLoader.load(obj, this);
        this.reset();
    }

    protected fromString(content: string): void
    {
        objLoader.load(content, this);
        this.reset();
    }

    public static async from(path: string): Promise<Mesh>
    {
        let mesh = new Mesh();
        await mesh.from(path);
        return mesh;
    }

    public static fromString(content: string): Mesh
    {
        let mesh: Mesh;
        mesh = new Mesh();
        objLoader.load(content, mesh);
        return mesh;
    }
}