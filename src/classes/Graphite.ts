/** IMPORTS */
import { Engine }       from "./engine/Core/Engine.js";
import { Thread }       from "./engine/Core/Thread.js";
import { Input }        from "./engine/Core/Input.js";
import { FileReader }   from "./engine/Utils/FileReader.js";
import { OBJLoader }    from "./engine/Utils/OBJLoader.js";

/** EXPORTS */
/** CORE */
export * from "./engine/Core/Engine.js";
export * from "./engine/Core/Input.js";
export * from "./engine/Core/Thread.js";
/** ENTITY */
export * from "./engine/Entity/Actor.js";
export * from "./engine/Entity/ControlCamera.js";
export * from "./engine/Entity/FrameRateDebuger.js";
/** MATH */
export * from "./engine/Math/Matrix4.js"
export * from "./engine/Math/ProjectionMatrix.js";
export * from "./engine/Math/RotationxMatrix.js";
export * from "./engine/Math/RotationyMatrix.js";
export * from "./engine/Math/RotationzMatrix.js";
export * from "./engine/Math/ScalingMatrix.js";
export * from "./engine/Math/Transform.js";
export * from "./engine/Math/TranslationMatrix.js";
export * from "./engine/Math/Vector3.js";
/** RENDER */
export * from "./engine/Render/RenderingCanvas.js";
export * from "./engine/Render/Vertex.js";
export * from "./engine/Render/WebGPUCamera.js";
export * from "./engine/Render/WebGPUMaterial.js";
export * from "./engine/Render/WebGPUMesh.js";
export * from "./engine/Render/WebGPURender.js";
export * from "./engine/Render/WebGPUShader.js";
/** UTILS */
export * from "./engine/Utils/FileReader.js";
export * from "./engine/Utils/OBJLoader.js";

export let fileReader:      FileReader  = new FileReader();
export let objLoader:       OBJLoader   = new OBJLoader(fileReader);
export let inputThread:     Thread      = new Thread(300);       /** INPUT THREAD */
export let renderThread:    Thread      = new Thread(300);       /** MAIN THREAD */
export let input:           Input       = new Input(inputThread);
export let graphite:        Engine      = new Engine(renderThread);