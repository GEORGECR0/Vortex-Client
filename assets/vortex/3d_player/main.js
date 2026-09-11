
import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  1000
);

camera.position.set(-20, 15, 50);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
  alpha: true
});

renderer.setClearColor(0x000000, 0);

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);
scene.background = null;
scene.add(new THREE.AmbientLight(0xffcfa0, 0.5));

scene.add(
  new THREE.HemisphereLight(
    0xffe6b3,
    0x442200,
    0.9
  )
);

const sun = new THREE.DirectionalLight(0xffffff, 1.2);

sun.position.set(5, 25, 5);

scene.add(sun);

const loader = new THREE.TextureLoader();

function createPixelTexture(src) {
  const tex = loader.load(
    src,
    () => {
      console.log("Skin loaded:", src);
      tex.needsUpdate = true;
    },
    undefined,
    (error) => {
      console.error("SKIN FAILED TO LOAD:", src, error);
    }
  );

  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;

  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;

  tex.generateMipmaps = false;

  tex.colorSpace = THREE.SRGBColorSpace;

  return tex;
}


const skinMat = new THREE.MeshStandardMaterial({
  roughness: 0.6,
  metalness: 0
});


function setCharacterImage(imageUrl) {
  if (typeof imageUrl !== "string" || !imageUrl) {
    return;
  }

  const newTexture = createPixelTexture(imageUrl);

  skinMat.map = newTexture;
  skinMat.needsUpdate = true;
}


setCharacterImage("./Bob.png");


function setUVs(g, faces, w = 64, h = 64) {
  const u = g.attributes.uv.array;

  const inset = 0.1;

  faces.forEach((r, i) => {
    const x1 = (r.x + inset) / w;
    const x2 = (r.x + r.w - inset) / w;

    const y1 = 1 - (r.y + r.h - inset) / h;
    const y2 = 1 - (r.y + inset) / h;

    const o = i * 8;

    u[o + 0] = x1;
    u[o + 1] = y2;

    u[o + 2] = x2;
    u[o + 3] = y2;

    u[o + 4] = x1;
    u[o + 5] = y1;

    u[o + 6] = x2;
    u[o + 7] = y1;
  });

  g.attributes.uv.needsUpdate = true;
}

const bloxdman = new THREE.Group();

scene.add(bloxdman);

function createNametag(name, imageUrl = "assets/images/red-trees.webp") {
  const group = new THREE.Group();

  const bgTexture = loader.load(imageUrl);
  bgTexture.colorSpace = THREE.SRGBColorSpace;
  bgTexture.minFilter = THREE.NearestFilter;
  bgTexture.magFilter = THREE.NearestFilter;
  bgTexture.wrapS = THREE.ClampToEdgeWrapping;
  bgTexture.wrapT = THREE.ClampToEdgeWrapping;
  bgTexture.generateMipmaps = false;

  const bgMaterial = new THREE.MeshBasicMaterial({
    map: bgTexture,
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false
  });

  const geometry = new THREE.PlaneGeometry(12, 3);

  const bgMesh = new THREE.Mesh(
    geometry,
    bgMaterial
  );

  group.add(bgMesh);

  const textCanvas = document.createElement("canvas");
  textCanvas.width = 500;
  textCanvas.height = 50;

  const textCtx = textCanvas.getContext("2d");

  textCtx.clearRect(0, 0, 500, 50);
  textCtx.fillStyle = "white";
  textCtx.font = "bold 30px Arial";
  textCtx.textAlign = "center";
  textCtx.textBaseline = "middle";

  textCtx.save();
  textCtx.scale(2, 1);
  textCtx.fillText(name, 125, 27);
  textCtx.restore();

  const textTexture = new THREE.CanvasTexture(textCanvas);

  textTexture.colorSpace = THREE.SRGBColorSpace;
  textTexture.minFilter = THREE.LinearFilter;
  textTexture.magFilter = THREE.LinearFilter;

  const textMaterial = new THREE.MeshBasicMaterial({
    map: textTexture,
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false
  });

  const textMesh = new THREE.Mesh(
    geometry.clone(),
    textMaterial
  );

  textMesh.position.z = 0.01;
  group.add(textMesh);

  group.position.set(0, 17, 0);

  return group;
}

let nametagName = "Player";
let nametagImage = "./red-trees.webp";

let nametag = createNametag(nametagName, nametagImage);

bloxdman.add(nametag);

function setCharacterName(name) {
  if (typeof name !== "string" || !name) return;
  nametagName = name;
  bloxdman.remove(nametag);
  nametag = createNametag(nametagName, nametagImage);
  bloxdman.add(nametag);
}

