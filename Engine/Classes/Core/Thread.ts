export class Thread
{
    private isRunning: boolean;

    private deltaTime: number;
    private lastTime: number;

    public constructor()
    {
        this.isRunning = false;

        this.deltaTime = 0;
        this.lastTime = 0;
    }

    private run(): void
    {
        if(!this.isRunning)
            return;

        this.onTick(this.deltaTime);

        this.deltaTime = (performance.now() - this.lastTime) / 1e3;
        this.lastTime = performance.now();

        window.requestAnimationFrame(this.run.bind(this));
    }

    public onTick(deltaTime: number): void {};

    public launch(): void
    {
        if(this.isRunning)
            throw new Error("Thread is already running");

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