export default `

@fragment
fn main(@location(0) uv: vec2<f32>, @location(1) normal: vec4<f32>) -> @location(0) vec4<f32>
{
    let color: vec3<f32> = vec3<f32>(0.5, 0.5, 0.5) * max(0.1, dot(normal.xyz, normalize(vec3<f32>(1.0, 1.0, 0.0))));
    return vec4<f32>(color, 1.0);
}

`