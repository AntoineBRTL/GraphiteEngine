export class Vector3 {
    constructor(x, y, z) {
        this.x = x || 0.0;
        this.y = y || 0.0;
        this.z = z || 0.0;
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }
    getMagnitude() {
        return Math.sqrt(this.dot(this));
    }
    add(vector) {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }
    scale(x) {
        return new Vector3(this.x * x, this.y * x, this.z * x);
    }
    substract(vector) {
        return this.add(vector.scale(-1));
    }
    divide(x) {
        return this.scale(1 / x);
    }
    product(vector) {
        return new Vector3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
    }
    cross(vector) {
        return new Vector3(this.y * vector.z - this.z * vector.y, this.z * vector.x - this.x * vector.z, this.x * vector.y - this.y * vector.x);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
}
