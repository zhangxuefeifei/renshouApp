
// 绘图的颜色
var drawStyle =new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#00F5B4',
        width: 3,
        // lineDash: [2, 2, 2, 2, 2, 2, ]
    }),
    fill:new ol.style.Fill({
      color:'rgba(113, 128, 248, 0.5)'
    })
})

 // 判断第二次点击清除画的图
 var isSecondClick = false;
// 距离长度测量
var drawObjThat = null;
function getMeasure(that,type,remove = false) {
  map.un('singleclick', pointClickSearch);
  map.un('singleclick', lineClickSearch);
  map.removeEventListener('click', clickjiaodumeasurement);
  map.removeEventListener('click', clickelementmeasurement);

  drawObjThat = that;
  footerLiActive(that);
  removeAddLayer('measureLayer',map.getView().getZoom());
    var drawType =null;
    if(type == 'length'){
      drawType ='LineString';
    }
    else{
      drawType ='Polygon';
    }
     if(isSecondClick){
       $(that).removeClass('li_active');
       clickClearMapSurvey();
       isSecondClick = false;
     }else {
      isSecondClick = true;
      var measureLayer = new ol.layer.Vector({
          source: new ol.source.Vector,
          style: drawStyle
      });
      measureLayer.set('name','measureLayer');
      map.addLayer(measureLayer);
       measureDraw = new ol.interaction.Draw({
        type: drawType,
        source: measureLayer.getSource(), // 注意设置source，这样绘制好的线，就会添加到这个source里
        style: new ol.style.Style({ // 设置绘制时的样式
          stroke: new ol.style.Stroke({
            color: '#00F5B4',
            width: 1,
          })
        }),
        // maxPoints: 2 // 限制不超过4个点
      });
      // 监听线绘制结束事件，获取坐标
      measureDraw.on('drawend', function(event) {
        getLengthAreaText(type,event);
        map.removeInteraction(measureDraw); //取消绘制
          // if (($("#pointswitch").hasClass('aui-checked'))) {
          //     map.on('singleclick', pointClickSearch);
          // }
          // if (($("#lineswitch").hasClass('aui-checked'))) {
          //     map.on('singleclick', lineClickSearch);
          // }
      });
      // 为地图添加一个绘图交互
      map.addInteraction(measureDraw);
      // 添加一个显示文字信息的layer
     }


}

//角度定位
function calculateAngle(that) {
  footerLiActive(that);
  closewindow();
  clickClearMapSurvey();
  api.toast({
      msg: '请绘制参照点',
      duration: 2000,
      location: 'middle'
  });
  map.un('singleclick', pointClickSearch);
  map.un('singleclick', lineClickSearch);
  map.addEventListener('click', clickjiaodumeasurement);
}
var clickjiaodumeasurement = function(evt) {
  removeAddLayer('measureLayer',map.getView().getZoom());
  var measureLayer = new ol.layer.Vector({
      source: new ol.source.Vector
  });
  measureLayer.set('name','measureLayer');
  map.addLayer(measureLayer);
  var newFeature = new ol.Feature({
      geometry: new ol.geom.Point([evt.coordinate[0], evt.coordinate[1]])
  })
  newFeature.setStyle(createLabelStyle1(newFeature));
  measureLayer.getSource().addFeature(newFeature);

var view = map.getView();
view.animate({
    center: [evt.coordinate[0], evt.coordinate[1]],
    duration: 2000
});

      $('.point_pipe_box').show();
      $('.point_pipe_box').html('');
      var data = {
          type: "jiaodumeasurement",
          x: evt.coordinate[0],
          y: evt.coordinate[1]
      };
      var str = template('AngleInfoDemo', data);
      $('.point_pipe_box').append(str);


}
function closewindow(){
    $('.point_pipe_box').hide();
    map.removeEventListener('click', clickjiaodumeasurement);
    map.removeEventListener('click', clickelementmeasurement);
    removeAddLayer('measureLayer',map.getView().getZoom());
    removeAddLayer('measureresuiltLayer',map.getView().getZoom());
    if (($("#pointswitch").hasClass('aui-checked'))) {
        map.on('singleclick', pointClickSearch);
    }
    if (($("#lineswitch").hasClass('aui-checked'))) {
        map.on('singleclick', lineClickSearch);
    }
}

