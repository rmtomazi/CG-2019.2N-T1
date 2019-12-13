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

var timeSum, q = 0, queues, distance, altura;

init();
animate();

function init() {
    q = 0;
    timeSum = -1;

    container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 2000);

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
    globo.load( './models/rede__globo_3d_model_by_logomanseva_db6gvy3.fbx', function ( object3D ) {
        object3D.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        }
        );
        scene.add( object3D );
        globo = object3D;
    } );
    
    //cameras positions
    var cp = [
        [-140, 80, 330],
        [-140, 0, 350],
        [-140, -80, 330],
        [-70, 120, 430],
        [-70, 40, 450],
        [-70, -40, 450],
        [-70, -120, 430],
        [30, 160, 460],
        [30, 80, 480],
        [30, 0, 500],
        [30, -80, 480],
        [30, -160, 460],
        [130, 120, 460],
        [130, 40, 480],
        [130, -40, 500],
        [130, -120, 480],
        [230, 160, 410],
        [230, 80, 430],
        [230, 0, 450],
        [230, -80, 430],
        [230, -160, 410]
    ];
    //cameras rotations 
    var cr = [
        [-2.6],
        [-2.6],
        [-2.6],
        [-2.3],
        [-2.3],
        [-2.3],
        [-2.3],
        [-1.8],
        [-1.8],
        [-1.8],
        [-1.8],
        [-1.8],
        [-1.4],
        [-1.4],
        [-1.4],
        [-1.4],
        [-1],
        [-1],
        [-1],
        [-1],
        [-1]
    ];
    var nc = 0;
    for(var i = 0; i < cp.length; i++){
        var camera_ = new FBXLoader();
        camera_.load( './models/camera.fbx', function ( object3D ) {
            object3D.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            }
            );
            i = nc++;
            object3D.scale.set(0.01, 0.01, 0.01);
            object3D.rotation.set(0, cr[i][0], -1.5);
            object3D.position.set(cp[i][0], cp[i][1], cp[i][2]);
            scene.add( object3D );
            cameras.push(object3D);
        } );
    }

    //microphone positions
    var mp = [
        [-70, 80, 440],
        [-70, 0, 460],
        [-70, -80, 440],
        [30, 120, 470],
        [30, 40, 490],
        [30, -40, 490],
        [30, -120, 470],
        [130, 160, 450],
        [130, 80, 470],
        [130, 0, 490],
        [130, -80, 470],
        [130, -160, 450],
        [230, -120, 420],
        [230, 40, 440],
        [230, -40, 440],
        [230, -120, 420],
        [280, 160, 320],
        [280, 80, 340],
        [280, 0, 360],
        [280, -80, 340],
        [280, -160, 320]
    ];
    //microphones rotations 
    var mr = [
        [-2.2],
        [-2.2],
        [-2.2],
        [-2],
        [-2],
        [-2],
        [-2],
        [-1.5],
        [-1.5],
        [-1.5],
        [-1.5],
        [-1.5],
        [-1],
        [-1],
        [-1],
        [-1],
        [-0.5],
        [-0.5],
        [-0.5],
        [-0.5],
        [-0.5]
    ];
    var nm = 0;
    for(var i = 0; i < mp.length; i++){
        var microphone_ = new FBXLoader();
        microphone_.load('./models/camera.fbx', function ( object3D ) {
            object3D.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            }
            );
            i = nm++;
            object3D.scale.set(0.01, 0.01, 0.01);
            //object3D.rotation.set(0, cr[i][0], -1.5);
            object3D.position.set(mp[i][0], mp[i][1], mp[i][2]);
            scene.add( object3D );
            microphones.push(object3D);
        } );
    }
    queues = [
        [-140, 350],
        [-70, 460],
        [30, 500],
        [130, 500],
        [230, 450],
        [280, 360]
    ];
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

function render() {
    var delta = clock.getDelta();
    if(timeSum == -1){
        camera.position.set(-200, 40, 450);
        camera.rotation.x = 90 * Math.PI / 180;
        camera.rotation.y = -100 * Math.PI / 180;
        timeSum = 0;
    }else{
        //camera.position.x += 1;
        //camera.position.z = Math.pow(-0.00329004329 * camera.position.x, 2) +
        //                    0.4844155844 * camera.position.x + 532.3030303;
        camera.rotation.y += 0.001;
    }
    renderer.render(scene, camera);
}
