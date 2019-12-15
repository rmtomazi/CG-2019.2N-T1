import * as THREE from './three.js-r110/build/three.module.js';
import Stats from './three.js-r110/examples/jsm/libs/stats.module.js';
import { FBXLoader } from './three.js-r110/examples/jsm/loaders/FBXLoader.js';

// microfone - https://sketchfab.com/3d-models/microphone-9c8483481a134ecf84d3864b45faca6a
// globo - https://www.deviantart.com/logomanseva/art/Rede-Globo-3D-Model-675993567
// camera - http://www.cadnav.com/3d-models/model-19925.html
// audio - https://www.youtube.com/watch?v=7DYomde2YEc

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, camera, scene, renderer, sound;

var globo;

var cameras = [], microphones = [];

var controls;

var clock = new THREE.Clock();

var stats;

var timeSum;

var text;

init();
animate();

function init() {
    timeSum = -1;

    container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 2500);
    camera.position.set(0, 0, 2000);

    // SCENE

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);
    
    // LIGHTS

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    var light = new THREE.SpotLight(0xffffff, 2, 2000);
    light.position.set(0, 0, 1800);
    light.angle = 1;

    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    scene.add(light);

    var light = new THREE.SpotLight(0xffffff, 2, 2000);
    light.position.set(0, 0, 1800);
    light.angle = 1;

    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    scene.add(light);

    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container.appendChild(renderer.domElement);

    //

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = false;

    // STATS

    stats = new Stats();
    container.appendChild(stats.dom);

    // EVENTS

    window.addEventListener('resize', onWindowResize, false);

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
        camera_.load( './models/1-140RFR429/cadnav.com_model/Camera_A0825_035/camera.fbx', function ( object3D ) {
            object3D.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            }
            );
            i = nc++;
            object3D.scale.set(2.0, 2.0, 2.0);
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
        [130, 160, 470],
        [130, 80, 480],
        [130, 0, 490],
        [130, -80, 480],
        [130, -160, 470],
        [230, 120, 420],
        [230, 40, 440],
        [230, -40, 440],
        [230, -120, 420],
        [300, 160, 350],
        [300, 80, 370],
        [300, 0, 390],
        [300, -80, 370],
        [300, -160, 350]
    ];
    //microphones rotations 
    var mr = [
        [-3.2],
        [-3.2],
        [-3.2],
        [-3],
        [-3],
        [-3],
        [-3],
        [-2.5],
        [-2.5],
        [-2.5],
        [-2.5],
        [-2.5],
        [-2.1],
        [-2.1],
        [-2.1],
        [-2.1],
        [-1.8],
        [-1.8],
        [-1.8],
        [-1.8],
        [-1.8]
    ];
    var nm = 0;
    for(var i = 0; i < mp.length; i++){
        var microphone_ = new FBXLoader();
        microphone_.load('./models/mic-fbx/microphone.fbx', function ( object3D ) {
            object3D.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            }
            );
            i = nm++;
            object3D.scale.set(0.15, 0.15, 0.15);
            object3D.rotation.set(0, mr[i][0], -1.5);
            object3D.position.set(mp[i][0], mp[i][1], mp[i][2]);
            scene.add( object3D );
            microphones.push(object3D);
        } );
    }
    var listener = new THREE.AudioListener();
    camera.add(listener);
    
    sound = new THREE.Audio(listener);

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('./models/som.ogg', function( buffer ) {
        sound.setBuffer(buffer);
        sound.setVolume(1);
        sound.play();
    });

    var loader = new THREE.FontLoader();
    loader.load( './three.js-r110/examples/fonts/optimer_bold.typeface.json', function ( font ) {
        var textGeo = new THREE.TextBufferGeometry( 'PLANTAO', {
            font: font,
            size: 250,
            height: 50,
            curveSegments: 12,
            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true
        } );
        textGeo.computeBoundingBox();
        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xf0f0f0, specular: 0xffffff } );
        text = new THREE.Mesh( textGeo, textMaterial );
        text.position.x = 400;
        text.position.y = 400;
        text.rotation.x = 1.3;
        text.rotation.y = 0.2;
        text.castShadow = true;
        text.receiveShadow = true;
        scene.add( text );
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

var py, dpy;
var step;
function render() {
    var delta = clock.getDelta();
    if(timeSum == -1){
        camera.position.set(-200, 0, 400);
        camera.rotation.set(3.11038, -1.04179, 1.922030);
        py = 0.5;
        dpy = 0.0001;
        for (var i = 0; i < cameras.length; i++){
            cameras[i].visible = true;
        }
        for (var i = 0; i < microphones.length; i++){
            microphones[i].visible = true;
        }
        text.visible = false;
        text.position.x = 400;
        text.position.y = 400;
        text.rotation.x = 1.3;
        text.rotation.y = 0.2;
        sound.play();
        step = 0;
        timeSum = 0;
    }else{
        if(step == 0){
            camera.position.x += 1.4;
            camera.position.z = (-0.00329004329004329 * Math.pow(camera.position.x, 2)) +
                                (0.4844155844155844 * camera.position.x) + 532.3030303030303;
            camera.position.y -= 0.5;
            camera.rotateX(-0.0045);
            camera.rotateY(0.0045);
            if(camera.position.x >= 100)
                step ++;
        }else if(step == 1){
            camera.position.x += 1.4;
            camera.position.z = (-0.00329004329004329 * Math.pow(camera.position.x, 2)) +
                                (0.4844155844155844 * camera.position.x) + 532.3030303030303;
            camera.rotateX(-0.0055);
            camera.rotateY(0.0045);
            camera.rotateZ(0.006);
            if(py > 0){
                py -= dpy;
                dpy *= 2;
                camera.position.y -= py;
            }
            if(camera.position.x >= 250)
                step ++;
        }else if(step == 2){
            for (var i = 0; i < cameras.length; i++){
                cameras[i].visible = false;
            }
            for (var i = 0; i < microphones.length; i++){
                microphones[i].visible = false;
            }
            text.visible = true;
            step++;
        }else if(step == 3){
            if(camera.rotation.y < 0.0347339891)
                camera.rotateY(0.001);
            camera.position.z += 10;
            if(camera.position.x > 72)
                camera.position.x -= 5;
            if(camera.position.y < 0)
                camera.position.y += 5;
            if(camera.position.z > 200 && text.rotation.x > 0)
                text.rotation.x -= 0.01;
            if(camera.position.z > 200 && text.rotation.y < 0.4)
                text.rotation.y += 0.01;
            if(text.position.x > -450)
                text.position.x -= 7;
            if(camera.position.z >= 1800)
                step ++;
        } else {
            timeSum += delta;
            if(timeSum >= 5){
                sound.stop();
                timeSum = -1;
            }
        }
    }
    renderer.render(scene, camera);
}
