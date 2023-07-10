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
        this.resource = this.resources.items.newDude

        this.setMaterial()
        this.setModel()
    }
    setModel()
    {
        
        this.model = this.resource.scene
        console.log(this.resource)
        this.model.scale.set(.3, .3, .3)
        this.model.position.set(0,0,-2)
        this.model.rotation.y = Math.PI
        this.scene.add(this.model)
        this.model.traverse((child) =>
        {
            console.log(child.animations)
            // if(child instanceof THREE.Mesh && child.name == 'metarig.002')
            // {
            //     console.log(child)
            //     // child.material = this.material
            //     // child.castShadow = true

            // }

        })
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
        const bakedTexture = this.resources.items.mikDudeTexture
        bakedTexture.flipY = false
        bakedTexture.encoding = sRGBEncoding
      
        const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture})
        this.material = bakedMaterial
    }

    update(){
        this.animation.mixer.update(this.time.delta * 0.001)
       
    }


}