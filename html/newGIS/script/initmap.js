// start纠偏
// var forEachPoint = function (func) {
//     return function (input, opt_output, opt_dimension) {
//         var len = input.length;
//         var dimension = opt_dimension ? opt_dimension : 2;
//         var output;
//         if (opt_output) {
//             output = opt_output;
//         } else {
//             if (dimension !== 2) {
//                 output = input.slice();
//             } else {
//                 output = new Array(len);
//             }
//         }
//         for (var offset = 0; offset < len; offset += dimension) {
//             func(input, output, offset)
//         }
//         return output;
//     };
// };
//
// var sphericalMercator = {}
//
// var RADIUS = 6378137;
// var MAX_LATITUDE = 85.0511287798;
// var RAD_PER_DEG = Math.PI / 180;
//
// sphericalMercator.forward = forEachPoint(function (input, output, offset) {
//     var lat = Math.max(Math.min(MAX_LATITUDE, input[offset + 1]), -MAX_LATITUDE);
//     var sin = Math.sin(lat * RAD_PER_DEG);
//
//     output[offset] = RADIUS * input[offset] * RAD_PER_DEG;
//     output[offset + 1] = RADIUS * Math.log((1 + sin) / (1 - sin)) / 2;
// });
//
// sphericalMercator.inverse = forEachPoint(function (input, output, offset) {
//     output[offset] = input[offset] / RADIUS / RAD_PER_DEG;
//     output[offset + 1] = (2 * Math.atan(Math.exp(input[offset + 1] / RADIUS)) - (Math.PI / 2)) / RAD_PER_DEG;
// });
//
//
// var baiduMercator = {}
//
// var MCBAND = [12890594.86, 8362377.87,
//     5591021, 3481989.83, 1678043.12, 0];
//
// var LLBAND = [75, 60, 45, 30, 15, 0];
//
// var MC2LL = [
//     [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331,
//         200.9824383106796, -187.2403703815547, 91.6087516669843,
//         -23.38765649603339, 2.57121317296198, -0.03801003308653,
//         17337981.2],
//     [-7.435856389565537e-9, 0.000008983055097726239,
//     -0.78625201886289, 96.32687599759846, -1.85204757529826,
//     -59.36935905485877, 47.40033549296737, -16.50741931063887,
//         2.28786674699375, 10260144.86],
//     [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616,
//         59.74293618442277, 7.357984074871, -25.38371002664745,
//         13.45380521110908, -3.29883767235584, 0.32710905363475,
//         6856817.37],
//     [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591,
//         40.31678527705744, 0.65659298677277, -4.44255534477492,
//         0.85341911805263, 0.12923347998204, -0.04625736007561,
//         4482777.06],
//     [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062,
//         23.10934304144901, -0.00023663490511, -0.6321817810242,
//         -0.00663494467273, 0.03430082397953, -0.00466043876332,
//         2555164.4],
//     [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8,
//         7.47137025468032, -0.00000353937994, -0.02145144861037,
//         -0.00001234426596, 0.00010322952773, -0.00000323890364,
//         826088.5]];
//
// var LL2MC = [
//     [-0.0015702102444, 111320.7020616939, 1704480524535203,
//     -10338987376042340, 26112667856603880,
//     -35149669176653700, 26595700718403920,
//     -10725012454188240, 1800819912950474, 82.5],
//     [0.0008277824516172526, 111320.7020463578, 647795574.6671607,
//         -4082003173.641316, 10774905663.51142, -15171875531.51559,
//         12053065338.62167, -5124939663.577472, 913311935.9512032,
//         67.5],
//     [0.00337398766765, 111320.7020202162, 4481351.045890365,
//         -23393751.19931662, 79682215.47186455, -115964993.2797253,
//         97236711.15602145, -43661946.33752821, 8477230.501135234,
//         52.5],
//     [0.00220636496208, 111320.7020209128, 51751.86112841131,
//         3796837.749470245, 992013.7397791013, -1221952.21711287,
//         1340652.697009075, -620943.6990984312, 144416.9293806241,
//         37.5],
//     [-0.0003441963504368392, 111320.7020576856, 278.2353980772752,
//         2485758.690035394, 6070.750963243378, 54821.18345352118,
//         9540.606633304236, -2710.55326746645, 1405.483844121726,
//         22.5],
//     [-0.0003218135878613132, 111320.7020701615, 0.00369383431289,
//         823725.6402795718, 0.46104986909093, 2351.343141331292,
//         1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]];
//
//
// function getRange(v, min, max) {
//     v = Math.max(v, min);
//     v = Math.min(v, max);
//
//     return v;
// }
//
// function getLoop(v, min, max) {
//     var d = max - min;
//     while (v > max) {
//         v -= d;
//     }
//     while (v < min) {
//         v += d;
//     }
//
//     return v;
// }
//
// function convertor(input, output, offset, table) {
//     var px = input[offset];
//     var py = input[offset + 1];
//     var x = table[0] + table[1] * Math.abs(px);
//     var d = Math.abs(py) / table[9];
//     var y = table[2]
//         + table[3]
//         * d
//         + table[4]
//         * d
//         * d
//         + table[5]
//         * d
//         * d
//         * d
//         + table[6]
//         * d
//         * d
//         * d
//         * d
//         + table[7]
//         * d
//         * d
//         * d
//         * d
//         * d
//         + table[8]
//         * d
//         * d
//         * d
//         * d
//         * d
//         * d;
//
//     output[offset] = x * (px < 0 ? -1 : 1);
//     output[offset + 1] = y * (py < 0 ? -1 : 1);
// }
//
// baiduMercator.forward = forEachPoint(function (input, output, offset) {
//     var lng = getLoop(input[offset], -180, 180);
//     var lat = getRange(input[offset + 1], -74, 74);
//
//     var table = null;
//     var j;
//     for (j = 0; j < LLBAND.length; ++j) {
//         if (lat >= LLBAND[j]) {
//             table = LL2MC[j];
//             break;
//         }
//     }
//     if (table === null) {
//         for (j = LLBAND.length - 1; j >= 0; --j) {
//             if (lat <= -LLBAND[j]) {
//                 table = LL2MC[j];
//                 break;
//             }
//         }
//     }
//     output[offset] = lng;
//     output[offset + 1] = lat;
//     convertor(output, output, offset, table);
// });
//
// baiduMercator.inverse = forEachPoint(function (input, output, offset) {
//     var y_abs = Math.abs(input[offset + 1]);
//
//     var table = null;
//     for (var j = 0; j < MCBAND.length; j++) {
//         if (y_abs >= MCBAND[j]) {
//             table = MC2LL[j];
//             break;
//         }
//     }
//
//     convertor(input, output, offset, table);
// });
//
// var gcj02 = {}
//
// var PI = Math.PI;
// var AXIS = 6378245.0;
// var OFFSET = 0.00669342162296594323;  // (a^2 - b^2) / a^2
//
// function delta(wgLon, wgLat) {
//     var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
//     var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
//     var radLat = wgLat / 180.0 * PI;
//     var magic = Math.sin(radLat);
//     magic = 1 - OFFSET * magic * magic;
//     var sqrtMagic = Math.sqrt(magic);
//     dLat = (dLat * 180.0) / ((AXIS * (1 - OFFSET)) / (magic * sqrtMagic) * PI);
//     dLon = (dLon * 180.0) / (AXIS / sqrtMagic * Math.cos(radLat) * PI);
//     return [dLon, dLat];
// }
//
// function outOfChina(lon, lat) {
//     if (lon < 72.004 || lon > 137.8347) {
//         return true;
//     }
//     if (lat < 0.8293 || lat > 55.8271) {
//         return true;
//     }
//     return false;
// }
//
// function transformLat(x, y) {
//     var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
//     ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
//     ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
//     ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
//     return ret;
// }
//
// function transformLon(x, y) {
//     var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
//     ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
//     ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
//     ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
//     return ret;
// }
//
// gcj02.toWGS84 = forEachPoint(function (input, output, offset) {
//     var lng = input[offset];
//     var lat = input[offset + 1];
//     if (!outOfChina(lng, lat)) {
//         var deltaD = delta(lng, lat);
//         lng = lng - deltaD[0];
//         lat = lat - deltaD[1];
//     }
//     output[offset] = lng;
//     output[offset + 1] = lat;
// });
//
// gcj02.fromWGS84 = forEachPoint(function (input, output, offset) {
//     var lng = input[offset];
//     var lat = input[offset + 1];
//     if (!outOfChina(lng, lat)) {
//         var deltaD = delta(lng, lat);
//         lng = lng + deltaD[0];
//         lat = lat + deltaD[1];
//     }
//     output[offset] = lng;
//     output[offset + 1] = lat;
// });
//
// var bd09 = {}
//
// var PI = Math.PI;
// var X_PI = PI * 3000 / 180;
//
// function toGCJ02(input, output, offset) {
//     var x = input[offset] - 0.0065;
//     var y = input[offset + 1] - 0.006;
//     var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
//     var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
//     output[offset] = z * Math.cos(theta);
//     output[offset + 1] = z * Math.sin(theta);
//     return output;
// }
//
// function fromGCJ02(input, output, offset) {
//     var x = input[offset];
//     var y = input[offset + 1];
//     var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
//     var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
//     output[offset] = z * Math.cos(theta) + 0.0065;
//     output[offset + 1] = z * Math.sin(theta) + 0.006;
//     return output;
// }
//
// bd09.toWGS84 = function (input, opt_output, opt_dimension) {
//     var output = forEachPoint(toGCJ02)(input, opt_output, opt_dimension);
//     return gcj02.toWGS84(output, output, opt_dimension);
// };
//
// bd09.fromWGS84 = function (input, opt_output, opt_dimension) {
//     var output = gcj02.fromWGS84(input, opt_output, opt_dimension);
//     return forEachPoint(fromGCJ02)(output, output, opt_dimension);
// };
//
//
// var projzh = {}
//
// projzh.smerc2bmerc = function (input, opt_output, opt_dimension) {
//     var output = sphericalMercator.inverse(input, opt_output, opt_dimension);
//     output = bd09.fromWGS84(output, output, opt_dimension);
//     return baiduMercator.forward(output, output, opt_dimension);
// };
//
// projzh.bmerc2smerc = function (input, opt_output, opt_dimension) {
//     var output = baiduMercator.inverse(input, opt_output, opt_dimension);
//     output = bd09.toWGS84(output, output, opt_dimension);
//     return sphericalMercator.forward(output, output, opt_dimension);
// };
//
// projzh.bmerc2ll = function (input, opt_output, opt_dimension) {
//     var output = baiduMercator.inverse(input, opt_output, opt_dimension);
//     return bd09.toWGS84(output, output, opt_dimension);
// };
//
// projzh.ll2bmerc = function (input, opt_output, opt_dimension) {
//     var output = bd09.fromWGS84(input, opt_output, opt_dimension);
//     return baiduMercator.forward(output, output, opt_dimension);
// };
//
// projzh.ll2smerc = sphericalMercator.forward;
// projzh.smerc2ll = sphericalMercator.inverse;
//
//
//
// var extent = [72.004, 0.8293, 137.8347, 55.8271];
//
// var baiduMercatorProj = new ol.proj.Projection({
//     code: 'baidu',
//     extent: ol.extent.applyTransform(extent, projzh.ll2bmerc),
//     units: 'm'
// });
//
// ol.proj.addProjection(baiduMercatorProj);
// ol.proj.addCoordinateTransforms('EPSG:4326', baiduMercatorProj, projzh.ll2bmerc, projzh.bmerc2ll);
// ol.proj.addCoordinateTransforms('EPSG:3857', baiduMercatorProj, projzh.smerc2bmerc, projzh.bmerc2smerc);
//
// var bmercResolutions = new Array(19);
// for (var i = 0; i < 19; ++i) {
//     bmercResolutions[i] = Math.pow(2, 18 - i);
// }
// end纠偏









 // 收藏的管点管线查询信息
 // 管线
 var queryLineInfoclayersource = new ol.source.Vector({
     format: new ol.format.GeoJSON(),
     wrapX: false
 });
 var queryLineInfoclayer = new ol.layer.Vector({
     source: queryLineInfoclayersource,
     style: new ol.style.Style({
         fill: new ol.style.Fill({
             color: '#0081F5'
         }),
         stroke: new ol.style.Stroke({
             color: '#0081F5',
             width: 3
         }),
     })
 });
 // 管点
 var bookmarkImg = './image/bookmark.png';
 var queryPointInfoclayersource = new ol.source.Vector({
     format: new ol.format.GeoJSON(),
     wrapX: false
 });
  var queryPointInfoclayer = new ol.layer.Vector({
       source: queryPointInfoclayersource,
       style: new ol.style.Style({
           image: new ol.style.Icon({
               src: bookmarkImg,
               scale: 0.5
           }),
       })
   });
  var pointSelectSingleClick = new ol.interaction.Select({
       layers: [queryPointInfoclayer, queryLineInfoclayer],
       style: new ol.style.Style({
           image: new ol.style.Icon({
               src: bookmarkImg,
               scale: 0.6
           }),
       }),
       hitTolerance: 2

   });

 // 收藏的管点管线查询信息结束

 // 地图操作
 function getTdtLayer(lyr) {
     var urls = [];
     for (var i = 0; i < 4; i++) {
         urls.push("http://t" + i + ".tianditu.com/DataServer?T=" + lyr +
             "&X={x}&Y={y}&L={z}&tk=8c8a425c56da4762aeef3f79346aaa8b")
     }
     var layer = new ol.layer.Tile({
         source: new ol.source.XYZ({
             urls: urls
         })
     });
     return layer;
 }
