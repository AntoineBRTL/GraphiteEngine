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

            let vertices: number[][] = new Array();
            let normals: number[][] = new Array();
            let uvs: number[][] = new Array();

            // read all the lines 
            let lines = objFileContent.split("\n");
            lines.forEach(function(line: string) 
            {
                let splitedLine = line.replace("\r", "").split(" ");
                let name = splitedLine.shift();

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
                    function setIndice(i: number)
                    {
                        let indices = splitedLine[i].split("/");
                        let vi = parseInt(indices[0]) - 1;
                        let ti = parseInt(indices[1]) - 1;
                        let ni = parseInt(indices[2]) - 1;

                        mesh.addVertexAsNumbers(...vertices[vi]);
                        mesh.addVertexAsNumbers(...uvs[ti]);
                        mesh.addVertexAsNumbers(...normals[ni]);
                    }
                    
                    setIndice(0);
                    setIndice(1);
                    setIndice(2);

                    if(splitedLine.length == 4)
                    {
                        setIndice(0);
                        setIndice(3);
                        setIndice(2);
                    }

                    return;
                }
            });
            
            callback();
        });
    }
}