export default class Point {
	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	empty() {
		this.x = 0;
		this.y = 0;

		return this;
	}
}
