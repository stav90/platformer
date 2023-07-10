import * as THREE from 'three'
import Experience from '../Experience.js'
import JoyStick from '../Utils/JoyStick'
import CANNON from 'cannon' 

export default class YBot
{
    constructor(environmentProxy, basketball)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
           
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }
        this.environmentProxy = environmentProxy
        // this.basketball = basketball
        // Resource
        this.resource = this.resources.items.newDude
        // this.walkAnimation = this.resources.items.yBotWalk
        // this.runAnimation = this.resources.items.yBotRun
        // this.throwAnimation = this.resources.items.yBotThrow
        this.setModel()
         this.setAnimation()
        this.setUpJoystick()
        this.InitInput_() 
    }


    setModel()
    {   
        // console.log('hello', this.experience.physics)

        // this.model = this.resource
        
        // this.model.scale.set(.012, .012, .012)
        // this.model.rotation.y = - Math.PI / 1.5;
        // this.scene.add(this.model)

        // this.model.traverse((child) =>
        // {
        //     if(child instanceof THREE.Mesh && child.name == 'Alpha_Joints')
        //     {
        //         // child.castShadow = true
        //         // console.log(child.geometry.FBX_Deformer.bones[9])
        //         // this.leftHand = child.geometry.FBX_Deformer.bones[9]
        //         // this.leftHand.add(this.basketball.model)
        //         // this.basketball.model.position.x += 12
        //     }
        // })
        this.model = this.resource.scene
        this.model.position.set(0, 0, -5)
        this.model.scale.set(.3, .3, .3)
        this.scene.add(this.model)
        this.model.rotation.y = - Math.PI ;
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
      
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        console.log(this.resource.animations[0])
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[1])
        // this.animation.actions.throw = this.animation.mixer.clipAction(this.throwAnimation.animations[0])
        // this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        // this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[0])
        // this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()
        // console.log('actions',this.animation.actions)
        // Play the action
        this.animation.play = (name) =>
        {

            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, .2)

            this.animation.actions.current = newAction
        }

        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }
    setUpJoystick() {
        // console.log(this.playerControl, 'helooo')
        this.joystick = new JoyStick({
            onMove: this.playerControl,
            game: this.experience 
        })
    }
    playerControl(forward, turn){
		// console.log(`playerControl(${forward}), ${turn}`);
        turn = -turn; //Flip direction

        if(this.animation != undefined){
            if (forward>0 && this.animation != undefined){
                // console.log('inside',forward)
                if (this.animation.actions.current != this.animation.actions['walking']) {
                    // this.action = 'walk';
                    this.animation.play('walking')  
                } 
            }else{
                // console.log('hellllooooo')
                if (this.animation.actions.current == this.animation.actions['walking'])  {
                    // this.action = 'look-around';
                    this.animation.play('idle') 
                } 
            }
        }
		
        
		if (forward==0 && turn==0){
			delete this.playerMovement;
		}else{
			this.playerMovement = { forward, turn }; 
		}

        
	}
    throwBall() {
        if (this.keys_.space) {
            console.log(this.keys_.space)
            if (this.animation.actions.current != this.animation.actions['throw'] && 
            this.animation.actions.current != this.animation.actions['walking']) {
                
                this.animation.play('throw')  
                setTimeout(() => {
                    this.animation.play('idle') 
                }, 2300);
            } 
        // }else
        //     if(this.animation.actions.current == this.animation.actions['throw']) {
        //     this.animation.play('idle') 
        }
    }

    movePlayer(){
		const pos = this.model.position.clone();
		pos.y += 1;
        // console.log(pos)
        const playersWorldirection = new THREE.Vector3()
		let dir = this.model.getWorldDirection(playersWorldirection);
        // console.log(this.environmentProxy.children)
		let raycaster = new THREE.Raycaster(pos, dir);
        // console.log('raycaster', raycaster)
		let blocked = false;


		
		for(let box of this.environmentProxy.children){
            
			const intersect = raycaster.intersectObject(box);
            // console.log('intersect', box)
			if (intersect.length>0){
                console.log('hit')
				if (intersect[0].distance<1){
                    console.log('hit')
					blocked = true;
					break;
				}
			}
		}
		
		if (!blocked && this.playerMovement.forward > 0) this.model.translateZ(this.time.delta * 0.0050);
		
		//cast left
		dir.set(-1,0,0);
		dir.applyMatrix4(this.model.matrix);
		dir.normalize();
		raycaster = new THREE.Raycaster(pos, dir);
		
		for(let box of this.environmentProxy.children){
			const intersect = raycaster.intersectObject(box);
			if (intersect.length>0){
				if (intersect[0].distance<1){
					this.model.translateX(-(intersect[0].distance-1));
					break;
				}
			}
		}
		
		//cast right
		dir.set(1,0,0);
		dir.applyMatrix4(this.model.matrix);
		dir.normalize();
		raycaster = new THREE.Raycaster(pos, dir);
		
		for(let box of this.environmentProxy.children){
			const intersect = raycaster.intersectObject(box);
			if (intersect.length>0){
				if (intersect[0].distance<1){
					this.model.translateX(intersect[0].distance-1);
					break;
				}
			}
		}
	}
    InitInput_() {
        this.keys_ = {
            spacebar: false,
        };
        this.oldKeys = {...this.keys_};
  
        document.addEventListener('keydown', (e) => this.OnKeyDown_(e), false);
        document.addEventListener('keyup', (e) => this.OnKeyUp_(e), false);
    }
    OnKeyDown_(event) {
        switch(event.keyCode) {
            case 32:
                this.keys_.space = true;
            break;
        }
    }
  
    OnKeyUp_(event) {
        switch(event.keyCode) {
          case 32:
            this.keys_.space = false;
            break;
        }
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)

        if (this.playerMovement!=undefined ){
			this.movePlayer();
			this.model.rotateY(this.playerMovement.turn *this.time.delta* 0.001);
		}

        if (this.keys_.space ){
            this.throwBall()
        }

        
    }
}