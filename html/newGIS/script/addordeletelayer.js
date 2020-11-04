// 图层添加
// 管点
var isaddOrDeletePointlayer = null;
var getAppMapSetConfig = $api.getStorage('getAppMapSetConfig');

function addOrDeletePoint(type, zoom, isAddPoint = false, currentMap = null) {
    isaddOrDeletePointlayer = new ol.layer.Tile({
        visible: true,
        maxResolution: 0.000010728836059570312,
        source: new ol.source.TileWMS({
            url: getAppMapSetConfig.wmsCommenUrl,
            tileLoadFunction: getWMSSourceBySecurity,
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                tiled: true,
                "LAYERS": getAppMapSetConfig.wmsPointName,
                "exceptions": 'application/vnd.ogc.se_inimage',
                tilesOrigin: 104.092185974121 + "," + 29.9510860443115
            }
        }),
    });

    if (currentMap == null) {
        if (type == 'add') {
            // map.un('pointerup', pointerupFun); //长按
            isaddOrDeletePointlayer.set('name', 'pointLayer');
            map.addLayer(isaddOrDeletePointlayer);
            map.getView().setZoom(zoom);
            if (isAddPoint == false) { //判断是从图层点击过来的还是现在管线点击过来的，图层过来可以点击查询，新增的时候最开始不可以，使用管点生成管线的时候可以点击查询
                // 页面单击获取查询数据
                clickViewGetDataPoint(isaddOrDeletePointlayer, 'point', isAddPoint);
            }

        } else {
            removeAddLayer('pointLayer', zoom);
            map.un('singleclick', pointClickSearch); //移除管点点击页面查询数据
        }
    } else {
        isaddOrDeletePointlayer.set('name', 'pointLayer');
        currentMap.addLayer(isaddOrDeletePointlayer);
        currentMap.getView().setZoom(zoom);
    }


}
// 新增管网中的管线添加单击
function addPointClick() {
    $('.new_add_pipe_box').hide();
    clickViewGetDataPoint(isaddOrDeletePointlayer, 'point', true);
}


// 管线
function addOrDeletePipeLine(type, zoom, isAddPoint = false) {
    var pipeLine = new ol.layer.Tile({
        visible: true,
        maxResolution: 1.194328566955879,
        source: new ol.source.TileWMS({
            url: getAppMapSetConfig.wmsCommenUrl,
            tileLoadFunction: getWMSSourceBySecurity,
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                tiled: true,
                "LAYERS": getAppMapSetConfig.wmsLineName,
                "exceptions": 'application/vnd.ogc.se_inimage',
                tilesOrigin: 104.092185974121 + "," + 29.9511852264404
            }
        })
    });
    if (type == 'add') {
        pipeLine.set('name', 'pipeLine');
        map.addLayer(pipeLine);
        map.getView().setZoom(zoom);
        if (isAddPoint == false) {
            // 页面单击获取查询数据
            clickViewGetDataLine(pipeLine, 'pipe', isAddPoint);
        }

    } else {
        removeAddLayer('pipeLine', zoom);
        map.un('singleclick', lineClickSearch); //移除管点点击页面查询数据
    }
}

// 管线，管点加密
function getWMSSourceBySecurity(tile, src) {
    const client = new XMLHttpRequest();
    client.open('GET', src);
    client.responseType = 'arraybuffer';
    client.setRequestHeader('Authorization', authenticateUser(getAppMapSetConfig.gisUserName, getAppMapSetConfig.gisPassWord));
    client.onload = function() {
        var arrayBufferView = new Uint8Array(this.response);
        var blob = new Blob([arrayBufferView], {
            type: 'image/png'
        });
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(blob);
        tile.getImage().src = imageUrl;
    };
    client.send();
}


// 专题图
//专题管径图
var LineselectSingleClick = null;

