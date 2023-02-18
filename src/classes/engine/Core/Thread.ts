export class Thread
{
    private isRunning: boolean;
    private intervalId: number;
    private targetFrameRate: number;

    private deltaTime: number;
    private lastTime: number;

    private finishedFrame: boolean;

    public constructor(targetFrameRate: number)
    {
        this.isRunning = false;
        this.intervalId = -1;
        this.targetFrameRate = targetFrameRate;

        this.deltaTime = 0;
        this.lastTime = 0;

        this.finishedFrame = true;
    }

    private run(): void
    {
        this.intervalId = window.setInterval(function(this:Thread)
        {
            if(!this.isRunning)
            {
                window.clearInterval(this.intervalId);
                return;
            }

            if(!this.finishedFrame)
                return;

            this.finishedFrame = false;

            this.onTick();

            this.deltaTime = (performance.now() - this.lastTime) / 1e3;
            this.lastTime = performance.now();

            this.finishedFrame = true;
        }.bind(this), 1000 / this.targetFrameRate);
    }

    public onTick(): void {};

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