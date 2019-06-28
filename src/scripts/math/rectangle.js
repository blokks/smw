export default class Rectangle {
	x;
	y;
	width;
	height;

	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	contains(point) {
		const horizontal = point.x > this.left && point.x < this.right;
		const vertical = point.y > this.top && point.y < this.bottom;

		return horizontal && vertical;
	}

	intersects(rectangle) {
		return !(
			rectangle.left > this.right ||
			rectangle.right < this.left ||
			rectangle.top > this.bottom ||
			rectangle.bottom < this.top
		);
	}

	empty() {
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;

		return this;
	}

	get top() {
		return this.y;
	}

	get right() {
		return this.x + this.width;
	}

	get bottom() {
		return this.y + this.height;
	}

	get left() {
		return this.x;
	}

	get centerX() {
		return this.x + this.width * 0.5;
	}

	get centerY() {
		return this.y + this.height * 0.5;
	}
}