function calibreRenderingthematicMap(data) {
    map.removeInteraction(LineselectSingleClick);
    currentThematicName = 'guanjing';
    if (data.all) {
        var url = getAppMapSetConfig.diameterMapAll;
    } else {
        var url = getAppMapSetConfig.diameterMapClass + `=min:${data.min};max:${data.max}`;
    }
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '加载中...',
        text: '',
        modal: false
    });
    var vectorSource = new ol.source.Vector({
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
                    // console.log(ajax.responseText);
                    vectorSource.addFeatures(vectorSource.getFormat().readFeatures(ajax.responseText));
                }
            };
            ajax.ontimeout = function(e) {};
            ajax.onerror = function(e) {

            };
        }
    });

    var thematiclayer = new ol.layer.Vector({
        source: vectorSource,
        style: function(feature, resolution) {

        }

    });
    thematiclayer.set('name', 'thematiclayer');
    map.addLayer(thematiclayer);
    map.getView().setZoom(18);
    thematiclayer.setStyle(guanwangIcon); //添加图层图标样式
    LineselectSingleClick = new ol.interaction.Select({
        style: selectIcon,
        hitTolerance: 1
    });
    map.addInteraction(LineselectSingleClick);
    LineselectSingleClick.on('select', function(e) {
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
                stateClass: property.StateClass, //状态类别
                firm: property.Firm, //材料厂商
                buildunit: property.BuildUnit, //所属单位
                materename: property.Material, //管线管材名称
                unittype: property.UnitType, //管线管径型号
                location: property.Location, //所属道路
                buildtime: property.BuildTime, //埋设日期
                length: (property.length * 100000).toFixed(4), //管线管长
                BuriedType: property.BuriedType, //埋设类型
            }
            $('.point_pipe_box').show();
            $('.point_pipe_box').html('');
            var str = template('pipeInfoDemo', renderData);
            $('.point_pipe_box').append(str);
        } else {
            hidePointOrPipeInfo();
        }
    });
}
//  隐藏专题图的信息
function hidePointOrPipeInfo() {
    LineselectSingleClick.getFeatures().clear();
    $('.point_pipe_mask').hide();
    $('.point_pipe_box').hide();
}


// 专题管材图
function pipeRenderingthematicMap(name) {
    map.removeInteraction(LineselectSingleClick);
    currentThematicName = 'guancai';
    if (name == true) {
        var url = getAppMapSetConfig.materialMapAll;
    } else {
        var url = getAppMapSetConfig.materialMapClass + `=name:${name}`;
    }
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '加载中...',
        text: '',
        modal: false
    });
    var vectorSource = new ol.source.Vector({
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
                    vectorSource.addFeatures(vectorSource.getFormat().readFeatures(ajax.responseText));
                }
            };
            ajax.ontimeout = function(e) {};
            ajax.onerror = function(e) {

            };
        }
    });

    var thematiclayer = new ol.layer.Vector({
        source: vectorSource,
    });
    thematiclayer.set('name', 'thematiclayer');
    map.addLayer(thematiclayer);
    map.getView().setZoom(18);
    thematiclayer.setStyle(guanwangIcon); //添加图层图标样式
    LineselectSingleClick = new ol.interaction.Select({
        style: selectIcon,
        hitTolerance: 1
    });
    map.addInteraction(LineselectSingleClick);
    LineselectSingleClick.on('select', function(e) {
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
                location: property.Location, //所属道路
                buildtime: property.BuildTime, //埋设日期
                length: (property.length * 100000).toFixed(4), //管线管长
                BuriedType: property.BuriedType, //埋设类型
            }
            $('.point_pipe_box').show();
            $('.point_pipe_box').html('');
            var str = template('pipeInfoDemo', renderData);
            $('.point_pipe_box').append(str);
        } else {
            hidePointOrPipeInfo();
        }
    });
}


