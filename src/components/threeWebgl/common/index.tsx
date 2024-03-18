import ReactDOM from 'react-dom';
import CreateThreeMap from './creatChinaMap';
import * as THREE from 'three';

export const formatColor = function (color = 'rgba(255,255,255,0)') {
	try {
		if (color.indexOf('#') >= 0) {
			return { color: new THREE.Color(color), opacity: 1 };
		} else {
			const rgbRegex =
				/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
			const [, r, g, b, a] = color.match(rgbRegex) as any[];
			return { color: new THREE.Color(`rgb(${r},${g},${b})`), opacity: +a };
		}
	} catch (error) {
		return { color: new THREE.Color('rgb(255,255,255)'), opacity: 0 };
	}
};

/**
 * @param param0 [x,y] 经纬度
 * @param offset 偏移对象
 */
const getOffset = (
	[x, y]: [x: number, y: number],
	offset: { t: number; b: number; l: number; r: number }
) => {
	if (offset.t == 0) {
		offset.t = y;
	} else {
		offset.t < y && (offset.t = y);
	}
	if (offset.b == 0) {
		offset.b = y;
	} else {
		offset.b > y && (offset.b = y);
	}
	if (offset.l == 0) {
		offset.l = x;
	} else {
		offset.l > x && (offset.l = x);
	}
	if (offset.r == 0) {
		offset.r = x;
	} else {
		offset.r < x && (offset.r = x);
	}
};

export function queryGeojson(adcode: any, isFull: boolean = true) {
	return new Promise((resolve, reject) => {
		fetch(
			`https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${
				adcode + (isFull ? '_full' : '')
			}`
		)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				resolve(data);
			})
			.catch(async (err) => {
				if (isFull) {
					let res = await queryGeojson(adcode, false);
					resolve(res);
				} else {
					reject();
				}
			});
	});
}

/**
 * 根据geojson算出 地图距离 [0,0] 的偏移量和缩放比
 * @param mapData geoJSON数据
 * @param width 地图宽
 * @param height 地图高
 * @returns scale  offset
 */
export const getOffsetAndSclae = (
	mapData: any,
	width: number,
	height: number
) => {
	const offset = { t: 0, b: 0, l: 0, r: 0 };

	mapData.features.forEach((elem: any) => {
		const coordinates = elem.geometry.coordinates;
		const coordinatesType = elem.geometry.type; //MultiPolygon  Polygon

		for (let index = 0; index < coordinates.length; index++) {
			const multiPolygon = coordinates[index];
			if (coordinatesType === 'MultiPolygon') {
				if (multiPolygon.length && 2 === multiPolygon[0].length) {
					for (let i = 0; i < multiPolygon.length; i++) {
						const [x, y] = multiPolygon[i];
						getOffset([x, y], offset);
					}
				} else if (multiPolygon.length && multiPolygon[0].length > 2) {
					for (let i = 0; i < multiPolygon[0].length; i++) {
						const [x, y] = multiPolygon[0][i];
						getOffset([x, y], offset);
					}
				}
			} else {
				const polygons =
					multiPolygon.length > 1 ? multiPolygon : multiPolygon[0];
				if (polygons) {
					for (let i = 0; i < polygons.length; i++) {
						const [x, y] = polygons[i];
						getOffset([x, y], offset);
					}
				}
			}
		}
	});

	const { t, b, l, r } = offset;

	const mapWidth = r - l;
	const mapHeight = t - b;

	const maxSize = Math.max(mapWidth, mapHeight);

	const x = -r + mapWidth / 2;
	const y = -t + mapHeight / 2;

	return {
		offset: { x, y },
		scale: { x: (height * 0.1) / maxSize, y: (height * 0.12) / maxSize }
	};
};

export function resetFloatArea(this: CreateThreeMap) {
	const floatObject3D = this.mapGroud.getObjectByName('区域悬浮块');
	if (floatObject3D) {
		floatObject3D.remove(...floatObject3D.children);
		floatObject3D.clear();
		this.floatChilds.forEach((item) => {
			item.position.z = 0;
		});
		this.floatChilds = [];
		this.floatCode = '';
		this.floatAreaAnimate && this.floatAreaAnimate.stop();
	}
}

/**
 * @param multiPolygon geojson 点的数据
 * @param scale  缩放
 * @param center 中心点
 * @returns THREE.Shape
 */
export const drawShape = function (
	multiPolygon: any,
	scale: any,
	center = [0, 0]
) {
	const vector = multiPolygon.map((polygon: any) => {
		const [x, y] = polygon;
		return new THREE.Vector2(
			(x - center[0]) * scale.x,
			(y - center[1]) * scale.y
		);
	});

	return new THREE.Shape(vector);
};

/**
 * @param shape THREE.Shape
 * @param material THREE.Material
 * @param depth 地图拉伸的高度
 * @param name 区域名称
 * @param showAreaLine 正反边界线条对象
 * @param lineMaterial 正反边界线条材质
 * @returns
 */
