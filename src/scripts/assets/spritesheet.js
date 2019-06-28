import { Loader } from 'pixi.js';

export const load = () => {
	return new Promise(resolve => {
		Loader.shared.add('smw.json').load(() => resolve());
	});
};

export const animation = name => {
	const sheet = Loader.shared.resources['smw.json'].spritesheet;
	return sheet.animations[name];
};

export const texture = name => {
	const sheet = Loader.shared.resources['smw.json'].spritesheet;
	return sheet.textures[name];
};
