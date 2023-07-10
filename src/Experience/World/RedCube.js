import * as THREE from 'three'
import Experience from '../Experience.js'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshStandardMaterial, sRGBEncoding } from 'three';
export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        // Resource
        this.resource = this.resources.items.chessboard

        this.setMaterial()
        this.setModel()
    }
    setModel()
    {
        
        this.model = this.resource.scene
        this.model.scale.set(.5, .5, .5)
        
        this.scene.add(this.model)
        this.model.position.set(0, 1, -8)
        this.model.rotation.y = Math.PI
        this.model.rotation.x = -Math.PI * .5
       
        this.model.traverse((child) =>
        {
        
            if(child instanceof THREE.Mesh)
            {
                // console.log(child)
                child.material = this.material
                child.castShadow = true
            }
        })

    
    }


    setMaterial()
    {   
        const bakedTexture = this.resources.items.marbleTexture
        bakedTexture.flipY = false
        bakedTexture.encoding = sRGBEncoding
      
        const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture})
        this.material = bakedMaterial
    }

    update(){
        // this.model.rotation.y += this.time.delta * .002
       
    }


}