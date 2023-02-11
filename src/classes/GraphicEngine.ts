import { Engine } from "./engine/Core/Engine.js";
import { Renderer } from "./engine/Render/Renderer.js";
import { Thread } from "./engine/Core/Thread.js";
import { ENGINE_DEFAULT_TARGET_FRAMERATE } from "./engine/Core/Constants.js";
import { InputSystem } from "./engine/Core/InputSystem.js";
import { FileReader } from "./engine/Utils/FileReader.js";
import { OBJLoader } from "./engine/Utils/OBJLoader.js";

export { Mesh } from "./engine/Render/Mesh.js";
export { Thread } from "./engine/Core/Thread.js";
export { Engine } from "./engine/Core/Engine.js";
export { Renderer } from "./engine/Render/Renderer.js";
export { RenderingCanvas } from "./engine/Render/RenderingCanvas.js";
export { Actor } from "./engine/Entity/Actor.js";
export { Camera } from "./engine/Entity/Camera.js";
export { Vector3 } from "./engine/Math/Vector3.js";
export { FrameRateDebuger } from "./engine/Entity/FrameRateDebuger.js";

export { ControlCamera } from "./engine/Entity/ControlCamera.js";

export let fileReader = new FileReader();
export let objLoader = new OBJLoader(fileReader);
export let Time = new Thread(ENGINE_DEFAULT_TARGET_FRAMERATE);
export let Input = new InputSystem(Time);
export let Graphite = new Engine(Time);