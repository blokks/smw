import { Loader } from 'pixi.js';

export const load = () => {
	return new Promise(resolve => {
		Loader.shared
			.add(`${process.env.ASSETS_URL}/smw.json`)
			.load(() => resolve());
	});
};

export const animation = name => {
	const sheet = Loader.shared.resources[`${process.env.ASSETS_URL}/smw.json`].spritesheet;
	return sheet.animations[name];
};

export const texture = name => {
	const sheet = Loader.shared.resources[`${process.env.ASSETS_URL}/smw.json`].spritesheet;
	return sheet.textures[name];
};
