import { Matrix4 } from "./Matrix4.js";
export class TranslationMatrix extends Matrix4 {
    constructor(location) {
        super();
        this.a41 = location.x;
        this.a42 = location.y;
        this.a43 = location.z;
    }
}
