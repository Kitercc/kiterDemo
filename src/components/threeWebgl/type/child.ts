export interface ToolTipImageStyle {
	fixedImgUrl?: string;
	expImgUrl?: string;
	radius: number;
	width: number;
	height: number;
	rotate: number;
	clickPreview: boolean;
	position?: { x: number; y: number };
}

export interface ToolTipImageConfig extends ToolTipImageStyle {
	display: boolean;
	source: 'fixed' | 'exp';
	fixedImageList?: ToolTipImageStyle[];
}

export interface Border {
	display?: boolean;
	color?: string;
	width?: number;
	radius?: number;
}

export interface NumberFormat {
	// 数字格式化配置
	display: boolean;
	decollate: boolean;
	decimal: number;
	round: boolean;
	percentage?: boolean;
	negativeing?: string; //  负数显示值  负号 minus  括号 brackets  绝对值  abs
	zeroFill?: boolean;
}

export interface LineContent {
	fieldName: string;
	title: string;
	latout?: any;
	position?: { x: number; y: number };
	titleStyle?: any;
	valueStyle?: any;
}

export interface FontStyle {
	fontFamily: string;
	fontSize: number;
	color: string;
	fontWeight: any;
	letterSpacing: number | string; // 文字间距
	italics?: boolean;
	textAlign?: any;
}

interface BaseConfig {
	levels: string;
	zIndex?: number;
	select?: {
		value: any;
	};
}

// 涟漪
//#region

export type RipplesData = {
	lng: string | number;
	lat: string | number;
};

export interface RipplesStyle {
	display?: boolean;
	condition?: string | boolean;
	radius: string; // 初始半径
	haloRadius: string; //晕开半径
	haloSpeed: number; // 晕开速度
	haloInterval: number; // 晕开间隔
	color: string;
	stroke: any;
}

export type Ripples = {
	type: 'lcz-3d-area-map-ripples';
	id: string;
	config: {
		show: boolean;
		condition: any;
		globalConfig?: BaseConfig;
		ripplesConfig?: {
			normalStyle?: RipplesStyle;
			styleSection?: RipplesStyle[];
		};
	};
	data?: any[];
};

export type OutRipples = {
	type: 'lcz-3d-area-map-ripples';
	id: string;
	show: boolean;
	condition: any;
	globalConfig?: BaseConfig;
	ripplesConfig?: {
		normalStyle?: RipplesStyle;
		styleSection?: RipplesStyle[];
	};
	data?: any[];
};
//#endregion

// 提示框
//#region
export interface Area3dMapCurrentArea {
	manualTrigger: boolean;
	targetType: 'mouseenter' | 'click';
	autoCarousel: boolean;
	residenceTime: number;
	movePause: boolean;
	sign?: any;
	area?: {
		display: boolean;
		color: string;
	};
}

interface ToolTipstyleConfig {
	position?: { x: number; y: number };
	padding?: { l: number; t: number; b: number; r: number };
	bgConfig?: { color: any; imgUrl: string; radius: number };
	border?: {
		display: boolean;
		color: string;
		width: number;
	};
}
export interface Tooltip {
	type: 'lcz-3d-area-map-tooltip';
	id: string;
	config: {
		show: boolean;
		condition: any;
		globalConfig?: BaseConfig;
		currentArea?: Area3dMapCurrentArea;
		size?: {
			width: number;
			height: number;
		};
		styleConfig?: ToolTipstyleConfig;
		lineContent?: LineContent[];
		imageConfig?: ToolTipImageConfig;
	};
	data?: any[];
	event?: {
		onDataChange?: (data: any) => void;
	};
}

export interface OutToolTip {
	type: 'lcz-3d-area-map-tooltip';
	id: string;
	show: boolean;
	condition: any;
	globalConfig?: BaseConfig;
	currentArea?: Area3dMapCurrentArea;
	size?: {
		width: number;
		height: number;
	};
	styleConfig?: ToolTipstyleConfig;
	lineContent?: LineContent[];
	imageConfig?: ToolTipImageConfig;
	data?: any[];
	onDataChange?: (data: any) => void;
}
//#endregion

// 标牌
//#region

export type AreaMapSignData = {
	adcode: number | string;
	area: string;
	lng?: number | string;
	lat?: number | string;
};

interface SignFontStyle extends FontStyle {
	styleFollow?: boolean;
}

export interface SignStyle {
	normalBackType?: 'color' | 'custom';
	focusBackType?: 'color' | 'custom';
	bgColor: any;
	imageUrl: string;
	radius: number;
	border?: { display: boolean; color: string; width: number };
	padding?: { top: number; right: number; bottom: number; left: number };
	decorate?: {
		imgUrl: string;
		width: number;
		height: number;
		offset?: { x: number; y: number };
	};
	offset?: { x: number; y: number };
	fontStyle?: SignFontStyle;
}

export type Sign = {
	type: 'lcz-3d-area-map-sign';
	id: string;
	config: {
		show: boolean;
		condition: any;
		globalConfig?: BaseConfig;
		normalStyle?: SignStyle;
		focuStyle?: SignStyle;
	};
	data?: AreaMapSignData[];
};

export type OutSign = {
	type: 'lcz-3d-area-map-sign';
	id: string;
	show: boolean;
	condition: any;
	globalConfig?: BaseConfig;
	normalStyle?: SignStyle;
	focuStyle?: SignStyle;
	data?: AreaMapSignData[];
};
//#endregion

// 区域热力
//#region

