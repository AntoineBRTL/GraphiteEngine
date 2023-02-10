export class Thread {
    constructor(targetFrameRate) {
        this.isRunning = false;
        this.intervalId = -1;
        this.targetFrameRate = targetFrameRate;
        this.deltaTime = 0;
        this.lastTime = 0;
    }
    run() {
        this.intervalId = window.setInterval(function () {
            if (!this.isRunning) {
                window.clearInterval(this.intervalId);
                return;
            }
            this.onTick();
            this.onInputTick();
            this.deltaTime = (performance.now() - this.lastTime) / 1e3;
            this.lastTime = performance.now();
        }.bind(this), 1000 / this.targetFrameRate);
    }
    onTick() { }
    ;
    onInputTick() { }
    ;
    launch() {
        if (this.isRunning)
            throw new Error("Thread is already running");
        this.isRunning = true;
        this.lastTime = performance.now();
        this.run();
    }
    stop() {
        this.isRunning = false;
    }
    getDeltaTime() {
        return this.deltaTime;
    }
}
