import EventEmitter from 'events';

export default class CollisionSolver extends EventEmitter {
	update(gameobjects) {
		gameobjects.forEach((objectA, index) => {
			if (!objectA.isAlive) {
				return;
			}

			const remainingObjects = gameobjects.slice(index + 1);
			remainingObjects.forEach(objectB => {
				if (!objectB.isAlive) {
					return;
				}

				if (
					objectA.type !== objectB.type &&
					objectA.bounds.intersects(objectB.bounds)
				) {
					objectA.onCollision(objectB);
					objectB.onCollision(objectA);

					this.emit('collision', { objectA, objectB });
				}
			});
		});
	}

	destroy() {
		this.removeAllListeners('collision');
	}
}
