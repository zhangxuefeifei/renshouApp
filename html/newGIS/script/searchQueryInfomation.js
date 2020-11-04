var DataObj = null;
var layerNumber = 0;
var feature = null;
var getAppMapSetConfig = $api.getStorage('getAppMapSetConfig');
var featurecoordinates = {};
// 搜索出的管点挂线查询信息
function queryPointOrLineInfo(data, IsSelect = false) { //IsSelect 为false时为搜索页面查询信息，不可点击， 为ture是，为首页查询信息，可以select查询信息
    DataObj = data;
    DataObj.IsSelect = IsSelect;
    if (data.type == 'Point') {
        // point
        var url=getAppMapSetConfig.searchPoint+`:${data.number}`;
    } else {
        var url=getAppMapSetConfig.searchLine+`:${data.number}`;
    }
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '加载中...',
        text:'',
        modal: false
    });
    vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        loader: function(extent, resolution, projection) {
            var ajax = new XMLHttpRequest();
            ajax.open('get', url);
            ajax.withCredentials = true;
            ajax.setRequestHeader("Authorization", authenticateUser('admin', "Sntsoft123"));
            ajax.send();
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    api.hideProgress();
                    var data = JSON.parse(ajax.responseText);
                    // console.log(ajax.responseText)
                    vectorSource.addFeatures(vectorSource.getFormat().readFeatures(ajax.responseText));
                    if (data.features.length != 0) {
                        var result = data.features[0].properties;

                        if (data.features[0].geometry.type == 'LineString') {
                          var coordinates = data.features[0].geometry.coordinates;
                          featurecoordinates.lon = coordinates[0][0];
                          featurecoordinates.lat = coordinates[0][1];
                            map.getView().setCenter(coordinates[0]);
                            var length = 10;
                            result.coordinates = coordinates;
                            var renderData = {
                                linenumber: result.LineNumber, //管线编号
                                fromnumber: result.FromNumber, //起始编号
                                tonumber: result.ToNumber, //终点编号
                                fromelevat: result.FromElevat, //起始高程
                                toelevat: result.ToElevat, //终点高程
                                fromdeep: result.FromDeep, //起始埋深
                                todeep: result.ToDeep, //终点埋深
                                buriedtype: result.BuriedType, //状态类别
                                firm: result.Firm, //材料厂商
                                buildunit: result.BuildUnit, //所属单位
                                materename: result.Material, //管线管材名称
                                unittype: result.UnitType, //管线管径型号
                                location: result.Location, //所属道路
                                buildtime: result.BuildTime, //埋设日期
                                length: (result.length * 100000).toFixed(4),
                                coordinates: coordinates, //坐标
                                bookmark: DataObj.bookmark,
                                result: result,
                                BuriedType:result.BuriedType, //埋设类型

                            }
                            $('.point_pipe_box').show();
                            $('.point_pipe_box').html('');
                            var str = template('pipeInfoDemo', renderData);
                            $('.point_pipe_box').append(str);
                            if (DataObj.bookmark == false) {
                                IsCollect(result.LineNumber, 'line');
                            }
                        } else {
                          var coordinates = data.features[0].geometry.coordinates;
                          featurecoordinates.lon = coordinates[0];
                          featurecoordinates.lat = coordinates[1];
                            map.getView().setCenter(coordinates);
                            result.coordinates = coordinates;
                            var renderData = {
                                pointnumbe: result.PointNumbe, //管点编号
                                lon: coordinates[0], //经度
                                lat: coordinates[1], //纬度
                                pointtype: result.PointName, //设备类型
                                elevation: result.Elevation, //高程
                                deep: result.Deep, //埋深
                                buildtime: result.BuildTime, //埋设日期
                                location: result.Location, //所属道路
                                firm: result.Firm, //材料厂商
                                unittype: result.UnitType, //型号
                                coordinates: coordinates,
                                result: result,
                                bookmark: DataObj.bookmark,
                                buildunit: result.BuildUnit, //所属单位
                            }

                            $('.point_pipe_box').show();
                            $('.point_pipe_box').html('');
                            var str = template('pointInfoDemo', renderData);
                            $('.point_pipe_box').append(str);
                            if (DataObj.bookmark == false) {
                                IsCollect(result.PointNumbe, 'point');
                            }
                        }
                    }


                }
            };
            ajax.ontimeout = function(e) {};
            ajax.onerror = function(e) {};
        }
    });
    var queryInfoclayer = new ol.layer.Vector({
        source: vectorSource,
        style: function(feature, resolution) {
            switch (true) {
                case data.type == "Point" && DataObj.bookmark == true:
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            src: '../image/bookmark.png',
                            scale: 0.5
                        }),
                    })
                    break;
                case data.type == "Point" && DataObj.bookmark == false:
                    return new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 5,
                            fill: new ol.style.Fill({
                                color: '#FF647C'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#FF647C',
                                width: 3
                            }),
                        })
                    })
                    break;
                case data.type == "Line":
                    return new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: '#FF647C'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#FF647C',
                            width: 3
                        }),
                    })
                    break;
            }
        }
    });
    map.addLayer(queryInfoclayer);
    queryInfoclayer.set('name', 'queryInfoclayer');
    map.getView().setZoom(18);
}