export type AreaMapAreaHeatData = {
	adcode: number | string;
	value: number;
};
export interface AreaHeat {
	type: 'lcz-3d-area-map-areaheat';
	id: string;
	config: {
		show: boolean;
		condition: any;
		heatConfig?: {
			styleSeries?: any[];
			defectColor: string;
		};
	};
	data?: AreaMapAreaHeatData[];
}

export interface OutAreaHeat {
	type: 'lcz-3d-area-map-areaheat';
	id: string;
	show: boolean;
	condition: any;
	heatConfig?: {
		styleSeries?: any[];
		defectColor: string;
	};
	data?: AreaMapAreaHeatData[];
}
//#endregion

// 散点
//#region

export type ScatterData = {
	lat: number | string;
	lng: number | string;
	value: number;
	type?: string;
};

export interface Scattertype {
	imgUrl: string;
	opacity: number;
}

export interface ScatterSign {
	display: boolean;
	imgUrl: string;
	opacity: number;
	size?: { width: number; height: number };
	offset?: { x: number; y: number };
	fontStyle?: FontStyle;
}

interface ScatterGlobal extends BaseConfig {
	size: { min: { value: number }; max: { value: number } };
}

export interface ScatterStyle {
	type?: { value: any };
	scatter?: Scattertype;
	scatterSign?: ScatterSign;
}
export interface Scatter {
	type: 'lcz-3d-area-map-scatter';
	id: string;
	config: {
		show: boolean;
		condition: any;
		globalConfig?: ScatterGlobal;
		scatterNormalStyle?: ScatterStyle;
		scatterStyleList?: ScatterStyle[];
	};
	data?: ScatterData[];
	event?: {
		onClick?: (data: ScatterData) => void;
	};
}

export interface OutScatter {
	type: 'lcz-3d-area-map-scatter';
	id: string;
	show: boolean;
	condition: any;
	globalConfig?: ScatterGlobal;
	scatterNormalStyle?: ScatterStyle;
	scatterStyleList?: ScatterStyle[];
	data?: ScatterData[];
	onClick?: (data: ScatterData) => void;
}
//#endregion

// 飞线
//#region

export type FlyDataMap = {
	fromLat: number | string;
	fromLng: number | string;
	toLat: number | string;
	toLng: number | string;
};

export interface FlightConfig {
	speed: number;
	height: number;
	smooth: number;
	randomStart: boolean;
}

interface LineStyle {
	display?: boolean;
	baseColor?: string;
	flyColor?: {
		start: string;
		end: string;
	};
	lineWidth: number;
	lineLen?: number;
}

export interface LineConfig {
	baseLine?: LineStyle;
	flyline?: LineStyle;
}

export interface FlyLine {
	type: 'lcz-3d-area-map-flyline';
	id: string;
	config: {
		show: boolean;
		condition: any;
		globalConfig?: BaseConfig;
		flightConfig?: FlightConfig;
		lineConfig?: LineConfig;
	};
	data?: FlyDataMap[];
}

export interface OutFlyLine {
	type: 'lcz-3d-area-map-flyline';
	id: string;
	show: boolean;
	condition: any;
	globalConfig?: BaseConfig;
	flightConfig?: FlightConfig;
	lineConfig?: LineConfig;
	data?: FlyDataMap[];
}
//#endregion

// 柱子
//#region

interface GradualChange {
	start: string;
	end: string;
}

interface LightBarGlobal {
	levels: string;
	actionWay: 'auto' | 'slider';
	sliderPassStyle?: GradualChange;
}

export interface LightBarConfig {
	colors?: GradualChange;
	raiseTime: number;
	barWidth: number;
	barHeight?: {
		min: number;
		max: number;
	};
	barType: 'rect' | 'circle';
}

interface MainSection {
	offset: { x: number; y: number };
	width: number;
	height: number;
	bgColor: any;
}

interface SerialSection {
	display: boolean;
	size: number;
	offset?: { x: number; y: number };
	fontStyle?: FontStyle;
	customBackground: boolean;
	radius: number;
	bgImageUrl?: string;
	inshadow?: any;
	outshadow?: any;
	border?: Border;
}

interface ValueSection {
	offset: { x: number; y: number };
	bgColor: any;
	radius: number;
	border?: Border;
	padding?: { t: number; r: number; b: number; l: number };
	fontStyle: FontStyle;
	format?: NumberFormat;
}

interface AddressSection {
	display: boolean;
	offset: { x: number; y: number };
	fontStyle: FontStyle;
}

export interface TextConfig {
	mainSection?: MainSection;
	suffix?: {
		content: string;
		offset: number;
		fontStyle: FontStyle;
	};
	serialSection?: SerialSection;
	valueSection?: ValueSection;
	addressSection?: AddressSection;
	scale?: {
		min: number;
		max: number;
	};
}

export type LightBarDataMap = {
	lat: number | string;
	lng: number | string;
	value: number | string;
	area: string;
	adcode: string;
};

export interface LightBar {
	type: 'lcz-3d-area-map-lightbar';
	id: string;
	config: {
		show: boolean;
		condition: any;
		globalConfig?: LightBarGlobal;
		lightbarConfig?: LightBarConfig;
		textConfig?: TextConfig;
	};
	data?: LightBarDataMap[];
	event?: {
		onClick?: (data: LightBarDataMap) => void;
	};
}

export interface OutLightBar {
	type: 'lcz-3d-area-map-lightbar';
	id: string;
	show: boolean;
	condition: any;
	globalConfig?: LightBarGlobal;
	lightbarConfig?: LightBarConfig;
	textConfig?: TextConfig;
	data?: LightBarDataMap[];
	onClick?: (data: LightBarDataMap) => void;
}

//#endregion
