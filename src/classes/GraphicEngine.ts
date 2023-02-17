/** IMPORTS */
import { Engine } from "./engine/Core/Engine.js";
import { Thread } from "./engine/Core/Thread.js";
import { InputSystem } from "./engine/Core/InputSystem.js";
import { FileReader } from "./engine/Utils/FileReader.js";
import { OBJLoader } from "./engine/Utils/OBJLoader.js";

/** EXPORTS */
/** CORE */
export { Engine } from "./engine/Core/Engine.js";
export { InputSystem } from "./engine/Core/InputSystem.js";
export { Thread } from "./engine/Core/Thread.js";
/** ENTITY */
export { Actor } from "./engine/Entity/Actor.js";
export { ControlCamera } from "./engine/Entity/ControlCamera.js";
export { FrameRateDebuger } from "./engine/Entity/FrameRateDebuger.js";
/** MATH */
export { Matrix4 } from "./engine/Math/Matrix4.js"
export { ProjectionMatrix } from "./engine/Math/ProjectionMatrix.js";
export { RotationxMatrix } from "./engine/Math/RotationxMatrix.js";
export { RotationyMatrix } from "./engine/Math/RotationyMatrix.js";
export { RotationzMatrix } from "./engine/Math/RotationzMatrix.js";
export { ScalingMatrix } from "./engine/Math/ScalingMatrix.js";
export { Transform } from "./engine/Math/Transform.js";
export { TranslationMatrix } from "./engine/Math/TranslationMatrix.js";
export { Vector3 } from "./engine/Math/Vector3.js";
/** RENDER */
export { RenderingCanvas } from "./engine/Render/RenderingCanvas.js";
export { WebGPUCamera } from "./engine/Render/WebGPUCamera.js";
export { WebGPUMaterial } from "./engine/Render/WebGPUMaterial.js";
export { WebGPUMesh } from "./engine/Render/WebGPUMesh.js";
export { WebGPURenderer } from "./engine/Render/WebGPURender.js";
export { WebGPUShader } from "./engine/Render/WebGPUShader.js";
/** UTILS */
export { FileReader } from "./engine/Utils/FileReader.js";
export { OBJLoader } from "./engine/Utils/OBJLoader.js";
/** GLOBAL */
export let fileReader = new FileReader();
export let objLoader = new OBJLoader(fileReader);
export let time = new Thread(Thread.ENGINE_DEFAULT_TARGET_FRAMERATE);
export let input = new InputSystem(time);
export let graphit = new Engine(time);