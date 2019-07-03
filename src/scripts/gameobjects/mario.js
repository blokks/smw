import { AnimatedSprite } from 'pixi.js';
import { GameObject } from 'game/core';

import { play as playSound } from 'game/assets/sounds';
import { texture } from 'game/assets/spritesheet';

export default class Mario extends GameObject {
	static STATE_INTRO = 0x0004;
	static STATE_JUMPING = 0x008;
	static STATE_OUTRO = 0x0016;

	comboCount = 0;

	initialize() {
		super.initialize();

		this.id = 'Mario';
		this.type = GameObject.TYPE_PLAYER;
		this.state |= Mario.STATE_INTRO;

		this.bounds.x = 0;
		this.bounds.y = -100;
		this.bounds.width = 16;
		this.bounds.height = 28;

		this.sprite = new AnimatedSprite([texture('mario_jump_down.png')]);
		this.sprite.animationSpeed = 0.2;
		this.sprite.play();

		this.mouseDownHandler = this.mouseDownHandler.bind(this);
		this.keyDownHandler = this.keyDownHandler.bind(this);
	}

	spawnKoopa = () => {};

	update() {
		// Mario is death
		if (!this.isAlive) {
			this.setFrame('mario_death.png');
		}

		// Mario is jumping
		else if (this.isJumping) {
			if (this.speed.y <= 3) {
				this.setFrame('mario_jump_up.png');
			} else {
				this.setFrame('mario_jump_down.png');
			}
		}

		// Mario is dropping
		else if (this.state & Mario.STATE_INTRO) {
			this.setFrame('mario_jump_down.png');
		}

		// Mario is walking
		else {
			this.setAnimation('mario_walk');
		}

		super.update();

		// Reset properties if mario is on the ground
		if (this.bounds.bottom === -5) {
			this.comboCount = 0;
			this.state &= ~Mario.STATE_INTRO;
			this.isJumping = false;
		}
	}

	jump() {
		const intro = this.state & Mario.STATE_INTRO;

		if (
			this.isAlive &&
			!this.isJumping &&
			!intro &&
			this.bounds.bottom === -5
		) {
			this.isJumping = true;
			this.speed.y = -12;

			playSound('jump');
		}
	}

	onCollision(gameobject) {
		super.onCollision(gameobject);

		if (!gameobject.isPlayer) {
			const horizontal = this.bounds.right >= gameobject.bounds.left;
			const vertical = this.bounds.bottom <= gameobject.bounds.centerY;

			if (horizontal && vertical) {
				this.speed.y = -9;
				this.comboCount++;
			} else {
				this.speed.y = -12;
				this.isAlive = false;
				this.isStatic = true;

				setTimeout(() => (this.isStatic = false), 600);
			}

			return;
		}
	}

	keyDownHandler() {
		switch (event.keyCode) {
			case 32:
				this.jump();
				break;
		}
	}

	mouseDownHandler() {
		this.jump();
	}

	get combo() {
		return this.comboCount;
	}

	get isJumping() {
		return this.state & Mario.STATE_JUMPING;
	}

	set isJumping(value) {
		if (value) {
			this.state |= Mario.STATE_JUMPING;
		} else {
			this.state &= ~Mario.STATE_JUMPING;
		}
	}

	enable() {
		if (!this.enabled) {
			super.enable();

			window.addEventListener('keydown', this.keyDownHandler);
			window.addEventListener('mousedown', this.mouseDownHandler);
		}
	}

	disable() {
		if (this.enabled) {
			super.disable();

			window.removeEventListener('keydown', this.keyDownHandler);
			window.removeEventListener('mousedown', this.mouseDownHandler);
		}
	}

	destroy() {
		if (!this.destroyed) {
			super.destroy();
			this.disable();
		}
	}
}