// 首页收藏管点 渲染到地图
function queryInfoPoint(data, IsSelect = true) { //IsSelect 为false时为搜索页面查询信息，不可点击， 为ture是，为首页查询信息，可以select查询信息
    DataObj = data;
    DataObj.IsSelect = IsSelect;
    // point
    var url=getAppMapSetConfig.collectPoint+`:${data.number}`;
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '加载中...',
        text:'',
        modal: false
    });
    var ajax = new XMLHttpRequest();
    ajax.open('get', url);
    ajax.withCredentials = true;
    ajax.setRequestHeader("Authorization", authenticateUser('admin', "Sntsoft123"));
    ajax.send();
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            feature = queryPointInfoclayersource.getFormat().readFeatures(ajax.responseText);
            queryPointInfoclayersource.addFeatures(feature);
        }
    };
    ajax.ontimeout = function(e) {

    };
    ajax.onerror = function(e) {

    };
    map.getView().setZoom(18);
}
// 首页收藏管线 渲染到地图
function queryInfoLine(data, IsSelect = true) { //IsSelect 为false时为搜索页面查询信息，不可点击， 为ture是，为首页查询信息，可以select查询信息
    DataObj = data;
    DataObj.IsSelect = IsSelect;
    // var url = `http://119.3.192.111:5431/geoserver/OpenGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=OpenGIS%3AGetLineByName&outputFormat=application%2Fjson&viewparams=number:${data.number}`
    var url=getAppMapSetConfig.collectLine+`:${data.number}`;
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '加载中...',
        text:'',
        modal: false
    });
    var ajax = new XMLHttpRequest();
    ajax.open('get', url);
    ajax.withCredentials = true;
    ajax.setRequestHeader("Authorization", authenticateUser('admin', "Sntsoft123"));
    ajax.send();
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {

            feature = queryLineInfoclayersource.getFormat().readFeatures(ajax.responseText);
            queryLineInfoclayersource.addFeatures(feature);


        }
    };
    ajax.ontimeout = function(e) {

    };
    ajax.onerror = function(e) {

    };
    map.getView().setZoom(18);
}
// 收藏的管点管线查询信息
pointSelectSingleClick.on('select', function(e) {
    var features = e.target.getFeatures().getArray();
    if (features.length > 0) {
        var feature = features[0];
        var property = feature.getProperties();
        if (property.PointNumbe != undefined) {
            var coordinates = [property.geometry.flatCoordinates[0],property.geometry.flatCoordinates[1]];
            var renderData = {
                pointnumbe: property.PointNumbe, //管点编号
                lon: property.geometry.flatCoordinates[0], //经度
                lat: property.geometry.flatCoordinates[1], //纬度
                pointtype: property.PointName, //设备类型
                elevation: property.Elevation, //高程
                deep: property.Deep, //埋深
                buildtime: property.BuildTime, //埋设日期
                location: property.Location, //所属道路
                firm: property.Firm, //材料厂商
                unittype: property.UnitType, //型号
                bookmork: true,
                stateClass:property.StateClass,
                buildunit:property.BuildUnit, //所属单位BuildUnit,
                coordinates:coordinates
            }
            searchByNumber(renderData,'Point');//根据编号生成wkt ，common.js
            $('.point_pipe_box').show();
            $('.point_pipe_box').html('');
            var str = template('pointInfoDemo', renderData);
            $('.point_pipe_box').append(str);
        } else {
            var coordinates =JSON.parse(JSON.stringify(property.geometry.flatCoordinates));
            var newcoordinates = [];
            for(let i=0;i<coordinates.length;i+=2){
              var coods = [coordinates[i],coordinates[i+1]];
              newcoordinates.push(coods);
            }
            var renderData = {
                linenumber: property.LineNumber, //管线编号
                fromnumber: property.FromNumber, //起始编号
                tonumber: property.ToNumber, //终点编号
                fromelevat: property.FromElevat, //起始高程
                toelevat: property.ToElevat, //终点高程
                fromdeep: property.FromDeep, //起始埋深
                todeep: property.ToDeep, //终点埋深
                stateClass: property.StateClass, //状态类别
                firm: property.Firm, //材料厂商
                buildunit: property.BuildUnit, //所属单位
                materename: property.Material, //管线管材名称
                unittype: property.UnitType, //管线管径型号
                location: property.Location, //所属道路
                buildtime: property.BuildTime, //埋设日期
                length: (property.length * 100000).toFixed(4), //管线管长
                bookmork: true,
                BuriedType:property.BuriedType, //埋设类型
                coordinates:newcoordinates
            }
            searchByNumber(renderData,'Line');//根据编号生成wkt ，common.js
            $('.point_pipe_box').show();
            $('.point_pipe_box').html('');
            var str = template('pipeInfoDemo', renderData);
            $('.point_pipe_box').append(str);
        }

    } else {
         removePoinOrLineInfoBox(); //addordeletelayer.js
        $('.point_pipe_mask').hide();
        $('.point_pipe_box').hide();

    }
});

