var select;
var token = 'nHZuzkIYrW9TVLfTE7qclNwtj3VKpN2Btm47aGKlf2IGDF_n8mNe3ICSkQenYilqrgY8bdM9cYzPukvEaKtqXg..';
SuperMap.SecurityManager.registerToken(mapurl, token);
//初始化超图
var layer = new ol.layer.Tile({
	source: new ol.source.TileSuperMapRest({
		url: mapurl,
		crossOrigin: 'anonymous',                     //打印有跨域
		wrapX: true
	}),
	projection: 'EPSG:4326'
});
//初始化天地图
var baseLayers = ["vec_w", "img_w", "ter_w","cva_w"];
var vecLayer = getBaseLayer("地图", baseLayers[0]);
var vecAnno = getBaseLayer("地图标注", baseLayers[3]);
function getBaseLayer(layername, layer) {
	return new ol.layer.Tile({
		title: layername,
		source: new ol.source.XYZ({
			crossOrigin: 'anonymous',				//打印有跨域
			url: "http://t4.tianditu.com/DataServer?T=" + layer + "&x={x}&y={y}&l={z}&tk=2cf48884eec6baf37013fd13f908ee84"
		})
	});
};
//初始化一个点矢量图层
var pointsource = new ol.source.Vector({
	wrapX: false
});
var pointvector = new ol.layer.Vector({
	source: pointsource
});
//初始化点样式
var pointstyle = new ol.style.Style({
	fill: new ol.style.Fill({
		color: 'rgba(255, 255, 255, 0.2)'
	}),
	stroke: new ol.style.Stroke({
		color: '#ffcc33',
		width: 2
	}),
	image: new ol.style.Icon({
		src: '../../image/gis/markers_normal.png',
		scale:0.7
	})
});
//初始化一个线矢量图层
var linesource = new ol.source.Vector({
	wrapX: false
});
var linevector = new ol.layer.Vector({
	source: linesource
});
//初始化线样式
var lineStyle = new ol.style.Style({
	stroke: new ol.style.Stroke({
		// color: 'rgba(214, 75 ,131, 1)',
		color: 'rgba(255, 215, 0, 1)',
		width: 3
	}),
	fill: new ol.style.Fill({
		color: 'rgba(255, 215, 0, 0.1)'
	})
});
//全局绘制
var draw,interaction;
//前后视图
window.app = {};
var app = window.app;
var if_mouse = true;
var now_view = -1;
var view_list = [];
app.lastViewControl = function(opt_options) {
	var options = opt_options || {};
	var button = document.createElement('button');
	button.innerHTML = '<img src="../../image/gis/left.png" alt="前视图" />';

	button.title = '前视图';
	var this_ = this;
	var handleLastView = function() {
		if_mouse = false;
		if (now_view - 1 < 0) now_view = 0;
		else now_view = now_view - 1;
		var temp_view = view_list[now_view];
		map.getView().animate({
			center: temp_view['Center'],
			zoom: temp_view['zoom'],
			duration: 500
		});
	}
	button.addEventListener('click', handleLastView, false);
	button.addEventListener('touchstart', handleLastView, false);
	var element = document.getElementById('viewdiv');
	element.appendChild(button);
	ol.control.Control.call(this, {
		element: element,
		target: options.target
	});
}
app.nextViewControl = function(opt_options) {
	var options = opt_options || {};
	var button = document.createElement('button');
	button.innerHTML = '<img src="../../image/gis/right.png" alt="前视图" />';
	button.title = '后视图';
	var this_ = this;
	var handleNextView = function() {
		if_mouse = false;
		if(now_view + 1 >= view_list.length) now_view = now_view;
		else now_view = now_view + 1;
		var temp_view = view_list[now_view];
		map.getView().animate({
			center: temp_view['Center'],
			zoom: temp_view['zoom'],
			duration: 500
		});
	}
	button.addEventListener('click', handleNextView, false);
	button.addEventListener('touchstart', handleNextView, false);
	var element = document.getElementById('viewdiv');
	element.appendChild(button);
	ol.control.Control.call(this, {
		element: element,
		target: options.target
	});
}
ol.inherits(app.lastViewControl, ol.control.Control);
ol.inherits(app.nextViewControl, ol.control.Control);
//初始地图
var map = new ol.Map({
	target: 'map',
	controls: ol.control.defaults({
		attribution: false,
		zoom: false
	}).extend([new app.lastViewControl(),new app.nextViewControl()]),
	interactions: ol.interaction.defaults({
      altShiftDragRotate:false,
      pinchRotate:false,
      doubleClickZoom: false
  }),
	view: new ol.View({
		center: mapconfig.center,
		maxZoom: mapconfig.maxZoom,
		minZoom: mapconfig.minZoom,
		zoom: mapconfig.initialZoom,
		// maxZoom: 18,
		// minZoom: 6,
		projection: 'EPSG:4326'
	})
});
//地图添加图层
setTimeout(function() {
	map.addLayer(vecLayer);       				//天地图底图
	map.addLayer(vecAnno);								//天地图注记
	map.addLayer(layer);
	map.addLayer(pointvector);            //添加点矢量地图，用于地图上的绘制点等
	map.addLayer(linevector);
}, 1500);

