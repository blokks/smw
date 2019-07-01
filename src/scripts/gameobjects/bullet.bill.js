import { AnimatedSprite } from 'pixi.js';
import { Enemy } from 'game/gameobjects';

import { play as playSound } from 'game/assets/sounds';
import { texture } from 'game/assets/spritesheet';

export default class BulletBill extends Enemy {
	initialize() {
		super.initialize();

		this.id = 'BulletBill';
		this.applyGravity = false;
		this.bounds.x = 250;
		this.bounds.y = -1 * (Math.random() * 10 + 50);
		this.bounds.width = 16;
		this.bounds.height = 14;

		this.speed.x = -2;

		this.sprite = new AnimatedSprite([texture('bullet.png')]);
		this.sprite.play();

		playSound('swooper');
	}

	playerCollisionHandler(player) {
		const vertical = this.bounds.centerY >= player.bounds.bottom;
		if (vertical) {
			this.isAlive = false;
			this.applyGravity = true;

			this.speed.x = 0;
			this.speed.y = -5;

			playSound('stomp');
		}
	}
}
