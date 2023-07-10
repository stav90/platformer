// import * as THREE from 'three'
import Experience from './Experience.js'
import CANNON from 'cannon' 
export default class Physics
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.worldPhysics = new CANNON.World()

        // Debug

        // Resource
        // this.resource = this.resources.items.foxModel

        this.initPhysics()
    }

    initPhysics() {
        this.worldPhysics.gravity.set(0, - 9.82, 0)
        // console.log( this.worldPhysics)
    }

    update()
    {

    }
}