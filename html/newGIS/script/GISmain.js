// 获取地图最开始的坐标
function initialPposition(){
  var loction = map.getView().getCenter();
 $api.setStorage('initialPposition', loction);
}
// 右边菜单栏
// 全屏
function fullScreen(that) {
    if ($(that).text() == '全屏') {
        $(that).text('关闭');
        elementHide('#header');
        elementHide('.footer_menu');
        elementHide('#search');
        // 底部菜单内容区，在全屏的时候需要隐藏掉，不然会出现闪现的问题
        elementHide('.menu_content');
    } else {
        $(that).text('全屏');
        elementShow('#header');
        elementShow('.footer_menu');
        elementShow('#search');
        // 作用：底部菜单是打开的状态下，关闭菜单按钮已经被隐藏，所以关闭全屏后。关闭菜单按钮还是隐藏状态，需要把隐藏状态移除
        if ($('.menu_content_ative') != null) {
            $('.menu_show').removeClass('menu_show_hide');
        }
    }
}

// 显示主页菜单
function openMainMenu(type) {
    // elementShow('#footer_main_menu');
    // showFooterMenu('#footer_menu_hide', 'hide',false);
    // removePoinOrLineInfoBox();
    if (type) {
        addAndDeAnimation('.search_box', 'search_box_menu_close', 'search_box_menu_open', 'show');
        setTimeout(() => {
            elementShow('.main_menu');
            elementShow('.menu_open_box');
        }, 300);
        elementHide('.menu_close_box');
        elementShow('#footer_main_menu');
        showFooterMenu('#footer_menu_hide', 'hide',false);
    } else {
        addAndDeAnimation('.search_box', 'search_box_menu_open', 'search_box_menu_close', 'hide');
        setTimeout(() => {
            elementHide('.main_menu');
            elementHide('.menu_open_box');
        }, 50);
        setTimeout(() => {
            elementShow('.menu_close_box');
        }, 300);



    }
}


// 显示图层菜单
function openLayerMenu(type) {
    openMainMenu(false);
    if (type) {
        elementShow('.layer_box_mask');
        elementShow('.layer_box');
        addAndDeAnimation('.rightMenu', 'rightMenu_show', 'rightMenu_hide', 'hide');
        addAndDeAnimation('.layer_box', 'layer_box_hide', 'layer_box_show', 'show');
        // closeLayerMenu(true);
    } else {
        openMainMenu(false); //关闭主菜单
        elementHide('.layer_box_mask');
        elementHide('.layer_box');
        addAndDeAnimation('.rightMenu', 'rightMenu_hide', 'rightMenu_show', 'show');
        addAndDeAnimation('.layer_box', 'layer_box_show', 'layer_box_hide', 'hide');
    }
}


// 底部菜单选中效果
function footerLiActive(that, clear = null) {
    if (clear == null) {
        $(that).addClass('li_active');
        $(that).siblings().removeClass('li_active');
    } else {
        var lis = $('.footer_menu li');
        for (var i = 0; i < lis.length; i++) {
            $(lis[i]).removeClass('li_active');
        }
    }

}


// 显示或者隐藏元素
function elementShow(elemet) {
    $(elemet).show();
}

function elementHide(elemet) {
    $(elemet).hide();
}
// 添加动画或者删除动画
function addAndDeAnimation(elemet, removeclassName, addclassName, type) {
    if (type == 'show') {
        $(elemet).removeClass(removeclassName).addClass(addclassName);
    } else {
        $(elemet).removeClass(removeclassName).addClass(addclassName);
    }
}

