export default `

@group(0) @binding(0) var texture : texture_2d<f32>;
@group(0) @binding(1) var samp : sampler;

@fragment
fn main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32>
{
    let coord = vec2<f32>((uv.x + 1.0) / 2.0, (1.0 - uv.y) / 2.0);
    let color = textureSample(texture, samp, coord);
    return sqrt(color);
}

`