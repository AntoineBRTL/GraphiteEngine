@group(0) @binding(0) var<uniform> mViewRot : mat4x4<f32>;
@group(0) @binding(1) var<uniform> mProj : mat4x4<f32>;

struct VertexOutput 
{
    @builtin(position) vertPosition : vec4<f32>,
    @location(0) fragUV : vec2<f32>
};

@vertex
fn main(@location(0) position: vec3<f32>, @location(1) uv: vec2<f32>, @location(2) normal: vec3<f32>) -> VertexOutput
{
    var output : VertexOutput;
    output.vertPosition = mProj * mViewRot * vec4<f32>(position.x, position.y, position.z, 1.0);
    output.fragUV = uv;
    return output;
}