// 地图切换
function layerActive(that, type) {
    // 隐藏选择图层菜单和遮罩层
    elementHide('.layer_box_mask');
    elementHide('.layer_box');
    openMainMenu(false); //关闭主菜单
    var layers = null;
    var allLayers = map.getLayers();

    if (type == '2D') {
        // allLayers.insertAt(0, baidu);
        allLayers.insertAt(0, vecLayer);
        // allLayers.insertAt(1, vecAnno);
        map.removeLayer(imgLayer);
        vecAnno.setMinResolution(0.000005364418029785156); //21級分辨率
        // map.removeLayer(vecAnno);
        $(that).siblings().children().find('.layerimg').removeClass('layer_moon_img_border');
        $(that).children().find('.layerimg').addClass('layer_moon_img_border');
        $('#moonchecked').hide();
        $('#layerchecked').show();
        addAndDeAnimation('.rightMenu', 'rightMenu_hide', 'rightMenu_show', 'show');
        addAndDeAnimation('.layer_box', 'layer_box_show', 'layer_box_hide', 'hide');
    } else {
        allLayers.insertAt(0, imgLayer);
        // var ResolutionForZoom =map.getView().getResolutionForZoom(21);
        // console.log(ResolutionForZoom);
        imgLayer.setMinResolution(0.000021457672119140625);  //16級分辨率
        vecAnno.setMinResolution(0.000021457672119140625);
        // allLayers.insertAt(1, vecAnno);
        // map.removeLayer(baidu);
        map.removeLayer(vecLayer);
        map.getView().setZoom(16);


        $(that).siblings().children().find('.layerimg').removeClass('layer_moon_img_border');
        $(that).children().find('.layerimg').addClass('layer_moon_img_border');
        $('#moonchecked').show();
        $('#layerchecked').hide();
        addAndDeAnimation('.rightMenu', 'rightMenu_hide', 'rightMenu_show', 'show');
        addAndDeAnimation('.layer_box', 'layer_box_show', 'layer_box_hide', 'hide');
    }
}
// 图层显示方法
function closeOrOpenLayer(that) {
    var name = $(that).attr('name');
    if (!($(that).hasClass('aui-checked'))) {
        $(that).addClass('aui-checked');
        var defaultLayers = $api.getStorage('defaultLayers');
        if (defaultLayers != undefined) {
            var number = 0;
            for (var i = 0; i < defaultLayers.length; i++) {
                if (defaultLayers[i].name == name) {
                    defaultLayers[i].name = name;
                    defaultLayers[i].isShow = true;
                    break;
                } else {
                    number += 1;
                }
            }
            if (number == defaultLayers.length) {
                defaultLayers.push({
                    name: name,
                    isShow: true
                })
            }
            $api.setStorage('defaultLayers', defaultLayers);
        } else {
            defaultLayers = [];
            defaultLayers.push({
                name: name,
                isShow: true
            });
            $api.setStorage('defaultLayers', defaultLayers);
        }
        // 添加图层
        switch (name) {
            case '管点':
                addOrDeletePoint('add', 18);
                map.removeInteraction(pointSelectSingleClick);
                break;
            case '管线':
                addOrDeletePipeLine('add', 18);
                map.removeInteraction(pointSelectSingleClick);
                break;
            case '已收藏管点':
                GetAllCollectPoint('add', 'Point');
                break;
            case '已收藏管线':
                GetAllCollectLine('add', 'Line');
                break;
            case '标注':
                GetAllLabel('add');
                break;
            case '鹰眼':
                yingyan('add');
                break;
        }
        map.un('pointerup', pointerupFun); //移除长按事件

    } else {
      $(that).removeClass('aui-checked');
        var defaultLayers = $api.getStorage('defaultLayers');
        if(defaultLayers!=undefined){
          for (var i = 0; i < defaultLayers.length; i++) {
              if (defaultLayers[i].name == name) {
                  defaultLayers[i].name = name;
                  defaultLayers[i].isShow = false;
                  break;
              }
          }
          $api.setStorage('defaultLayers', defaultLayers);
        }

        // 删除图层
        switch (name) {
            case '管点':
                addOrDeletePoint('remove', 18);
                map.addInteraction(pointSelectSingleClick);
                break;
            case '管线':
                addOrDeletePipeLine('remove', 18);
                map.addInteraction(pointSelectSingleClick);
                break;
            case '已收藏管点':
                GetAllCollectPoint('remove', 'Point');
                break;
            case '已收藏管线':
                GetAllCollectLine('remove', 'Line');
                break;
            case '标注':
                GetAllLabel('remove');
                break;
            case '鹰眼':
                yingyan('remove');
                break;
        }
    }


}

//  初始化要显示的图层（记住用户上次的操作）
function defaultShowLayers() {
    // $api.rmStorage('defaultLayers');
    var defaultLayers = $api.getStorage('defaultLayers');
    var defualts = $('.aui-switch');
    if (defaultLayers != undefined) {
        if (defaultLayers.length > 0) {
            for (var i = 0; i < defualts.length; i++) {
                var name = $(defualts[i]).attr('name');
                for (var j = 0; j < defaultLayers.length; j++) {
                    if (name == defaultLayers[j].name) {
                        if (defaultLayers[j].isShow && name!='鹰眼') {
                            $(defualts[i]).addClass('aui-checked');
                            defaultShowLayer(defaultLayers[j].name, 'add');
                            continue;
                        } else {
                            $(defualts[i]).removeClass('aui-checked');
                            continue;
                        }
                    }
                }
            }
        }
    }
}

function defaultShowLayer(name, type) {
    if (name == '已收藏管点') {
        if (type == 'add') {
            GetAllCollectPoint('add', 'Point');
        }
    } else if (name == '已收藏管线') {
        if (type == 'add') {
            GetAllCollectLine('add', "Line");
        }
    } else if (name == '标注') {
        if (type == 'add') {
            GetAllLabel('add');
        }
    } else if (name == '管点') {
        if (type == 'add') {
            addOrDeletePoint('add', 17);
            map.removeInteraction(pointSelectSingleClick);
        }
    } else if (name == '管线') {
        if (type == 'add') {
            addOrDeletePipeLine('add', 17);
            map.removeInteraction(pointSelectSingleClick);
        }
    }

}


function GetAllCollectPoint(type, Type) { //type 为add或者remove , Type 为Point或者Line
    if (type == 'add') {
        fnGet(`services/SNTGIS/PipeCollect/GetAllCollect?type=${Type}`, null, false, function(ret, err) {
            if (ret && ret.success) {
                var result = ret.result;
                for (var i = 0; i < result.length; i++) {
                    var data = {
                        type: Type,
                        number: result[i].number,
                        length: result.length
                    }
                    queryInfoPoint(data);
                };

            }
            api.hideProgress();
        });
        map.addLayer(queryPointInfoclayer);
        queryPointInfoclayer.set('name', 'queryPointInfoclayer');
    } else {
        removeAddLayer('queryPointInfoclayer', 18);
    }

}

