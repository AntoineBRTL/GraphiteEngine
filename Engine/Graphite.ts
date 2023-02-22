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
export * from "./Classes/Math/RotationxMatrix.js";
export * from "./Classes/Math/RotationyMatrix.js";
export * from "./Classes/Math/RotationzMatrix.js";
export * from "./Classes/Math/ScalingMatrix.js";
export * from "./Classes/Math/Transform.js";
export * from "./Classes/Math/TranslationMatrix.js";
export * from "./Classes/Math/Vector3.js";
/** RENDER */
export * from "./Classes/Render/RenderingCanvas.js";
export * from "./Classes/Render/Vertex.js";
export * from "./Classes/Render/WebGPUCamera.js";
export * from "./Classes/Render/WebGPUMaterial.js";
export * from "./Classes/Render/WebGPUMesh.js";
export * from "./Classes/Render/WebGPURender.js";
export * from "./Classes/Render/WebGPUShader.js";
/** UTILS */
export * from "./Classes/Utils/FileReader.js";
export * from "./Classes/Utils/OBJLoader.js";

export let fileReader:      FileReader  = new FileReader();
export let objLoader:       OBJLoader   = new OBJLoader(fileReader);
export let inputThread:     Thread      = new Thread();       /** INPUT THREAD */
export let renderThread:    Thread      = new Thread();       /** MAIN THREAD */
export let input:           Input       = new Input(inputThread);
export let graphite:        Engine      = new Engine(renderThread);