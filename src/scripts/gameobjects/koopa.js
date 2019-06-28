import { AnimatedSprite } from 'pixi.js';
import { GameObject } from 'game/core';

import { play as playSound } from 'game/assets/sounds';
import { animation } from 'game/assets/spritesheet';

export default class Koopa extends GameObject {
	initialize() {
		super.initialize();

		this.id = 'Koopa';
		this.type = GameObject.TYPE_ENEMY;

		this.bounds.x = 250;
		this.bounds.y = -27;
		this.bounds.width = 16;
		this.bounds.height = 27;

		this.speed.x = -1;

		this.sprite = new AnimatedSprite(animation('koopa_walk'));
		this.sprite.animationSpeed = 0.2;
		this.sprite.play();
	}

	update(frame) {
		// if (!player.isAlive) {
		//     this.sprite.stop();
		//     return;
		// }

		if (this.isAlive) {
			this.setAnimation('koopa_walk');
		} else {
			this.setFrame('koopa_death.png');
		}

		super.update(frame);
	}

	onCollision(gameobject) {
		super.onCollision(gameobject);

		if (gameobject.isPlayer) {
			const horizontal = this.bounds.left < gameobject.bounds.right;
			const vertical = this.bounds.centerY >= gameobject.bounds.bottom;

			if (horizontal && vertical) {
				this.isAlive = false;
				this.isStatic = true;

				this.speed.x = 0;
				playSound('stomp');

				setTimeout(() => {
					this.isGarbage = true;
				}, 350);
			}
		}
	}
}
