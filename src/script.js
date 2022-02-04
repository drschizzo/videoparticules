import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import * as dat from 'dat.gui'


var fragmentshader = require('./shaders/fragment.glsl')
var vertexshader=require('./shaders/vertex.glsl')

const scene = new THREE.Scene()


    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10)
    camera.position.z = 2

    const renderer = new THREE.WebGLRenderer(
        {
                     
        
        }
    )
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    document.body.appendChild(renderer.domElement)


    let orbitControls = new OrbitControls(camera, renderer.domElement);

    let geometry = new THREE.SphereBufferGeometry(1, 500, 500)
    geometry=new THREE.PlaneBufferGeometry(.56,1,480,820)
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        
    })


    

    const video = document.getElementById('video1')
    video.play()
    const video2 = document.getElementById('video2')
    //video2.play()
    //video.srcObject =videopath
   
    


    // if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {

    //     const constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };

    //     navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {

    //         // apply the stream to the video element used in the texture

    //         video2.srcObject = stream;
    //         video2.play();

    //     } ).catch( function ( error ) {

    //         console.error( 'Unable to access the camera/webcam.', error );

    //     } );

    // }


    //create a shader material
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            resolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            },
            time: {
                value: 0
            },
            distortion: {
                value: 0.
            },
            t:{
                type:"t",
                value:new THREE.TextureLoader().load('./1.png')
                //value:new THREE.VideoTexture(video)
            },
            
            t2:{
                type:"t",
                value:new THREE.TextureLoader().load('./2.jpeg')
                //value:new THREE.VideoTexture(video2)
            },
            tmix:{
                value:0.
            }

        },
        vertexShader: vertexshader,
        fragmentShader: fragmentshader,
    })


    const cube = new THREE.Mesh(geometry, shaderMaterial)
    const particules=new THREE.Points(geometry,shaderMaterial)
    scene.add(particules)
    let currentvideo=video
    let neddupdate=false
    let transition=0
    let maxvideoduration=5
    
    video.addEventListener('ended', function () {

            neddupdate=true
            transition=0
           // currentvideo=video2
           // currentvideo.currentTime=0
           // currentvideo.play()

           // shaderMaterial.uniforms.t.value=new THREE.VideoTexture(video2)

       
        
    }, false);
    video2.addEventListener('ended', function () {
        neddupdate=true
            transition=0

    }, false);


    // window.addEventListener('click', (e) => {
    //     console.log(cube.geometry.getAttribute('position'))
    //     cube.geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array([
    //         Math.random() * 2 - 1,
    //         Math.random() * 2 - 1,
    //         Math.random() * 2 - 1
    //     ]), 3))
    //     cube.geometry.attributes.position.needsUpdate = true
    // })

    window.addEventListener('click', (e) => {
        
    });


    window.addEventListener(
        'resize',
        () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            render()
        },
        false
    )

    const stats = Stats()
    document.body.appendChild(stats.dom)

     const gui = new dat.GUI()
     gui.add(shaderMaterial.uniforms.distortion, 'value', 0, 10)
    // const cubeFolder = gui.addFolder('Cube')
     //cubeFolder.add(cube.scale, 'x', -5, 5)
    // cubeFolder.add(cube.scale, 'y', -5, 5)
    // cubeFolder.add(cube.scale, 'z', -5, 5)
    // cubeFolder.open()
    // const cameraFolder = gui.addFolder('Camera')
    // cameraFolder.add(camera.position, 'z', 0, 10)
    // cameraFolder.open()

    let elapsedTime = 0
    function animate() {
        requestAnimationFrame(animate)
      //  cube.rotation.x += 0.01
      //  cube.rotation.y += 0.01
        
        // let position = cube.geometry.getAttribute('position').array;
        // for(let i=0;i<position.length;i+=3){
        //     position[i]+=(Math.random()-.5)*0.01
        //     position[i+1]+=(Math.random()-.5)*0.01
        //     position[i+2]+=(Math.random()-.5)*0.01
        // }
        // cube.geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
        // cube.geometry.attributes.position.needsUpdate = true
      
        render()
        shaderMaterial.uniforms.time.value += 1.0 / 60.0
        if(currentvideo.currentTime>maxvideoduration){
            neddupdate=true
            transition=0
        }
       // console.log(shaderMaterial.uniforms.time.value)
        if(neddupdate){
            if(transition<10){

                transition+=.1
            }
            else{
                
            currentvideo=currentvideo==video?video2:video
            currentvideo.currentTime=0
          
            neddupdate=false
            currentvideo.play()

            }
            
        }
        else if(transition>0){
            if(currentvideo==video){
                shaderMaterial.uniforms.tmix.value=transition/10
            }
            else
            {  
                shaderMaterial.uniforms.tmix.value=1-transition/10
            }
            transition-=.1
            

        }
       
       shaderMaterial.uniforms.distortion.value=transition//+currentvideo.currentTime*.1

        
        orbitControls.update()
        stats.update()
    }

    function render() {
        renderer.render(scene, camera)
    }

    animate()