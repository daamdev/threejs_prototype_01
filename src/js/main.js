import * as THREE from 'three'
import {GUI} from 'dat.gui'
import {PlayerControls} from './PlayerControls.js'
import {VirtualJoystick} from './VirtualJoystick.js'

const gui = new GUI();

let player, camera;
var controls; // Player Controller
var joystick;

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  
  const fov = 35;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.z = 6.28;
  // camera.rotation.x =0.64;
  // camera.position.y = -4.89;
  
  const scene = new THREE.Scene();
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const dirLight = new THREE.DirectionalLight(color, intensity);
    dirLight.position.set(-1, 2, 4);
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(color, 0.35);
    scene.add(ambLight);
  }


  const material = new THREE.MeshPhongMaterial({color:0xFFC0CB});
    
  const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(30,30), material);
  plane.rotation.x = -Math.PI / 2;

  // const cameraFolder = gui.addFolder("camera")  
  // cameraFolder.add(camera.rotation, "x", -Math.PI * 1, Math.PI * 2, 0.01)
  // cameraFolder.add(camera.position, "y", -Math.PI * 2, Math.PI * 1, 0.01)
  // cameraFolder.add(camera.position, "z", -Math.PI * 1, Math.PI * 2, 0.01)
  
  // cameraFolder.open();
  // const cubeFolder = gui.addFolder("plane")
  // cubeFolder.add(Plane.rotation, "x", -Math.PI * 2, Math.PI * 2, 0.01)
  // cubeFolder.add(plane.rotation, "y", -Math.PI * 2, Math.PI * 2, 0.01)
  // cubeFolder.add(plane.rotation, "z", -Math.PI * 2, Math.PI * 2, 0.01)
  // cubeFolder.open()
  
  scene.add(plane);


  
  const boxWidth = 3;
  const boxHeight = 1;
  const boxDepth = 3;
  const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const boxArea = [
    makeInstance(boxGeometry, "box1",0x44ff88, -7, 0),
    makeInstance(boxGeometry, "box2",0xff8844,  0, -7),
    makeInstance(boxGeometry, "box3",0x4488ff,  7, 0),
    makeInstance(boxGeometry, "box4",0xff88ff,  0, 7),
  ];

  function makeInstance(geometry, objName, color, x, z) {

    //const colorMaterial = new THREE.MeshPhongMaterial({color});
    const wireMaterial = new THREE.MeshBasicMaterial( { color, wireframe:true, wireframeLinewidth:10 } );

    const cube = new THREE.Mesh(geometry, wireMaterial);
    scene.add(cube);

    cube.name = objName;
    cube.position.x = x;
    cube.position.y += boxHeight / 2;
    cube.position.z = z;

    return cube;
  }

  const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
  const playerMaterial = new THREE.MeshPhongMaterial({color:0x8844aa});
  player = new THREE.Mesh(playerGeometry, playerMaterial);
  scene.add(player);
  player.position.x = 0;
  player.position.y += boxHeight / 2;
  player.position.z = 0;
   
 
  const pixelRatio = window.devicePixelRatio;
  const width  = canvas.clientWidth  * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0; 
  //CONTROL

  //CONTROL - JOYSTICK
  joystick = new VirtualJoystick({
    mouseSupport	: true,
    stationaryBase	: true,
    baseX		: width / 2,
    baseY		: height - 200
  });
  
  controls = new PlayerControls( camera, player, joystick );
  controls.init();
  //CONTROL - Events
  controls.addEventListener( 'change', render, false ); 




  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
 
      if( controls != undefined){ 
        joystick.resizeScreen(width/2,height - 200);
      }
    }
    return needResize;
  }

  let collisionObj = "";
  function collisionCheck(){ 
		 if (boxArea !== undefined){
        boxArea.forEach(function(object){
          if (collisionObj != object.name && player != undefined && object.visible && player.position.distanceTo(object.position)<2){                               
            //TODO COLLISION!          
            if( object.name == "box1" ){      
              collisionObj = object.name;
              console.log("COLLISION : BOX1");              
              changePlaneColor(0x44ff88);
            }else if( object.name == "box2"){
              collisionObj = object.name;
              console.log("COLLISION : BOX2");
              changePlaneColor(0xff8844);
            }else if( object.name == "box3"){
              collisionObj = object.name;
              console.log("COLLISION : BOX3");
              changePlaneColor(0x4488ff);
            }else if( object.name == "box4"){ 
              collisionObj = object.name;
              console.log("COLLISION : BOX4");
              changePlaneColor(0xff88ff);
            }
        } 
      });      
    }
  }

  function changePlaneColor(color){     
    plane.material =  new THREE.MeshPhongMaterial({color});

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

     
    controls.update(); 
    collisionCheck();
    
    
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