function GetAllCollectLine(type, Type) { //type 为add或者remove , Type 为Point或者Line
    if (type == 'add') {
        fnGet(`services/SNTGIS/PipeCollect/GetAllCollect?type=${Type}`, null, false, function(ret, err) {
            if (ret && ret.success) {
                var result = ret.result;
                for (var i = 0; i < result.length; i++) {
                    var data = {
                        type: Type,
                        number: result[i].number,
                        length: result.length
                    }
                    queryInfoLine(data);
                };

            }
            api.hideProgress();
        });
        map.addLayer(queryLineInfoclayer);
        queryLineInfoclayer.set('name', 'queryLineInfoclayer');
    } else {
        removeAddLayer('queryLineInfoclayer', 18);
    }
}




//  底部菜单显示
var canIsShowPointOrLine = false;
var canIsShowLabel = false;

function showFooterMenu(that, type, from = canIsShowPointOrLine) {
    if (type == 'show') {
        map.un('pointerup', pointerupFun); //为地图移除事件
        // 显示底部菜单
        $(that).addClass('menu_show_hide');
        $('.menu_hide').show();
        // 显示底部菜单内容区，因为全屏的时候会关闭，所以需要设置一下显示
        $('.menu_content').show();
        $('#footer_menu_content').removeClass('menu_content_noAtive').addClass('menu_content_ative');
    } else {
        elementShow('#footer_main_menu');
        // 关闭地图菜单
        footerLiActive(that, 'clear'); //清除底部菜单选中效果
        $('#footer_menu_content').removeClass('menu_content_ative').addClass('menu_content_noAtive');
        var marginleft = $('#footer_menu_content').css('margin-left');
        // 关闭底部菜单并且关闭打开的子菜单，回到原始菜单
        if ($('.main_meter').length != 0) {
            hideAndShow('.main_meter', 'hide');
        }
        if ($('.main_tagging').length != 0) {
            hideAndShow('.main_tagging', 'hide');
            if (canIsShowLabel == true) { //表示是从菜单处点击关闭菜单按钮的
                GetAllLabel('remove'); //移除管点层
                whetherToDisaplayLayers();
            }
            $('.label_box').hide();
            map.un('singleclick', singleClickListener); //移除添加标注功能
        }
        if ($('.main_addnewdata').length != 0) {
            if (canIsShowPointOrLine == true) { //表示是从菜单处点击关闭菜单按钮的
                addOrDeletePoint('remove', 18); //移除管点层
                whetherToDisaplayLayers();
            }
            hideAndShow('.main_addnewdata', 'hide');
        }
        clickClearMapSurvey('measureLayer', 0);
        //  菜单消失后显示打开菜单按钮
        if (parseInt(marginleft) == 0) {
            setTimeout(() => {
                $('.menu_show').removeClass('menu_show_hide');
            }, 450)
        }
        //  新增管点或者管线的菜单
        $('.new_add_pipe_box').hide();
        $('.new_add_point_box').hide();
        //清楚测量操作
        closewindow();

    }
}

// 是否显示管点或者管线图层，首页的管点和管线
function whetherToDisaplayLayers() {
    var defaultLayers = $api.getStorage('defaultLayers');
    if(defaultLayers!=undefined){
      for (var i = 0; i < defaultLayers.length; i++) {
          if (defaultLayers[i].name == '管点' && defaultLayers[i].isShow) {
              addOrDeletePoint('add', 18, false);
          }
          if (defaultLayers[i].name == '管线' && defaultLayers[i].isShow) {
              addOrDeletePipeLine('add', 18);
          }
          if (defaultLayers[i].name == '标注' && defaultLayers[i].isShow) {
              GetAllLabel('add');
          }
      }
    }

}