//离线地图
 // var baidu = new  ol.layer.Tile({                
 //      source:  new  ol.source.XYZ({                    
 //          projection:   'baidu',
 //          crossOrigin:   'anonymous',
 //          tileUrlFunction:   function (tileCoord)  {                        
 //              var  x  =  tileCoord[1];                        
 //              var  y  =  tileCoord[2];                        
 //              var  z  =  tileCoord[0];                        
 //              return  'http://192.168.10.221:8596/rs_qxl_tile/'  +  z  +  '/'  +  x  +  '/'  +  y  +  '.png'                    
 //          },
 //          tileGrid:  new  ol.tilegrid.TileGrid({                        
 //              resolutions:  bmercResolutions,
 //              origin:  [0,  0],
 //              extent:  ol.extent.applyTransform(extent,  projzh.ll2bmerc),
 //              tileSize:  [256,  256]                    
 //          })                
 //      })          
 // });


var vecLayer = getTdtLayer("vec_w");
var imgLayer = getTdtLayer("img_w");
var vecAnno = getTdtLayer("cva_w");
 //  初始化天地图
 function initMap() {
     var getAppMapSetConfig = $api.getStorage('getAppMapSetConfig');
     var centerstring = getAppMapSetConfig.center.toString();
     var x = parseFloat(centerstring.split(",")[0]);
     var y = parseFloat(centerstring.split(",")[1]);
     var view = new ol.View({
         center:[x,y],
         projection: 'EPSG:4326',
         zoom: 17,
         maxZoom:getAppMapSetConfig.maxZoom,
         minZoom:getAppMapSetConfig.minZoom
     });
     map = new ol.Map({
         controls: [],
         layers: [vecLayer, vecAnno],
        //  layers: [baidu],
         view: view,
         interactions: ol.interaction.defaults({
             doubleClickZoom: false,
             pinchRotate: false,
         }),
         target: 'map'
     });
     // addLineLayer();
     if (JSON.stringify(arguments) == "{}") {
         map.on('moveend', onMoveEnd);
     }
     map.addInteraction(pointSelectSingleClick);

 }

 //初始化地图 （用于新增管点管线页面）
 function initpointMap() {
   var getAppMapSetConfig = $api.getStorage('getAppMapSetConfig');
   var centerstring = getAppMapSetConfig.center.toString();
   var x = parseFloat(centerstring.split(",")[0]);
   var y = parseFloat(centerstring.split(",")[1]);
   var view = new ol.View({
       center:[x,y],
       projection: 'EPSG:4326',
       zoom: 17,
       maxZoom:getAppMapSetConfig.maxZoom,
       minZoom:getAppMapSetConfig.minZoom
   });
     pointOrPipemap = new ol.Map({
         controls: [],
        //  layers: [baidu],
         layers: [vecLayer, vecAnno],
         view: view,
         interactions: ol.interaction.defaults({
             doubleClickZoom: false,
             pinchRotate: false,
         }),
         target: 'map'
     });
 }
 //初始化地图 （用于新增管点管线页面）
 function initEditMap() {
   var getAppMapSetConfig = $api.getStorage('getAppMapSetConfig');
   var centerstring = getAppMapSetConfig.center.toString();
   var x = parseFloat(centerstring.split(",")[0]);
   var y = parseFloat(centerstring.split(",")[1]);
   var view = new ol.View({
       center:[x,y],
       projection: 'EPSG:4326',
       zoom: 17,
       maxZoom:getAppMapSetConfig.maxZoom,
       minZoom:getAppMapSetConfig.minZoom
   });
     editManageMap = new ol.Map({
         controls: [],
        //  layers: [baidu],
         layers: [vecLayer, vecAnno],
         view: view,
         interactions: ol.interaction.defaults({
             doubleClickZoom: false,
             pinchRotate: false,
         }),
         target: 'map'
     });
 }


 // 禁止地图转动
 function viewChangeRotation() {
     map.getView().on('change:rotation', function(event) {
         map.getView().setRotation(0);
     })
 }

 // 地图长按事件监听
 var longPressMapObj = {
     time: 0,
     timeOutEvent: null
 }

 function longPressMap() {
     map.on('pointerdown', function(event) {});
     map.on('pointerup', pointerupFun);
     map.on('pointerdrag', function(event) {
         map.un('pointerup', pointerupFun); //为地图添加监听pointerUp事件
     });

 }




 var pointerupFun = function(event) {
     var coordinate = event.coordinate;
     navOverLay(coordinate, type = null, true);
     map.un('pointerup', pointerupFun);
 }

 // 视图(实现前视图和后视图，需要监听每次结束后的位置)
 var if_mouse = true;
 var now_view = -1;
 var view_list = [];

 function onMoveEnd(evt) {
     if (if_mouse) {
         var new_list = [];
         temp = now_view;
         if (view_list.length > 1) {
             for (var i = 0; i < temp + 1; i++) {
                 new_list.push(view_list[i]);
             }
             now_view++;
             new_list.push({
                 'zoom': map.getView().getZoom(),
                 'Center': map.getView().getCenter()
             });
             view_list = new_list;
         } else {
             view_list.push({
                 'zoom': map.getView().getZoom(),
                 'Center': map.getView().getCenter()
             });
             now_view++;
         }
     } else {
         if_mouse = true;
     }
 }

 function handleView(type) {
     if (type == 'last') {
         if_mouse = false;
         if (now_view - 1 < 0) now_view = 0;
         else now_view = now_view - 1;
         var temp_view = view_list[now_view];
         map.getView().animate({
             center: temp_view['Center'],
             zoom: temp_view['zoom'],
             duration: 500
         });
     } else {
         if_mouse = false;
         if (now_view + 1 >= view_list.length) now_view = now_view;
         else now_view = now_view + 1;
         var temp_view = view_list[now_view];
         map.getView().animate({
             center: temp_view['Center'],
             zoom: temp_view['zoom'],
             duration: 500
         });
     }
 }

 // 添加移动图标功能
 function addMoveInteraction(map) {
     var app = {};
     app.Drag = function() {

         ol.interaction.Pointer.call(this, {
             handleDownEvent: app.Drag.prototype.handleDownEvent,
             handleDragEvent: app.Drag.prototype.handleDragEvent,
             handleMoveEvent: app.Drag.prototype.handleMoveEvent,
             handleUpEvent: app.Drag.prototype.handleUpEvent
         });

         this.coordinate_ = null;
         this.cursor_ = 'pointer';
         this.feature_ = null;
         this.previousCursor_ = undefined;

     };
     ol.inherits(app.Drag, ol.interaction.Pointer);

     app.Drag.prototype.handleDownEvent = function(evt) {
         var map = evt.map;

         var feature = map.forEachFeatureAtPixel(evt.pixel,
             function(feature) {
                 return feature;
             });

         if (feature) {
             var geom = (feature.getGeometry());
             if (geom instanceof ol.geom.MultiPolygon) {
                 return;
             } else if (geom instanceof ol.geom.LineString) {
                 return;
             } else {
                 this.coordinate_ = evt.coordinate;
                 // alert(evt.coordinate[0]);
                 this.feature_ = feature;
             }
         }
         return !!feature;
     };

     app.Drag.prototype.handleDragEvent = function(evt) {
         // 返回拖动期间所有的坐标点
         var deltaX = evt.coordinate[0] - this.coordinate_[0];
         var deltaY = evt.coordinate[1] - this.coordinate_[1];
         var geometry = this.feature_.getGeometry();
         geometry.translate(deltaX, deltaY);
         this.coordinate_[0] = evt.coordinate[0];
         this.coordinate_[1] = evt.coordinate[1];

     };
     app.Drag.prototype.handleMoveEvent = function(evt) {
         if (this.cursor_) {
             var map = evt.map;
             var feature = map.forEachFeatureAtPixel(evt.pixel,
                 function(feature) {
                     //alert("handleMoveEvent");
                     return feature;
                 });
             var element = evt.map.getTargetElement();
             if (feature) {
                 if (element.style.cursor != this.cursor_) {
                     this.previousCursor_ = element.style.cursor;
                     element.style.cursor = this.cursor_;
                 }
             } else if (this.previousCursor_ !== undefined) {
                 element.style.cursor = this.previousCursor_;
                 this.previousCursor_ = undefined;
             }
         }
     };

     app.Drag.prototype.handleUpEvent = function(evt) {
         //拖动以后触发操作 放下拖动后结束 返回最后的最新的坐标点
         // 最新的坐标
         // console.log('this.coordinate_[0]' + evt.coordinate[0]);
         // console.log(' this.coordinate_[1]' + evt.coordinate[1]);
         api.sendEvent({
             name: 'newCoordinate',
             extra: {
                 lon: evt.coordinate[0],
                 lat: evt.coordinate[1]
             }
         });
         this.coordinate_ = null;
         this.feature_ = null;
         return false;
     };
     appD = new app.Drag();
     //将交互添加到map中
     map.addInteraction(appD);
 }


 // 验证登录 (请求管点管线的验证登录)
 function authenticateUser(user, password) {
     var token = user + ":" + password;
     var hash = "Basic " + Base64.encode(token);
     return hash;
 }

 // 移除图层
 function removeAddLayer(layername, zoom, currentMap = null) {
     var activetMap = null;
     if (currentMap == null) {
         activetMap = map;
     } else {
         activetMap = currentMap;
     }
     var layers = activetMap.getLayers().array_;
     for (var i = 0; i < layers.length; i++) {
         var targetLayer = layers[i].get('name');
         var j = i;
         var target = activetMap.getLayers().item(j);
         if (targetLayer == layername) {
             activetMap.removeLayer(target);
             activetMap.getView().setZoom(zoom);
             break;
         }
     }
     // activetMap.un('singleclick',pointPipeClickSearch);
 }
 // 清除overlay
 function clearOverlay(overlayName) {
     var overlays = map.getOverlays().array_;
     for (var i = 0; i < overlays.length; i++) {
         var targetLayer = overlays[i].get('name');
         var j = i;
         var target = map.getOverlays().item(j);
         if (targetLayer == overlayName) {
             map.removeOverlay(target);
             break;
         }
     }
 }
 // 清除Interactions
 function clearInteractions(overlayName) {
     var overlays = map.getInteractions().array_;
     for (var i = 0; i < overlays.length; i++) {
         var targetLayer = overlays[i].get('name');
         var j = i;
         var target = map.getInteractions().item(j);
         if (targetLayer == overlayName) {
             map.removeInteraction(target);
             break;
         }
     }
 }


 //鹰眼
 function yingyan(type) {
    if (type == 'add') {
        document.getElementById("overview").style.display = "block";
        var getAppMapSetConfig = $api.getStorage('getAppMapSetConfig');
        var centerstring = getAppMapSetConfig.center.toString();
        var x = parseFloat(centerstring.split(",")[0]);
        var y = parseFloat(centerstring.split(",")[1]);
        var overview = new ol.Map({
            controls: ol.control.defaults({
                attribution: false,
                zoom: false
            }).extend([]),
            interactions: ol.interaction.defaults({
                doubleClickZoom: false,
                pinchRotate: false,
            }),
            target: 'overview',
            layers: [imgLayer,vecAnno],
            view: new ol.View({
                projection: 'EPSG:4326',
                center: [x, y],
                zoom: 12,
                maxZoom: 12,
                minZoom: 12
            })
        });
        var extent = map.getView().calculateExtent(map.getSize());
        var coor = [
            [
                [extent[0], extent[1]],
                [extent[2], extent[1]],
                [extent[2], extent[3]],
                [extent[0], extent[3]],
                [extent[0], extent[1]]
            ]
        ];
        var polygonFeature = new ol.Feature(new ol.geom.Polygon(coor));
        var vectorSource = new ol.source.Vector({
            features: [polygonFeature]
        });
        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(160,160,160,0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 2
                })
            })
        });
        overview.addLayer(vectorLayer);
        map.on('moveend', function() {
                var extent = map.getView().calculateExtent(map.getSize());
                var coor = [
                    [
                        [extent[0], extent[1]],
                        [extent[2], extent[1]],
                        [extent[2], extent[3]],
                        [extent[0], extent[3]],
                        [extent[0], extent[1]]
                    ]
                ];
                vectorLayer.getSource().getFeatures()[0].getGeometry().setCoordinates(coor);
                setTimeout(function() {
                    overview.getView().setCenter(map.getView().getCenter());
                }, 300);
            })
             overview.on('click',function(e){
                 var coor = e.coordinate;
                 map.getView().setCenter(coor);
             })
            overview.getInteractions().forEach(function(element,index,array){  
                if(element instanceof ol.interaction.DragPan)
                element.setActive(false)
            });  

    } else {
        document.getElementById("overview").style.display = "none";
        document.getElementById("overview").innerHTML = "";
    }
}
