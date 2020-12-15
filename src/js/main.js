import * as THREE from '../../node_modules/three-js/three.js'
import {GUI} from 'dat.gui'
const gui = new GUI();
function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  
  const fov = 35;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 6.28;
  camera.rotation.x =0.64;
  camera.position.y = -4.89;
  
  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }


  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const material = new THREE.MeshPhongMaterial({color:0xFFC0CB});
    
  const aaaa = new THREE.Mesh(new THREE.PlaneBufferGeometry(10,5), material);
  // aaaa.position.x = -Math.PI / 2;
  const cameraFolder = gui.addFolder("camera")
  
  cameraFolder.add(camera.rotation, "x", -Math.PI * 1, Math.PI * 2, 0.01)
  cameraFolder.add(camera.position, "y", -Math.PI * 2, Math.PI * 1, 0.01)
  cameraFolder.add(camera.position, "z", -Math.PI * 1, Math.PI * 2, 0.01)
  
  cameraFolder.open();
  const cubeFolder = gui.addFolder("plane")
  cubeFolder.add(aaaa.rotation, "x", -Math.PI * 2, Math.PI * 2, 0.01)
  cubeFolder.add(aaaa.rotation, "y", -Math.PI * 2, Math.PI * 2, 0.01)
  cubeFolder.add(aaaa.rotation, "z", -Math.PI * 2, Math.PI * 2, 0.01)
  cubeFolder.open()
  
  scene.add(aaaa);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88,  0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844,  2),
  ];

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // cubes.forEach((cube, ndx) => {
    //   const speed = 1 + ndx * .1;
    //   const rot = time * speed;
    //   cube.rotation.x = rot;
    //   cube.rotation.y = rot;
    // });

    


    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