// 菜单切换
function showChild(that, type) {
    footerLiActive(that);
    setTimeout(() => {
        // 隐藏更多菜单
        if (type == 'tagging') { //地图标注
            $(that).parent().hide();
            hideAndShow('.main_meter', '.main_tagging');
            hideAndShow('.main_addnewdata', '.main_tagging');
            // 调用全部标注接口
            canIsShowPointOrLine = false;
            canIsShowLabel = true;
            // 判断标注图层是否存在
            var defaultLayers = $api.getStorage('defaultLayers');
            if(defaultLayers!=undefined){
              for (var i = 0; i < defaultLayers.length; i++) {
                  if (defaultLayers[i].name == '标注' && defaultLayers[i].isShow) {
                      GetAllLabel('remove');
                      break;
                  }
              }
            }
            GetAllLabel('add');
        } else if (type == 'meter') {
            $(that).parent().hide();
            hideAndShow('.main_tagging', '.main_meter');
            hideAndShow('.main_addnewdata', '.main_meter');
            canIsShowPointOrLine = false;
            canIsShowLabel = false;
        } else if (type == 'addnewdata') {
            $(that).parent().hide();
            hideAndShow('.main_meter', '.main_addnewdata');
            hideAndShow('.main_tagging', '.main_addnewdata');
            canIsShowPointOrLine = true;
            canIsShowLabel = false;
            // 判断管点图层是否存在
            var defaultLayers = $api.getStorage('defaultLayers');
            if(defaultLayers!=undefined){
              for (var i = 0; i < defaultLayers.length; i++) {
                  if (defaultLayers[i].name == '管点' && defaultLayers[i].isShow) {
                      addOrDeletePoint('remove', 18);
                      addOrDeletePipeLine('remove', 18);
                      break;
                  }
              }
            }
            addOrDeletePoint('add', 18, true); //true表示地图上管点不可以单击查询信息
        } else if (type == 'goback') {
            canIsShowPointOrLine = false;
            canIsShowLabel = false;
            GetAllLabel('remove');
            $(that).removeClass('li_active');
            $(that).parent().removeClass('child_menu_show').addClass('child_menu_hide');
            if ($(that).attr('name') == 'line') {
                addOrDeletePoint('remove', 18);
                whetherToDisaplayLayers()
                    //  新增管点或者管线的菜单
                $('.new_add_pipe_box').hide();
                $('.new_add_point_box').hide();
            }
            if ($(that).attr('name') == 'label') {
                GetAllLabel('remove');
                whetherToDisaplayLayers();
                $('.label_box').hide();
                map.un('singleclick', singleClickListener); //移除添加标注功能
            }
            clickClearMapSurvey('measureLayer', 0);
            setTimeout(() => {
                $('.main').show();
            }, 350)

        }

    }, 100)
}
// 显示或者隐藏菜单
function hideAndShow(hide, show) {
    if (show == 'hide') {
        // 隐藏菜单
        $(hide).hide();
        $(hide).removeClass('child_menu_show').addClass('child_menu_hide');
    } else {
        // 隐藏一个菜单显示另一个菜单
        $(hide).hide();
        $(hide).removeClass('child_menu_show').addClass('child_menu_hide');
        $(show).show();
        $(show).removeClass('child_menu_hide').addClass('child_menu_show');
    }
}

// 更多菜单
var isCloseMoreMenu = false;

function showMoreMenu(that, type) {
    footerLiActive(that);
    if (type == 'location') {
        // openMainMenu(false); //关闭主菜单
        if (isCloseMoreMenu) {
            elementHide('.location_more_box');
            isCloseMoreMenu = false;
        } else {
            elementShow('.location_more_box');
            isCloseMoreMenu = true;
        }

    }
    if (type == 'addpipe') {
        if (isCloseMoreMenu) {
            removeAddLayer('addNewPipeDrawLayer', 18); //新增管线画线图层
            removeAddLayer('addPipeLineFeaturesLayer', 18); //图标图层
            elementHide('.new_add_pipe_box');
            $(that).removeClass('li_active');
            elementHide('.new_add_point_box');
            isCloseMoreMenu = false;
        } else {
            elementHide('.new_add_point_box');
            elementShow('.new_add_pipe_box');
            isCloseMoreMenu = true;

        }
    }
    if (type == 'addpoint') {
        if (isCloseMoreMenu) {
            elementHide('.new_add_point_box');
            $(that).removeClass('li_active');
            elementHide('.new_add_pipe_box');
            isCloseMoreMenu = false;
        } else {
            elementHide('.new_add_pipe_box');
            elementShow('.new_add_point_box');
            isCloseMoreMenu = true;
        }
    }


}

// 打开坐标定位页面
function loacionFrm() {
    openMainMenu(false);
    elementHide('.location_more_box');
    api.openFrame({
        name: 'location_frm',
        url: './location_frm.html',
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        bounces: false,
        bgColor: 'rgba(0,0,0,0.4)',
        pageParam: {
            type: 'location'
        }
    });
}
// 打开搜索页面
function openSearchFrame() {
    showFooterMenu('#footer_menu_hide', 'hide', false);
    // removePoinOrLineInfoBox(); //移除管点管线信息框
    api.openWin({
        name: 'search',
        url: './search/search.html',
    });

}

// 添加绘制图的图层
function addLineLayer() {
    // 添加一个绘制的线使用的layer
    var areaSearchLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#00F5B4',
                width: 3,
            })
        })
    })
    areaSearchLayer.set('name', 'areaSearchLayer');
    map.addLayer(areaSearchLayer);
    addAreaDraw(areaSearchLayer);

}
// 面积
function addAreaDraw(layername) {
    var lineDraw = new ol.interaction.Draw({
        type: 'Polygon',
        source: layername.getSource(), // 注意设置source，这样绘制好的线，就会添加到这个source里
        style: new ol.style.Style({ // 设置绘制时的样式
            stroke: new ol.style.Stroke({
                color: '#00F5B4',
                width: 1,
            })
        }),
        // maxPoints: 2 // 限制不超过4个点
    });
    lineDraw.set('name', 'areaLineDraw');
    // 监听线绘制结束事件，获取坐标
    lineDraw.on('drawend', function(event) {
        // var coordinates = event.feature.getGeometry().getCoordinates();
        // console.log( event.feature.getGeometry().getCoordinates());
        // console.log(JSON.stringify(event.feature.getGeometry().getCoordinates()) );
        var coordinates = JSON.stringify(event.feature.getGeometry().getCoordinates());
        // 获取数据，并清除页面上的绘制图层，打开新的页面显示效果
        getAreaSearchCoordinates(layername, coordinates);
        setTimeout(() => {
            map.removeInteraction(lineDraw); //取消绘制
        }, 500)

    });

    map.addInteraction(lineDraw);

}

