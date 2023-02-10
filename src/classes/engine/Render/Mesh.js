export class Mesh {
    constructor() {
        this.vertices = new Array();
        this.indices = null;
    }
    add(...vertex) {
        for (let vert of vertex) {
            this.vertices.push(vert.x);
            this.vertices.push(vert.y);
            this.vertices.push(vert.z);
        }
    }
    setIndices(indices) {
        this.indices = indices;
    }
    setVertices(vertices) {
        this.vertices = vertices;
    }
    getVertices() {
        return this.vertices;
    }
    getIndices() {
        return this.indices;
    }
}