function setNametagImage(imageUrl) {
  if (typeof imageUrl !== "string" || !imageUrl) return;
  nametagImage = imageUrl;
  bloxdman.remove(nametag);
  nametag = createNametag(nametagName, nametagImage);
  bloxdman.add(nametag);
}

const torsoGeom = new THREE.BoxGeometry(
  8,
  12,
  4
);

setUVs(torsoGeom, [
  { x: 28, y: 20, w: 4, h: 12 },
  { x: 16, y: 20, w: 4, h: 12 },
  { x: 20, y: 16, w: 8, h: 4 },
  { x: 28, y: 16, w: 8, h: 4 },
  { x: 20, y: 20, w: 8, h: 12 },
  { x: 32, y: 20, w: 8, h: 12 }
]);

const torso = new THREE.Mesh(
  torsoGeom,
  skinMat
);

torso.castShadow = true;
torso.receiveShadow = true;

bloxdman.add(torso);

const headGeom = new THREE.BoxGeometry(
  8,
  8,
  8
);

setUVs(headGeom, [
  { x: 16, y: 8, w: 8, h: 8 },
  { x: 0, y: 8, w: 8, h: 8 },
  { x: 8, y: 0, w: 8, h: 8 },
  { x: 16, y: 0, w: 8, h: 8 },
  { x: 8, y: 8, w: 8, h: 8 },
  { x: 24, y: 8, w: 8, h: 8 }
]);

const head = new THREE.Mesh(
  headGeom,
  skinMat
);

head.position.y = 10;

head.castShadow = true;
head.receiveShadow = true;

torso.add(head);

function makeArm(x) {
  const g = new THREE.BoxGeometry(
    4,
    12,
    4
  );

  setUVs(g, [
    { x: 48, y: 20, w: 4, h: 12 },
    { x: 40, y: 20, w: 4, h: 12 },
    { x: 44, y: 16, w: 4, h: 4 },
    { x: 48, y: 16, w: 4, h: 4 },
    { x: 44, y: 20, w: 4, h: 12 },
    { x: 52, y: 20, w: 4, h: 12 }
  ]);

  const arm = new THREE.Mesh(
    g,
    skinMat
  );

  arm.position.set(
    x,
    0,
    0
  );

  arm.castShadow = true;
  arm.receiveShadow = true;

  torso.add(arm);
}

makeArm(-6);
makeArm(6);

function makeLeg(x) {
  const g = new THREE.BoxGeometry(
    4,
    12,
    4
  );

  setUVs(g, [
    { x: 8, y: 20, w: 4, h: 12 },
    { x: 0, y: 20, w: 4, h: 12 },
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 4, y: 20, w: 4, h: 12 },
    { x: 12, y: 20, w: 4, h: 12 }
  ]);

  const leg = new THREE.Mesh(
    g,
    skinMat
  );

  leg.position.set(
    x,
    -12,
    0
  );

  leg.castShadow = true;
  leg.receiveShadow = true;

  torso.add(leg);
}

makeLeg(-2);
makeLeg(2);


window.addEventListener("message", event => {
  const data = event.data;

  if (!data || data.type !== "character-control") return;

  if (typeof data.name === "string") {
    setCharacterName(data.name);
  }

  if (typeof data.image === "string") {
    setNametagImage(data.image);
  }
});

addEventListener("resize", () => {

  camera.aspect =
    innerWidth / innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    innerWidth,
    innerHeight
  );

  renderer.setPixelRatio(
    Math.min(devicePixelRatio, 2)
  );

});

let dragging = false;
let lastX = 0;

let targetRotationY = 0;
let currentRotationY = 0;

const rotationSpeed = 0.008;
const smoothness = 0.12;

renderer.domElement.addEventListener("pointerdown", (event) => {
  dragging = true;
  lastX = event.clientX;

  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event) => {
  if (!dragging) return;

  const deltaX = event.clientX - lastX;

  targetRotationY += deltaX * rotationSpeed;

  lastX = event.clientX;
});

renderer.domElement.addEventListener("pointerup", (event) => {
  dragging = false;
  renderer.domElement.releasePointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointercancel", () => {
  dragging = false;
});

function animate() {
  requestAnimationFrame(animate);

  // Smoothly move toward target rotation
  currentRotationY +=
    (targetRotationY - currentRotationY) * smoothness;

  bloxdman.rotation.y = currentRotationY;

  renderer.render(scene, camera);
}

animate();
