import { Actor } from "../Entity/Actor.js";
import { Camera } from "../Entity/Camera.js";
import { RenderingCanvas } from "./RenderingCanvas.js";

export class Renderer
{
    protected renderingCanvas: RenderingCanvas;
    protected gl: WebGL2RenderingContext;
    private primitiveType: number;

    public setPremitiveType(premitiveType: number): void
    {
        this.primitiveType = premitiveType;
    }

    public constructor()
    {
        this.renderingCanvas = new RenderingCanvas();
        this.renderingCanvas.displayCanvas();
        this.renderingCanvas.resize();
        window.addEventListener("resize", this.resize.bind(this));
        let tmpgl = this.renderingCanvas.generateGlContext();
        if(!tmpgl) throw new Error("can't create GL context");
        this.gl = tmpgl;

        this.gl.clearColor(0.09, 0.09, 0.09, 1.0);

        this.primitiveType = WebGL2RenderingContext.LINE_STRIP;
    }

    private resize(): void
    {
        this.renderingCanvas.resize();
        let canvas = this.renderingCanvas.getCanvas();
        this.gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    }

    protected clear(): void
    {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    protected renderActor(actor: Actor, camera: Camera)
    {
        let material = actor.getMaterial();

        let program = material.getProgram();
        if(!program)
        {
            material.compile(this.gl);
            return;
        }

        let mesh = actor.getMesh();
        let vertices = mesh.getVertices();
        
        this.gl.useProgram(program);
        this.bufferAttribute('vertexPosition', vertices, program);
        this.uniformMatrix('mObject', actor.getTransform().getTransformationMatrix().toArray(), program);
        this.uniformMatrix('mView', camera.getTransform().getViewTransformationMatrix().toArray(), program);
        this.uniformMatrix('mProj', camera.getProjectionMatrix().toArray(), program);
        this.uniformFloat('width', this.renderingCanvas.getCanvas().width, program);
        this.uniformFloat('height', this.renderingCanvas.getCanvas().height, program);
        this.onSettingAttribute(program);

        let indices = mesh.getIndices();

        if(!indices)
        {
            this.gl.drawArrays(this.primitiveType, 0, vertices.length);
            return;
        }
        
        this.bufferIndices(indices);
        this.gl.drawElements(this.primitiveType, indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    private getUniformLoaction(name: string, program: WebGLProgram): WebGLUniformLocation | null
    {
        return this.gl.getUniformLocation(program, name);
    }

    protected uniformMatrix(name: string, value: number[], program: WebGLProgram): void
    {
        this.gl.uniformMatrix4fv(this.getUniformLoaction(name, program), false, new Float32Array(value));
    }

    protected uniformFloat(name: string, value: number, program: WebGLProgram): void
    {
        this.gl.uniform1f(this.getUniformLoaction(name, program), value);
    }

    public onSettingAttribute(program: WebGLProgram): void {}

    protected bufferAttribute(name: string, value: number[], program: WebGLProgram): void
    {
        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(value), this.gl.STATIC_DRAW);

        let location = this.gl.getAttribLocation(program, name);
        this.gl.vertexAttribPointer(location, 3, this.gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
        this.gl.enableVertexAttribArray(location);
    }

    protected bufferIndices(indices: number[]): void
    {
        let buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    }

    public render(actors: Actor[], camera: Camera): void
    {
        this.clear();

        for(let actor of actors)
        {
            if(actor != camera)
                this.renderActor(actor, camera);
        }
    }

    public getRenderingCanvas(): RenderingCanvas
    {
        return this.renderingCanvas;
    }
}