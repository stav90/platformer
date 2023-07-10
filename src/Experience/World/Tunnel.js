import * as THREE from 'three'
import Experience from '../Experience.js'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshStandardMaterial, sRGBEncoding } from 'three';
export default class Tunnel
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        // Resource
        this.resource = this.resources.items.tunnel

        this.setMaterial()
        this.setModel()
    }
    setModel()
    {
        
        this.model = this.resource.scene
        this.model.scale.set(1, 1, 1)
        for(let i = 0; i < 20; i++) {
            let tunnelSector = this.model.clone()
            tunnelSector.position.set(0, 0, i * -7)
            this.scene.add(tunnelSector)
            tunnelSector.traverse((child) =>
            {
        
                if(child instanceof THREE.Mesh)
                {
                    // console.log(child)
                    child.material = this.material
                    child.castShadow = true
                }
            })
            // console.log(model2)
        }
       
        
        this.model.position.set(0, 0, 0)
        this.model.rotation.y = Math.PI
        
        
        // this.scene.add(this.model)
       
    
    }

    setAnimation() {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model.scene)

        this.animation.actions = {}
        this.animation.actions.idle = this.animation.mixer.clipAction(this.model.animations[8])
        this.animation.actions.run = this.animation.mixer.clipAction(this.model.animations[1])
        this.animation.actions.jump = this.animation.mixer.clipAction(this.model.animations[2])
        // console.log( this.animation.actions)

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        this.animation.play = (name) => {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            if(!this.experience.gameOver){
                newAction.crossFadeFrom(oldAction, .4)
            }else{
                newAction.crossFadeFrom(oldAction, 0)
            }
            this.animation.actions.current = newAction
        }

        //Debug
        // if(this.debug.active) {
        //     const debugObject = {
        //         playIdle: () => {this.animation.play('idle')},
        //         playRun: () => {this.animation.play('run')},
        //         playJump: () => {this.animation.play('jump')}
        //     }
        //     this.debugFolder.add(debugObject, 'playIdle')
        //     this.debugFolder.add(debugObject, 'playRun')
        //     this.debugFolder.add(debugObject, 'playJump')

        // }
 
    }
    setMaterial()
    {   
        const bakedTexture = this.resources.items.tunnelTexture
        bakedTexture.flipY = false
        bakedTexture.encoding = sRGBEncoding
      
        const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture})
        this.material = bakedMaterial
    }

    update(){
        this.animation.mixer.update(this.time.delta * 0.001)
       
    }


}