// 获取范围查询的结果，并清除该层
function getAreaSearchCoordinates(layername, coordinates) {
    api.openWin({
        name: 'areasearchresult',
        url: '../../html/newGIS/search/areasearchresult.html',
        pageParam: {
            data: coordinates
        }
    });
    // 移除图层
    removeAddLayer('areaSearchLayer', 18);
    addOrDeletePoint('remove', 18);
    addOrDeletePipeLine('remove', 18);
}




// 地图快捷操作
function mapFast(type) {
    switch (type) {
        //  前视图
        case 'pre':
            handleView("last");
            break;
            //  后视图
        case 'next':
            handleView("next");
            break;
            //  放大地图
        case 'big':
            setMapZoom('big');
            break;
            //  缩小地图
        case 'small':
            setMapZoom('small');
            break;
            //  鹰眼图
        case 'smallmap':
            setViewMap();
            break;
    }
}
// 设置地图层级
function setMapZoom(type) {
    var defualtZoom = map.getView().getZoom();
    // console.log(JSON.stringify(map.getView().getResolution()));
    if (type == 'big') {
        if (defualtZoom >= 0 && defualtZoom < 18) {
            defualtZoom += 1;
            map.getView().setZoom(defualtZoom);
        } else {
            map.getView().setZoom(18);
            api.toast({
                msg: '已是最大层级',
                duration: 2000,
                location: 'top'
            });

        }
    } else {
        if (defualtZoom > 5) {
            defualtZoom -= 1;
            map.getView().setZoom(defualtZoom);
        } else {
            map.getView().setZoom(5);
            api.toast({
                msg: '已是最小层级',
                duration: 2000,
                location: 'top'
            });
        }
    }
}
//  设置是否显示鹰眼图
var isShowViewMap = true;

function setViewMap() {
    var overviewMapControl = new ol.control.OverviewMap({
        layers: [
            getTdtLayer("vec_w"), getTdtLayer("cva_w")
        ],
        collapseLabel: '\u00BB',
        label: '\u00AB',
        collapsed: false
    });
    if (isShowViewMap) {
        map.addControl(overviewMapControl);
        isShowViewMap = false;
    } else {
        var controls = map.getControls();
        controls.clear();
        isShowViewMap = true;
    }
}


// 我的位置定位
function myLocation() {
    openMainMenu(false);
    elementHide('.location_more_box');
    getLocation();
}
// h5 定位
function getLocation() {
    if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    // console.log( position.coords.latitude)
    // console.log( position.coords.longitude)
    locationFeature([position.coords.longitude,position.coords.latitude]);
}

function locationFeature(coordinate) {
    map.getView().setCenter(coordinate);
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(coordinate)
    });
    // 为特点设置样式
    feature.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            src: './image/location.png'
        })
    }));
    var locationLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [feature]
        })
    });
    locationLayer.set('name', 'locationLayer');
    map.addLayer(locationLayer);
    setTimeout(() => {
        locationLayerClickClear(); //取消定位
    }, 1000)

}

// 轻点地图，定位坐标消失
function locationLayerClickClear() {
    var mapCLick = function(event) {
        removeAddLayer('locationLayer', 8);
        map.un('click', mapCLick)
    };
    map.on('click', mapCLick)
}

// 打开更多专题图页面
function moreThematicMap() {
    api.openWin({
        name: 'thematicmap',
        url: '../../html/newGIS/thematicmap/morethematicmap.html',
    });
}


// 打开标注列表页面
function openMapMarkWin(that) {
    GetAllLabel('remove'); //移除标注，用于列表可能编辑标注，重新刷新页面
    footerLiActive(that); //添加中效果
    $('.label_box').hide();
    setTimeout(() => {
        $("li[name ='labelDetele']").siblings().removeClass('li_active');
    }, 500)
    api.openWin({
        name: 'mapmarklist',
        url: '../../html/newGIS/mapmark/mapmarklist.html',
        pageParam: {
            name: name
        }
    });
    whetherDeleteLabel = false;
}
// 新增地图标注
var MapMarkObj = {
    thisObj: null,
    type: null
};

function addOrDeleteMapMark(that, type) {
    $('.label_box').hide();
    MapMarkObj.thisObj = that;
    MapMarkObj.type = type;
    $(that).addClass('li_active');
    $(that).siblings().removeClass('li_active');
    if (type == 'add') {
        api.toast({
            msg: '请点击地图添加标注',
            duration: 2000,
            location: 'top'
        });
        whetherDeleteLabel = false; //是否删除标注信息
        map.on('singleclick', singleClickListener);
    } else {
        api.toast({
            msg: '请选择要删除的标注',
            duration: 2000,
            location: 'top'
        });
        whetherDeleteLabel = true; //是否删除标注信息
    }
}
// 页面单击监听(这样用于好取消监听)
var singleClickListener = function(event) {
    if (MapMarkObj.type == 'add') {
        $(MapMarkObj.thisObj).removeClass('li_active');
        var coordinate = event.coordinate;
        api.openFrame({
            name: 'addnewmark_frm',
            url: '../../html/newGIS/mapmark/addnewmark_frm.html',
            pageParam: {
                lon: coordinate[0],
                lat: coordinate[1],
                type: 'add',
            },
            bounces: false,
            bgColor: 'rgba(0,0,0,0.4)',
        });
        // 移除监听
        map.un('singleclick', singleClickListener);
    }
}

