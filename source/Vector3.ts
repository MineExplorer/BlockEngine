/**
 * Class which represents three-dimensional vector
 * and basic operations with it.
 */
class Vector3 implements Vector {
	static readonly DOWN: Vector3 = new Vector3(0, -1, 0);
	static readonly UP: Vector3 = new Vector3(0, 1, 0);
	static readonly NORTH: Vector3 = new Vector3(0, 0, -1);
	static readonly SOUTH: Vector3 = new Vector3(0, 0, 1);
	static readonly EAST: Vector3 = new Vector3(-1, 0, 0);
	static readonly WEST: Vector3 = new Vector3(1, 0, 0);

	/**
	 * @param side block side
	 * @returns direction vector for specified side 
	 */
	static getDirection(side: number): Vector3 {
		switch(side) {
			case 0: return this.DOWN;
			case 1: return this.UP;
			case 2: return this.NORTH;
			case 3: return this.SOUTH;
			case 4: return this.EAST;
			case 5: return this.WEST;
			default: Logger.Log("Invalid block side: " + side, "ERROR");
		}
	}

	/** X coord of the vector */
	x: number;
	/** Y coord of the vector */
	y: number;
	/** Z coord of the vector */
	z: number;

	constructor(vx: number, vy: number, vz: number);
	constructor(vector: Vector);
	constructor(vx: any, vy?: number, vz?: number) {
		if (typeof(vx) == "number") {
			this.x = vx;
			this.y = vy;
			this.z = vz;
		}
		else {
			const v = vx;
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
		}
	}

	/**
	 * Copies coords to a new vector.
	 * @returns vector copy.
	 */
	copy(): Vector3
	/**
	 * Copies coords to specified vector.
	 * @param dst destination vector to set values.
	 * @returns destination vector.
	 */
	copy(dst: Vector3): Vector3
	copy(dst?: Vector3): Vector3 {
		if (dst) {
			return dst.set(this);
		}
        return new Vector3(this);
    }

	/**
	 * Sets vector coords.
	 */
	set(vx: number, vy: number, vz: number): Vector3;
	set(vector: Vector): Vector3;
	set(vx: any, vy?: number, vz?: number): Vector3 {
		if (typeof(vx) == "number") {
			this.x = vx;
			this.y = vy;
			this.z = vz;
			return this;
		}
		const v = vx;
		return this.set(v.x, v.y, v.z);
    }

	/**
	 * Adds vector.
	 * @returns result vector.
	 */
    add(vx: number, vy: number, vz: number): Vector3;
    add(vector: Vector): Vector3;
    add(vx: any, vy?: number, vz?: number): Vector3 {
		if (typeof(vx) == "number") {
			this.x += vx;
			this.y += vy;
			this.z += vz;
			return this;
		}
		const v = vx;
		return this.add(v.x, v.y, v.z);
    }

	/**
	 * Adds vector scaled by factor.
	 * @param vector vector to add.
	 * @param scale scale factor
	 * @returns result vector.
	 */
    addScaled(vector: Vector, scale: number): Vector3 {
        return this.add(vector.x * scale, vector.y * scale, vector.z * scale);
    }

	/**
	 * Substracts vector.
	 * @returns result vector.
	 */
    sub(vx: number, vy: number, vz: number): Vector3;
    sub(vector: Vector): Vector3;
    sub(vx: any, vy?: number, vz?: number): Vector3 {
		if (typeof(vx) == "number") {
			this.x -= vx;
			this.y -= vy;
			this.z -= vz;
			return this;
		}
		const v = vx;
		return this.sub(v.x, v.y, v.z);
    }

	/**
	 * Calculates cross product of vectors.
	 * @returns result vector.
	 */
    cross(vx: number, vy: number, vz: number): Vector3;
    cross(vector: Vector): Vector3;
    cross(vx: any, vy?: number, vz?: number): Vector3 {
		if (typeof(vx) == "number") {
			return this.set(this.y * vz - this.z * vy, this.z * vx - this.x * vz, this.x * vy - this.y * vx);
		}
		const v = vx;
		return this.cross(v.x, v.y, v.z);
    }

	/**
	 * @returns dot product of vectors.
	 */
	dot(vx: number, vy: number, vz: number): number;
	dot(vector: any): number;
	dot(vx: any, vy?: number, vz?: number): number {
		if (typeof(vx) == "number") {
			return this.x * vx + this.y * vy + this.z * vz;
		}
		const v = vx;
		return this.dot(v.x, v.y, v.z);
    }

	/**
	 * Normalizes vector.
	 * @returns normalized vector.
	 */
    normalize(): Vector3 {
        const len = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }

	/**
	 * @returns vector length squared
	 */
    lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

	/**
	 * @returns vector length.
	 */
    length(): number {
        return Math.sqrt(this.lengthSquared());
    }

	/**
	 * Multiplies vector coords by -1.
	 * @returns opposite vector. 
	 */
    negate(): Vector3 {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

	/**
	 * Calculates squared distance to another point.
	 * @param vx x coord
	 * @param vy y coord
	 * @param vz z coord
	 * @returns squared distance 
	 */
    distanceSquared(vx: number, vy: number, vz: number): number;
	/**
	 * Calculates squared distance to another point.
	 * @param coords coords of second point
	 * @returns squared distance
	 */
    distanceSquared(coords: Vector): number;
    distanceSquared(vx: any, vy?: number, vz?: number): number {
		if (typeof(vx) == "number") {
			const dx = vx - this.x;
			const dy = vy - this.y;
			const dz = vz - this.z;
			return dx * dx + dy * dy + dz * dz;
		}
		const v = vx;
		return this.distanceSquared(v.x, v.y, v.z);
    }

	/**
	 * Calculates distance to another point.
	 * @param vx x coord
	 * @param vy y coord
	 * @param vz z coord
	 * @returns distance 
	 */
	distance(vx: number, vy: number, vz: number): number;
	/**
	 * Calculates distance to another point.
	 * @param coords coords of second point
	 * @returns distance 
	 */
	distance(coords: Vector): number;
	distance(vx: any, vy?: number, vz?: number): number {
		if (typeof(vx) == "number") {
			return Math.sqrt(this.distanceSquared(vx, vy, vz));
		}
		const v = vx;
		return this.distance(v.x, v.y, v.z);
    }

	/**
	 * Scales vector coords by factor.
	 * @param factor scaling factor
	 * @returns scaled vector
	 */
    scale(factor: number): Vector3 {
        this.x *= factor;
        this.y *= factor;
        this.z *= factor;
        return this;
    }

	/**
	 * Scales vector length to specified value.
	 * @param len target length
	 * @returns scaled vector
	 */
    scaleTo(len: number): Vector3 {
        const factor = len / this.length();
        return this.scale(factor);
    }

    toString() {
        return "[ " + this.x + ", " + this.y + ", " + this.z + " ]";
    }
}

EXPORT("Vector3", Vector3);