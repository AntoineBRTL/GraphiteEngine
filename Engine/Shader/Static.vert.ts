export default `

struct VertexOutput 
{
    @builtin(position) vertPosition : vec4<f32>,
    @location(0) uv : vec2<f32>,
};

@vertex
fn main(@location(0) position: vec3<f32>) -> VertexOutput
{
    var output : VertexOutput;
    output.vertPosition = vec4<f32>(position, 1.0);
    output.uv = position.xy;
    return output;
}

`