//设置点样式显示
var createLabelStyle = function(feature) {
return new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0.1)'
    }),
    stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
    }),
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
            color: '#ffcc33'
        })
    })
});
};
var createLabelStyle1 = function(feature) {
return new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(139,0,139,0.1)'
    }),
    stroke: new ol.style.Stroke({
        color: '#8B008B',
        width: 2
    }),
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
            color: '#8B008B'
        })
    })
});
};

//计算角度定位坐标
function calculate() {
    var x = document.getElementById('cankaodianx').innerText;
    var y = document.getElementById('cankaodiany').innerText;
    var distence = document.getElementById('distence').value;
    var jiaodu = document.getElementById('jiaodu').value;
    var coord = ADestinceAngle_B({
        lon: x,
        lat: y
    }, jiaodu, distence);
    if (x == "" || y == "") {
        api.toast({
            msg: '请先绘制参照点',
            duration: 2000,
            location: 'middle'
        });
    } else {
        if (distence == '' || jiaodu == '') {
            api.toast({
                msg: '请输入正确的距离和角度',
                duration: 2000,
                location: 'middle'
            });
        } else {
            document.getElementById("calculatex").innerHTML = coord.lon;
            document.getElementById("calculatey").innerHTML = coord.lat;
            removeAddLayer('measureresuiltLayer',map.getView().getZoom());
            var measureLayer = new ol.layer.Vector({
                source: new ol.source.Vector
            });
            measureLayer.set('name','measureresuiltLayer');
            map.addLayer(measureLayer);
            var newFeature = new ol.Feature({
                geometry: new ol.geom.Point([coord.lon, coord.lat])
            })
            newFeature.setStyle(createLabelStyle(newFeature));
            measureLayer.getSource().addFeature(newFeature);



            document.getElementById('distence').setAttribute('disabled', 'disabled');
            document.getElementById('jiaodu').setAttribute('disabled', 'disabled');
            var view = map.getView();
            view.animate({
                center: [coord.lon, coord.lat - 0.001],
                duration: 2000
            });
        }
    }
}

function rad(d) {
    return d * Math.PI / 180.0;
}

function deg(x) {
    return x * 180 / Math.PI;
}

function ADestinceAngle_B(lonlat, brng, dist) {
    var u = this;
    var ct = {
        a: 6378137,
        b: 6356752.3142,
        f: 1 / 298.257223563
    };
    var a = ct.a,
        b = ct.b,
        f = ct.f;

    var lon1 = lonlat.lon * 1; //乘一（*1）是为了确保经纬度的数据类型为number
    var lat1 = lonlat.lat * 1;

    var s = dist;
    var alpha1 = rad(brng);
    var sinAlpha1 = Math.sin(alpha1);
    var cosAlpha1 = Math.cos(alpha1);

    var tanU1 = (1 - f) * Math.tan(rad(lat1));
    var cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)),
        sinU1 = tanU1 * cosU1;
    var sigma1 = Math.atan2(tanU1, cosAlpha1);
    var sinAlpha = cosU1 * sinAlpha1;
    var cosSqAlpha = 1 - sinAlpha * sinAlpha;
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

    var sigma = s / (b * A),
        sigmaP = 2 * Math.PI;
    while (Math.abs(sigma - sigmaP) > 1e-12) {
        var cos2SigmaM = Math.cos(2 * sigma1 + sigma);
        var sinSigma = Math.sin(sigma);
        var cosSigma = Math.cos(sigma);
        var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
        sigmaP = sigma;
        sigma = s / (b * A) + deltaSigma;
    }

    var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
    var lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
        (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
    var lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
    var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    var L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    var revAz = Math.atan2(sinAlpha, -tmp); // final bearing
    var lon_destina = lon1 * 1 + deg(L);
    var lonlat_destination = {
        lon: lon_destina,
        lat: deg(lat2)
    };

    return lonlat_destination;
}
// 角度测量重置
function reset() {
    document.getElementById('cankaodianx').innerHTML = "";
    document.getElementById('cankaodiany').innerHTML = "";

    document.getElementById('distence').value = "";
    document.getElementById('jiaodu').value = "";
    document.getElementById("calculatex").innerHTML = "";
    document.getElementById("calculatey").innerHTML = "";
    removeAddLayer('measureLayer',map.getView().getZoom());
    removeAddLayer('measureresuiltLayer',map.getView().getZoom());
}

