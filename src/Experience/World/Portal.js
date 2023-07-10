import * as THREE from 'three'
import Experience from '../Experience.js'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


import { MeshStandardMaterial, sRGBEncoding } from 'three';

export default class hoop
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
        this.resource = this.resources.items.portal
        this.setTextures()
        this.setMaterial()
        this.setModel()

        // this.setAnimation()
    }

    setModel()
    {
        const bakedTexture = new THREE.TextureLoader().load('./textures/baked.jpg')
        bakedTexture.flipY = false
        bakedTexture.encoding = sRGBEncoding
      
        const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture})

        this.model = this.resource.scene
        this.model.scale.set(3, 3, 3)

        this.model.rotation.y = Math.PI/2
        this.scene.add(this.model)
        this.model.position.set(-15, .1, -5)
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
                // console.log(child)
                child.material = bakedMaterial
            }
        })

    
    }
    setTextures()
    {
        this.textures = {}

        this.textures.color = this.resources.items.portalTexture
        this.textures.flipY = false
        this.textures.color.encoding = THREE.sRGBEncoding
        // // this.textures.color.repeat.set(1.5, 1.5)
        // this.textures.color.wrapS = THREE.RepeatWrapping
        // this.textures.color.wrapT = THREE.RepeatWrapping

        // this.textures.normal = this.resources.items.grassNormalTexture
        // this.textures.normal.repeat.set(1.5, 1.5)
        // this.textures.normal.wrapS = THREE.RepeatWrapping
        // this.textures.normal.wrapT = THREE.RepeatWrapping
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
        })
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}