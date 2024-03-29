export default `

@group(0) @binding(0) var<uniform> mActor : mat4x4<f32>;
@group(0) @binding(1) var<uniform> mView : mat4x4<f32>;
@group(0) @binding(2) var<uniform> mProj : mat4x4<f32>;
@group(0) @binding(3) var<uniform> mActorRot : mat4x4<f32>;

struct VertexOutput 
{
    @builtin(position) vertPosition : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragNormal: vec4<f32>
};

@vertex
fn main(@location(0) position: vec3<f32>, @location(1) uv: vec2<f32>, @location(2) normal: vec3<f32>) -> VertexOutput
{
    var output : VertexOutput;
    output.vertPosition = mProj * mView * mActor * vec4<f32>(position.x, position.y, position.z, 1.0);
    output.fragUV = uv;
    output.fragNormal = normalize(mActorRot * vec4<f32>(normal, 1.0));
    return output;
}

`

// export default `#version 300 es
// precision mediump float;

// in vec2 vPosition;
// in vec2 vUV;

// out vec2 uv;

// uniform mat4 mActor;
// uniform mat4 mView;
// uniform mat4 mProj;
// uniform mat4 mActorRot;

// out vec3 position;
// out vec3 uv;
// out vec3 normal;

// void main()
// {   
//     uv = vUV;
//     gl_Position = mProj * mView * mActor * vec4(vPosition, 0.0, 1.0);
// }
// `;