import { Loader } from 'pixi.js';

export const load = () => {
	return new Promise(resolve => {
		const url = `${process.env.ASSETS_URL}/smw.json`;

		if (Loader.shared.resources[url]) {
			resolve();
			return;
		}

		Loader.shared.add(url).load(() => resolve());
	});
};

export const animation = name => {
	const sheet =
		Loader.shared.resources[`${process.env.ASSETS_URL}/smw.json`]
			.spritesheet;
	return sheet.animations[name];
};

export const texture = name => {
	const sheet =
		Loader.shared.resources[`${process.env.ASSETS_URL}/smw.json`]
			.spritesheet;
	return sheet.textures[name];
};
