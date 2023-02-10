import { Transform } from "../Math/Transform.js";
import { Material } from "../Render/Material.js";
import { Mesh } from "../Render/Mesh.js";
export class Actor {
    constructor() {
        Actor.actors.push(this);
        this.transform = new Transform();
        this.mesh = new Mesh();
        this.material = new Material();
    }
    update() { }
    ;
    static getActors() {
        return Actor.actors;
    }
    getMesh() {
        return this.mesh;
    }
    getMaterial() {
        return this.material;
    }
    getTransform() {
        return this.transform;
    }
}
Actor.actors = [];
