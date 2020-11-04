var select;
// var time = null;
var flag = 1;

//高德地图
// var gaodeMapLayer = new ol.layer.Tile({
//     source: new ol.source.XYZ({
//         url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
//     })
// });


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

var map = new ol.Map({
    layers: [vecLayer,vecAnno],
    view: new ol.View({
        center: [104.1561, 30.0056],
        projection: 'EPSG:4326',
        zoom: 14
    }),
    controls: ol.control.defaults({
  		attribution: false,
      zoom: false
  	}).extend([]),
    interactions: ol.interaction.defaults({
        altShiftDragRotate:false,
        pinchRotate:false,
        doubleClickZoom: false
    }),
    target: 'map'
});
//矢量图层
var scadasource = new ol.source.Vector({
	wrapX: false
});
var scadavector = new ol.layer.Vector({
	source: scadasource
});
map.addLayer(scadavector);

//清除选中样式
function clearstyle(){
  for (var i = 0; i < scadasource.getFeatures().length; i++) {
     var feaureN = scadasource.getFeatures()[i];
     feaureN.setStyle(createStyle(feaureN));
  }
}
//样式
var createStyle = function (feature) {
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
//选中的样式
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


//坐标转换
var xx_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var aa = 6378245.0;
var eee = 0.00669342162296594323;
//百度地图坐标转换为天地图
function bd_decrypt(bd_lon, bd_lat) {
	var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
	var x = bd_lon - 0.0065;
	var y = bd_lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xx_PI);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xx_PI);
	var gg_lng = z * Math.cos(theta);
	var gg_lat = z * Math.sin(theta);
	return gcj02towgs84(gg_lng, gg_lat);
}
function gcj02towgs84(lng, lat) {
	var dlat = transformlat(lng - 105.0, lat - 35.0);
	var dlng = transformlng(lng - 105.0, lat - 35.0);
	var radlat = lat / 180.0 * Math.PI;
	var magic = Math.sin(radlat);
	magic = 1 - eee * magic * magic;
	var sqrtmagic = Math.sqrt(magic);
	dlat = (dlat * 180.0) / ((aa * (1 - eee)) / (magic * sqrtmagic) * Math.PI);
	dlng = (dlng * 180.0) / (aa / sqrtmagic * Math.cos(radlat) * Math.PI);
	mglat = lat + dlat;
	mglng = lng + dlng;
	return [lng * 2 - mglng, lat * 2 - mglat]
}
function transformlat(lng, lat) {
	var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
	ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin(lat / 3.0 * Math.PI)) * 2.0 / 3.0;
	ret += (160.0 * Math.sin(lat / 12.0 * Math.PI) + 320 * Math.sin(lat * Math.PI / 30.0)) * 2.0 / 3.0;
	return ret
}
function transformlng(lng, lat) {
	var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
	ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0;
	ret += (150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0 / 3.0;
	return ret
}



function loadData(index){
  flag=index;
  if(scadasource !=null){
      scadasource.clear();
      clearslected(index);
  }

  if(index==0){
    api.ajax({
        url: 'http://118.122.84.146:9002/api/gis/Get',
        method: 'get',
    }, function(ret, err) {
        api.hideProgress();
        if (ret) {
            var data = ret.Data;
            for (var i = 0; i < data.length; i++) {
                var name = data[i].Name;
                var x=data[i].Longitude;
                var y=data[i].Latitude;
                var point = bd_decrypt(x, y);
                var newFeature = new ol.Feature({
                        geometry: new ol.geom.Point([point[0], point[1]]),
                        name: name
                })
                newFeature.setStyle(createStyle(newFeature));
                scadasource.addFeature(newFeature);
            }
            selectfeature(index);
        }
    });
  }
  if(index!=0){
    api.ajax({
        url: 'http://118.122.84.146:9002/api/gis/Get/'+index,
        method: 'get',
    }, function(ret, err) {
        api.hideProgress();
        if (ret) {
            var data = ret.Data;
            for (var i = 0; i < data.length; i++) {
                var name = data[i].Name;
                var x=data[i].Longitude;
                var y=data[i].Latitude;
                var point = bd_decrypt(x, y);
                var newFeature = new ol.Feature({
                        geometry: new ol.geom.Point([point[0], point[1]]),
                        name: name
                })
                newFeature.setStyle(createStyle(newFeature));
                scadasource.addFeature(newFeature);
            }
            selectfeature(index);
        }
    });
  }
}

function selectfeature(index){
  select = new ol.interaction.Select({
     layers: [scadavector],
     multi: false,
     hitTolerance: 10
   });
   select.on("select", function(e) {
      // if(time){
      //   clearInterval(time);
      // }

     var features = e.selected;
     if(features.length==1){
       clearstyle();
       features[0].setStyle(createSelectedStyle(features[0]));
       var featurename=features[0].getProperties().name;
       getfeaturedata(featurename,index);
     }
   });
   map.addInteraction(select);
}

function getfeaturedata(name,index){
  // if(time){
  //   clearInterval(time);
  // }
  if(index==0){
    // time = setInterval(function(){
        api.ajax({
            url: 'http://118.122.84.146:9002/api/gis/Get',
            method: 'get',
        }, function(ret, err) {
            api.hideProgress();
            if (ret) {
                var data = ret.Data;
                for (var i = 0; i < data.length; i++) {
                    	if(name==data[i].Name){
                          var view = map.getView();
                          view.setCenter([data[i].Longitude,data[i].Latitude]);
                          var result = {
                            title:data[i].Name,
                            lon:data[i].Longitude,
                            lat:data[i].Latitude,
                            pressures:[],
                          };
                          var Infoslength=data[i].Devices[0].Infos.length;
                         if(Infoslength > 1){
                           for(var j=0;j<Infoslength;j++){
                             var Citem = {
                               pressure:data[i].Devices[0].Infos[j].Name,
                               pressureValue:data[i].Devices[0].Infos[j].Value,
                               unit:data[i].Devices[0].Infos[j].Unit
                             };
                            result.pressures.push(Citem);
                           }

                         } else {
                           var Citem = {
                             pressure:data[i].Devices[0].Infos[0].Name,
                             pressureValue:data[i].Devices[0].Infos[0].Value,
                             unit:data[i].Devices[0].Infos[0].Unit
                           };
                         result.pressures.push(Citem);
                         }
                          // 采集点
                          infoType = 'CollectionPoint';
                          $('.content').addClass('aui-show');
                          var datas = {
                              type: infoType,
                              result: result
                          };
                          $('.content').html('');
                          var str = template('menuList', datas);
                          $('.content').append(str);
                          operationDom();

                      }
                }
            }
        });
      // },100);
  }
  else{
    // time = setInterval(function(){
        api.ajax({
            url: 'http://118.122.84.146:9002/api/gis/Get/'+index,
            method: 'get',
        }, function(ret, err) {
            api.hideProgress();
            if (ret) {
                var data = ret.Data;
                for (var i = 0; i < data.length; i++) {
                    	if(name==data[i].Name){
                          var view = map.getView();
                          view.setCenter([data[i].Longitude,data[i].Latitude]);
                          var result = {
                            title:data[i].Name,
                            lon:data[i].Longitude,
                            lat:data[i].Latitude,
                            pressures:[],
                          };
                          var Infoslength=data[i].Devices[0].Infos.length;
                         if(Infoslength > 1){
                           for(var j=0;j<Infoslength;j++){
                             var Citem = {
                               pressure:data[i].Devices[0].Infos[j].Name,
                               pressureValue:data[i].Devices[0].Infos[j].Value,
                               unit:data[i].Devices[0].Infos[j].Unit
                             };
                            result.pressures.push(Citem);
                           }

                         } else {
                           var Citem = {
                             pressure:data[i].Devices[0].Infos[0].Name,
                             pressureValue:data[i].Devices[0].Infos[0].Value,
                             unit:data[i].Devices[0].Infos[0].Unit
                           };
                         result.pressures.push(Citem);
                         }
                         // 采集点
                         infoType = 'CollectionPoint';
                         $('.content').addClass('aui-show');
                         var datas = {
                             type: infoType,
                             result: result
                         };
                         $('.content').html('');
                         var str = template('menuList', datas);

                         $('.content').append(str);
                         operationDom();
                      }
                }
            }
        });
      // },100);


  }
}

function clearslected(index){
    map.removeInteraction(select);
    selectfeature(index);
}
