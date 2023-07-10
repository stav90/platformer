import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.player = {}
        this.setInstance()
        this.setControls()
        // this.createCameras()
    }

    createCameras(){
		const offset = new THREE.Vector3(0, 60, 0);
		
        const frontViewCameraView = new THREE.Object3D();
		frontViewCameraView.position.set(0, 5, 40);
        frontViewCameraView.parent = this.experience.world.character.model;

        const backCameraView = new THREE.Object3D();
		backCameraView.position.set(0, 300, -650);
		backCameraView.parent = this.experience.world.character.model;
		
        const wideCameraView = new THREE.Object3D();
		wideCameraView.position.set(678, 639, 965);
		wideCameraView.parent = this.experience.world.character.model;
		
        const overheadCameraView = new THREE.Object3D();
		overheadCameraView.position.set(0, 800, 0);
		overheadCameraView.parent = this.experience.world.character.model;
		
        const collectCameraView = new THREE.Object3D();
		collectCameraView.position.set(100, 82, 94);
        collectCameraView.parent = this.experience.world.character.model;
        
		this.player.cameras = { frontViewCameraView, backCameraView, wideCameraView, overheadCameraView, collectCameraView };
		this.activeCamera = this.player.cameras.frontViewCameraView;
        
        document.getElementById("camera-btn").onclick = () =>{ 
            this.switchCamera(); };
	}

    switchCamera(fade=0.05){
        console.log('hello', this.experience.world.character.model)
		const cams = Object.keys(this.player.cameras);
		cams.splice(cams.indexOf('active'), 1);
		let index;
		for(let prop in this.player.cameras){
			if (this.player.cameras[prop]==this.player.cameras.active){
				index = cams.indexOf(prop) + 1;
				if (index>=cams.length) index = 0;
				this.player.cameras.active = this.player.cameras[cams[index]];
				break;
			}
		}
		this.cameraFade = fade;
	}


	set activeCamera(object){
		this.player.cameras.active = object;
	}

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(10, 8, 13)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()

        if (this.player.cameras!=undefined && this.player.cameras.active!=undefined && this.experience.world.character !=undefined){
            this.instance.position.lerp(this.player.cameras.active.getWorldPosition(new THREE.Vector3()), 0.05)
			// this.instance.position.lerp(this.player.cameras.active.getWorldPosition(new THREE.Vector3()), this.cameraFade);
			const pos = this.experience.world.character.model.position.clone();

			pos.y += 1;
           
			this.instance.lookAt(pos);
            
		}
    }


}