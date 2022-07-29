// To run website on a local server:
// - cd portfolioWebsite
// - npm run dev
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

const scene = new THREE.Scene(); // scene == container

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // (field of view, aspect ratio, view fustrum) 

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
}); // make the magic happen

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera); // render == draw

// creating a Torus object

// 1. geometery: the {x,y,z} points that make up a shape
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// 2. material: the wrapping paper for the object. Reacts to light bounching off the material
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
// 3. mesh: geometery + material
const torus = new THREE.Mesh(geometry, material);
// add torus object to the scene
scene.add(torus);

// light up the object

const pointLight = new THREE.PointLight(0xffffff);
// move light away from the center and position it at 5
pointLight.position.set(5, 5, 5);
// ambient light lights up the entire scene
const ambientLight = new THREE.AmbientLight(0xffffff);
// add point light and ambient light to the scene
scene.add(pointLight, ambientLight);

// light helper tools

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

// randomly generate stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // randomly generate [x,y,z] position value for the stars
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
// 200 stars randomly positioned stars!
Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Avatar

const jeffTexture = new THREE.TextureLoader().load('adam.png');

const jeff = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: jeffTexture }));

scene.add(jeff);

// Moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 20;
moon.position.setX(-10);

jeff.position.z = -5;
jeff.position.x = 2;

// Scroll animation

function moveCamera() {
  // calculate where the user is scrolled to
  const getBoundingClient = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.10;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  // change the position of the camera itself
  camera.position.z = getBoundingClient * -0.01;
  camera.position.x = getBoundingClient * -0.0002;
  camera.rotation.y = getBoundingClient * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// use recursive loop to call render function automatically. "game loop"

function animate() {
  requestAnimationFrame(animate); // recursive step

  torus.rotation.x += 0.02;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera); // render the scene and camera in the animate function
}

// call animate function to display torus
animate();
