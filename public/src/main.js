import * as THREE from "three";
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
let model; // To store the loaded model

let cameraList = [];

// Load the GLTF model
LoadGLTFByPath(scene)
  .then((loadedModel) => {
    model = loadedModel; // Save the model for future updates
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

  renderer.render(scene, camera);
}

// Update renderer and camera on window resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (camera) {
    updateCameraAspect(camera);
  }
});

// Handle device orientation for horizontal rotation
if (window.DeviceOrientationEvent) {
  window.addEventListener(
    "deviceorientation",
    (event) => {
      if (model) {
        // Use the alpha value (yaw) to rotate the model
        const alpha = event.alpha || 0;

        // Convert alpha from degrees to radians and apply it to the model's rotation
        model.rotation.y = THREE.MathUtils.degToRad(alpha);

        // Optionally, you can smooth the rotation using interpolation for better UX
      }
    },
    true
  );
} else {
  console.error("DeviceOrientationEvent is not supported on this device/browser.");
}