// 显示长度距离的layer
function getLengthAreaText(type,event) {
  var overlayPosition = null;
  var coordinates = JSON.parse(JSON.stringify(event.feature.getGeometry().getCoordinates()));
  var info = document.getElementById('lengthArea');
      info.style.display = 'block';
    if (type == 'length') {
      info.style.minWidth = '7rem';
      var Sphere = new ol.Sphere(6378137);
      var distance = ol.Sphere.getLength(event.feature.getGeometry(),{projection:'EPSG:4326'});
      if (distance > 1000) {
        distance = (distance / 1000).toFixed(2);
      $('#length_content').text("长度:"+distance + 'km');
      } else {
          $('#length_content').text("长度:"+ distance.toFixed(2) + 'm');
      }
      overlayPosition = coordinates[coordinates.length-1];
    } else {
      info.style.minWidth = '7.5rem';
      var area = ol.Sphere.getArea(event.feature.getGeometry(),{projection:'EPSG:4326'});
      if (area > 1000000) {
        area = (area / 1000000).toFixed(2);
          $('#length_content').text("面积:"+ area + 'km²');
      } else {
          $('#length_content').text("面积:"+ area.toFixed(2) + 'm²');
      }
      overlayPosition = event.feature.getGeometry().getInteriorPoint().getCoordinates();//设置图标到画的面积中间
    }
    // 把图标呼叫到地图上.,需要一个ol.Overlay
    var anchor = new ol.Overlay({
      element: info,
      position:overlayPosition,
      positioning: 'bottom-center'
    });
    anchor.set('name','lengthOverlay');
    // 将图标添加到地图上
    map.addOverlay(anchor);
}





var clearMapDraw = function(evt){
  $(drawObjThat).removeClass('li_active');
  clickClearMapSurvey();
  isSecondClick = false;
  map.un('singleclick',`clearMapDraw`);
}

// 清除图层，重新绘制图
function clickClearMapSurvey(){
    var info = document.getElementById('lengthArea');
      info.style.display = 'none';
      removeAddLayer('measureLayer',map.getView().getZoom());
}



//高程测量
function calculateElement(that) {
    footerLiActive(that);
    clickClearMapSurvey();
    closewindow();
    api.toast({
        msg: '请绘制测量点',
        duration: 2000,
        location: 'middle'
    });
    map.un('singleclick', pointClickSearch);
    map.un('singleclick', lineClickSearch);
    map.addEventListener('click', clickelementmeasurement);
}


var clickelementmeasurement = function(evt) {
    removeAddLayer('measureLayer', map.getView().getZoom());
    var measureLayer = new ol.layer.Vector({
        source: new ol.source.Vector
    });
    measureLayer.set('name', 'measureLayer');
    map.addLayer(measureLayer);
    var newFeature = new ol.Feature({
        geometry: new ol.geom.Point([evt.coordinate[0], evt.coordinate[1]])
    })
    newFeature.setStyle(createLabelStyle1(newFeature));
    measureLayer.getSource().addFeature(newFeature);
    var tiled = new ol.layer.Tile({
        visible: false,
        source: new ol.source.TileWMS({
            url: getAppMapSetConfig.wmsCommenUrl,
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                tiled: true,
                "LAYERS": 'OpenGIS:DEM',
                "exceptions": 'application/vnd.ogc.se_inimage',
                tilesOrigin: 104.09284149256806 + "," + 29.951791697823978
            }
        })
    });
    map.addLayer(tiled);
    var view = map.getView();
    var viewResolution = view.getResolution();
    view.animate({
        center: [evt.coordinate[0], evt.coordinate[1]],
        duration: 2000
    });
    var source = tiled.getSource();
    var url = source.getGetFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), {
        'INFO_FORMAT': 'application/json',
        'FEATURE_COUNT': 1
    });
    if (url) {
        var ajax = new XMLHttpRequest();
        ajax.open('get', url);
        ajax.setRequestHeader('Authorization', authenticateUser('admin', "Sntsoft123"));
        ajax.send();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var data = JSON.parse(ajax.responseText);
                var data;
                if (data.features.length != 0) {
                    var result = data.features[0].properties;
                    data = result.GRAY_INDEX;
                } else {
                    data = 0
                }
                var overlayPosition = null;
                var info = document.getElementById('lengthArea');
                info.style.display = 'block';
                info.style.minWidth = '7rem';
                $('#length_content').text("高程:" + data.toFixed(2) + 'm');
                var anchor = new ol.Overlay({
                    element: info,
                    position: evt.coordinate,
                    positioning: 'bottom-center'
                });
                anchor.set('name', 'lengthOverlay');
                map.addOverlay(anchor);

            }
        }
    }

}
