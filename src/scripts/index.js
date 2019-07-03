import EventEmitter from 'events';

import { World } from 'game/core';
import {
	BulletBill,
	Gumba,
	Koopa,
	ShieldedKoopa,
	Mario,
} from 'game/gameobjects';
import {
	load as loadSounds,
	play as playSound,
	stop as stopSound,
} from 'game/assets/sounds';
import { load as loadSpritesheet } from 'game/assets/spritesheet';

class Game extends EventEmitter {
	world = new World();
	groundLevel = 600;
	gravity = 1.5;
	score = 0;
	player;

	constructor() {
		super();
		this.initialize();
	}

	async initialize() {
		this.world.root.scale.x = 8;
		this.world.root.scale.y = 8;

		this.world.once('gameend', this.gameEndHandler);
		this.world.collisionSolver.on('collision', this.collisionHandler);

		await loadSpritesheet();
		await loadSounds();

		this.emit('gamestart');
		this.musicId = playSound('music');

		if (process.env.APP_ENV === 'development') {
			this.spawnMario();
			this.spawnKoopa();
		} else {
			this.marioSpawnId = setTimeout(this.spawnMario, 2500);
			this.koopaSpawnId = setTimeout(this.spawnKoopa, 3000);
		}
	}

	spawnMario = () => {
		this.player = new Mario();
		this.world.addGameObject(this.player);
	};

	spawnKoopa = () => {
		if (this.world.playing) {
			const index = Math.ceil(Math.random() * 4);

			let koopa;
			if (index === 4 && this.score >= 4) {
				koopa = new ShieldedKoopa();
			} else {
				koopa = new Koopa();
			}

			koopa.player = this.player;

			this.world.addGameObject(koopa);
			this.koopaSpawnId = setTimeout(
				this.spawnKoopa,
				Math.random() * 3000 + 1000
			);
		}
	};

	spawnGumba = () => {
		if (this.world.playing) {
			const gumba = new Gumba();
			gumba.player = this.player;

			this.world.addGameObject(gumba);

			this.gumbaSpawnId = setTimeout(
				this.spawnGumba,
				Math.random() * 6000 + 2000
			);
		}
	};

	spawnBulletBill = () => {
		if (this.world.playing) {
			const bill = new BulletBill();
			bill.player = this.player;

			this.world.addGameObject(bill);

			const timeout = Math.random() * 9000 + 4000;
			this.billSpawnId = setTimeout(this.spawnBulletBill, timeout);
		}
	};

	collisionHandler = ({ objectA, objectB }) => {
		if (objectA.isBullet) {
			this.score += 1;
		} else if (objectA.isAlive && !objectB.isAlive) {
			this.score += objectA.combo;
		}

		if (this.score === 4) {
			this.spawnGumba();
		}

		if (this.score === 8 || this.score === 16) {
			this.spawnBulletBill();
		}

		if (!this.player.isAlive) {
			stopSound(this.musicId);
			playSound('death');
		}

		const formattedScore = this.score < 10 ? '0' + this.score : this.score;
		this.emit('scoreupdate', { score: this.score, formattedScore });
	};

	gameEndHandler = async () => {
		const formattedScore = this.score < 10 ? '0' + this.score : this.score;
		this.emit('gameend', { score: this.score, formattedScore });
	};

	destroy() {
		this.world.destroy();

		this.removeAllListeners('gamestart');
		this.removeAllListeners('scoreupdate');
		this.removeAllListeners('gameend');

		clearTimeout(this.marioSpawnId);
		clearTimeout(this.koopaSpawnId);
		clearTimeout(this.gumbaSpawnId);
		clearTimeout(this.billSpawnId);

		stopSound(this.musicId);

		this.world = null;
		this.player = null;
	}
}

window.blokks = window.blokks || {};
window.blokks.MarioGame = Game;

if (process.env.APP_ENV === 'development') {
	const game = new Game();

	window.addEventListener('keydown', event => {
		if (event.keyCode === 27) {
			game.destroy();
		}
	});
}
