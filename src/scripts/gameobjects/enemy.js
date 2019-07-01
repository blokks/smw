import { GameObject } from 'game/core';
import { play as playSound } from 'game/assets/sounds';

export default class Enemy extends GameObject {
	initialize() {
		super.initialize();
		this.type = GameObject.TYPE_ENEMY;
	}

	update(frame) {
		if (!this.player.isAlive) {
			this.sprite.stop();
			return;
		}

		super.update(frame);
	}

	onCollision(gameobject) {
		super.onCollision(gameobject);

		if (gameobject.isBullet) {
			this.bulletCollisionHandler(gameobject);
		}

		if (gameobject.isPlayer) {
			this.playerCollisionHandler(gameobject);
		}
	}

	bulletCollisionHandler(bullet) {
		const horizontal = this.bounds.left <= bullet.bounds.right;
		if (horizontal) {
			this.isAlive = false;
			this.isStatic = true;
			this.speed.x = 0;

			playSound('stomp');
			setTimeout(() => (this.isGarbage = true), 350);
		}
	}

	playerCollisionHandler(player) {}
}
