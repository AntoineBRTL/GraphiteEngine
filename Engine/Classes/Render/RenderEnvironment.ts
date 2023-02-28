export class RenderEnvironment
{
    private canvas: HTMLCanvasElement;

    public constructor()
    {
        this.canvas = document.createElement('canvas');
    }

    public displayCanvas(): void
    {
        document.body.appendChild(this.canvas);
        document.body.style.margin = '0px';
        document.body.style.padding = '0px';
    }

    public hideCanvas(): void
    {
        document.body.removeChild(this.canvas);
    }

    public resize():void
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    public getCanvas():HTMLCanvasElement
    {
        return this.canvas;
    }
}