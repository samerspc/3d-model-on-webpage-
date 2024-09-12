import * as THREE from 'three';
import init from './init';
import './style.css';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const { sizes, camera, scene, canvas, controls, renderer } = init();

camera.position.set(0, 10, 5);
camera.lookAt(0, 40, 0)

/** Сцена */
camera.position.set(0, 10, 5);

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: '#444444',
		metalness: 0,
		roughness: 0.5,
	}),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/** Свет */
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(dirLight);

/** Загрузчик */
const loader = new GLTFLoader();
loader.load(
	'/model/scene.gltf',
	(gltf) => {
		console.log('success');
		console.log(gltf);
		gltf.scene.scale.set(2, 2, 2);
		scene.add(gltf.scene);
	},
	(process) => {
		console.log('progress');
		console.log(process);
	},
	(error) => {
		console.log('error');
		console.log(error);
	},
);

const tick = () => {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};
tick();

/** Базовые обработчики событий для поддержки ресайза */
window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});