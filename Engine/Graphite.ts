/** IMPORTS */
import { Engine }       from "./Classes/Core/Engine.js";
import { Thread }       from "./Classes/Core/Thread.js";
import { Input }        from "./Classes/Core/Input.js";
import { FileReader }   from "./Classes/Utils/FileReader.js";
import { OBJLoader }    from "./Classes/Utils/OBJLoader.js";

/** EXPORTS */
/** CORE */
export * from "./Classes/Core/Engine.js";
export * from "./Classes/Core/Input.js";
export * from "./Classes/Core/Thread.js";
/** ENTITY */
export * from "./Classes/Entity/Actor.js";
export * from "./Classes/Entity/ControlCamera.js";
export * from "./Classes/Entity/FrameRateDebuger.js";
/** MATH */
export * from "./Classes/Math/Matrix4.js"
export * from "./Classes/Math/ProjectionMatrix.js";
export * from "./Classes/Math/RotationMatrix.js";
export * from "./Classes/Math/ScalingMatrix.js";
export * from "./Classes/Math/Transform.js";
export * from "./Classes/Math/TranslationMatrix.js";
export * from "./Classes/Math/Vector3.js";
/** RENDER */
export * from "./Classes/Render/RenderEnvironment.js";
export * from "./Classes/Render/Vertex.js";
export * from "./Classes/Render/Camera.js";
export * from "./Classes/Render/Material.js";
export * from "./Classes/Render/Mesh.js";
export * from "./Classes/Render/Renderer.js";
export * from "./Classes/Render/Shader.js";
/** UTILS */
export * from "./Classes/Utils/FileReader.js";
export * from "./Classes/Utils/OBJLoader.js";

export let fileReader:      FileReader  = new FileReader();
export let objLoader:       OBJLoader   = new OBJLoader();
export let inputThread:     Thread      = new Thread();       /** INPUT THREAD */
export let renderThread:    Thread      = new Thread();       /** MAIN THREAD */
export let input:           Input       = new Input(inputThread);
export let graphite:        Engine      = new Engine(renderThread);