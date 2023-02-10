export class Shader {
    constructor(source, glType) {
        this.source = source;
        this.glShader = null;
        this.glType = glType;
    }
    compile(gl) {
        this.glShader = gl.createShader(this.glType);
        if (!this.glShader)
            throw new Error("An error occurred while creating shader");
        gl.shaderSource(this.glShader, this.source);
        gl.compileShader(this.glShader);
        if (!gl.getShaderParameter(this.glShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(this.glShader));
            return false;
        }
        return true;
    }
    getGlShader() {
        return this.glShader;
    }
}
