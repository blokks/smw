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

class Game {
	world = new World();
	groundLevel = 600;
	gravity = 1.5;
	score = 0;
	player;

	constructor() {
		this.initialize();
	}

	async initialize() {
		this.world.root.scale.x = 8;
		this.world.root.scale.y = 8;

		this.world.collisionSolver.on('collision', this.collisionHandler);

		console.log('1');
		await loadSpritesheet();
		await loadSounds();

		this.musicId = playSound('music');

		setTimeout(this.spawnMario, 2500);
		setTimeout(this.spawnKoopa, 3000);
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
			setTimeout(this.spawnKoopa, Math.random() * 3000 + 1000);
		}
	};

	spawnGumba = () => {
		if (this.world.playing) {
			const gumba = new Gumba();
			gumba.player = this.player;

			this.world.addGameObject(gumba);

			setTimeout(this.spawnGumba, Math.random() * 6000 + 2000);
		}
	};

	spawnBulletBill = () => {
		if (this.world.playing) {
			const bill = new BulletBill();
			bill.player = this.player;

			this.world.addGameObject(bill);

			const timeout = Math.random() * 9000 + 4000;
			setTimeout(this.spawnBulletBill, timeout);
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
	};

	gameEndHandler = () => {};
}

window.addEventListener('click', () => {
	const game = new Game();
});
