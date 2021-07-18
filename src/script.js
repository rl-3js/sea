import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import waterVertex from './shaders/water/vertex.glsl'
import waterFragment from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

debugObject.depthColor = '#020000'
debugObject.surfaceColor = '#8d8de8'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertex,
    fragmentShader: waterFragment,
    uniforms: {
        uTime: { value: 0},

        uBigWaveElevation: { value: 0.2},
        uBigWavesFrequency: { value: new THREE.Vector2(4.0,1.5)},
        uBigWaveSpeed: { value: 0.75},

        uDepthColor: { value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: { value: 0.05},
        uColorMultiplier : { value: 0.48}
    }
})

gui.add(waterMaterial.uniforms.uBigWaveElevation,'value').min(0).max(1).step(0.0001).name("uBigWaveElevation")
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value,'x').min(0).max(10).step(0.0001).name("uBigWavesFrequency_x")
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value,'y').min(0).max(10).step(0.0001).name("uBigWavesFrequency_y")
gui.add(waterMaterial.uniforms.uBigWaveSpeed,'value').min(0).max(2).step(0.0001).name("BigWaveSpeed")
gui.add(waterMaterial.uniforms.uColorOffset,'value').min(0).max(2).step(0.0001).name("uColorOffset")
gui.add(waterMaterial.uniforms.uColorMultiplier,'value').min(0).max(2).step(0.0001).name("uColorMultiplier")

gui.addColor(debugObject,'depthColor').name("uDepthColor").onChange(()=> waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor))
gui.addColor(debugObject,'surfaceColor').name("uSurfaceColor").onChange(()=> waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor))

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    waterMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()