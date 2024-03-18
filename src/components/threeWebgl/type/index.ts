import {
	AreaHeat,
	FlyLine,
	FontStyle,
	LightBar,
	Ripples,
	Scatter,
	Sign,
	Tooltip
} from './child';

export interface ClickHover {
	display: boolean;
	stretchHeight: number;
	suspensionHeight: number;
	floatingTime: number;
	bgConfig?: {
		topColor?: {
			display: boolean;
			color: string;
		};
		topMap?: {
			display: boolean;
			imgUrl: string;
			repeat?: {
				xRepeat: number;
				yRepeat: number;
			};
		};
		sideColor: string;
	};
	boundary?: {
		topBoundary?: Boundary;
		bottomBoundary?: Boundary;
	};
}

interface MapBaseConfig {
	stretchHeight: number;
	stretchFill: string;
	cameraPosition?: {
		x: number;
		y: number;
		z: number;
	};
	canDrag: boolean;
	canZooms: {
		display: boolean;
		minDistance: number;
		maxDistance: number;
	};
	sortObjects: boolean;
	clickHover?: ClickHover;
}

export interface BgConfig {
	display: boolean;
	colorObj?: {
		display: boolean;
		color: string;
	};
	bgImage?: {
		display: boolean;
		image: string;
		repeat?: {
			xRepeat: number;
			yRepeat: number;
		};
	};
	highlight?: {
		display: boolean;
		fill: string;
	};
}

interface Boundary {
	display: boolean;
	color: string;
	// width: number
	highlight?: {
		display: boolean;
		color: string;
		// width: number
	};
}

interface TextSeries {
	value: string;
	xOffset: number;
	yOffset: number;
}

export interface AreamConfig {
	display: boolean;
	fontStyle?: any;
	textSeries?: TextSeries[];
	highlight?: {
		display: boolean;
		fontStyle?: FontStyle;
	};
}

interface AreaShadow {
	display: boolean;
	width: number;
	color: string;
	edgeGlow: number;
}

export interface CallbackBtn {
	content: string;
	position?: { x: number; y: number };
	fontStyle?: FontStyle;
	bgConfig?: {
		color: any;
		imgUrl: string;
		width: number;
		height: number;
		radius: number;
	};
	border?: {
		display: boolean;
		color: string;
		width: number;
	};
}
export interface RihConfig {
	display: boolean;
	rootCode?: { value: any };
	maxLevel: number | null;
	callbackBtn?: CallbackBtn;
}
export interface MapConfig {
	range?: any;
	baseConfig?: MapBaseConfig;
	bgConfig?: BgConfig;
	boundary?: {
		topBoundary?: Boundary;
		bottomBoundary?: Boundary;
	};
	areaName?: AreamConfig;
	// 阴影
	areaShadow?: AreaShadow;
	// 下钻
	rihConfig?: RihConfig;
}

export type MapPath = {
	name: string;
	adcode: string | number;
};
export interface MapRange {
	source: 'system' | 'custom';
	adcode?: { value: string | number };
	uploadData?: any;
}

type Component =
	| Ripples
	| Tooltip
	| Sign
	| AreaHeat
	| Scatter
	| FlyLine
	| LightBar;
export interface AreaMapProps {
	w?: number;
	h?: number;
	design?: boolean;
	mapConfig?: MapConfig;
	childComponents?: Component[];
	onClick?: (param: any) => void;
	onDrollDown?: (param: any) => void; //下钻时
	onDrollUp?: (param: any) => void; // 上钻
	onChildComEvent?: (id: string, type: string, parpm: any) => void;
}