// 专题图管网
function pipeNetworkRenderingthematicMap(data) {
    map.removeInteraction(LineselectSingleClick);
    currentThematicName = 'guanwang';
    removeAddLayer('thematiclayer', 18);
    pipeNetworkObj.value = data.value;
    pipeNetworkObj.type = data.type;
    var url = null;
    if (data.type == 'point') {
        if (data.all) {
            url = getAppMapSetConfig.pointMapAll;
        } else {
            url = getAppMapSetConfig.pointMapClass + `:${data.value}`;
        }
    } else {
        if (data.all) {
            url = getAppMapSetConfig.lineMapAll;
        } else {
            url = getAppMapSetConfig.lineMapClass;
        }
    }
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '加载中...',
        text: '',
        modal: false
    });

    var vectorSource = new ol.source.Vector({
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
                    var result = JSON.parse(ajax.responseText);
                    vectorSource.addFeatures(vectorSource.getFormat().readFeatures(ajax.responseText));
                }
            };
            ajax.ontimeout = function(e) {};
            ajax.onerror = function(e) {

            };
        }
    });
    var thematiclayer = new ol.layer.Vector({
        source: vectorSource,
    });
    thematiclayer.set('name', 'thematiclayer');
    map.addLayer(thematiclayer);
    map.getView().setZoom(18);
    thematiclayer.setStyle(guanwangIcon);
    LineselectSingleClick = new ol.interaction.Select({
        style: selectIcon,
        hitTolerance: 1
    });
    map.addInteraction(LineselectSingleClick);
    LineselectSingleClick.on('select', function(e) {
        var features = e.target.getFeatures().getArray();
        if (features.length > 0) {
            var feature = features[0];
            var property = feature.getProperties();
            if (data.type == 'pipeline') {
                var result = property;
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
                    result: result,
                    BuriedType: property.BuriedType, //埋设类型
                }
                $('.point_pipe_box').show();
                $('.point_pipe_box').html('');
                var str = template('pipeInfoDemo', renderData);
                $('.point_pipe_box').append(str);

            } else {
                var result = property;
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
                    result: result
                }
                $('.point_pipe_box').show();
                $('.point_pipe_box').html('');
                var str = template('pointInfoDemo', renderData);
                $('.point_pipe_box').append(str);

            }
        } else {
            hidePointOrPipeInfo();
        }
    });
}

//专题图，管点渲染（更多里面）
function pointRenderingthematicMap(name) {
    map.removeInteraction(LineselectSingleClick);
    currentThematicName = 'moretematic';
    pipeNetworkObj.value = name; //修改图标用
    removeAddLayer('thematiclayer', 18);
    var layerName = name;
    var url = getAppMapSetConfig.singleMap + `:${layerName}`;
    if (layerName == 'famenlei' || layerName == 'guanjianlei' || layerName == 'qitalei') {
        url = getAppMapSetConfig.classAll + `:${layerName}`;
    }
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '加载中...',
        text: '',
        modal: false
    });
    var vectorSource = new ol.source.Vector({
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
                    var result = JSON.parse(ajax.responseText);
                    // console.log(ajax.responseText);
                    vectorSource.addFeatures(vectorSource.getFormat().readFeatures(ajax.responseText));
                }
            };
            ajax.ontimeout = function(e) {};
            ajax.onerror = function(e) {};
        }
    });

    var thematiclayer = new ol.layer.Vector({
        source: vectorSource,
        style: guanwangIcon
    });
    thematiclayer.set('name', 'thematiclayer');
    map.addLayer(thematiclayer);
    map.getView().setZoom(18);
    LineselectSingleClick = new ol.interaction.Select({
        style: selectIcon
    });
    map.addInteraction(LineselectSingleClick);
    LineselectSingleClick.on('select', function(e) {
        var features = e.target.getFeatures().getArray();
        if (features.length > 0) {
            var feature = features[0];
            var property = feature.getProperties();
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
            }
            $('.point_pipe_box').show();
            $('.point_pipe_box').html('');
            var str = template('pointInfoDemo', renderData);
            $('.point_pipe_box').append(str);
        } else {
            $('.point_pipe_box').html('');
            $('.point_pipe_box').hide();
            hidePointOrPipeInfo();
        }
    });

}



