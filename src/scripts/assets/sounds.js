import { Howl } from 'howler';

let sound;

export const load = () => {
	return new Promise(resolve => {
		sound = new Howl({
			src: [
				`${process.env.ASSETS_URL}/smw.mp3`,
				`${process.env.ASSETS_URL}/smw.ogg`,
			],
			autoplay: false,
			loop: false,
			sprite: {
				coin: [0, 419],
				gameover: [2000, 5339],
				jump: [9000, 332],
				death: [11000, 3270],
				stomp: [16000, 131],
				swooper: [18000, 1414],
				music: [21000, 92539],
			},
			onload: () => resolve(),
		});
	});
};

export const play = name => {
	return sound.play(name);
};

export const stop = name => {
	sound.stop(name);
};
