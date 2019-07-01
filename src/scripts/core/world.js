import EventEmitter from 'events';
import { settings, autoDetectRenderer, Container } from 'pixi.js';
import { CollisionSolver } from 'game/core';

import remove from 'lodash.remove';

export default class World extends EventEmitter {
	static STATE_PLAYING = 0x0001;
	static STATE_PAUSED = 0x0002;
	static STATE_STOPPED = 0x0004;

	renderer;
	root;
	fps = 60;
	lastUpdateAt = 0;
	currentFrame = 0;
	state = World.STATE_STOPPED;
	gameobjects = [];

	constructor(autoplay = true) {
		super();
		this.initialize();

		settings.SCALE_MODE = 0;

		if (autoplay) {
			this.play();
		}
	}

	initialize() {
		const { innerWidth: width, innerHeight: height } = window;

		// Create pixi renderer
		this.renderer = autoDetectRenderer({
			transparent: true,
			width,
			height,
		});
		document.body.appendChild(this.renderer.view);

		// Create stage and basic collision solver
		this.stage = new Container();
		this.collisionSolver = new CollisionSolver();

		// Add container in which all gameobjects are placed
		this.root = new Container();
		this.root.y = window.innerHeight;
		this.stage.addChild(this.root);
	}

	addGameObject(gameobject) {
		this.root.addChildAt(gameobject.sprite, 0);
		this.gameobjects.push(gameobject);
	}

	removeGameObject(gameobject) {
		remove(this.gameobjects, gameobject);
		this.root.removeChild(gameobject.sprite);
	}

	collectGarbage() {
		const removedObjects = remove(
			this.gameobjects,
			gameobject => gameobject.isGarbage
		);

		removedObjects.forEach(gameobject => {
			this.root.removeChild(gameobject.sprite);
			gameobject.destroy();

			if (gameobject.isPlayer) {
				this.emit('gameend');
			}
		});
	}

	update(force) {
		const now = Date.now();
		const difference = now - this.lastUpdateAt;

		if (difference >= 1000 / this.fps || force) {
			this.currentFrame++;
			this.lastUpdateAt = now;

			this.collisionSolver.update(this.gameobjects);
			this.gameobjects.forEach(gameobject =>
				gameobject.update(this.currentFrame)
			);

			this.renderer.render(this.stage);
		}

		if (this.playing) {
			requestAnimationFrame(this.update.bind(this));
		}

		this.collectGarbage();
	}

	play() {
		this.state = World.STATE_PLAYING;
		this.update();
	}

	stop() {
		this.state = World.STATE_STOPPED;
	}

	get playing() {
		return this.state & World.STATE_PLAYING;
	}
}
