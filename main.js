// To run website on a local server:
// - cd portfolioWebsite
// - npm run dev
import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import { AmbientLight, Color, Light } from 'three';

const scene = new THREE.Scene(); // scene == container

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100); // (field of view, aspect ratio, view fustrum) 

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
}); // make the magic happen

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerHeight,window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene,camera); // render == draw

// creating a Torus object
// 1. geometery: the {x,y,z} points that make up a shape
const geometery = new THREE.TorusGeometry(10,3,16,100);
// 2. material: the wrapping paper for the object. Reacts to light bounching off the material
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
// 3. mesh: geometery + material
const torus = new THREE.Mesh(geometery, material);
// add torus object to the scene
scene.add(torus);

// light up the object
const pointlight = new THREE.PointLight(0xffffff);
// move light away from the center and position it at 5
pointlight.position.set(5,5,5);
// ambient light lights up the entire scene
const ambientLight = new THREE.AmbientLight(0xffffff);
// add point light and ambient light to the scene
scene.add(pointlight, ambientLight);

// light helper tool
// const lightHelper = new THREE.PointLightHelper(pointlight);
// gridHelper draws a 2D grid on the scene
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper,gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
// randomly generate stars
function addStar(){
  const geometery = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color:0xfffff});
  const star = new THREE.Mesh(geometery,material);
  // randomly generate [x,y,z] position value for the stars
  const [x,y,z] = Array[3].fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);
}
// 200 stars randomly positioned stars!
Array[200].fill().forEach(addStar);

// background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background(spaceTexture);

// avatar
const adamTexture = new THREE.TextureLoader().load('adam.jpg');
const adam = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map:adamTexture}));
scene.add(adam);

// moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('moonTexture.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map:moonTexture,
    normalMap: normalTexture})
)
scene.add(moon);
// reposition the moon
moon.position.z = 30;
moon.position.setX(-10);

adam.position.z = -5;
adam.position.x = 2;

// Scroll animation
function moveCamera(){
  // calculate where the user is scrolled to
  const t = document.body.getBoundingClientRect().top();
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  adam.rotation.y += 0.01;
  adam.rotation.z += 0.01;
  // change the position of the camera itself
  camera.position.z = t * -0.01;
  camera.position.y = t * -0.0002;
  camera.position.z = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();


// use recursive loop to call render function automatically. "game loop"
function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  controls.update();

  renderer.render(scene,camera);
}
// call animate function to display torus
animate();

