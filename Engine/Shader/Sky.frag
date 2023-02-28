@fragment

fn main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32>
{
    var t: f32 = uv.x;
    var color: vec3<f32> = (1.0 - t)*vec3<f32>(1.0, 1.0, 1.0) + t*vec3<f32>(0.5, 0.7, 1.0);
    // color += fbm(vec2<f32>(uv.x, 1.0)) * 0.1;
    return vec4<f32>(color, 1.0);
}

fn random(st: vec2<f32>) -> f32
{
    return fract(sin(dot(st.xy,
                         vec2<f32>(12.9898,78.233)))*
        43758.5453123);
}

fn noise(st: vec2<f32>) -> f32 
{
    var i: vec2<f32> = floor(st);
    var f: vec2<f32> = fract(st);

    var a: f32 = random(i);
    var b: f32 = random(i + vec2<f32>(1.0, 0.0));
    var c: f32 = random(i + vec2<f32>(0.0, 1.0));
    var d: f32 = random(i + vec2<f32>(1.0, 1.0));

    var u: vec2<f32> = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

fn fbm(st: vec2<f32>) -> f32
{
    var stm: vec2<f32> = st;
    var value: f32 = 0.0;
    var amplitude: f32 = 0.5;
    var frequency: f32 = 0.0;

    for (var i: i32 = 0; i < 1; i++) 
    {
        value += amplitude * noise(stm);
        stm *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}