// 收藏管点或者管线
function bookMarkInfo(that) {
    $(that).hasClass('bookmark_active') ? $(that).removeClass('bookmark_active') : $(that).addClass('bookmark_active');
}
// 隐藏管点或者管线信息
function hidePointOrPipeInfo() {
    removeAddLayer('pointOrPipeInfoFeatureLayer', 18);
    elementHide('.point_pipe_mask');
    elementHide('.point_pipe_box');
    elementHide('.point_point_overlay');
}

// 管点，管线搜周边
function searchAound(that, addBtn = null) {
    // 没有新增按钮的时候
    var params =JSON.parse($(that).attr('params'));
    api.openWin({
        name: 'searcharound',
        url: '../../html/newGIS/search/searcharound.html',
        pageParam: {
            data: params
        }
    });


}
// 管点，管线导航
var navCoordinate = null;

function goNavHere(that) {
    var navCoordinatelon = parseFloat($(that).attr('lon'));
    var navCoordinatelat = parseFloat($(that).attr('lat'));
    navCoordinate = [navCoordinatelon, navCoordinatelat];
    var navigator = api.require('navigator');

    if (api.systemType == 'ios') {
        MapNavigation(navigator, 'appleMap');
    } else {
        ifInstalled(navigator, 'bMap');
    }
}
// 判断是否安装了其他地图

function ifInstalled(navigator, mapName) {
    navigator.installed({
        target: mapName
    }, function(ret, err) {
        if (ret.status) {
            MapNavigation(navigator, mapName);
        } else {
            ifInstalled(navigator, 'aMap');
        }
    });
}
// 打开其他地图app进行导航
function MapNavigation(navigator, type) {
    // navCoordinate
    var startLon = null,
        startLat = null,
        startName = null,
        endName = null;
    var bMap = api.require('bMap');
    bMap.getLocation({
        accuracy: '100m',
        autoStop: true,
        filter: 1
    }, function(ret, err) {
        if (ret.status) {
            startLon = ret.lon;
            startLat = ret.lat;
            bMap.getNameFromCoords({
                lon: startLon,
                lat: startLat
            }, function(ret, err) {
                if (ret.status) {
                    startName = ret.address; //获取起点的坐标名字

                    var wgs84togcj02 = coordtransform.wgs84togcj02(navCoordinate[0], navCoordinate[1]);  //高德地图
                    var gcj02tobd09 = coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1]);   //百度

                    bMap.getNameFromCoords({
                        lon: wgs84togcj02[0],
                        lat: wgs84togcj02[1]
                    }, function(ret, err) {
                        if (ret.status) {
                            endName = ret.address;

                            if (type == 'bMap') {
                                var mapInfoDatas = {
                                    start: { // 起点信息.
                                        lon: startLon, // 经度.
                                        lat: startLat, // 纬度.
                                        name: startName
                                    },
                                    end: { // 终点信息.
                                        lon: gcj02tobd09[0], // 经度
                                        lat: gcj02tobd09[1], // 纬度
                                        name: endName
                                    },
                                    mode: 'driving'
                                };
                                navigator.bMapNavigation(mapInfoDatas);
                            } else if (type == 'aMap') {
                                var mapInfoDatas = {
                                    start: { // 起点信息.
                                        lon: startLon, // 经度.
                                        lat: startLat, // 纬度.
                                        name: startName
                                    },
                                    end: { // 终点信息.
                                        lon: wgs84togcj02[0], // 经度
                                        lat: wgs84togcj02[1], // 纬度
                                        name: endName
                                    },
                                    mode: 'driving'
                                };
                                navigator.aMapPath(mapInfoDatas);
                            } else if (type == 'appleMap') {
                                var mapInfoDatas = {
                                    start: { // 起点信息.
                                        lon: startLon, // 经度.
                                        lat: startLat, // 纬度.
                                        name: startName
                                    },
                                    end: { // 终点信息.
                                        lon: wgs84togcj02[0], // 经度
                                        lat: wgs84togcj02[1], // 纬度
                                        name: endName
                                    },
                                    mode: 'driving'
                                };
                                navigator.appleNavigation(mapInfoDatas);
                            }
                        }
                    });
                }
            });
        }
    });
}




