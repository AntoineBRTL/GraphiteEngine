export class Matrix4
{
    protected a11: number;
    protected a12: number;
    protected a13: number;
    protected a14: number;

    protected a21: number;
    protected a22: number;
    protected a23: number;
    protected a24: number;

    protected a31: number;
    protected a32: number;
    protected a33: number;
    protected a34: number;

    protected a41: number;
    protected a42: number;
    protected a43: number;
    protected a44: number;

    public constructor()
    {
        this.a11 = 1.0;
        this.a12 = 0.0;
        this.a13 = 0.0;
        this.a14 = 0.0;

        this.a21 = 0.0;
        this.a22 = 1.0;
        this.a23 = 0.0;
        this.a24 = 0.0;

        this.a31 = 0.0;
        this.a32 = 0.0;
        this.a33 = 1.0;
        this.a34 = 0.0;

        this.a41 = 0.0;
        this.a42 = 0.0;
        this.a43 = 0.0;
        this.a44 = 1.0;
    }

    public product(matrix: Matrix4): Matrix4
    {
        let productMatrix = new Matrix4();

        productMatrix.a11 = this.a11 * matrix.a11 + this.a12 * matrix.a21 + this.a13 * matrix.a31 + this.a14 * matrix.a41;
        productMatrix.a12 = this.a11 * matrix.a12 + this.a12 * matrix.a22 + this.a13 * matrix.a32 + this.a14 * matrix.a42;
        productMatrix.a13 = this.a11 * matrix.a13 + this.a12 * matrix.a23 + this.a13 * matrix.a33 + this.a14 * matrix.a43;
        productMatrix.a14 = this.a11 * matrix.a14 + this.a12 * matrix.a24 + this.a13 * matrix.a34 + this.a14 * matrix.a44;

        productMatrix.a21 = this.a21 * matrix.a11 + this.a22 * matrix.a21 + this.a23 * matrix.a31 + this.a24 * matrix.a41;
        productMatrix.a22 = this.a21 * matrix.a12 + this.a22 * matrix.a22 + this.a23 * matrix.a32 + this.a24 * matrix.a42;
        productMatrix.a23 = this.a21 * matrix.a13 + this.a22 * matrix.a23 + this.a23 * matrix.a33 + this.a24 * matrix.a43;
        productMatrix.a24 = this.a21 * matrix.a14 + this.a22 * matrix.a24 + this.a23 * matrix.a34 + this.a24 * matrix.a44;

        productMatrix.a31 = this.a31 * matrix.a11 + this.a32 * matrix.a21 + this.a33 * matrix.a31 + this.a34 * matrix.a41;
        productMatrix.a32 = this.a31 * matrix.a12 + this.a32 * matrix.a22 + this.a33 * matrix.a32 + this.a34 * matrix.a42;
        productMatrix.a33 = this.a31 * matrix.a13 + this.a32 * matrix.a23 + this.a33 * matrix.a33 + this.a34 * matrix.a43;
        productMatrix.a34 = this.a31 * matrix.a14 + this.a32 * matrix.a24 + this.a33 * matrix.a34 + this.a34 * matrix.a44;

        productMatrix.a41 = this.a41 * matrix.a11 + this.a42 * matrix.a21 + this.a43 * matrix.a31 + this.a44 * matrix.a41;
        productMatrix.a42 = this.a41 * matrix.a12 + this.a42 * matrix.a22 + this.a43 * matrix.a32 + this.a44 * matrix.a42;
        productMatrix.a43 = this.a41 * matrix.a13 + this.a42 * matrix.a23 + this.a43 * matrix.a33 + this.a44 * matrix.a43;
        productMatrix.a44 = this.a41 * matrix.a14 + this.a42 * matrix.a24 + this.a43 * matrix.a34 + this.a44 * matrix.a44;

        return productMatrix;
    }

    public set(matrix: Matrix4): void
    {
        this.a11 = matrix.a11;
        this.a12 = matrix.a12;
        this.a13 = matrix.a13;
        this.a14 = matrix.a14;

        this.a21 = matrix.a21;
        this.a22 = matrix.a22;
        this.a23 = matrix.a23;
        this.a24 = matrix.a24;

        this.a31 = matrix.a31;
        this.a32 = matrix.a32;
        this.a33 = matrix.a33;
        this.a34 = matrix.a34;

        this.a41 = matrix.a41;
        this.a42 = matrix.a42;
        this.a43 = matrix.a43;
        this.a44 = matrix.a44;
    }

    public toArray(): number[]
    {
        return [
            this.a11, this.a12, this.a13, this.a14, 
            this.a21, this.a22, this.a23, this.a24, 
            this.a31, this.a32, this.a33, this.a34, 
            this.a41, this.a42, this.a43, this.a44, 
        ];
    }
}