import * as THREE from "three";
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { LoadGLTFByPath } from "./Helpers/ModelHelper.js";

// Renderer configuration
let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#background"),
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Scene and camera setup
const scene = new THREE.Scene();
let camera;
let controls;

let cameraList = [];

// Load the GLTF model
LoadGLTFByPath(scene)
  .then(() => {
    retrieveListOfCameras(scene);
  })
  .catch((error) => {
    console.error("Error loading JSON scene:", error);
  });

// Retrieve list of cameras and initialize the first one
function retrieveListOfCameras(scene) {
  scene.traverse((object) => {
    if (object.isCamera) {
      cameraList.push(object);
    }
  });

  // Set the camera to the first camera in the scene
  if (cameraList.length > 0) {
    camera = cameraList[0];
    updateCameraAspect(camera);

    // Initialize OrbitControls only after camera is defined
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Makes the rotation smoother
    controls.dampingFactor = 0.05;

    // Start the animation loop after the model and cameras are loaded
    animate();
  } else {
    console.error("No cameras found in the scene.");
  }
}

// Set the camera aspect ratio to match the browser window dimensions
function updateCameraAspect(camera) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls in each frame
  if (controls) controls.update();

  renderer.render(scene, camera);
}

// Update renderer and camera on window resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (camera) {
    updateCameraAspect(camera);
  }
});