// 新增管线（通过画图的方式）
function addNewPipeDraw() {
    elementHide('.new_add_pipe_box');
    var addNewPipeDrawLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#7180F8',
                width: 3
            }),
        })
    });
    addNewPipeDrawLayer.set('name', 'addNewPipeDrawLayer');
    map.addLayer(addNewPipeDrawLayer);
    var addNewPipeDraw = new ol.interaction.Draw({
        type: 'LineString',
        source: addNewPipeDrawLayer.getSource(), //设置了source,这样绘制好的线就会添加到source里面
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#7180F8',
                width: 2
            })
        })
    });
    map.addInteraction(addNewPipeDraw);
    addNewPipeDraw.on('drawend', function(event) {
        //  console.log(JSON.stringify(event.feature.getGeometry().getCoordinates()));
        var getCoordinates = event.feature.getGeometry().getCoordinates();
        setTimeout(() => {
            api.openWin({
                name: 'newAddPipeLine',
                url: '../../html/newGIS/pointOrpipemanage/newAddPipeLine.html',
                pageParam: {
                    coordinatesStart: getCoordinates[0],
                    coordinatesEnd: getCoordinates[getCoordinates.length - 1],
                    coordinates: getCoordinates,
                    type: 'draw'
                }
            });
            //删除图层
            removeAddLayer('addNewPipeDrawLayer', 18);
        }, 1000);
        map.removeInteraction(addNewPipeDraw);
        $('#addpipe').removeClass('li_active');
    })
}

// 新增管点
function newAddPoint(type) {
    $('.new_add_point_box').hide();
    $('#addpoint').removeClass('li_active');
    if (type == 'map') {
        map.on('singleclick', newAddPointClickMap)
    } else {
        api.openFrame({
            name: 'location_frm',
            url: './location_frm.html',
            rect: {
                x: 0,
                y: 0,
                w: 'auto',
                h: 'auto'
            },
            bounces: false,
            bgColor: 'rgba(0,0,0,0.4)',
            pageParam: {
                type: 'addNewPoint'
            }
        });
    }
}
var newAddPointClickMap = function(event) {
    //  获取地图上点击的坐标
    //  console.log(event.coordinate);
    var coordinates = event.coordinate;
    var lon = coordinates[0].toFixed(5);
    var lat = coordinates[1].toFixed(5);
    createNumber('Point', function(number) {
        api.openWin({
            name: 'newAddPoint',
            url: '../../html/newGIS/pointOrpipemanage/newAddPoint.html',
            pageParam: {
                lon: lon,
                lat: lat,
                number: number
            }
        });
        map.un('singleclick', newAddPointClickMap);
    })

}

// 长按页面新增管点
function longPressAddPoint(that) {
     var params =JSON.parse( $(that).attr('params'));
       // // 接口判断是否此点已经添加
     whetherPointExists(params,function(status,data){
       if(status){
         //  创建管点编号
          createNumber('Point', function(number) {
              api.openWin({
                  name: 'newAddPoint',
                  url: '../../html/newGIS/pointOrpipemanage/newAddPoint.html',
                  pageParam: {
                      lon: params.lon.toFixed(5),
                      lat: params.lat.toFixed(5),
                      number: number
                  }
              });
              setTimeout(() => {
                  elementHide('#longpresspointOrPipeNav');
                  removeAddLayer('pointOrPipeInfoFeatureLayer', 18);
              }, 300)
          });

      } else {
        api.toast({
            msg: '该管点已存在!',
            duration: 2000,
            location: 'bottom'
        });

      }
    });

}

// 删除管点或者管线 (首页)
function deletePointOrPipeLine(that, type,number) {
  // 查询数据是否处于待审核状态
  IsCheckState(number,function(status){
    if(status){
      api.toast({
          msg: '该设备信息审核中,暂不支持操作!',
          duration: 4000,
          location: 'top'
      });

    }else {
      var data = $api.getStorage('selectPointOrLine');
      dialogAlert({
          title: '提示',
          content: '确认删除吗?',
          buttons: ['确定', '取消'],
      }, function(ret) {
          if (ret.buttonIndex == 1) {
              if (type == "Point") {
                  deletePoint(data);
              } else {
                  deleteLine(data);
              }
          }
      });
    }
  })
}

// 删除管点（首页管点查询处的删除）
function deletePoint(data) {
    fnGet(`services/SNTGIS/EditPipeManage/DeletePoint?Number=${data.pointnumbe}&Wkt=${data.wkt}&PointName=${data.pointtype}&PointElevation=${data.elevation}&PointDeep=${data.deep}&Location=${data.location}&BuildTime=${data.buildtime}&Firm=${data.firm}&BuildUnit=${data.buildunit}&UnitType=${data.unittype}&StateClass=${data.stateClass}`, null, true, function(ret, err) {
        if (ret && ret.success) {
            api.toast({
                msg: '已提交后台审核!',
                duration: 2000,
                location: 'top'
            });
            hidePointOrPipeInfo();
            $api.rmStorage('selectPointOrLine');
        } else {
            api.toast({
                msg: '提交审核失败!',
                duration: 2000,
                location: 'top'
            });
        }
        api.hideProgress();
    });

}

