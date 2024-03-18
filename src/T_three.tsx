// import React, { memo, useState } from 'react';
// import T_3DMap from './components/threeWebgl';

// const c1 = {
// 	selected: 'gradient',
// 	single: '#00ff9d',
// 	gradient: {
// 		gradualAngle: 1,
// 		colors: [
// 			{
// 				begins: 0,
// 				value: '#66ff00'
// 			},
// 			{
// 				begins: 100,
// 				value: '#ff23ff'
// 			}
// 		]
// 	}
// };

// const c2 = {
// 	selected: 'gradient',
// 	single: '#00ff9d',
// 	gradient: {
// 		gradualAngle: 1,
// 		colors: [
// 			{
// 				begins: 0,
// 				value: '#f00'
// 			},
// 			{
// 				begins: 100,
// 				value: '#999'
// 			}
// 		]
// 	}
// };

// export const T_Lcz3dAreaMap = memo(function T_Lcz3dAreaMap() {
// 	const config = {
// 		mapConfig: {
// 			range: {
// 				source: 'system',
// 				adcode: { value: '100000' },
// 				uploadData: {
// 					src: 'https://easyv.assets.dtstack.com/components/area/330100.json'
// 				}
// 			},
// 			baseConfig: {
// 				stretchHeight: 3,
// 				stretchFill: 'rgba(52,158,255,1)',
// 				cameraPosition: {
// 					x: 0,
// 					y: 70,
// 					z: 40
// 				},
// 				canDrag: true,
// 				canZooms: {
// 					display: true,
// 					minDistance: 10,
// 					maxDistance: 300
// 				},
// 				sortObjects: true,

// 				clickHover: {
// 					display: true,
// 					stretchHeight: 1,
// 					suspensionHeight: 4,
// 					floatingTime: 1,
// 					bgConfig: {
// 						topColor: {
// 							display: true,
// 							color: '#ffdc15'
// 						},
// 						topMap: {
// 							display: false,
// 							imgUrl:
// 								'https://pica.zhimg.com/80/v2-47da4a436a369c97890995d394f86f02_720w.jpg?source=1940ef5c',
// 							repeat: {
// 								yRepeat: 0.02,
// 								xRepeat: 0.02
// 							}
// 						},
// 						sideColor: '#329cff'
// 					},
// 					boundary: {
// 						topBoundary: {
// 							display: true,
// 							color: '#e100ff'
// 						},
// 						bottomBoundary: {
// 							display: true,
// 							color: '#ff7b00'
// 						}
// 					}
// 				}
// 			},
// 			bgConfig: {
// 				colorObj: {
// 					color: '#2b14ff',
// 					display: true
// 				},
// 				highlight: {
// 					display: true,
// 					fill: 'rgba(0, 255, 234,1)'
// 				},
// 				display: true,
// 				bgImage: {
// 					image:
// 						'https://pica.zhimg.com/80/v2-0f76beea0e5086541bc0ef6d8904b746_720w.jpg',
// 					display: false,
// 					repeat: {
// 						yRepeat: 0.02,
// 						xRepeat: 0.02
// 					}
// 				}
// 			},
// 			boundary: {
// 				topBoundary: {
// 					display: true,
// 					color: '#6EC6FF',
// 					highlight: {
// 						display: true,
// 						color: '#e100ff'
// 					}
// 				},
// 				bottomBoundary: {
// 					display: true,
// 					color: '#60C6FF',
// 					highlight: {
// 						display: true,
// 						color: '#ff7b00'
// 					}
// 				}
// 			},
// 			areaName: {
// 				display: true,
// 				fontStyle: {
// 					fontFamily: 'PingFangSC-Regular',
// 					fontSize: 14,
// 					color: '#ffffff',
// 					fontWeight: 'normal',
// 					letterSpacing: 0
// 				},
// 				textSeries: [
// 					{
// 						value: '河北省',
// 						xOffset: 10,
// 						yOffset: 0
// 					}
// 				],
// 				highlight: {
// 					display: true,
// 					fontStyle: {
// 						fontFamily: 'PingFangSC-Regular',
// 						fontSize: 12,
// 						color: '#f715ff',
// 						fontWeight: 'normal',
// 						letterSpacing: 0
// 					}
// 				}
// 			},
// 			areaShadow: {
// 				display: false,
// 				width: 10,
// 				color: 'rgba(255, 0, 0,1)',
// 				edgeGlow: 1
// 			},
// 			rihConfig: {
// 				display: true,
// 				rootCode: { value: '' },
// 				maxLevel: null,
// 				callbackBtn: {
// 					content: '返回11',
// 					position: { x: 0, y: 0 },
// 					fontStyle: {
// 						fontFamily: 'PingFangSC-Regular',
// 						fontSize: 12,
// 						color: '#fff',
// 						fontWeight: 'normal',
// 						letterSpacing: 0
// 					},
// 					bgConfig: {
// 						color: c2,
// 						imgUrl:
// 							'https://pic2.zhimg.com/50/v2-2038cd0997d58ff893d433761b90c102_hd.webp',
// 						width: 40,
// 						height: 20,
// 						radius: 4
// 					},
// 					border: {
// 						display: true,
// 						color: 'skyblue',
// 						width: 1
// 					}
// 				}
// 			}
// 		}
// 	};
// 	const [status, setStatus] = useState(true);

// 	return (
// 		<div style={{ width: 900, height: 900 }}>
// 			<T_3DMap
// 				onClick={(a) => console.log(a, 'click')}
// 				onChildComEvent={(a, b, c) => console.log(a, b, c)}
// 				onDrollDown={(a) => console.log(a, '下钻')}
// 				onDrollUp={(a) => console.log(a, '上钻')}
// 				{...config}
// 				w={900}
// 				h={900}
// 			/>
// 		</div>
// 	);
// });
