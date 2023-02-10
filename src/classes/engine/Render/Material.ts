import { Shader } from "./Shader.js";

let vss = `#version 300 es
precision mediump float;
in vec3 vertexPosition;
in vec3 vertexNormal;

uniform mat4 mObject;
uniform mat4 mView;
uniform mat4 mProj;

out vec3 normal;

void main(){
    normal = normalize(mat3(mObject) * vertexNormal);
    gl_Position = mProj * mView * mObject * vec4(vertexPosition.x, -vertexPosition.y, vertexPosition.z, 1.0);
}
`;

let fss = `#version 300 es
precision mediump float;
layout(location = 0) out vec4 out1;

uniform float width;
uniform float height;

in vec3 normal;

vec3 computeDirectionalLigth(vec3 color)
{
    vec3 sunDir = vec3(-1.0, 1.0, 0.0);
    return color * max(0.0, dot(normal, sunDir));
}

void main(){
    vec2 resolution = vec2(width, height);
    // out1 = vec4(vec3(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y, 1.0), 1.0);
    vec3 color = computeDirectionalLigth(vec3(0.1, 0.1, 0.1));
    out1 = vec4(color, 1.0);
}
`;

export class Material
{
    private vertexShader: Shader;
    private fragmentShader: Shader;
    private program: WebGLProgram | null;

    public constructor()
    {
        this.vertexShader = new Shader(vss, WebGL2RenderingContext.VERTEX_SHADER);
        this.fragmentShader = new Shader(fss, WebGL2RenderingContext.FRAGMENT_SHADER);
        this.program = null;
    }

    public compile(gl: WebGL2RenderingContext): boolean
    {
        if(!this.vertexShader.compile(gl))
            return false;
        
        if(!this.fragmentShader.compile(gl))
            return false;

        this.program = gl.createProgram();
        if(!this.program)
            throw new Error("An error occurred while creating program");

        let vertexGlShader = this.vertexShader.getGlShader();
        if(!vertexGlShader)
            return false;

        let fragmentGlShader = this.fragmentShader.getGlShader();
        if(!fragmentGlShader)
            return false;

        gl.attachShader(this.program, vertexGlShader);
        gl.attachShader(this.program, fragmentGlShader);
        gl.linkProgram(this.program);
        return true;
    }

    public getVertexShader(): Shader
    {
        return this.vertexShader;
    }

    public getFragmentShader(): Shader
    {
        return this.fragmentShader;
    }

    public getProgram(): WebGLProgram | null
    {
        return this.program;
    }
}