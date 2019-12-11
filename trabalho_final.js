import * as THREE from './three.js-r110/build/three.module.js';
import Stats from './three.js-r110/examples/jsm/libs/stats.module.js';
import { OrbitControls } from './three.js-r110/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './three.js-r110/examples/jsm/loaders/FBXLoader.js';

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, camera, light, scene, renderer;

var globo;

var cameras = [], microphones = [];

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
    camera.position.set(0, 0, 1800);
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
    globo = new FBXLoader();
    globo.load( './models/rede__globo_3d_model_by_logomanseva_db6gvy3.fbx', function ( object ) {
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        }
        );
        scene.add( object );
    } );
    
    var i;
    var camera_positions = [
        [0, 0, 450]
    ];
    for(i = 0; i < 21; i++){
        var camera_ = new FBXLoader();
        camera_.load( './models/camera.fbx', function ( object ) {
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            }
            );
            object.rotation.set(1.5, -1.5, 0);
            object.scale.set(0.01, 0.01, 0.01);
            object.position.set(-70, 0, 420);
            scene.add( object );
        } );
        cameras.push(camera_);
    }

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

var timeSum = -1;

function render() {
    var delta = clock.getDelta();
    // if(timeSum == -1){
    //     camera.position.set(-0, 60, 0);
    //     camera.rotation.set(-3, 0, 1.65);
    //     timeSum = 0;
    // }
    // if(camera.rotation.y > -3){
    //     camera.rotation.z += 0.001;
    //     camera.rotation.y -= 0.002;
    //     camera.position.z += 0.5;
    // }else if(camera.position.z < 1800){
    //     camera.position.z += 10;
    // }else{
    //     timeSum += delta;
    //     if(timeSum >= 4){
    //         camera.position.set(-0, 60, 0);
    //         camera.rotation.set(-3, 0, 1.65);
    //         timeSum = 0.0;
    //     }
    // }
    // console.log(camera.position);
    // console.log(camera.rotation);

    renderer.render(scene, camera);
}
