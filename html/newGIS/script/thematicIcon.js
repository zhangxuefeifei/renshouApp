var currentThematicName = null; //判断是那个专题图，以此来显示相应的图标
// 专题管网图
var pipeNetworkObj = {
        value: null,
        type: null,
    }
    // 管点图标style
var pointIconLayerStyle = function(src) {
        return new ol.style.Style({
            image: new ol.style.Icon({
                src: src,
                scale: 0.4
            }),
        })
    }
    // 管线图标style
// 图标选中style
var pointIconLayerSelectStyle = function(src) {
        return new ol.style.Style({
            image: new ol.style.Icon({
                src: src,
                scale: 0.6
            }),
        })
    }
    // 管线图标style
// 管线图标style
var guanjingLayerStyle = function(color) {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                color: color,
                width: 3
            }),
        })
    }
// 管线图标选中style
var guanjingLayerSelectStyle = function(color) {
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: color
                }),
                stroke: new ol.style.Stroke({
                    color: color,
                    width: 4
                }),
            })
        }
    // 管网图标
function guanwangIcon(feature, resolution) {
    var PointName = null;
      var StateClass = null;
    if(currentThematicName == 'guanwang'){
      StateClass = feature.values_.StateClass;
    }
    if(currentThematicName == 'moretematic'){
      PointName = feature.values_.PointName;
    }
    if (pipeNetworkObj.type != null && pipeNetworkObj.type == 'point') {
        switch (true) {
            case pipeNetworkObj.value == 1 || StateClass == 1:
                return pointIconLayerStyle('../image/icon/guanwang/nowhas.png')
                break;
            case pipeNetworkObj.value == 2 || StateClass == 2:
                return pointIconLayerStyle('../image/icon/guanwang/plan.png')
                break;
            case pipeNetworkObj.value == 3 || StateClass == 3:
                return pointIconLayerStyle('../image/icon/guanwang/delete.png');
                break;
            case pipeNetworkObj.value == 4 || StateClass == 4:
                return pointIconLayerStyle('../image/icon/guanwang/build.png');
                break;
        }
    } else {
        switch (true) {
            case pipeNetworkObj.value == 1 || StateClass == 1:
                return guanjingLayerStyle('#6500F5')
                break;
            case pipeNetworkObj.value == 2 || StateClass == 2:
                return guanjingLayerStyle('#F58F00')
                break;
            case pipeNetworkObj.value == 3 || StateClass == 3:
                return guanjingLayerStyle('#0081F5');
                break;
            case pipeNetworkObj.value == 4 || StateClass == 4:
                return guanjingLayerStyle('#C600F5');
                break;
            case pipeNetworkObj.value == 'xiaofangshuan':
                return pointIconLayerStyle('../image/icon/xiaofangshuan.png');
                break;
            case pipeNetworkObj.value == 'shuibiao':
                return pointIconLayerStyle('../image/icon/shuibiao.png');
                break;
            case pipeNetworkObj.value == 'jianxiujing':
                return pointIconLayerStyle('../image/icon/jianxiujing.png');
                break;
            case pipeNetworkObj.value == 'bengzhan':
                return pointIconLayerStyle('../image/icon/bengzhan.png');
                break;
            case pipeNetworkObj.value == 'wantou' || PointName == '弯头':
                return pointIconLayerStyle('../image/icon/wantou.png');
                break;
            case pipeNetworkObj.value == 'gaidu' || PointName == '盖堵':
                return pointIconLayerStyle('../image/icon/gaidu.png');
                break;
            case pipeNetworkObj.value == 'santong' || PointName == '三通':
                return pointIconLayerStyle('../image/icon/santong.png');
                break;
            case pipeNetworkObj.value == 'sitong' || PointName == '四通':
                return pointIconLayerStyle('../image/icon/sitong.png');
                break;
            case pipeNetworkObj.value == 'wutong' || PointName == '五通':
                return pointIconLayerStyle('../image/icon/wutong.png');
                break;
            case pipeNetworkObj.value == 'diefa' || PointName == '蝶阀':
                return pointIconLayerStyle('../image/icon/diefa.png');
                break;
            case pipeNetworkObj.value == 'zhafa' || PointName == '闸阀':
                return pointIconLayerStyle('../image/icon/zhafa.png');
                break;
            case pipeNetworkObj.value == 'yalifa' || PointName == '压力阀':
                return pointIconLayerStyle('../image/icon/yalifa.png');
                break;
            case pipeNetworkObj.value == 'paiqifa' || PointName == '排气阀':
                return pointIconLayerStyle('../image/icon/paiqifa.png');
                break;
            case pipeNetworkObj.value == 'jianyafa' || PointName == '减压阀':
                return pointIconLayerStyle('../image/icon/jianyafa.png');
                break;
            case pipeNetworkObj.value == 'paiwufa' || PointName == '排污阀':
                return pointIconLayerStyle('../image/icon/paiwufa.png');
                break;
            case pipeNetworkObj.value == 'xuansaifa' || PointName == '旋塞阀':
                return pointIconLayerStyle('../image/icon/xuansaifa.png');
                break;
            case pipeNetworkObj.value == 'qitafamen' || PointName == '其他阀门':
                return pointIconLayerStyle('../image/icon/qitafamen.png');
                break;
            case pipeNetworkObj.value == 'chushuikou' || PointName == '出水口':
                return pointIconLayerStyle('../image/icon/chushuikou.png');
                break;
            case pipeNetworkObj.value == 'yuliukou' || PointName == '预留口':
                return pointIconLayerStyle('../image/icon/yuliukou.png');
                break;
            case pipeNetworkObj.value == 'feipucha' || PointName == '非普查':
                return pointIconLayerStyle('../image/icon/feipucha.png');
                break;
            case pipeNetworkObj.value == 'bianzhi' || PointName == '变质':
                return pointIconLayerStyle('../image/icon/bianzhi.png');
                break;
        }
    }

    if (currentThematicName == 'guanjing') {
        var UnitType = feature.values_.UnitType;
        switch (true) {
            case UnitType <= 200:
                return guanjingLayerStyle('#00F5B4')
                break;
            case UnitType > 200 && UnitType <= 400:
                return guanjingLayerStyle('#F58F00')
                break;
            case UnitType > 400 && UnitType <= 600:
                return guanjingLayerStyle('#0081F5');
                break;
            case UnitType > 600 && UnitType <= 800:
                return guanjingLayerStyle('#C600F5');
                break;
            case UnitType > 800 && UnitType <= 1000:
                return guanjingLayerStyle('#D00A57');
                break;
            case UnitType > 1000 && UnitType <= 1200:
                return guanjingLayerStyle('#0A00F5');
                break;
            case UnitType > 1200 && UnitType <= 1400:
                return guanjingLayerStyle('#00F5F3');
                break;
            case UnitType > 1400 && UnitType < 1600:
                return guanjingLayerStyle('#95FF28');
                break;
            default:
        }
    }

    if (currentThematicName == 'guancai') {
        var Material = null;
        Material = feature.values_.Material;
        switch (true) {
            case name == 'qiumozhutie' || Material == '球墨铸铁':
                return guanjingLayerStyle('#00F5B4')
                break;
            case name == 'zhutie' || Material == '铸铁':
                return guanjingLayerStyle('#F58F00')
                break;
            case name == 'prc' || Material == 'PRC':
                return guanjingLayerStyle('#0081F5');
                break;
            case name == 'pe' || Material == 'PE':
                return guanjingLayerStyle('#C600F5');
                break;
            case name == 'pvc' || Material == 'PVC':
                return guanjingLayerStyle('#D00A57');
                break;
            case name == 'tong' || Material == '砼':
                return guanjingLayerStyle('#0A00F5');
                break;
            case name == 'gang' || Material == '钢':
                return guanjingLayerStyle('#00F5F3');
                break;
            case name == 'biligang' || Material == '玻璃钢':
                return guanjingLayerStyle('#95FF28');
                break;
            default:
        }
    }

}

