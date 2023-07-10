import * as THREE from 'three'
import Experience from '../Experience.js'

export default class dummyEnvironment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Resource
        this.resource = this.resources.items.crate

        this.createDummyEnvironment()
    }

    createDummyEnvironment(){
		const env = new THREE.Group();
		env.name = "Environment";
		this.scene.add(env);
		
		const geometry = new THREE.BoxBufferGeometry( .5, 2, 140 );
		const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		
		const geometry2 = new THREE.BoxBufferGeometry( .6, 2, .6 );
			// for(let x= 0; x<10; x++){
			// 	const block = new THREE.Mesh(geometry, material);
			// 	block.position.set(-x, 0, 0);
			// 	env.add(block);
			// }
			for(let i = 0; i < 20; i++) {
            
				const crateDummy = new THREE.Mesh(geometry2, material);
				crateDummy.visible = false
				if(i % 3 == 0){
					crateDummy.position.set(2, 0, i * -7)
					env.add(crateDummy);
				} else if(i % 2 == 0){
					crateDummy.position.set(-2, 0, i * -7)
					env.add(crateDummy);
				}
				else {
					crateDummy.position.set(0, 0, i * -7)
					env.add(crateDummy);
				}
			}
		const leftBlock = new THREE.Mesh(geometry, material);
		leftBlock.position.set(2.2, 0, -70);
        leftBlock.visible = false
		env.add(leftBlock);

		const rightBlock = new THREE.Mesh(geometry, material);
		rightBlock.position.set(-2.2, 0, -70);
        rightBlock.visible = false
		env.add(rightBlock);

		this.environmentProxy = env;
	}

    update()
    {

    }
}