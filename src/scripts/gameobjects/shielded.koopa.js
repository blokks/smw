import { GameObject } from 'game/core';
import { Koopa } from 'game/gameobjects';
import { play as playSound } from 'game/assets/sounds';

export default class ShieldedKoopa extends Koopa {
	initialize() {
		super.initialize();
		this.id = 'ShieldedKoopa';
	}

	update(frame) {
		super.update(frame);

		if (this.isBullet) {
			this.bounds.y = -16;
			this.sprite.y = this.bounds.top;

			this.setAnimation('shield');
		}
	}

	playerCollisionHandler(player) {
		console.log('test');
		const horizontal = this.bounds.left < player.bounds.right;
		const vertical = this.bounds.centerY >= player.bounds.bottom;

		if (horizontal && vertical) {
			if (this.isEnemy) {
				this.type = GameObject.TYPE_BULLET;
				this.speed.x = 0;
			} else {
				this.speed.x = 5;
			}

			playSound('stomp');
		}
	}
}
