import { WebGPUMesh } from "../Render/WebGPUMesh.js";
import { FileReader } from "./FileReader.js";

export class OBJLoader{

    private fileReader: FileReader;

    public constructor(fileReader: FileReader)
    {
        this.fileReader = fileReader;
    }

    public load(path: string, mesh: WebGPUMesh, callback: Function){

        // read the file 
        this.fileReader.readFile(path, function(objFileContent: string){

            let lines: string[];
            let vertices: number[][];
            let normals: number[][];
            let uvs: number[][];

            vertices    = new Array();
            normals     = new Array();
            uvs         = new Array(); 
            lines       = objFileContent.split("\n");

            lines.forEach(function(line: string) 
            {
                let splitedLine: string[];
                let name: string;

                splitedLine = line.replace("\r", "").split(" ");
                name = splitedLine.shift() || "";

                if(name == "v")
                {
                    let v = new Array();
                    for(let i = 0; i < splitedLine.length; i++)
                    {
                        let coordinate = parseFloat(splitedLine[i]);
                        v.push(coordinate);
                    }

                    vertices.push(v);
                    return;
                }

                if(name == "vn")
                {
                    let n = new Array();
                    for(let i = 0; i < splitedLine.length; i++)
                    {
                        let coordinate = parseFloat(splitedLine[i]);
                        n.push(coordinate);
                    }

                    normals.push(n);
                    return;
                }

                if(name == "vt")
                {
                    let u = new Array();
                    for(let i = 0; i < splitedLine.length; i++)
                    {
                        let coordinate = parseFloat(splitedLine[i]);
                        u.push(coordinate);
                    }

                    uvs.push(u);
                    return;
                }

                if(name == "f")
                {
                    function setIndice(indices: string[])
                    {
                        let vi = parseInt(indices[0]) - 1;
                        let ti = parseInt(indices[1]) - 1;
                        let ni = parseInt(indices[2]) - 1;

                        mesh.addVertexAsNumbers(...vertices[vi || 0]);
                        mesh.addVertexAsNumbers(...uvs[ti || 0]);
                        mesh.addVertexAsNumbers(...normals[ni || 0]);
                    }

                    /** TRIANGLES */
                    if(splitedLine.length === 3)
                    {
                        setIndice(splitedLine[0].split("/"));
                        setIndice(splitedLine[1].split("/"));
                        setIndice(splitedLine[2].split("/"));
                    }

                    /** QUADS */
                    if(splitedLine.length === 4)
                    {
                        setIndice(splitedLine[0].split("/"));
                        setIndice(splitedLine[1].split("/"));
                        setIndice(splitedLine[2].split("/"));
                        setIndice(splitedLine[0].split("/"));
                        setIndice(splitedLine[3].split("/"));
                        setIndice(splitedLine[2].split("/"));
                    }

                    if(splitedLine.length > 4)
                        throw new Error("n-gons with n > 4 is not supported, please use Blender and triangulate your model");
                    
                    // let indices_0: string[];
                    // let indices_1: string[];
                    // let indices_2: string[];

                    // indices_0 = splitedLine[0].split("/");
                    // indices_1 = splitedLine[1].split("/");
                    // indices_2 = splitedLine[2].split("/");

                    // setIndice(indices_0);
                    // setIndice(indices_1);
                    // setIndice(indices_2);

                    // if(splitedLine.length < 4) return;

                    // let indices_3: string[];
                    // indices_3 = splitedLine[3].split("/");

                    // setIndice(indices_0);
                    // setIndice(indices_3);
                    // setIndice(indices_2);

                    // return;
                }
            });
            
            callback();
        });
    }
}