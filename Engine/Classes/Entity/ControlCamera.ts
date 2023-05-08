import { Engine, Vector3 } from "../../Graphite.js";
import { Camera } from "../Render/Camera.js";

export class ControlCamera extends Camera
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

        Engine.getFrame().getCanvas().addEventListener("click", function(this:ControlCamera)
        {
            Engine.getFrame().getCanvas().requestPointerLock();
        }.bind(this));

        window.addEventListener('mousemove', function(this: ControlCamera, event: MouseEvent)
        {
            this.transform.setRotation(this.transform.getRotation().add(new Vector3(-event.movementY, -event.movementX, 0.0).scale(this.sensitivity * Engine.getRenderUpdater().getDeltaTime())));
        }.bind(this));
    }

    public override update(deltaTime: number): void 
    {
        super.update(deltaTime);
        
        if(Engine.getInput().getKeyPress("z"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getForward().scale(this.speed * deltaTime)));

        if(Engine.getInput().getKeyPress("s"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getBackward().scale(this.speed * deltaTime)));

        if(Engine.getInput().getKeyPress("q"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getLeft().scale(this.speed * deltaTime)));

        if(Engine.getInput().getKeyPress("d"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getRight().scale(this.speed * deltaTime)));

        if(Engine.getInput().getKeyPress(" "))
            this.transform.setLocation(this.transform.getLocation().add(new Vector3(0.0, this.flySpeed, 0.0).scale(deltaTime)));

        if(Engine.getInput().getKeyPress("Shift"))
            this.transform.setLocation(this.transform.getLocation().add(new Vector3(0.0, -this.flySpeed, 0.0).scale(deltaTime)));
    }
}