<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

//
onMounted(() => {
  /**
   * Base
   */
  // Debug
  // const gui = new GUI();

  const parameters = {}
  parameters.count = 491100
  parameters.size = 0.006
  parameters.radius = 3.68
  parameters.branches = 6
  parameters.spin = 1.15
  parameters.randomness = 1.03
  parameters.randomnessPower = 3.43
  parameters.insideColor = '#d56801'
  parameters.outsideColor = '#0f2f80'
  parameters.textLocationX = 0
  parameters.textLocationY = 0
  parameters.textLocationZ = 0

  // Canvas
  const canvas = document.getElementById('galaxy')

  // Scene
  const scene = new THREE.Scene()

  const dirLight = new THREE.DirectionalLight('#d56801', 8) // blue
  scene.add(dirLight)
  dirLight.position.set(0, 0, 5)
  const helper = new THREE.DirectionalLightHelper(dirLight, 2)
  // scene.add(helper);

  const dirLight2 = new THREE.DirectionalLight('#0f2f80', 5) // orange
  scene.add(dirLight2)
  dirLight2.position.set(0, 0, -3)
  const helper2 = new THREE.DirectionalLightHelper(dirLight2, 2)
  // scene.add(helper2);

  const pointLight = new THREE.PointLight('#efc070', 0.5)
  scene.add(pointLight)
  pointLight.position.set(0, 0, 2)
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
  // scene.add(pointLightHelper);

  // scene.add(new THREE.AxesHelper(10));

  let textMesh = null
  let textGeo = null
  let textMat = new THREE.MeshStandardMaterial({ color: 'white' })
  // let text = "Unlocking a Brigter Future with US";
  let text = `Unlocking a Brighter
    Future with Us`
  const depth = 0.05
  const size = 0.4
  let fontData = null
  const hover = 30
  const curveSegments = 6
  const bevelThickness = 0.03
  const bevelSize = 0.03
  const loader = new TTFLoader()

  loader.load(
    '/fonts/ttf/noto-serif.ttf',
    function (ttfData) {
      fontData = new FontLoader().parse(ttfData)
      textMesh = createText(fontData)
    },
    undefined,
    function (err) {
      console.log('Error loading font', err)
    },
  )

  /**
   * Galaxy
   */

  let geometry = null
  let material = null
  let points = null

  const generateGalaxy = () => {
    // Destroy old galaxy
    if (points !== null) {
      geometry.dispose()
      material.dispose()
      scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++) {
      // Position
      const i3 = i * 3

      const radius = Math.random() * parameters.radius

      const spinAngle = radius * parameters.spin
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2

      const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius
      const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius
      const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      // Color
      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / parameters.radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
    return points
  }

  // gui.add(parameters, "count")
  //     .min(100)
  //     .max(1000000)
  //     .step(100)
  //     .onFinishChange(generateGalaxy);
  // gui.add(parameters, "size")
  //     .min(0.001)
  //     .max(0.1)
  //     .step(0.001)
  //     .onFinishChange(generateGalaxy);
  // gui.add(parameters, "radius")
  //     .min(0.01)
  //     .max(20)
  //     .step(0.01)
  //     .onFinishChange(generateGalaxy);
  // gui.add(parameters, "branches")
  //     .min(2)
  //     .max(20)
  //     .step(1)
  //     .onFinishChange(generateGalaxy);
  // gui.add(parameters, "spin")
  //     .min(-5)
  //     .max(5)
  //     .step(0.001)
  //     .onFinishChange(generateGalaxy);
  // gui.add(parameters, "randomness")
  //     .min(0)
  //     .max(2)
  //     .step(0.001)
  //     .onFinishChange(generateGalaxy);
  // gui.add(parameters, "randomnessPower")
  //     .min(1)
  //     .max(10)
  //     .step(0.001)
  //     .onFinishChange(generateGalaxy);
  // gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
  // gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

  points = generateGalaxy()

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  window.addEventListener('resize', () => {
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
  // camera.position.x = -0.1643352908838938;
  camera.position.x = -0.019502618915832493
  camera.position.y = 0.9329201919961818
  camera.position.z = 3.9713518237595475
  scene.add(camera)

  // // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0xffffff, 0)

  function createText(font) {
    if (textMesh !== null) {
      textGeo.dispose()
      textMat.dispose()
      scene.remove(textMesh)
    }
    textGeo = new TextGeometry(text, {
      font: font,
      size: size,
      depth: depth,
      curveSegments: curveSegments,
      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelEnabled: true,
    })
    textGeo.computeBoundingBox()
    textGeo.computeVertexNormals()

    const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
    textMesh = new THREE.Mesh(textGeo, textMat)
    textMesh.position.set(centerOffset, 1, 2)
    dirLight.target = textMesh
    dirLight2.target = textMesh
    // helper.update();
    // helper2.update();
    scene.add(textMesh)
    camera.lookAt(0, 0, 0)
    textMesh.add(dirLight, dirLight2)
    return textMesh
  }

  /**
   * Animate
   */
  const clock = new THREE.Clock()

  let animationId = null
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    points.rotation.y += 0.0001
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    animationId = window.requestAnimationFrame(tick)
  }

  tick()
  const cookies = document.cookie
  console.log(cookies)
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    if (renderer) {
      renderer.dispose()
    }
    if (scene) {
      scene.traverse((obj) => {
        if (!obj.isMesh) return
        if (obj.geometry) {
          obj.geometry.dispose()
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose())
          } else {
            material.dispose()
          }
        }
      })
    }
  })
})
</script>

<template>
  <div class="w-full overflow-hidden">
    <canvas id="galaxy" class=""></canvas>
  </div>
</template>