// 点击图层查询管点和管线信息
var point_pipe_clickObj = {
    isAddPoint: false
}

function clickViewGetDataPoint(layerName, type, isAddPoint) {
    // isAddPoint  用于判断是显示信息还是添加图标
    point_pipe_clickObj.layerPointName = layerName;
    point_pipe_clickObj.PointType = type;
    point_pipe_clickObj.isAddPoint = isAddPoint;
    map.on('singleclick', pointClickSearch);
}
// 点击图层查询信息的监听函数
var pointClickSearch = function(evt) {
    // ClearAllActions();

    // 清除管点管线查询信息
    $('.point_pipe_box').hide();
    $('.point_point_overlay').hide();



    var view = map.getView();
    var viewResolution = view.getResolution();
    var source = point_pipe_clickObj.layerPointName.getSource();
    var url = source.getGetFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), {
        'INFO_FORMAT': 'application/json',
        'FEATURE_COUNT': 1
    });
    if (url != undefined) {
        api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: '加载中...',
            text: '',
            modal: false
        });
        var ajax = new XMLHttpRequest();
        ajax.open('get', url);
        ajax.setRequestHeader('Authorization', authenticateUser('admin', "Sntsoft123"));
        ajax.send();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                // console.log(ajax.responseText)
                api.hideProgress();
                var data = JSON.parse(ajax.responseText); //转换成json格式
                var coordinates = null;
                // console.log(ajax.responseText)
                if (point_pipe_clickObj.isAddPoint == false) { //用于判断是管点管线信息查询还是新增管点管线时需要添加图标
                    if (data.features.length != 0) {

                        var result = data.features[0].properties;
                        //管线（所属单位不清楚）
                        coordinates = data.features[0].geometry.coordinates;
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
                            bookmork: false,
                            stateClass: result.StateClass,
                            buildunit: result.BuildUnit, //所属单位BuildUnit
                        }
                        $('.point_pipe_box').show();
                        $('.point_pipe_box').html('');
                        var str = template('pointInfoDemo', renderData);
                        $('.point_pipe_box').append(str);
                        IsCollect(result.PointNumbe, 'point'); //判断是否是收藏的管点
                        // 根据编号查询wkt
                        searchByNumber(renderData, 'Point'); //common.js文件中，添加搜周边



                    } else {
                        api.hideProgress();
                        // removePoinOrLineInfoBox(); //移除图标
                    }
                } else {
                    // 长按添加管点
                    if (data.features.length > 0) {
                        var result = data.features[0].properties;
                        var coordinates = data.features[0].geometry.coordinates;
                        if (coordinates.length > 0) {
                            addPipeLineFeatures(coordinates, result);
                        }
                    }
                }


            }
        }
    }
}


var pipe_clickObj = {
    isAddPoint: false
}