function updateBookeMarkIcon(){
  map.removeInteraction(pointSelectSingleClick);
  map.on('singleclick',bookmarkQueryInfo)
}
var bookmarkQueryInfo = function(event){
  map.addInteraction(pointSelectSingleClick);
  map.un('singleclick',bookmarkQueryInfo)
}

var SelectPointOrLineSingleClick = null;
// 搜索管线页面地图渲染和查询
function lineSearchMapShow(result) {
    // removeAddLayer('lineSearchMapShowLayer',8);
    //矢量图层
    var lineSearchMapShowSource = new ol.source.Vector({
        wrapX: false
    });
    var lineSearchMapShowLayer = new ol.layer.Vector({
        source: lineSearchMapShowSource,
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

    for (var i = 0; i < result.length; i++) {
        var wkt = result[i].wkt;
        var format = new ol.format.WKT();
        var feature = format.readFeature(wkt);
        //设置属性
        feature.setProperties({
            wkt: result[i].wkt,
            LineNumber: result[i].lineNumber,
            FromNumber: result[i].fromNumber,
            ToNumber: result[i].toNumber,
            FromElevat: result[i].fromElevat,
            ToElevat: result[i].toElevat,
            FromDeep: result[i].fromDeep,
            ToDeep: result[i].toDeep,
            length: result[i].length,
            BuriedType: result[i].stateClass,
            BuildTime: moment(result[i].buildTime).format('YYYY-MM-DD'),
            UnitType: result[i].unitType,
            Material: result[i].material,
            location: result[i].location,
            BuildUnit: result[i].buildUnit,
            Firm: result[i].firm,
            // BuriedType: result[i].BuriedType, //埋设类型
        });
        lineSearchMapShowSource.addFeature(feature);
    }

    map.addLayer(lineSearchMapShowLayer);
    lineSearchMapShowLayer.set('name', 'lineSearchMapShowLayer');
    map.getView().setZoom(18);
    SelectPointOrLineSingleClick = new ol.interaction.Select({
        layers: [lineSearchMapShowLayer],
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: '#D00A57'
            }),
            stroke: new ol.style.Stroke({
                color: '#D00A57',
                width: 3
            }),
        }),
        hitTolerance: 1
    });
    map.addInteraction(SelectPointOrLineSingleClick);
    // 收藏的管点管线查询信息
    SelectPointOrLineSingleClick.on('select', function(e) {
        var features = e.target.getFeatures().getArray();
        if (features.length > 0) {
            var feature = features[0];
            var property = feature.getProperties();
            var renderData = {
                linenumber: property.LineNumber, //管线编号
                fromnumber: property.FromNumber, //起始编号
                tonumber: property.ToNumber, //终点编号
                fromelevat: property.FromElevat, //起始高程
                toelevat: property.ToElevat, //终点高程
                fromdeep: property.FromDeep, //起始埋深
                todeep: property.ToDeep, //终点埋深
                buriedtype: property.BuriedType, //状态类别
                firm: property.Firm, //材料厂商
                buildunit: property.BuildUnit, //所属单位
                materename: property.Material, //管线管材名称
                unittype: property.UnitType, //管线管径型号
                location: property.location, //所属道路
                buildtime: property.BuildTime, //埋设日期
                length: (property.length * 100000).toFixed(4), //管线管长
                bookmork: false,
                // BuriedType:property.BuriedType, //埋设类型
            }
            $('.point_pipe_box').show();
            $('.point_pipe_box').html('');
            var str = template('pipeInfoDemo', renderData);
            $('.point_pipe_box').append(str);
        } else {
        clearSelect();
        }
    });
}
// 清除地图选中效果
function clearSelect() {
  $('.point_pipe_mask').hide();
  $('.point_pipe_box').hide();
    if(SelectPointOrLineSingleClick!=null){
        SelectPointOrLineSingleClick.getFeatures().clear();
    }

}
// 搜索管点页面地图渲染和查询
function pointSearchMapShow(result) {
    //矢量图层
    var pointSearchMapShowSource = new ol.source.Vector({
        wrapX: false
    });
    var pointSearchMapShowLayer = new ol.layer.Vector({
        source: pointSearchMapShowSource,
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#0081F5'
                }),
                stroke: new ol.style.Stroke({
                    color: '#0081F5',
                    width: 3
                }),
            })
        })
    });
    for (var i = 0; i < result.length; i++) {
        var wkt = result[i].wkt;
        var format = new ol.format.WKT();
        var feature = format.readFeature(wkt);
        //设置属性
        feature.setProperties({
            wkt: result[i].wkt,
            PointNumbe: result[i].pointNumbe,
            PointName: result[i].pointName,
            Elevation: result[i].elevation,
            Deep: result[i].deep,
            location: result[i].location,
            BuildTime: moment(result[i].buildTime).format('YYYY-MM-DD'),
            Firm: result[i].firm,
            UnitType: result[i].unitType,
            id: result[i].id
        });
        pointSearchMapShowSource.addFeature(feature);
    }

    map.addLayer(pointSearchMapShowLayer);
    pointSearchMapShowLayer.set('name', 'pointSearchMapShowLayer');
    map.getView().setZoom(18);
    SelectPointOrLineSingleClick = new ol.interaction.Select({
        layers: [pointSearchMapShowLayer],
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#D00A57'
                }),
                stroke: new ol.style.Stroke({
                    color: '#D00A57',
                    width: 3
                }),
            })
        }),
        hitTolerance: 1
    });
    map.addInteraction(SelectPointOrLineSingleClick);
    // 收藏的管点管线查询信息
    SelectPointOrLineSingleClick.on('select', function(e) {
        var features = e.target.getFeatures().getArray();
        if (features.length > 0) {
            var feature = features[0];
            var property = feature.getProperties();
            var renderData = {
                pointnumbe: property.PointNumbe, //管点编号
                lon: property.geometry.flatCoordinates[0].toFixed(5), //经度
                lat: property.geometry.flatCoordinates[1].toFixed(5), //纬度
                pointtype: property.PointName, //设备类型
                elevation: property.Elevation, //高程
                deep: property.Deep, //埋深
                buildtime: property.BuildTime, //埋设日期
                location: property.location, //所属道路
                firm: property.Firm, //材料厂商
                unittype: property.UnitType, //型号
                bookmork: true,
            }
            $('.point_pipe_box').show();
            $('.point_pipe_box').html('');
            var str = template('pointInfoDemo', renderData);
            $('.point_pipe_box').append(str);
        } else {
            clearSelectData();
        }
    });
}

