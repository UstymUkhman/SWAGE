import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
import { PlaneBufferGeometry } from 'three/src/geometries/PlaneGeometry';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
// import { BoxGeometry } from 'three/src/geometries/BoxGeometry';
import { AmbientLight } from 'three/src/lights/AmbientLight';
// import { GridHelper } from 'three/src/helpers/GridHelper';

import { Scene } from 'three/src/scenes/Scene';
import { Mesh } from 'three/src/objects/Mesh';
import { Color } from 'three/src/math/Color';
import { Fog } from 'three/src/scenes/Fog';

import RAF from 'core/RAF';

import ThreeOrbitControls from 'three-orbit-controls';
const OrbitControls = ThreeOrbitControls(THREE);

const WHITE = 0xFFFFFF;
const GRAY = 0xA0A0A0;
// const BLACK = 0x000000;

export default class Playground {
  constructor (container = document.body) {
    this.container = container;
    this.setSize();

    this.createScene();
    this.createCamera();
    this.createLights();
    this.createGround();

    this.createRenderer();
    this.createControls();
    this.createEvents();

    this._render = this.render.bind(this);
    RAF.add(this._render);
  }

  createScene () {
    this.scene = new Scene();
    this.scene.background = new Color(GRAY);
    this.scene.fog = new Fog(GRAY, 50, 500);
  }

  createCamera () {
    this.camera = new PerspectiveCamera(45, this.ratio, 1, 500);
    this.camera.position.set(0, 5, -25);
    this.camera.lookAt(0, 0, 0);
  }

  createLights () {
    const directional = new DirectionalLight(WHITE, 1);
    const ambient = new AmbientLight(WHITE);

    directional.position.set(-10, 10, 5);
    directional.castShadow = true;

    directional.shadow.camera.bottom = -10;
    directional.shadow.camera.right = 10;
    directional.shadow.camera.left = -10;
    directional.shadow.camera.top = 10;

    directional.shadow.mapSize.x = 1024;
    directional.shadow.mapSize.y = 1024;

    directional.shadow.camera.near = 2;
    directional.shadow.camera.far = 50;

    this.scene.add(directional);
    this.scene.add(ambient);
  }

  createGround () {
    /* this.ground = new Mesh(
      // new PlaneBufferGeometry(500, 500),
      new BoxGeometry(500, 500, 1),
      new MeshPhongMaterial({
        depthWrite: false,
        color: 0x888888
      })
    );

    this.ground.receiveShadow = true;
    this.ground.rotateX(-Math.PI / 2);
    this.scene.add(this.ground);

    const grid = new GridHelper(500, 50, BLACK, BLACK);
    grid.material.transparent = true;
    grid.material.opacity = 0.2;
    this.scene.add(grid); */

    // const terrainWidthExtents = 100;
    // const terrainDepthExtents = 100;

    const terrainMinHeight = -2;
    const terrainMaxHeight = 8;

    const terrainWidth = 128;
    const terrainDepth = 128;

    const heightData = this.generateHeight(terrainWidth, terrainDepth, terrainMinHeight, terrainMaxHeight);
    const geometry = new PlaneBufferGeometry(100, 100, terrainWidth - 1, terrainDepth - 1);
    const vertices = geometry.attributes.position.array;

    geometry.rotateX(-Math.PI / 2);

    for (let i = 0, j = 0; i < vertices.length; i++, j += 3) {
      vertices[j + 1] = heightData[i];
    }

    geometry.computeVertexNormals();

    this.ground = new Mesh(geometry, new MeshPhongMaterial({ color: 0x888888 }));
    this.scene.add(this.ground);
  }

  generateHeight (width, depth, minHeight, maxHeight) {
    const data = new Float32Array(width * depth);
    const hRange = maxHeight - minHeight;

    const w2 = width / 2.0;
    const d2 = depth / 2.0;
    const phaseMult = 5.0;

    for (let j = 0, p = 0; j < depth; j++) {
      for (let i = 0; i < width; i++, p++) {
        const radius = Math.sqrt(
          Math.pow((i - w2) / w2, 2.0) +
          Math.pow((j - d2) / d2, 2.0)
        );

        data[p] = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;
      }
    }

    return data;
  }

  createRenderer () {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;

    this.container.appendChild(this.renderer.domElement);
  }

  createControls () {
    this.orbitControls = new OrbitControls(this.camera);
    this.orbitControls.target.set(0, 0, 25);
    this.orbitControls.update();
  }

  createEvents () {
    this._onResize = this.onResize.bind(this);
    window.addEventListener('resize', this._onResize, false);
  }

  render () {
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onResize () {
    this.setSize();
    this.camera.aspect = this.ratio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  setSize () {
    this.height = this.container.offsetHeight;
    this.width = this.container.offsetWidth;
    this.ratio = this.width / this.height;
  }

  destroy () {
    window.removeEventListener('resize', this._onResize, false);
    this.container.removeChild(this.renderer.domElement);
    RAF.remove(this._render);

    delete this.orbitControls;
    delete this.container;
    delete this.renderer;
    delete this.camera;
    delete this.scene;
  }
}