// 删除管线（首页管点查询处的删除）
function deleteLine(data) {
    fnGet(`services/SNTGIS/EditPipeManage/DeleteLine?Number=${data.linenumber}&FromNumber=${data.fromnumber}&ToNumber=${data.tonumber}&FromElevate=${data.fromelevat}&ToElevate=${data.toelevat}&FromDeep=${data.fromdeep}&ToDeep=${data.todeep}&BuildUnit=${data.buildunit}&UnitType=${data.unittype}&StateClass=${data.stateClass}&BuildTime=${data.buildtime}&Location=${data.location}&Firm=${data.firm}&Material=${data.materename}&BuriedType=${data.BuriedType}&Wkt=${data.wkt}`, null, true, function(ret, err) {
        if (ret && ret.success) {
            api.toast({
                msg: '删除成功!',
                duration: 2000,
                location: 'top'
            });
            $api.rmStorage('selectPointOrLine');
            hidePointOrPipeInfo();
        } else {
            api.toast({
                msg: '删除失败!',
                duration: 2000,
                location: 'top'
            });
        }
        api.hideProgress();
    });
}

// 编辑管点或者管线 (首页)
function editPointOrPipeLine(that, type,number) {
    IsCheckState(number,function(status){
      if(status){
          api.toast({
              msg: '该设备信息审核中,暂不支持操作!',
              duration: 4000,
              location: 'top'
          });
      }else{
        api.openWin({
            name: 'editPointOrPipeLine',
            url: '../../html/newGIS/pointOrpipemanage/editPointOrPipeLine.html',
            bounces: false,
            pageParam: {
                type: type,
                from: 'home'
            }
        });
      }
    });
}


// 编辑管理
function editorialManagement(that) {
    canIsShowPointOrLine = false;
    $(that).addClass('li_active');
    $(that).siblings().removeClass('li_active');
    api.openWin({
        name: 'editorialManagement',
        url: '../../html/newGIS/pointOrpipemanage/editorialManagement.html',
        bounces: false,
    });
}

// 全部标注接口调用
function GetAllLabel(type) {
    if (type == 'add') {
        fnGet('services/SNTGIS/LabelManage/GetAllLabel', null, false, function(ret, err) {
            if (ret && ret.success) {
                var result = ret.result;
                getAllLabelOverlay(result, false); //使用overlay渲染所有的标注
            }
        });
    } else {
        getAllLabelOverlay(null, true); //使用overlay渲染所有的标注
    }

}

function mapLongPress() {
    var start = 0;
    var delay = 200; // 时间限制避免长按
    var moved = false; // 是否发生滑动

    document.getElementById('map').addEventListener("touchstart", function(e) {
        moved = false; // 滑动标识置为false
        start = +new Date(); // 开始计时
    });
    document.getElementById('map').addEventListener("touchmove", function(e) {
        moved = true; // 滑动标识置为true
    });
    document.getElementById('map').addEventListener("touchend", function(e) {
        if (moved) return; // 滑动则不触发tap
        let cur = +new Date();
        if (cur - start > delay) {
            start = 0;
            moved = false;
            longPressMap();
            return;
        }
        if (cur - start < delay) {
            start = 0;
            moved = false;
            hideLongPressOverlay();
            return;
        }
    });
}

// 详情
function DetailsPointOrPipeLine(that, type,number) {
  var data = $api.getStorage('selectPointOrLine');
  var number;
  if(type == "Point"){
    number = data.pointnumbe;
  }
  else{
    number = data.linenumber;
  }
  api.openWin({
      name: 'detailManagement',
      url: '../../html/newGIS/video/detailvedio.html',
      bounces: false,
      pageParam: {
          number: number
      }
  });
}

//监控分布
function showMonitoring(that) {
    $(that).addClass('li_active');
    $(that).siblings().removeClass('li_active');
    api.showProgress({
        title: '加载中',
        modal: true
    });
    var headers = {};
    headers["Content-Type"] = 'application/json;charset=utf-8';
    headers.Authorization = $api.getStorage('loginInfo');
    api.ajax({
        url: apiUrl + '/api/services/SNTGIS/VideoService/GetVideo',
        method: 'get',
        dataType: 'json',
        headers: headers
    }, function(ret, err) {
        api.hideProgress();
        if (ret.success) {
            var videoLayer = new ol.layer.Vector({
                source: new ol.source.Vector,
                style: function(feature) {
                    return new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: '#5CACEE'
                        }),
                        image: new ol.style.Icon({
                            src: 'image/icon/paiwufa.png',
                            scale: 0.4
                        }),
                        text: new ol.style.Text({
                            offsetY: -10,
                            textBaseline: 'ideographic',
                            font: 'normal 10px 微软雅黑',
                            text: feature.get('name'),
                            fill: new ol.style.Fill({
                                color: '#FFFFFF'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#9396ed',
                                width: 2
                            })
                        })
                    });
                }
            });
            videoLayer.set('name', 'videoLayer');
            map.addLayer(videoLayer);
            var data = ret.result;
            var length = data.length;
            for (var i = 0; i < length; i++) {
                var name = data[i].name;
                var x = data[i].x;
                var y = data[i].y;
                var id = data[i].id;
                var newFeature = new ol.Feature({
                    geometry: new ol.geom.Point([x, y]),
                    name: name
                })
                newFeature.setId(id);
                videoLayer.getSource().addFeature(newFeature);
            }
            var view = map.getView();
            view.setZoom(10);
        } else {
            api.toast({
                msg: '监控设备加载失败',
                duration: 2000,
                location: 'middle'
            });
        }
    })
}