function clearSelectData() {
  $('.point_pipe_mask').hide();
  $('.point_pipe_box').hide();
  SelectPointOrLineSingleClick.getFeatures().clear();
}

// 所有标注渲染
//矢量图层
var labelSource =null;
var labelLayer = new ol.layer.Vector({
});
var labelSingleSelect = new ol.interaction.Select({
    layers: [labelLayer],
});
// 获取所有的标注
function getAllLabelOverlay(result,isDetele){
  if(isDetele == false){
    if (labelSource != null) {
            labelSource.clear();
        }
    labelSource =new ol.source.Vector({});
    for(var i=0;i<result.length;i++){
      var feature = new ol.Feature({
       geometry: new ol.geom.Point([result[i].x, result[i].y])
      });
      //设置属性
      feature.setProperties({
          id: result[i].id,
          x: result[i].x,
          y: result[i].y,
          remarks: result[i].remarks,
      });
      var text = result[i].remarks;
      if(text.length > 4){
        text = text.substring(0,4) +'...';
      }
      // 设置文字style
      feature.setStyle(new ol.style.Style({
      text: new ol.style.Text({
       font: '0.6rem sans-serif', //默认这个字体，可以修改成其他的，格式和css的字体设置一样
       text: text,
       offsetY: -3,
       offsetX:12,
       fill: new ol.style.Fill({
           color: '#7180F8'
       })
       }),
       image: new ol.style.Icon({
         src:'./image/label_box.png',
         scale:1
       })
      }));
     labelSource.addFeature(feature);
    }
    labelLayer.setSource(labelSource);
   map.getView().setZoom(18);
   map.addLayer(labelLayer);
   labelLayer.set('name', 'labelLayer');
   map.addInteraction(labelSingleSelect);
   // 收藏的管点管线查询信息
   labelSingleSelect.on('select',selectLabelFunc);
  }else {
    removeAddLayer('labelLayer',18);
    map.removeInteraction(labelSingleSelect);
  }
}

