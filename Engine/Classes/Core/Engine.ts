import { Actor } from "../Entity/Actor.js";
import { Frame } from "../Render/Frame.js";
import { Renderer } from "../Render/Renderer.js";
import { OBJLoader } from "../Utils/OBJLoader.js";
import { Input } from "./Input.js";
import { Updater } from "./Updater.js";
import { FileReader } from "../Utils/FileReader.js";

export class Engine
{
    /**
     * Main frame
     */
    private static frame: Frame;

    /**
     * Main renderer
     */
    private static renderer: Renderer;

    private static updater: Updater;

    private static input: Input;

    private static fileReader: FileReader;

    private static objLoader: OBJLoader

    /**
     * Starts engine
     */
    public static async start()
    {
        this.frame      = new Frame();
        await this.frame.init();

        this.renderer   = new Renderer(this.frame.getDevice(), this.frame.getContext());

        this.updater    = new Updater(this.update.bind(this));
        this.updater.launch();

        this.input      = new Input();
        this.fileReader = new FileReader();
        this.objLoader  = new OBJLoader();
    }

    public static getFrame(): Frame
    {
        return this.frame;
    }

    public static getRenderer(): Renderer
    {
        return this.renderer;
    }

    private static update(deltaTime: number): void
    {
        let actors: Array<Actor>;
        actors = Actor.getActors();

        for(let actor of actors) actor.update(deltaTime);
    }

    public static getRenderUpdater(): Updater
    {
        return this.updater;
    }

    public static getInput()
    {
        return this.input;
    }

    public static getFileReader()
    {
        return this.fileReader;
    }

    public static getObjLoader()
    {
        return this.objLoader;
    }
}