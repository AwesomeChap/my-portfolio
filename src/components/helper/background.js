import React, { Component } from 'react';
import '../../css/styles.scss';
import * as THREE from 'three';
let OrbitControls = require('three-orbit-controls')(THREE);

const WHITE = {
  mainColor: 0x000,
  mainEmissive: 0,
  secondaryColor: 0xffffff,
  secondaryEmissive: 0,
  detailColor: 0x999999,
  detailEmissive: 0
}

class ParticleSystem {
  constructor() {
    this.time = 0.0
    let triangles = 1
    let instances = 700
    let geometry = new THREE.InstancedBufferGeometry()

    let vertices = new THREE.BufferAttribute(new Float32Array(triangles * 3 * 3), 3)
    let unit = 0.1;
    vertices.setXYZ(0, unit, -unit, 0)
    vertices.setXYZ(1, -unit, unit, 0)
    vertices.setXYZ(2, 0, 0, unit)
    geometry.addAttribute('position', vertices)

    let offsets = new THREE.InstancedBufferAttribute(new Float32Array(instances * 3), 3, false)
    let dist = 180
    for (let i = 0, ul = offsets.count; i < ul; i++) {
      offsets.setXYZ(i, (Math.random() - 0.5) * dist, (Math.random() - 0.5) * dist, (Math.random() - 0.5) * dist)
    }
    geometry.addAttribute('offset', offsets)

    let colors = new THREE.InstancedBufferAttribute(new Float32Array(instances * 4), 4, false)

    let threeColor = new THREE.Color()
    for (let i = 0, ul = colors.count; i < ul; i++) {
      let c = threeColor.setHex(WHITE.mainColor)
      colors.setXYZW(i, c.r, c.g, c.b, 1)
    }
    geometry.addAttribute('color', colors)

    let timeOffsets = new THREE.InstancedBufferAttribute(new Float32Array(instances * 1), 1, false)

    for (let i = 0, ul = timeOffsets.count; i < ul; i++) {
      timeOffsets.setX(i, Math.random())
    }
    geometry.addAttribute('timeOffset', timeOffsets)

    let vector = new THREE.Vector4()
    let orientationsStart = new THREE.InstancedBufferAttribute(new Float32Array(instances * 4), 4, false)
    for (let i = 0, ul = orientationsStart.count; i < ul; i++) {
      vector.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
      vector.normalize()
      orientationsStart.setXYZW(i, vector.x, vector.y, vector.z, vector.w)
    }
    geometry.addAttribute('orientationStart', orientationsStart)

    let orientationsEnd = new THREE.InstancedBufferAttribute(new Float32Array(instances * 4), 4, false)
    for (let i = 0, ul = orientationsEnd.count; i < ul; i++) {
      vector.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
      vector.normalize()
      orientationsEnd.setXYZW(i, vector.x, vector.y, vector.z, vector.w)
    }
    geometry.addAttribute('orientationEnd', orientationsEnd)

    let material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        sineTime: { value: 1.0 }
      },
      vertexShader: `
        precision highp float;
        uniform float time;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        attribute vec3 position;
        attribute vec3 offset;
        attribute vec4 color;
        attribute vec4 orientationStart;
        attribute vec4 orientationEnd;
        attribute float timeOffset;
        varying vec4 vColor;
        varying float lifeProgress;

        void main(){

          vec3 vPosition = offset;

          lifeProgress = mod(time+timeOffset,1.0);

          vPosition = offset * lifeProgress + position;
          vec4 orientation = normalize(mix(orientationStart, orientationEnd, lifeProgress));
          vec3 vcV = cross(orientation.xyz, vPosition);
          //orientation.w *= time*5.0;
          vPosition = vcV * (2.0 * orientation.w) + (cross(orientation.xyz, vcV) * 2.0 + vPosition);
          vColor = color;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
        }
        `,
      fragmentShader: `
      precision highp float;
      uniform float time;
      varying vec4 vColor;
      varying float lifeProgress;

      void main() {
        float depth = gl_FragCoord.z / gl_FragCoord.w / 5.0;
        float opacity = clamp(0.2, 1.0, depth);
        vec4 color = vColor;
        color.a = sin(lifeProgress*100.0)*opacity;
        gl_FragColor = color;
      }
      `,
      side: THREE.DoubleSide,
      transparent: true
    })

    let mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = false
    this.mesh = mesh
  }
  update(dt) {
    this.time += 0.0001
    this.mesh.material.uniforms.time.value = Math.sin(this.time)
  }
}


export default class Background extends Component {
  constructor(props) {
    super(props);
    this.particles = new ParticleSystem();
    this.renderer = null;
    this.width = null;
    this.height = null;
    this.scene = null;
    this.camera = null;
    this.clock = new THREE.Clock();
    this.controls = null;
  }

  handleWindowResize = () => {
    // update height and width of the renderer and the camera
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  componentDidMount() {
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x2e2e2e, 2, 10);

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 30);
    this.camera.position.z = 4

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0x111, 0);
    this.renderer.setSize(this.width, this.height)
    this.mount.appendChild(this.renderer.domElement)

    //ADD AMBIENT LIGHT
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(ambientLight);

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = false;

    window.addEventListener('resize', this.handleWindowResize, false)

    //set camera at eyes height
    this.camera.position.y = 1.7; 
    this.camera.position.z = 0;

    this.controls.target.set(0, this.camera.position.y*10,0)

    // create particles
    this.particles.mesh.position.y = 4
    this.scene.add(this.particles.mesh)

    // start render
    this.start();
  }
  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  animate = () => {
    let delta = this.clock.getDelta();
    let elapsed = this.clock.getElapsedTime();
    this.particles.update(delta);
    this.controls.update();

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  render() {
    return (
      <div  ref={(mount) => { this.mount = mount }} className="background" ></div>
    )
  }
}