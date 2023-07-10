import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'
export default class hoop
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.ball
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
        this.resource = this.resources.items.bandicootGame

        this.setModel()
        // this.setAnimation()
        this.translateModel()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(.8, .8, .8)
        this.model.rotation.y = Math.PI
        this.scene.add(this.model)
    
        // this.model.position.set(-5, .01, -15)
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh )
            {
                child.castShadow = true
            }
            if(child instanceof THREE.Mesh && child.name == 'Icosphere')
            {
                
                this.ball = child
               
            }
           
        })
        // console.log('hello',this.ball.position)
    
    }
    translateModel() {
     
        this.ballAnimation = gsap.timeline()
        this.ballAnimation.to(this.ball.position, {delay: 1,z: 30, duration : 10,ease: 'powerOut'})
        this.ballAnimation.to(this.ball.rotation, {x: Math.PI * 2,repeat: -1, duration : 1,ease: 'linear', repeat: -1},0)

    }
    setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
        
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

    update()
    {
        // this.ball.translateZ(this.time.delta * 0.0025)
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}