//添加鹰眼控件
map.addControl(new ol.control.OverviewMap({
	className: 'ol-overviewmap ol-custom-overviewmap',
	layers:[vecLayer,vecAnno],
 view: new ol.View({
     projection: 'EPSG:4326'
 })
}));
//前后视图
function onMoveEnd(evt) {
	if(if_mouse) {
		var new_list = [];
		temp = now_view;
		if(view_list.length > 1) {
			for (var i = 0;i < temp+1; i++) {
				new_list.push(view_list[i]);
			}
			now_view++;
			new_list.push({'zoom': map.getView().getZoom(), 'Center': map.getView().getCenter()});
			view_list = new_list;
		} else {
			view_list.push({'zoom': map.getView().getZoom(), 'Center': map.getView().getCenter()});
			now_view++;
		}
	} else {
		if_mouse = true;
	}
}
map.on('moveend', onMoveEnd);

//放大缩小
function fangda(){
	var view = map.getView();
	if(view.getZoom()<18){
		view.setZoom(view.getZoom() +1);
	}
}
function suoxiao(){
	var view = map.getView();
	view.setZoom(view.getZoom() -1);
}

//创建样式
var createStyle = function (feature) {
    return new ol.style.Style({
        image: new ol.style.Icon({
            scale:0.4,
            src: '../../image/gis/markers_normal.png'
        }),
    });
};
//周边查询圆的样式
var CircleStyle = function (feature) {
    return new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(65,105,225,1)',
					width: 3
				}),
				fill: new ol.style.Fill({
					color: 'rgba(65,105,225, 0.1)'
				})
    });
};

//标签样式
var labelStyle = function (feature) {
		return new ol.style.Style({
			fill: new ol.style.Fill({
				color: '#5CACEE'
			}),
			image: new ol.style.Icon({
				src: '../../image/gis/mark.png',
				scale:0.4
			}),
			text: new ol.style.Text({
					offsetY: -15,
					textBaseline: 'ideographic',
					font: 'normal 12px 微软雅黑',
					text: feature.get('name'),
					fill: new ol.style.Fill({
							color: '#FFFFFF'
					}),
					stroke: new ol.style.Stroke({
							color: '#5CACEE',
							width: 2
					})
			})
		});
};

//标签选中的样式
var createSelectedStyle = function (feature) {
  return new ol.style.Style({
    image: new ol.style.Icon({
       src: '../../image/gis/selected.png',
       scale:0.3
    }),
    text: new ol.style.Text({
        offsetY: -15,
        textBaseline: 'ideographic',
        font: 'normal 12px 微软雅黑',
        text: feature.get('name'),
        fill: new ol.style.Fill({
            color: '#FFFFFF'
        }),
        stroke: new ol.style.Stroke({
            color: '#FF69B4',
            width: 2
        })
    })
  });
};
