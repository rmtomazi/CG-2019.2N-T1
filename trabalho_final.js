import * as THREE from './three.js-r110/build/three.module.js';
import Stats from './three.js-r110/examples/jsm/libs/stats.module.js';
import { OrbitControls } from './three.js-r110/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './three.js-r110/examples/jsm/loaders/FBXLoader.js';

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, camera, light, scene, renderer;

var character;

var gui, playbackConfig = {
    speed: 1.0,
    wireframe: false
};

var controls;

var clock = new THREE.Clock();

var stats;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 55, -100);
    camera.rotation.y = 0.4;
    //camera.position.x = -0.8;

    // SCENE

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.Fog(0x050505, 400, 10000); 

    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container.appendChild(renderer.domElement);

    //

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    // STATS

    stats = new Stats();
    container.appendChild(stats.dom);

    // EVENTS

    window.addEventListener('resize', onWindowResize, false);

    // CONTROLS

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 50, 0);
    controls.update();

    // LIGHTS

    scene.add(new THREE.AmbientLight(0xffffff));

    light = new THREE.SpotLight(0xffffff, 5, 10000);
    scene.add(light);

    // CHARACTER

    var pula = new FBXLoader();
    pula.load( './models/rede__globo_3d_model_by_logomanseva_db6gvy3.fbx', function ( object ) {
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        }
        );
        scene.add( object );
    } );
}

// EVENT HANDLERS

function onWindowResize() {

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

}

function animate() {
    requestAnimationFrame(animate);
    render();

    stats.update();
}

var timeSum = 0.0;

function render() {
    var delta = clock.getDelta();
    //character.update(delta);
    if(camera.rotation.y > -3.12){
        camera.rotation.y -= 0.005;
        camera.position.z += 2;
    }else if(camera.position.z < 1800){
        camera.position.z += 10;
    }else{
        timeSum += delta;
        if(timeSum >= 4){
            camera.position.set(0, 55, -100);
            camera.rotation.y = 0.4;
            timeSum = 0.0;
        }
    }

    renderer.render(scene, camera);
}
