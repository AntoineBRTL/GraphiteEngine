import { Engine } from "../../Graphite.js";
import { Vertex } from "./Vertex.js";

export class Mesh
{
    /** POSITION, UV, NORMAL */
    private vertices: number[];

    private vertexBuffer: GPUBuffer;

    public constructor(vertices: Array<number> = [])
    {
        this.vertices       = vertices;
        this.vertexBuffer   = this.generateVertexBuffer();
    }

    public getVertexBuffer(): GPUBuffer
    {
        return this.vertexBuffer;
    }

    private generateVertexBuffer(): GPUBuffer
    {
        let device = Engine.getRenderer().getDevice();
        let tf = new Float32Array(this.vertices);
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

    public static async from(path: string): Promise<Mesh>
    {
        let obj: string = await Engine.getFileReader().readFileAsync(path);
        return Engine.getObjLoader().load(obj);
    }

    public static fromString(content: string): Mesh
    {
        return Engine.getObjLoader().load(content);
    }
}