export const shapeToExtrude = function (
	shape: THREE.Shape,
	depth: any,
	name: any,
	showAreaLine: any = {},
	lineMaterial: any = {},
	type = 'main'
) {
	const options: THREE.ExtrudeGeometryOptions = {
		bevelEnabled: false
	};
	options.depth = depth;
	const geometry = new THREE.ExtrudeGeometry(shape, options);

	if (showAreaLine.justAreaLineObj || showAreaLine.backAreaLineObj) {
		const lineGeometry = new THREE.ExtrudeGeometry(shape, {
				...options,
				depth: 0.1
			}),
			_linegeometry = new THREE.EdgesGeometry(lineGeometry);

		const prefix = (t: string) => {
			return (
				{
					subtop: '上边线-',
					subbottom: '下边线-'
				}[t] || ''
			);
		};

		if (showAreaLine.justAreaLineObj) {
			const line = new THREE.LineSegments(
				_linegeometry,
				lineMaterial.justAreaLineMaterial.clone()
			);
			line.name = prefix(type + 'top') + name + '-line';
			line.position.z = depth;
			showAreaLine.justAreaLineObj.add(line);
		}

		if (showAreaLine.backAreaLineObj) {
			const line = new THREE.LineSegments(
				_linegeometry,
				lineMaterial.backAreaLineMaterial.clone()
			);
			line.name = prefix(type + 'bottom') + name + '-line';
			line.position.z = -0.1;
			showAreaLine.backAreaLineObj.add(line);
		}
	}

	return geometry;
};

// 获取绘制地图的geometry
export function createAreaMapMesh(
	this: CreateThreeMap,
	elem: any,
	{ scale, depth, showAreaLine, lineMaterial, type = 'main' }: any
): THREE.BufferGeometry {
	const coordinates = elem.geometry.coordinates,
		coordinatesType = elem.geometry.type, //MultiPolygon  Polygon
		properties = elem.properties || {},
		adcode = properties.adcode || properties.code,
		MeshArr: THREE.ExtrudeGeometry[] = [];

	for (let index = 0; index < coordinates.length; index++) {
		const multiPolygon = coordinates[index];
		let Mesh: THREE.ExtrudeGeometry | undefined = undefined;
		if (coordinatesType === 'MultiPolygon') {
			if (multiPolygon.length && 2 === multiPolygon[0].length) {
				const shape = drawShape(multiPolygon, scale);
				Mesh = shapeToExtrude(
					shape,
					depth,
					adcode,
					showAreaLine,
					lineMaterial,
					type
				);
			} else if (multiPolygon.length && multiPolygon[0].length > 2) {
				const shape = drawShape(multiPolygon[0], scale);
				Mesh = shapeToExtrude(
					shape,
					depth,
					adcode,
					showAreaLine,
					lineMaterial,
					type
				);
			}
		} else {
			const polygon = multiPolygon.length > 1 ? multiPolygon : multiPolygon[0];
			if (polygon) {
				const shape = drawShape(polygon, scale);
				Mesh = shapeToExtrude(
					shape,
					depth,
					adcode,
					showAreaLine,
					lineMaterial,
					type
				);
			}
		}
		Mesh && MeshArr.push(Mesh);
	}

	const geometry = mergeBufferGeometry(MeshArr);

	return geometry;
}

// 合并THREE.Mesh 数组
export const mergeBufferGeometry = function (objects: THREE.ExtrudeGeometry[]) {
	const sumPosArr: any[] = [];
	const sumNormArr: any[] = [];
	const sumUvArr: any[] = [];

	const modelGeometry = new THREE.BufferGeometry();

	let sumPosCursor = 0;
	let sumNormCursor = 0;
	let sumUvCursor = 0;

	let startGroupCount = 0;
	let lastGroupCount = 0;

	for (let a = 0; a < objects.length; a++) {
		const item = objects[a];
		const posAttArr = item.getAttribute('position').array;

		for (let b = 0; b < posAttArr.length; b++) {
			sumPosArr[b + sumPosCursor] = posAttArr[b];
		}

		sumPosCursor += posAttArr.length;

		const numAttArr = item.getAttribute('normal').array;

		for (let b = 0; b < numAttArr.length; b++) {
			sumNormArr[b + sumNormCursor] = numAttArr[b];
		}

		sumNormCursor += numAttArr.length;

		const uvAttArr = item.getAttribute('uv').array;

		for (let b = 0; b < uvAttArr.length; b++) {
			sumUvArr[b + sumUvCursor] = uvAttArr[b];
		}

		sumUvCursor += uvAttArr.length;

		const groupArr = item.groups;

		for (let b = 0; b < groupArr.length; b++) {
			startGroupCount = lastGroupCount;
			modelGeometry.addGroup(
				startGroupCount,
				groupArr[b].count,
				groupArr[b].materialIndex
			);
			lastGroupCount = startGroupCount + groupArr[b].count;
		}
	}

	modelGeometry.setAttribute(
		'position',
		new THREE.Float32BufferAttribute(sumPosArr, 3)
	);
	sumNormArr.length &&
		modelGeometry.setAttribute(
			'normal',
			new THREE.Float32BufferAttribute(sumNormArr, 3)
		);
	sumUvArr.length &&
		modelGeometry.setAttribute(
			'uv',
			new THREE.Float32BufferAttribute(sumUvArr, 2)
		);

	return modelGeometry;
};

// 移除材质
export function removeMaterial(target: any) {
	for (const key in target) {
		const material = target[key];
		material.dispose && material.dispose();
		delete target[key];
	}
}

export const removeComponents = function (
	labelArr: (HTMLDivElement | HTMLElement)[] | HTMLDivElement | HTMLElement
) {
	if (Array.isArray(labelArr)) {
		labelArr.forEach((item) => {
			if (item.nodeName) {
				ReactDOM.unmountComponentAtNode(item);
			}
		});
		labelArr = [];
	} else {
		if (labelArr && labelArr.nodeName) {
			ReactDOM.unmountComponentAtNode(labelArr);
		}
	}
};
