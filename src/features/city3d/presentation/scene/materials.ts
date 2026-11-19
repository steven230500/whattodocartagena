import * as THREE from "three"

export interface BuildingUniforms {
  uNight: { value: number }
  uSelected: { value: number }
  uBarrio: { value: number }
  uRise: { value: number }
}

/**
 * MeshStandardMaterial extendido:
 * - ventanas procedurales (oscuras de día, encendidas al azar de noche)
 * - resaltado del edificio seleccionado
 * - foco por barrio (el resto se apaga a un tono cal)
 * - "levantar la ciudad": los edificios crecen desde el centro al cargar
 */
export function createBuildingMaterial() {
  const uniforms: BuildingUniforms = {
    uNight: { value: 0 },
    uSelected: { value: -1 },
    uBarrio: { value: -1 },
    uRise: { value: 1 },
  }
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0 })
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
attribute float aId;
attribute float aBarrio;
uniform float uRise;
varying float vId;
varying float vBarrio;
varying vec3 vPos;
varying vec3 vObjNormal;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
float riseD = length(position.xz) / 1700.0;
float riseK = clamp((uRise * 1.6 - riseD) / 0.6, 0.0, 1.0);
riseK = 1.0 - pow(1.0 - riseK, 3.0);
transformed.y *= riseK;
vId = aId;
vBarrio = aBarrio;
vPos = position;
vObjNormal = normal;`,
      )
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uNight;
uniform float uSelected;
uniform float uBarrio;
varying float vId;
varying float vBarrio;
varying vec3 vPos;
varying vec3 vObjNormal;
float cityHash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
float isWall = 1.0 - step(0.5, abs(vObjNormal.y));
vec2 tng = normalize(vec2(-vObjNormal.z, vObjNormal.x) + vec2(1e-5));
float wu = dot(vPos.xz, tng);
vec2 cell = vec2(wu / 3.1, (vPos.y - 0.8) / 4.2);
vec2 fc = fract(cell);
float win = isWall * step(0.0, cell.y)
  * step(0.3, fc.x) * step(fc.x, 0.7) * step(0.32, fc.y) * step(fc.y, 0.8);
float lit = win * step(0.45, cityHash(floor(cell) + vec2(vId * 0.37, vId * 0.11))) * uNight;
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.5, win * 0.6);
float isSel = 1.0 - step(0.5, abs(vId - uSelected));
float focus = uBarrio < -0.5 ? 1.0 : 1.0 - step(0.5, abs(vBarrio - uBarrio));
float grey = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
diffuseColor.rgb = mix(mix(vec3(grey), vec3(0.93, 0.9, 0.85), 0.55), diffuseColor.rgb, focus);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.42, 0.28), isSel * 0.6);`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
totalEmissiveRadiance += vec3(1.0, 0.66, 0.3) * lit * 1.6 * mix(0.04, 1.0, focus);
// resplandor cálido de los faroles sobre la parte baja de las fachadas
totalEmissiveRadiance += vec3(1.0, 0.6, 0.28) * isWall * (1.0 - smoothstep(0.0, 10.0, vPos.y)) * uNight * 0.55 * mix(0.08, 1.0, focus);
totalEmissiveRadiance += vec3(1.0, 0.42, 0.28) * isSel * (0.18 + 0.5 * uNight);`,
      )
  }
  // la sombra también respeta la animación de crecer
  const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking })
  depth.onBeforeCompile = (shader) => {
    shader.uniforms.uRise = uniforms.uRise
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uRise;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
float riseD = length(position.xz) / 1700.0;
float riseK = clamp((uRise * 1.6 - riseD) / 0.6, 0.0, 1.0);
transformed.y *= 1.0 - pow(1.0 - riseK, 3.0);`,
      )
  }
  return { material, depth, uniforms }
}

/** Domo de cielo con degradado (sin texturas). */
export function createSkyMaterial() {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new THREE.Color("#3a8ee6") },
      uHorizon: { value: new THREE.Color("#cdeaf8") },
    },
    vertexShader: `varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
    fragmentShader: `uniform vec3 uTop;
uniform vec3 uHorizon;
varying vec3 vDir;
void main() {
  float t = pow(clamp(vDir.y * 1.6 + 0.05, 0.0, 1.0), 0.6);
  gl_FragColor = vec4(mix(uHorizon, uTop, t), 1.0);
  #include <colorspace_fragment>
}`,
  })
}
