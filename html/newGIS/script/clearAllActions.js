// 清屏
function ClearAllActions(){
  var mapCurrentZoom =  map.getView().getZoom();
  map.removeEventListener('click', clickjiaodumeasurement);
  map.removeEventListener('click', clickelementmeasurement);
  removeAddLayer('measureresuiltLayer',mapCurrentZoom);
  removeAddLayer('videoLayer',mapCurrentZoom);
  removeAddLayer('locationLayer', mapCurrentZoom); //清除定位
  // 清除长度和面积
  clickClearMapSurvey();
  // 移除新增管点的操作
  removeAddLayer('addPipeLineFeaturesLayer', mapCurrentZoom); //图标图层  因为添加了两次，所以要删除两次
  removeAddLayer('addPipeLineFeaturesLayer',mapCurrentZoom); //图标图层
  // addOrDeletelayer.js的变量
  newAddPipeLineObj = {
      FeaturesNumber: 0,
      getCoordinates: [],
      allData:[]
    }
    $('.footer_menu').find('.li_active').removeClass('li_active');

    // 清除管点管线查询信息
    $('.point_pipe_box').hide();
    $('.point_point_overlay').hide();
    removeAddLayer('pointOrPipeInfoFeatureLayer', mapCurrentZoom); //移除之前加的图标图层
    // 首页管点管线选中效果
    removeAddLayer('pointOrPipeInfoFeatureLayer', mapCurrentZoom); //移除之前加的图标图层
}

// 复位，地图回归到最开始的比例以及中心点
function resetMap() {
    ClearAllActions();
    openMainMenu(false);
    // var location=$api.getStorage('initialPposition');
    var getAppMapSetConfig = $api.getStorage('getAppMapSetConfig');
    var centerstring = getAppMapSetConfig.center.toString();
    var x = parseFloat(centerstring.split(",")[0]);
    var y = parseFloat(centerstring.split(",")[1]);
    map.getView().setCenter([x,y]);
    map.getView().setZoom(17);
    map.getView().setRotation(0);
}
