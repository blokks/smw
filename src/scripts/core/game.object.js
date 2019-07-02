import { Rectangle, Point } from 'game/math';
import { animation, texture } from 'game/assets/spritesheet';

const gravity = 1.1;

export default class GameObject {
	static TYPE_PLAYER = 0x0001;
	static TYPE_ENEMY = 0x0002;
	static TYPE_BULLET = 0x0004;

	static STATE_ALIVE = 0x0001;
	static STATE_GARBAGE = 0x0002;

	static OPTION_APPLY_GRAVITY = 0x0001;
	static OPTION_STATIC_OBJECT = 0x0002;

	id = 'Untitled';
	sprite;
	type;
	currentAnimation;
	currentFrame;
	options = GameObject.OPTION_APPLY_GRAVITY;
	state = GameObject.STATE_ALIVE;
	destroyed = false;
	enabled = false;

	constructor() {
		this.initialize();
		this.enable();
	}

	initialize() {
		this.animations = {};

		this.bounds = new Rectangle(0, 0, 0, 0);
		this.speed = new Point(0, 0);
	}

	update() {
		if (this.isStatic) {
			return;
		}

		if (this.applyGravity) {
			this.speed.y += gravity;
		}

		this.bounds.x += this.speed.x;
		this.bounds.y += this.speed.y;

		if (this.isAlive) {
			this.bounds.y = Math.min(this.bounds.y, -1 * this.bounds.height);
		}

		if (
			this.bounds.right < 0 ||
			this.bounds.top > 0 ||
			this.bounds.left > window.innerWidth
		) {
			this.isGarbage = true;
		}

		if (this.sprite) {
			this.sprite.x = this.bounds.left;
			this.sprite.y = this.bounds.top;
		}
	}

	setAnimation(name) {
		if (this.sprite && this.currentAnimation !== name) {
			this.currentAnimation = name;
			this.currentFrame = null;

			this.sprite.textures = animation(name);
			this.sprite.play();
		}
	}

	setFrame(name) {
		if (this.sprite && this.currentFrame !== name) {
			this.currentFrame = name;
			this.currentAnimation = null;

			this.sprite.textures = [texture(name)];
		}
	}

	onCollision(gameobject) {}

	get applyGravity() {
		return this.options & GameObject.OPTION_APPLY_GRAVITY;
	}

	set applyGravity(value) {
		if (value) {
			this.options |= GameObject.OPTION_APPLY_GRAVITY;
		} else {
			this.options &= ~GameObject.OPTION_APPLY_GRAVITY;
		}
	}

	get isPlayer() {
		return this.type & GameObject.TYPE_PLAYER;
	}

	get isEnemy() {
		return this.type & GameObject.TYPE_ENEMY;
	}

	get isBullet() {
		return this.type & GameObject.TYPE_BULLET;
	}

	get isAlive() {
		return this.state & GameObject.STATE_ALIVE;
	}

	set isAlive(value) {
		if (value) {
			this.state |= GameObject.STATE_ALIVE;
		} else {
			this.state &= ~GameObject.STATE_ALIVE;
		}
	}

	get isStatic() {
		return this.options & GameObject.OPTION_STATIC_OBJECT;
	}

	set isStatic(value) {
		if (value) {
			this.options |= GameObject.OPTION_STATIC_OBJECT;
		} else {
			this.options &= ~GameObject.OPTION_STATIC_OBJECT;
		}
	}

	get isGarbage() {
		return this.state & GameObject.STATE_GARBAGE;
	}

	set isGarbage(value) {
		if (value) {
			this.state |= GameObject.STATE_GARBAGE;
		} else {
			this.state &= ~GameObject.STATE_GARBAGE;
		}
	}

	enable() {
		if (!this.enabled) {
			this.enabled = true;
		}
	}

	disable() {
		if (this.enabled) {
			this.enabled = false;
		}
	}

	destroy() {
		if (!this.destroyed) {
			this.destroyed = true;

			this.sprite.stop();
			this.sprite.destroy();

			this.bounds = null;
			this.sprite = null;
		}
	}
}
