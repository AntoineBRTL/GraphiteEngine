import { objLoader } from "../../GraphicEngine.js";
import { Vector3 } from "../Math/Vector3.js";

export class Mesh
{
    private vertices: number[];
    private normals: number[];
    private indices: number[] | null;

    /** due to some memory leaks, pregenerated float32array(s) are not use by the renderer */
    // private verticesFloat32Array: Float32Array | null;
    // private normalsFloat32Array: Float32Array | null;

    public constructor()
    {
        this.vertices = new Array();
        this.normals = new Array();
        this.indices = null;

        // this.verticesFloat32Array = null;
        // this.normalsFloat32Array = null;
    }

    // private consolidateVertices(): Float32Array
    // {
    //     this.verticesFloat32Array = new Float32Array(this.vertices);
    //     return this.verticesFloat32Array;
    // }

    // private consolidateNormals(): Float32Array
    // {
    //     this.normalsFloat32Array = new Float32Array(this.normals);
    //     return this.normalsFloat32Array;
    // }

    // private deconsolidate(): void
    // {
    //     this.verticesFloat32Array = null;
    //     this.normalsFloat32Array = null;
    // }

    public addVertexAsNumbers(...x: number[]): void
    {
        // this.deconsolidate();
        this.vertices.push(...x);
    }

    public addNormalAsNumbers(...x: number[]): void
    {
        // this.deconsolidate();
        this.normals.push(...x);
    }

    public addVertex(...vertex: Vector3[]): void
    {
        // this.deconsolidate();
        for(let vert of vertex)
        {
            this.vertices.push(vert.x);
            this.vertices.push(vert.y);
            this.vertices.push(vert.z);
        }
    }

    public addNormal(...normal: Vector3[]): void
    {
        // this.deconsolidate();
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
        // this.deconsolidate();
        this.vertices = vertices;
    }

    public setNormals(normals: number[]): void
    {
        // this.deconsolidate();
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
        // this.deconsolidate();
        this.vertices = new Array();
        this.indices = null;
    }

    /** TODO: change the access modifier to protected, which force developpers to write sub classes for generic meshes*/
    public from(path: string): void
    {
        this.reset();

        objLoader.load(path, this, function(this:Mesh)
        {
            // this.consolidateVertices();
            // this.consolidateNormals();
        }.bind(this));
    }
}