// 图标选中后的效果
function selectIcon(feature, resolution) {
    if (currentThematicName == 'guanjing') {
        var UnitType = feature.values_.UnitType;
        switch (true) {
            case UnitType <= 200:
                return guanjingLayerSelectStyle('rgba(0,122,89)');
                break;
            case UnitType > 200 && UnitType <= 400:
                return guanjingLayerSelectStyle('rgba(122,71,0)');
                break;
            case UnitType > 400 && UnitType <= 600:
                return guanjingLayerSelectStyle('rgba(0,64,122)');
                break;
            case UnitType > 600 && UnitType <= 800:
                return guanjingLayerSelectStyle('rgba(98,0,122)');
                break;
            case UnitType > 800 && UnitType <= 1000:
                return guanjingLayerSelectStyle('rgba(103,4,43)');
                break;
            case UnitType > 1000 && UnitType <= 1200:
                return guanjingLayerSelectStyle('rgba(4,0,122)');
                break;
            case UnitType > 1200 && UnitType <= 1400:
                return guanjingLayerSelectStyle('rgba(0,122,121)');
                break;
            case UnitType > 1400 && UnitType < 1600:
                return guanjingLayerSelectStyle('rgba(74,127,19)');
                break;
            default:
        }
    }
    if (currentThematicName == 'guancai') {
        var Material = null;
        Material = feature.values_.Material;
        switch (true) {
            case name == 'qiumozhutie' || Material == '球墨铸铁':
                return guanjingLayerSelectStyle('rgba(0,122,89)');
                break;
            case name == 'zhutie' || Material == '铸铁':
                return guanjingLayerSelectStyle('rgba(122,71,0)');
                break;
            case name == 'prc' || Material == 'PRC':
                return guanjingLayerSelectStyle('rgba(0,64,122)');
                break;
            case name == 'pe' || Material == 'PE':
                return guanjingLayerSelectStyle('rgba(98,0,122)');
                break;
            case name == 'pvc' || Material == 'PVC':
                return guanjingLayerSelectStyle('rgba(103,4,43)');
                break;
            case name == 'tong' || Material == '砼':
                return guanjingLayerSelectStyle('rgba(4,0,122)');
                break;
            case name == 'gang' || Material == '钢':
                return guanjingLayerSelectStyle('rgba(0,122,121)');
                break;
            case name == 'biligang' || Material == '玻璃钢':
                return guanjingLayerSelectStyle('rgba(74,127,19)');
                break;
            default:
        }
    }
    if (currentThematicName == 'guanwang') {
      var StateClass = null;
      StateClass = feature.values_.StateClass;
        if (pipeNetworkObj.type != null && pipeNetworkObj.type == 'point') {
          switch (true) {
              case pipeNetworkObj.value == 1 || StateClass == 1:
                  return pointIconLayerSelectStyle('../image/icon/iconSelect/nowhasselect.png')
                  break;
              case pipeNetworkObj.value == 2 || StateClass == 2:
                  return pointIconLayerSelectStyle('../image/icon/iconSelect/planselect.png')
                  break;
              case pipeNetworkObj.value == 3 || StateClass == 3:
                  return pointIconLayerSelectStyle('../image/icon/iconSelect/deleteselect.png');
                  break;
              case pipeNetworkObj.value == 4 || StateClass == 4:
                  return pointIconLayerSelectStyle('../image/icon/iconSelect/buildselect.png');
                  break;
          }
        }
        if(pipeNetworkObj.type != null && pipeNetworkObj.type == 'pipeline'){
            switch (true) {
          case pipeNetworkObj.value == 1 || StateClass == 1:
              return guanjingLayerSelectStyle('rgba(50,0,122)')
              break;
          case pipeNetworkObj.value == 2 || StateClass == 2:
              return guanjingLayerSelectStyle('rgba(122,71,0)')
              break;
          case pipeNetworkObj.value == 3 || StateClass == 3:
              return guanjingLayerSelectStyle('rgba(0,64,122)');
              break;
          case pipeNetworkObj.value == 4 || StateClass == 4:
              return guanjingLayerSelectStyle('rgba(98,0,122)');
              break;
        }
       }
     }
    if(currentThematicName == 'moretematic'){
        var PointName = null;
        PointName = feature.values_.PointName;
      switch (true) {
          case pipeNetworkObj.value == 'xiaofangshuan':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/xiaofangshuanselect.png');
              break;
          case pipeNetworkObj.value == 'shuibiao':
              return pointIconLayerSelectStyle('../image/icon/shuibiao.png');
              break;
          case pipeNetworkObj.value == 'jianxiujing':
              return pointIconLayerSelectStyle('../image/icon/jianxiujing.png');
              break;
          case pipeNetworkObj.value == 'bengzhan':
              return pointIconLayerSelectStyle('../image/icon/bengzhan.png');
              break;
          case pipeNetworkObj.value == 'wantou' || PointName == '弯头':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/wantouselect.png');
              break;
          case pipeNetworkObj.value == 'gaidu' || PointName == '盖堵':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/gaiduselect.png');
              break;
          case pipeNetworkObj.value == 'santong' || PointName == '三通':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/santongselect.png');
              break;
          case pipeNetworkObj.value == 'sitong' || PointName == '四通':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/sitongselect.png');
              break;
          case pipeNetworkObj.value == 'wutong' || PointName == '五通':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/wutongselect.png');
              break;
          case pipeNetworkObj.value == 'diefa' || PointName == '蝶阀':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/diefaselect.png');
              break;
          case pipeNetworkObj.value == 'zhafa' || PointName == '闸阀':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/zhafaselect.png');
              break;
          case pipeNetworkObj.value == 'yalifa' || PointName == '压力阀':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/yalifaselect.png');
              break;
          case pipeNetworkObj.value == 'paiqifa' || PointName == '排气阀':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/paiqifaselect.png');
              break;
          case pipeNetworkObj.value == 'jianyafa' || PointName == '减压阀':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/jianyafaselect.png');
              break;
          case pipeNetworkObj.value == 'paiwufa' || PointName == '排污阀':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/paiwufaselect.png');
              break;
          case pipeNetworkObj.value == 'xuansaifa' || PointName == '旋塞阀':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/xuansaifaselect.png');
              break;
          case pipeNetworkObj.value == 'qitafamen' || PointName == '其他阀门':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/qitafamenselect.png');
              break;
          case pipeNetworkObj.value == 'chushuikou' || PointName == '出水口':
              return pointIconLayerSelectStyle('../image/icon/iconSelect/chushuikouselect.png');
              break;
          case pipeNetworkObj.value == 'yuliukou' || PointName == '预留口':
              return pointIconLayerSelectStyle('../image/icon/yuliukou.png');
              break;
          case pipeNetworkObj.value == 'feipucha' || PointName == '非普查':
              return pointIconLayerSelectStyle('../image/icon/feipucha.png');
              break;
          case pipeNetworkObj.value == 'bianzhi' || PointName == '变质':
              return pointIconLayerSelectStyle('../image/icon/bianzhi.png');
              break;
       }
     }
}
