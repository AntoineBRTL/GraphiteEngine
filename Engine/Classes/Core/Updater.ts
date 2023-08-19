export class Updater
{
    private isRunning: boolean;

    private deltaTime: number;
    private lastTime: number;

    private callback: Function;

    public constructor(callback: Function)
    {
        this.isRunning = false;

        this.deltaTime = 0;
        this.lastTime = 0;

        this.callback = callback;
    }

    private run(): void
    {
        if(!this.isRunning)
            return;

        this.callback(this.deltaTime);

        this.deltaTime = (performance.now() - this.lastTime) / 1e3;
        this.lastTime = performance.now();

        window.requestAnimationFrame(this.run.bind(this));
    }

    public launch(): void
    {
        if(this.isRunning)
            throw new Error("Updater is already running");

        this.isRunning = true;
        this.lastTime = performance.now();
        this.run();
    }

    public stop(): void
    {
        this.isRunning = false;
    }

    public getDeltaTime(): number
    {
        return this.deltaTime;
    }
}