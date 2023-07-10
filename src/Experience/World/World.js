import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import Girl from './Girl'
import YBot from './YBot'
import MikCharacter from './MikCharacter'
import TikiShaman from './TikiShaman'
import Hoop from './Hoop'
import DummyEnvironment from './dummyEnvironment'
import Ball from './BasketBall'
import Crate from './Crate'
import RedCube from './RedCube'
import Portal from './Portal'
import SciFiRoom from './Sci-FiRoom'
import Tunnel from './Tunnel'
import Monster from './Monster'
import MIKDude from './MIKDude'



export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
   
            // this.floor = new Floor()
            // this.fox = new Fox()
            // this.girl = new Girl()
            // this.basketball = new Ball()
            this.monster = new Monster()
            // this.newMIKDude = new MIKDude()
            this.dummyEnvironment = new DummyEnvironment()
            this.character = new YBot(this.dummyEnvironment.environmentProxy)
            // this.hoop = new Hoop()
            this.crate = new Crate()
            // this.character = new MikCharacter()
            // this.sciFiRoom = new SciFiRoom()
            // this.portal = new Portal()
            // this.redCube = new RedCube()
            this.createTunnel()
            
           
            this.experience.camera.createCameras()
            //  this.tiki = new TikiShaman()
            // this.mikCharacter = new MikCharacter()
            this.environment = new Environment()
        })

        
    }
    createTunnel() {
        this.tunnel = new Tunnel()
        // console.log(this.tunnel.model, 'tunnel1')
        // this.tunnel2 = new Tunnel(5)
        // console.log(this.tunnel2.model, 'tunnel2')
    }


    update()
    {
        if(this.monster)
            this.monster.update()

        if(this.character)
            this.character.update()

        if(this.ybot)
            this.ybot.update()

        // if(this.redCube)
        // this.redCube.update()
        
        // if(this.mikCharacter)
        //     this.mikCharacter.update()

        //  if(this.tiki)
        //     this.tiki.update()
    }
}