function clickViewGetDataLine(layerName, type, isAddPoint) {
    // isAddPoint  用于判断是显示信息还是添加图标
    pipe_clickObj.layerLineName = layerName;
    pipe_clickObj.LineType = type;
    pipe_clickObj.isAddPoint = isAddPoint;
    map.on('singleclick', lineClickSearch);
}
// 点击图层查询信息的监听函数
var lineClickSearch = function(evt) {
    // ClearAllActions();

    $('.point_pipe_box').hide();
    $('.point_point_overlay').hide();



    var view = map.getView();
    var viewResolution = view.getResolution();
    var source = pipe_clickObj.layerLineName.getSource();
    var url = source.getGetFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), {
        'INFO_FORMAT': 'application/json',
        'FEATURE_COUNT': 1
    });
    if (url != undefined) {
        api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: '加载中...',
            text: '',
            modal: false
        });
        var ajax = new XMLHttpRequest();
        ajax.open('get', url);
        ajax.setRequestHeader('Authorization', authenticateUser('admin', "Sntsoft123"));
        ajax.send();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                // console.log(ajax.responseText)
                api.hideProgress();
                var data = JSON.parse(ajax.responseText); //转换成json格式
                var coordinates = null;
                if (data.features.length != 0) {
                    var result = data.features[0].properties;
                    coordinates = data.features[0].geometry.coordinates;
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
                        stateClass: result.StateClass, //状态类别
                        firm: result.Firm, //材料厂商
                        buildunit: result.BuildUnit, //所属单位BuildUnit
                        materename: result.Material, //管线管材名称
                        unittype: result.UnitType, //管线管径型号
                        location: result.Location, //所属道路
                        buildtime: result.BuildTime, //埋设日期
                        length: (result.length * 100000).toFixed(4),
                        coordinates: coordinates, //坐标
                        bookmork: false,
                        BuriedType: result.BuriedType, //埋设类型
                    }
                    $('.point_pipe_box').show();
                    $('.point_pipe_box').html('');
                    var str = template('pipeInfoDemo', renderData);
                    $('.point_pipe_box').append(str);
                    IsCollect(result.LineNumber, 'line'); //判断是否是收藏的管线 common.js文件中
                    // // 根据编号查询wkt
                    searchByNumber(renderData, 'Line'); //common。js中，添加搜周边
                } else {
                    api.hideProgress();
                    // removePoinOrLineInfoBox(); //移除图标
                }



            }
        }
    }
}

// 移除管点管线信息框
function removePoinOrLineInfoBox() {
    $('#pointOrPipeNav').hide();
    $('#searchAound').removeAttr('params');
    $('#goNav').removeAttr('params');
    if ($('#longpresspointOrPipeNav').length == 0) { //判断是不是长按新增
        removeAddLayer('pointOrPipeInfoFeatureLayer', map.getView().getZoom()); //移除图标
    }
}


// 新增管点和管线时候添加的图标
function addPipeLineFeatures(coordinates, allData) {
    if (newAddPipeLineObj.FeaturesNumber < 2) {
        newAddPipeLineObj.FeaturesNumber++;
        newAddPipeLineObj.getCoordinates.push(coordinates);
        newAddPipeLineObj.allData.push(allData);
        var pointFeature = new ol.Feature(new ol.geom.Point(coordinates));
        pointFeature.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
                src: '../image/location.png'
            })
        }));
        var addPipeLineFeaturesLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [pointFeature]
            })
        });
        addPipeLineFeaturesLayer.set('name', 'addPipeLineFeaturesLayer');
        map.addLayer(addPipeLineFeaturesLayer);
        if (newAddPipeLineObj.FeaturesNumber == 2) {
            createNumber('Line', function(number) {
                api.openWin({
                    name: 'newAddPipeLine',
                    url: '../../html/newGIS/pointOrpipemanage/newAddPipeLine.html',
                    pageParam: {
                        coordinatesStart: newAddPipeLineObj.getCoordinates[0],
                        coordinatesEnd: newAddPipeLineObj.getCoordinates[newAddPipeLineObj.getCoordinates.length - 1],
                        coordinates: newAddPipeLineObj.getCoordinates,
                        type: 'select',
                        allData: newAddPipeLineObj.allData,
                        number: number
                    }
                });
                newAddPipeLineObj.FeaturesNumber = 0;
                newAddPipeLineObj.getCoordinates = [];
                newAddPipeLineObj.allData = [];
                $('#addpipe').removeClass('li_active');
                removeAddLayer('addNewPipeDrawLayer', 8); //管线图层
                removeAddLayer('addPipeLineFeaturesLayer', 8); //图标图层  因为添加了两次，所以要删除两次
                removeAddLayer('addPipeLineFeaturesLayer', 8); //图标图层
                map.un('singleclick', pointClickSearch); //移除管点点击页面查询数据
            });
        }


    } else {
        api.toast({
            msg: '只能选择两个点',
            duration: 2000,
            location: 'bottom'
        });

    }

}
