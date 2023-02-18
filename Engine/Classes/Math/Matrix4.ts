export class Matrix4 extends Float32Array
{
    public get a11(): number { return this[0]; }
    public get a12(): number { return this[1]; }
    public get a13(): number { return this[2]; }
    public get a14(): number { return this[3]; }
    public get a21(): number { return this[4]; }
    public get a22(): number { return this[5]; }
    public get a23(): number { return this[6]; }
    public get a24(): number { return this[7]; }
    public get a31(): number { return this[8]; }
    public get a32(): number { return this[9]; }
    public get a33(): number { return this[10]; }
    public get a34(): number { return this[11]; }
    public get a41(): number { return this[12]; }
    public get a42(): number { return this[13]; }
    public get a43(): number { return this[14]; }
    public get a44(): number { return this[15]; }
    public set a11(x:number) { this[0] = x; }
    public set a12(x:number) { this[1] = x; }
    public set a13(x:number) { this[2] = x; }
    public set a14(x:number) { this[3] = x; }
    public set a21(x:number) { this[4] = x; }
    public set a22(x:number) { this[5] = x; }
    public set a23(x:number) { this[6] = x; }
    public set a24(x:number) { this[7] = x; }
    public set a31(x:number) { this[8] = x; }
    public set a32(x:number) { this[9] = x; }
    public set a33(x:number) { this[10] = x; }
    public set a34(x:number) { this[11] = x; }
    public set a41(x:number) { this[12] = x; }
    public set a42(x:number) { this[13] = x; }
    public set a43(x:number) { this[14] = x; }
    public set a44(x:number) { this[15] = x; }

    public constructor()
    {
        super(16);

        this[0] = 1.0;
        this[1] = 0.0;
        this[2] = 0.0;
        this[3] = 0.0;

        this[4] = 0.0;
        this[5] = 1.0;
        this[6] = 0.0;
        this[7] = 0.0;

        this[8] = 0.0;
        this[9] = 0.0;
        this[10] = 1.0;
        this[11] = 0.0;

        this[12] = 0.0;
        this[13] = 0.0;
        this[14] = 0.0;
        this[15] = 1.0;
    }

    public product(matrix: Matrix4): Matrix4
    {
        let productMatrix = new Matrix4();

        productMatrix[0] = this[0] * matrix[0] + this[1] * matrix[4] + this[2] * matrix[8] + this[3] * matrix[12];
        productMatrix[1] = this[0] * matrix[1] + this[1] * matrix[5] + this[2] * matrix[9] + this[3] * matrix[13];
        productMatrix[2] = this[0] * matrix[2] + this[1] * matrix[6] + this[2] * matrix[10] + this[3] * matrix[14];
        productMatrix[3] = this[0] * matrix[3] + this[1] * matrix[7] + this[2] * matrix[11] + this[3] * matrix[15];

        productMatrix[4] = this[4] * matrix[0] + this[5] * matrix[4] + this[6] * matrix[8] + this[7] * matrix[12];
        productMatrix[5] = this[4] * matrix[1] + this[5] * matrix[5] + this[6] * matrix[9] + this[7] * matrix[13];
        productMatrix[6] = this[4] * matrix[2] + this[5] * matrix[6] + this[6] * matrix[10] + this[7] * matrix[14];
        productMatrix[7] = this[4] * matrix[3] + this[5] * matrix[7] + this[6] * matrix[11] + this[7] * matrix[15];

        productMatrix[8] = this[8] * matrix[0] + this[9] * matrix[4] + this[10] * matrix[8] + this[11] * matrix[12];
        productMatrix[9] = this[8] * matrix[1] + this[9] * matrix[5] + this[10] * matrix[9] + this[11] * matrix[13];
        productMatrix[10] = this[8] * matrix[2] + this[9] * matrix[6] + this[10] * matrix[10] + this[11] * matrix[14];
        productMatrix[11] = this[8] * matrix[3] + this[9] * matrix[7] + this[10] * matrix[11] + this[11] * matrix[15];

        productMatrix[12] = this[12] * matrix[0] + this[13] * matrix[4] + this[14] * matrix[8] + this[15] * matrix[12];
        productMatrix[13] = this[12] * matrix[1] + this[13] * matrix[5] + this[14] * matrix[9] + this[15] * matrix[13];
        productMatrix[14] = this[12] * matrix[2] + this[13] * matrix[6] + this[14] * matrix[10] + this[15] * matrix[14];
        productMatrix[15] = this[12] * matrix[3] + this[13] * matrix[7] + this[14] * matrix[11] + this[15] * matrix[15];

        return productMatrix;
    }

    public add(matrix: Matrix4): Matrix4
    {
        let additionMatrix = new Matrix4();
        for(let i = 0; i < 16; i++)
        {
            additionMatrix[i] = this[i] + matrix[i];
        }

        return additionMatrix;
    }
}