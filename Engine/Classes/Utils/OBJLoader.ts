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

                        mesh.addVertexAsNumbers(...vertices[vi]);
                        mesh.addVertexAsNumbers(...uvs[ti]);
                        mesh.addVertexAsNumbers(...normals[ni]);
                    }
                    
                    let indices_0: string[];
                    let indices_1: string[];
                    let indices_2: string[];

                    indices_0 = splitedLine[0].split("/");
                    indices_1 = splitedLine[1].split("/");
                    indices_2 = splitedLine[2].split("/");

                    setIndice(indices_0);
                    setIndice(indices_1);
                    setIndice(indices_2);

                    if(splitedLine.length < 4) return;

                    let indices_3: string[];
                    indices_3 = splitedLine[3].split("/");

                    setIndice(indices_0);
                    setIndice(indices_3);
                    setIndice(indices_2);

                    return;
                }
            });
            
            callback();
        });
    }
}