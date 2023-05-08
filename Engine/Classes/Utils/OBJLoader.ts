import { Mesh } from "../Render/Mesh.js";
import { FileReader } from "./FileReader.js";

export class OBJLoader{

    public load(obj: string): Mesh
    {
        let lines: Array<string>;
        let vertexPositions: Array<Array<number>>;
        let vertexNormals: Array<Array<number>>;
        let vertexUVs: Array<Array<number>>;
        let vertices: Array<number>;

        lines               = obj.split("\n");
        vertexPositions     = new Array();
        vertexNormals       = new Array();
        vertexUVs           = new Array(); 
        vertices            = new Array();

        for(let line of lines)
        {
            let name: string;
            let value: string[];

            value = line.replace("\r", "").split(" ");
            name = value.shift() || "";

            if(name == "v")
            {
                let vertexPosition: Array<number> = new Array<number>();

                for(let coordinate of value)
                    vertexPosition.push(parseFloat(coordinate));

                vertexPositions.push(vertexPosition);
                continue;
            }

            if(name == "vt")
            {
                let vertexTexture: Array<number> = new Array<number>();

                for(let coordinate of value)
                    vertexTexture.push(parseFloat(coordinate));

                vertexUVs.push(vertexTexture);
                continue;
            }

            if(name == "vn")
            {
                let vertexNormal: Array<number> = new Array<number>();

                for(let coordinate of value)
                    vertexNormal.push(parseFloat(coordinate));

                vertexNormals.push(vertexNormal);
                continue;
            }

            if(name == "f")
            {
                function setIndice(indices: string[])
                {
                    let vertexPositionIndex = parseInt(indices[0]) - 1;
                    let vertexUVIndex = parseInt(indices[1]) - 1;
                    let vertexNormalIndex = parseInt(indices[2]) - 1;

                    vertices.push(...vertexPositions[vertexPositionIndex || 0]);
                    vertices.push(...vertexUVs[vertexUVIndex || 0]);
                    vertices.push(...vertexNormals[vertexNormalIndex || 0]);
                }

                /** TRIANGLES */
                if(value.length == 3)
                {
                    let indices_0: Array<string> = value[0].split("/");
                    let indices_1: Array<string> = value[1].split("/");
                    let indices_2: Array<string> = value[2].split("/");

                    setIndice(indices_0);
                    setIndice(indices_1);
                    setIndice(indices_2);

                    continue;
                }

                /** QUADS */
                if(value.length == 4)
                {
                    let indices_0: Array<string> = value[0].split("/");
                    let indices_1: Array<string> = value[1].split("/");
                    let indices_2: Array<string> = value[2].split("/");
                    let indices_3: Array<string> = value[3].split("/");

                    setIndice(indices_0);
                    setIndice(indices_1);
                    setIndice(indices_2);
                    setIndice(indices_0);
                    setIndice(indices_3);
                    setIndice(indices_2);

                    continue;
                }

                console.error("n-gons with n > 4 are not supported, please use Blender and triangulate your model");    
            }
        }

        return new Mesh(vertices);
    }
}