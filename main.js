// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a spiral geometry
const radius = 1; // Spiral radius
const tubeRadius = 0.2; // Tube thickness
const radialSegments = 32;
const tubularSegments = 200;
const spiralHeight = 10; // Height of the spiral

// Vertical spiral using TubeGeometry and a custom curve
const curve = new THREE.Curve();
curve.getPoint = function (t) {
  const angle = t * Math.PI * 8; // Number of rotations
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const y = spiralHeight * t - spiralHeight / 2; // Adjust the vertical height of the spiral
  return new THREE.Vector3(x, y, z);
};

const spiralMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color(0x00ffff) }, // Spiral color
  },
  vertexShader: `
    varying float vFade;
    void main() {
      vFade = position.y; // Pass Y-position to fragment shader
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying float vFade;
    void main() {
      float alpha = smoothstep(-5.0, 5.0, vFade); // Gradual fade near the top
      gl_FragColor = vec4(color, alpha); // Apply fading with transparency
    }
  `,
  transparent: true,
});

const spiralGeometry = new THREE.TubeGeometry(curve, tubularSegments, tubeRadius, radialSegments, false);
const spiral = new THREE.Mesh(spiralGeometry, spiralMaterial);
scene.add(spiral);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

camera.position.z = 12;

// Animation loop: Rotate the spiral in reverse around its axis
function animate() {
  requestAnimationFrame(animate);

  // Reverse rotate the spiral around the Y-axis (vertical axis)
  spiral.rotation.y -= 0.05; // Adjust speed by changing the decrement

  renderer.render(scene, camera);
}
animate();
