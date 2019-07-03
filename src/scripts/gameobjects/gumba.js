import { AnimatedSprite } from 'pixi.js';
import { Enemy } from 'game/gameobjects';

import { play as playSound } from 'game/assets/sounds';
import { animation } from 'game/assets/spritesheet';

export default class Gumba extends Enemy {
	static STATE_FALLING = 0x0008;

	initialize() {
		super.initialize();

		this.id = 'Gumba';
		this.isFalling = true;
		this.applyGravity = false;

		this.bounds.x = Math.random() * 50 + 75;
		this.bounds.y = -100;
		this.bounds.width = 21;
		this.bounds.height = 30;

		this.speed.x = 0;
		this.speed.y = 1;

		this.sprite = new AnimatedSprite(animation('gumba_fall'));
		this.sprite.animationSpeed = 0.2;
		this.sprite.play();
	}

	update(frame) {
		if (!this.isAlive) {
			this.setFrame('gumba_death.png');
			return;
		}

		if (this.bounds.bottom === -5) {
			this.isFalling = false;
		}

		if (this.isFalling) {
			this.setAnimation('gumba_fall');
		} else {
			this.speed.x = -1.25;
			this.speed.y = 0;

			this.bounds.y = -16;
			this.bounds.width = 16;
			this.bounds.height = 16;

			this.setAnimation('gumba_walk');
		}

		super.update(frame);
	}

	playerCollisionHandler(player) {
		const horizontal = this.bounds.left < player.bounds.right;
		const vertical = this.bounds.centerY >= player.bounds.bottom;

		if (horizontal && vertical) {
			this.isAlive = false;
			this.isStatic = true;
			this.speed.x = 0;

			playSound('stomp');
			setTimeout(() => (this.isGarbage = true), 350);
		}
	}

	get isFalling() {
		return this.state & Gumba.STATE_FALLING;
	}

	set isFalling(value) {
		if (value) {
			this.state |= Gumba.STATE_FALLING;
		} else {
			this.state &= ~Gumba.STATE_FALLING;
		}
	}
}