var selectLabelFunc =  function(e) {
    var features = e.target.getFeatures().getArray();
    if (features.length > 0) {
      var feature = features[0];
      var property = feature.getProperties();
         if(whetherDeleteLabel == false){
           $('.label_box').show();
           $('.label_box span').html('');
           $('.label_box span').html(property.remarks);
         } else {
            deleteLabel(property.id,labelSource);
         }
    } else {
      if(whetherDeleteLabel == false){
         $('.label_box').hide();
      } else {
        api.toast({
            msg: '请选择要删除的标注',
            duration: 2000,
            location: 'top'
        });
      }

    }
}

var selectInfoLabel = new ol.interaction.Select({
    layers: [labelLayer],
});
 selectInfoLabel.on('select',selectLabelFunc);

// 添加新的标注
function addNewLabel(data){
  var feature = new ol.Feature({
   geometry: new ol.geom.Point([data.lon, data.lat])
  });
  //设置属性
  feature.setProperties({
      id:data.id ,
      x:data.lon,
      y:data.lat,
      remarks: data.remarks,
  });
  var text = data.remarks;
  if(text.length > 4){
    text = text.substring(0,4) +'...';
  }
  // 设置文字style
  feature.setStyle(new ol.style.Style({
  text: new ol.style.Text({
   font: '0.6rem sans-serif', //默认这个字体，可以修改成其他的，格式和css的字体设置一样
   text: text,
   offsetY: -3,
   offsetX:12,
   fill: new ol.style.Fill({
       color: '#7180F8'
   })
   }),
   image: new ol.style.Icon({
     src:'./image/label_box.png',
     scale:1
   })
  }));
 labelSource.addFeature(feature);
}

var labelDeleteSucesss = false;
function deleteLabel(deleteId,labelSource){
  var deleteId = deleteId;
  var labelSource = labelSource;
  dialogAlert({
      title: '提示',
      content: '确认删除标注吗?',
      buttons: ['确定', '取消'],
  }, function(ret) {
      if (ret.buttonIndex == 1) {
        fnGet(`services/SNTGIS/LabelManage/DeleteLabel?id=${deleteId}`,null,true,function(ret,err){
              api.hideProgress();
              if(ret && ret.success){
                api.toast({
                    msg: '删除成功!',
                    duration: 2000,
                    location: 'top'
                });
                  whetherDeleteLabel = false;
                var allFeatures = labelLayer.getSource().getFeatures();
               for(let i=0;i<allFeatures.length;i++){
                 var property = allFeatures[i].getProperties();
                 allFeatures[i].index = i;
                 if(property.id == deleteId){
                    labelLayer.getSource().removeFeature(allFeatures[i]);
                    labelLayer.getSource().refresh();
                    map.removeInteraction(labelSingleSelect);
                    map.render();
                    map.on('singleclick',LabelShowSingeClick)
                    break;
                 }
               }
                $("li[name ='labelDetele']").removeClass('li_active');
              } else {
                api.toast({
                    msg: '删除失败!',
                    duration: 2000,
                    location: 'top'
                });
              }
            });
      } else{
        whetherDeleteLabel = false;
        $("li[name ='labelDetele']").removeClass('li_active');
           map.addInteraction(labelSingleSelect);
          labelSingleSelect.on('select',selectLabelFunc);


      }
  });

}

var LabelShowSingeClick = function(event){
   map.addInteraction(labelSingleSelect);
   map.un('singleclick',LabelShowSingeClick);
}
