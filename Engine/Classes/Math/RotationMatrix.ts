import { Matrix4 } from "./Matrix4.js";
import { Vector3 } from "./Vector3.js";

export class RotationMatrix extends Matrix4
{
    public constructor(axis: Vector3)
    {
        super();

        let radScalar: number;
        let phi: number;
        let theta: number;
        let psi: number;
        let cosPhi: number;
        let sinPhi: number;
        let cosTheta: number;
        let sinTheta: number;
        let cosPsi: number;
        let sinPsi: number;

        radScalar = Math.PI / 180.0;
        phi = axis.x * radScalar;
        theta = axis.y * radScalar;
        psi = axis.z * radScalar;

        // TODO: OPTIMIZE SIN() COMPUTATION USING COS()
        cosPhi = Math.cos(phi);
        sinPhi = Math.sin(phi);
        cosTheta = Math.cos(theta);
        sinTheta = Math.sin(theta);
        cosPsi = Math.cos(psi);
        sinPsi = Math.sin(psi);

        this[0] = cosTheta * cosPsi;
        this[1] = -cosPhi * sinPsi + sinPhi * sinTheta * cosPsi;
        this[2] = sinPhi * sinPsi + cosPhi * sinTheta * cosPsi;
        this[3] = 0;
        this[4] = cosTheta * sinPsi;
        this[5] = cosPhi * cosPsi + sinPhi * sinTheta * sinPsi;
        this[6] = -sinPhi * cosPsi + cosPhi * sinTheta * sinPsi;
        this[7] = 0;
        this[8] = -sinTheta;
        this[9] = sinPhi * cosTheta;
        this[10] = cosPhi * cosTheta;
        this[11] = 0;
        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;
    }
}