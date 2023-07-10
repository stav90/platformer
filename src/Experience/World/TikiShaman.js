import * as THREE from 'three'
import Experience from '../Experience.js'
import JoyStick from '../Utils/JoyStick'

export default class Tiki
{
    constructor()
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

        // Resource
        this.resource = this.resources.items.tikiShaman
        this.walkAnimation = this.resources.items.tikiShamanWalk
        this.runAnimation = this.resources.items.tikiShamanRun
        this.setModel()
        this.setAnimation()
        this.setUpJoystick()
        this.playerControl()
    }
    setTextures()
    {
        this.textures = {}

        this.textures.color = this.resources.items.grassColorTexture
        this.textures.color.encoding = THREE.sRGBEncoding
        this.textures.color.repeat.set(1.5, 1.5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping

        this.textures.normal = this.resources.items.grassNormalTexture
        this.textures.normal.repeat.set(1.5, 1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping
    }
    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
          
        })
    }
    setModel()
    {
        this.model = this.resource
        
        this.model.scale.set(.015, .015, .015)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
                // child.material = this.material
            }
        })
    }
    
    setAnimation()
    {
        this.animation = {}
        // console.log('look anim',this.lookAroundAnimation.animations[0])
        console.log('run anim',this.runAnimation.animations[0])
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        // console.log(this.resource.animations[0])
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.walkAnimation.animations[0])
        this.animation.actions.running = this.animation.mixer.clipAction(this.runAnimation.animations[0])
        
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

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
        // console.log('joystick', this.joystick)
		// console.log(`playerControl(${forward}), ${turn}`);
        turn = -turn; //Flip direction
        
		if (forward>0){
			// if (this.animation.actions.current!== this.animation.actions.idle) {
                // this.action = 'walk';
                this.animation.play('running')  
            // } 
		}
        // else{
		// 	if (this.player.action=="walk") {
        //         // this.action = 'look-around';
        //         this.animation.play('run') 
        //     } 
		// }
        
		// if (forward==0 && turn==0){
		// 	delete this.player.move;
		// }else{
		// 	this.player.move = { forward, turn }; 
		// }
	}

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}