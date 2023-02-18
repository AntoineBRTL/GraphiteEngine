import { input, renderThread, Vector3 } from "../../Graphite.js";
import { WebGPUCamera } from "../Render/WebGPUCamera.js";

export class ControlCamera extends WebGPUCamera
{
    private speed: number;
    private flySpeed: number;
    private sensitivity: number;

    public constructor()
    {
        super();

        this.speed = 10.0;
        this.flySpeed = 10.0;
        this.sensitivity = 30.0;

        this.getRenderer().getPostProcessingRenderingCanvas().getCanvas().addEventListener("click", function(this:ControlCamera)
        {
            this.getRenderer().getPostProcessingRenderingCanvas().getCanvas().requestPointerLock();
        }.bind(this));

        window.addEventListener('mousemove', function(this: ControlCamera, event: MouseEvent)
        {
            this.transform.setRotation(this.transform.getRotation().add(new Vector3(-event.movementY, -event.movementX, 0.0).scale(this.sensitivity * renderThread.getDeltaTime())));
        }.bind(this));
    }

    public override update(): void 
    {
        super.update();
        
        if(input.getKeyPress("z"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getForward().scale(this.speed * renderThread.getDeltaTime())));

        if(input.getKeyPress("s"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getBackward().scale(this.speed * renderThread.getDeltaTime())));

        if(input.getKeyPress("q"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getLeft().scale(this.speed * renderThread.getDeltaTime())));

        if(input.getKeyPress("d"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getRight().scale(this.speed * renderThread.getDeltaTime())));

        if(input.getKeyPress(" "))
            this.transform.setLocation(this.transform.getLocation().add(new Vector3(0.0, this.flySpeed, 0.0).scale(renderThread.getDeltaTime())));

        if(input.getKeyPress("Shift"))
            this.transform.setLocation(this.transform.getLocation().add(new Vector3(0.0, -this.flySpeed, 0.0).scale(renderThread.getDeltaTime())));
    }
}