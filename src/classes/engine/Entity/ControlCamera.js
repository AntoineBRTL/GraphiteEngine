import { Camera, Input, Time, Vector3 } from "../../GraphicEngine.js";
export class ControlCamera extends Camera {
    constructor() {
        super();
        this.speed = 10.0;
        this.flySpeed = 10.0;
        this.sensitivity = 30.0;
        this.renderer.getRenderingCanvas().getCanvas().addEventListener("click", function () {
            this.renderer.getRenderingCanvas().getCanvas().requestPointerLock();
        }.bind(this));
        window.addEventListener('mousemove', function (event) {
            this.transform.setRotation(this.transform.getRotation().add(new Vector3(event.movementY, event.movementX, 0.0).scale(this.sensitivity * Time.getDeltaTime())));
        }.bind(this));
    }
    update() {
        super.update();
        if (Input.getKeyPress("z"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getForward().scale(this.speed * Time.getDeltaTime())));
        if (Input.getKeyPress("s"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getBackward().scale(this.speed * Time.getDeltaTime())));
        if (Input.getKeyPress("q"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getLeft().scale(this.speed * Time.getDeltaTime())));
        if (Input.getKeyPress("d"))
            this.transform.setLocation(this.transform.getLocation().add(this.transform.getRight().scale(this.speed * Time.getDeltaTime())));
        if (Input.getKeyPress(" "))
            this.transform.setLocation(this.transform.getLocation().add(new Vector3(0.0, this.flySpeed, 0.0).scale(Time.getDeltaTime())));
        if (Input.getKeyPress("Shift"))
            this.transform.setLocation(this.transform.getLocation().add(new Vector3(0.0, -this.flySpeed, 0.0).scale(Time.getDeltaTime())));
    }
}
