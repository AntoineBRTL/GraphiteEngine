export default `

@fragment

fn main(@location(0) uv: vec2<f32>, @location(1) position: vec4<f32>) -> @location(0) vec4<f32>
{
    let normalizedPosition: vec3<f32> = normalize(position.xyz);
    let t: f32 = (normalizedPosition.y + 1.0) / 2.0;
    // let cloudt: f32 = fbm(position.xy * 20);

    // var color: vec3<f32> = (1.0 - t)*vec3<f32>(1.0, 1.0, 1.0) + t*vec3<f32>(0.5, 0.7, 1.0);
    var color: vec3<f32> = getSkyColor(t, normalizedPosition);
    // color = (1.0 - cloudt)*vec3<f32>(1.0, 1.0, 1.0) + cloudt*color;

    return vec4<f32>(color, 1.0);
}

fn getSkyColor(t: f32, position: vec3<f32>) -> vec3<f32> 
{
    /** FUNCTION FROM GEPE */
    const skyTop: vec3<f32>     = vec3<f32>(0.5, 0.7, 1.0);
    const skyBottom: vec3<f32>     = vec3<f32>(1.0, 1.0, 1.0);
    const cloudColor: vec3<f32>     = vec3<f32>(1.0, 1.0, 1.0);
    const groundTop: vec3<f32>  = vec3<f32>(0.42, 0.40, 0.37);
    const groundBottom: vec3<f32>  = vec3<f32>(0.16, 0.18, 0.21);

    if (t < 0.48)
    {
        var fac: f32 = 1 - (t / 0.48);
        fac = 1 - exp( -10 * fac );

        return mix(groundTop, groundBottom, fac);
    }
    else if (t < 0.52)
    {
        var fac: f32 = (t - 0.48) / (0.52 - 0.48);
        fac = fac * fac * (3.0 - 2.0 * fac);

        return mix(groundTop, skyBottom, fac);
    }
    else
    {
        var fac: f32 = (t - 0.52) / (1 - 0.52);
        fac = 1 - exp( -6 * fac );

        let cloudt: f32 = fbm(position.xz * 3);

        return mix(mix(skyBottom, skyTop, fac), cloudColor, cloudt);
    }
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

    for (var i: i32 = 0; i < 6; i++) 
    {
        value += amplitude * noise(stm);
        stm *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

`;