
var newAddPipeLineObj = {
    FeaturesNumber: 0,
    getCoordinates: [],
    allData:[]
  }

// var getAppMapSetConfig = null; //app地图配置和地图数据请求接口对象变量
function initWindow() {
    api.parseTapmode();
    var header = $api.dom('header'); // 获取 header 标签元素
    var footer = $api.dom('footer'); // 获取 footer 标签元素
    // 1.修复开启沉浸式效果带来的顶部Header与手机状态栏重合的问题，最新api.js方法已支持适配iPhoneX；
    // 2.默认已开启了沉浸式效果 config.xml中 <preference name="statusBarAppearance" value="true"/>
    // 3.沉浸式效果适配支持iOS7+，Android4.4+以上版本
    if (header != null) {
        var headerH = $api.fixStatusBar(header);
    }
    // 最新api.js为了适配iPhoneX增加的方法，修复底部Footer部分与iPhoneX的底部虚拟横条键重叠的问题；
    if (footer != null) {
        var footerH = $api.fixTabBar(footer);
    }

}

var whetherDeleteLabel = false; //是否删除标注信息

// 关闭窗口
function closeWin() {
    api.closeWin();
}

// 复选框选中初始化
function initCheckbox() {
    // var checkbox = $('div[class*="aui-checkbox"]');
    // for (var i = 0; i < checkbox.length; i++) {
    //     checkbox[i].onclick = function() {
    //        if($(this).attr('data-type')!=undefined){
    //         //  全选
    //          if ($(this).hasClass('aui-checked')) {
    //              $(this).removeClass('aui-checked');
    //              $(this).parent().siblings().find('.aui-checkbox').removeClass('aui-checked');
    //          } else {
    //              $(this).addClass('aui-checked');
    //              $(this).parent().siblings().find('.aui-checkbox').addClass('aui-checked');
    //          }
    //        }else {
    //          if ($(this).hasClass('aui-checked')) {
    //              $(this).removeClass('aui-checked')
    //          } else {
    //              $(this).addClass('aui-checked');
    //          }
    //
    //        }
    //
    //     }
    // }

    var listcheckbox = $('div[class*="aui-row-checkbox"]');
    var checkedAll = 0;
    for (var i = 0; i < listcheckbox.length; i++) {
        listcheckbox[i].onclick = function() {
            if ($(this).attr('data-type') != undefined) {
                //  全选
                if ($(this).find('.aui-checkbox').hasClass('aui-checked')) {
                    $(this).find('.aui-checkbox').removeClass('aui-checked')
                    $(this).siblings().find('.aui-checkbox').removeClass('aui-checked');
                } else {
                    $(this).find('.aui-checkbox').addClass('aui-checked');
                    $(this).siblings().find('.aui-checkbox').addClass('aui-checked');
                }
            } else {
                if ($(this).children().find('.aui-checkbox').hasClass('aui-checked')) {
                    $(this).children().find('.aui-checkbox').removeClass('aui-checked');
                    if (checkedAll > 0) {
                        checkedAll -= 1;
                    }
                } else {
                    $(this).children().find('.aui-checkbox').addClass('aui-checked');
                    checkedAll++;
                }
                if (checkedAll == listcheckbox.length - 1) {
                    // 减一的原因是，减去全选按钮
                    $('#allchecked').addClass('aui-checked');
                } else {
                    $('#allchecked').removeClass('aui-checked');
                }
            }



        }
    }
}
// 打开专题地图页面
function thematicMapWin(name, thematicName, type, more = null) {
    var url = '../../html/newGIS/thematicmap/thematicmap.html';
    if (more != null) {
        api.openWin({
            name: 'thematicmapmany',
            url: '../../html/newGIS/thematicmap/thematicmapmany.html',
            pageParam: {
                name: name,
                type: type,
                thematicName: thematicName,
            }
        });
    } else {
        api.openWin({
            name: 'thematicmap',
            url: url,
            pageParam: {
                name: name,
                type: type,
                thematicName: thematicName,
            }
        });
    }

}

// 监听新增管线和管点页面关闭监听
function sendEvent() {
    api.sendEvent({
        name: 'newAddPipelineCloseWin',
    });
}

// zxf 模拟弹窗
function dialogAlert(params, callback) {
    let BtnNumbers = ''
    if (params.buttons.length != 0 || params.buttons != undefined) {
        var buttons = params.buttons;
        for (let i = 0; i < buttons.length; i++) {
            BtnNumbers += `<div class="dialogBtn" data-attr='${i+1}'>${buttons[i]}</div>`;
        }
    }
    if (BtnNumbers == '') {
        BtnNumbers = `  <div class="dialogBtn" data-attr='1'>确定</div>
             <div class="dialogBtn" data-attr='2'>取消</div>`;
    }
    let HtmlCentent = `<div class="dilogMark">
               <div class="dialogBox">
                   <div class="dialog_title"><span>${params.title!='' || params.title!=undefined  || params.title!= null ?params.title : '提示'}</span></div>
                   <div class="dialog_body"><span>${params.content !='' || params.content !=undefined ? params.content:'确定要操作吗'}</span></div>
                   <div class="dialog_footer">
                     ${BtnNumbers}
                   </div>
               </div>
           </div>`;
    // 在标签结束前添加html内容
    document.body.insertAdjacentHTML('beforeend', HtmlCentent);
    // 为按钮添加单击事件
    checkDialogBtn(callback);
};

function checkDialogBtn(callback) {
    var dialogBtn = $('.dialogBtn');
    $(dialogBtn[dialogBtn.length - 1]).addClass('noneBorder');
    var isClose = false;
    for (let i = 0; i < dialogBtn.length; i++) {
        $(dialogBtn[i]).on('click', function() {
            $(this).addClass("active");
            var index = $(this).attr('data-attr');
            //  确定
            var data = {
                buttonIndex: index
            }
            callback(data);
            // 移除标签
            document.body.removeChild(document.querySelector('.dilogMark'));

            isClose = true;
        });
        if (isClose) {
            break;
        }
    }
}


// 修改管点或者管线
function editPointOrPipeLine(that, type,currentView = null) {
  var params= $(that).attr('params');

 if(currentView == null){
     params = JSON.parse(params);
    console.log(JSON.stringify(params));
   url='../../html/newGIS/pointOrpipemanage/editPointOrPipeLine.html';
 }else {
  url='./editPointOrPipeLine.html';
 }
 api.openWin({
     name: 'editPointOrPipeLine',
     url: url,
     pageParam: {
         data: params,
         type:type
     }
 });

}


// 收藏管点或者管线
function bookmarkPointOrPipeLine(that, type,from = null) {
    var params ={
      number:$(that).attr('number'),
      name:$(that).attr('name'),
      location:$(that).attr('location'),
      type:type
    }
    var url ='../../html/newGIS/search/bookmarkRemork_frm.html';
    if(from!=null){
      url ='./bookmarkRemork_frm.html';
    }
    // 先判断是否已经收藏 ，已收藏，则删除
    if ($(that).hasClass('no_bookmark')) {
        api.openFrame({
            name: 'bookmarkRemork_frm',
            url:url ,
            rect: {
                x: 0,
                y: 0,
                w: 'auto',
                h: 'auto'
            },
            bounces: false,
            bgColor: 'rgba(0,0,0,0.4)',
            pageParam: params
        });
    } else {
        fnGet(`services/SNTGIS/PipeCollect/DeleteCollect?number=${params.number}`, null, true, function(ret, err) {
            if (ret && ret.success) {
               api.toast({
                   msg: '移除收藏夹成功!',
                   duration: 2000,
                   location: 'middle'
               });

                if (type == 'Point') {
                    $('#pointbookmarkImage').removeClass('hasbookmark').addClass('no_bookmark');
                } else {
                    $('#linebookmarkImage').removeClass('hasbookmark').addClass('no_bookmark');
                }
                if(from !=null){
                  api.sendEvent({
                      name: 'infoDeleteUpdate',
                  });
                } else {
                  api.sendEvent({
                      name: 'UpdateBookmark',
                      extra: {
                          type: type,
                      }
                  });

                }
            } else {
                api.toast({
                    msg: ret.error.message,
                    duration: 2000,
                    location: 'top'
                });

            }
            api.hideProgress();
        });
    }
}

// 修改页码
function changePages(type,PageIndex,callback){
 var allPages =parseInt($('#allPages').text());
  // 向前一页
  if(type == 'pre'){
    if(PageIndex == 1 ){
      PageIndex =1;
      $('.page_box .aui-icon-left').addClass('not_next');
    }else {
      PageIndex --;
      if(PageIndex<=allPages){
        $('.page_box .aui-icon-right').removeClass('not_next');
      }
      if(PageIndex == 1){
        $('.page_box .aui-icon-left').addClass('not_next');
      }
      $('#currentPage').text(PageIndex);
        callback(PageIndex);
    }
  } else {
    // 向后一页
    if(PageIndex < allPages){
      if(PageIndex == allPages){
        PageIndex = allPages;
        $('.page_box .aui-icon-right').addClass('not_next');
      } else {
          PageIndex ++;
          if(PageIndex == allPages){
            $('.page_box .aui-icon-right').addClass('not_next');
          }
          $('.page_box .aui-icon-left').removeClass('not_next');
          $('#currentPage').text(PageIndex);
          callback(PageIndex);
      }
    }

  }
}

// 页码初始化
function initPages(dataArray,pageCount,resuiltCount,currentPage){ //dataArray数据数组 ，pageCount 总共页数 ，resuiltCount查询到的所有数据 ，currentPage当前页数
  if(dataArray.length>0){
   $('.page_box').show();
   if($('#pageCountTitle').length > 0){
     $('#pageCount').text(pageCount);
     $('#resuiltCount').text(resuiltCount);
   }
 } else {
   if($('#pageCountTitle"').length > 0){
      $("#pageCountTitle").hide();
   }
 }
   $('#currentPage').text(currentPage);
   if(resuiltCount > 10){
     $('#allPages').text(pageCount);
     if(pageCount == currentPage){
       $('.aui-icon-right').addClass('not_next')
     }else {
       $('.aui-icon-right').removeClass('not_next');
     }
 }else {
     $('#allPages').text(1);
     $('.aui-icon-right').addClass('not_next');
 }
}





// 判断是否是收藏的管点或者管线 （主要用于显示收藏图标是已收藏还是未收藏）
function IsCollect(id, type) {
    //  获取数据添加为收藏
    fnPost(`services/SNTGIS/PipeCollect/IsCollect?number=${id}`, null, 'application/json', true, false, function(ret, err) {
        if (ret && ret.success) {
            if (ret.result) {
                //已经收藏
                if (type == 'point') {
                    $('#pointbookmarkImage').removeClass('no_bookmark').addClass('hasbookmark');
                } else {
                    $('#linebookmarkImage').removeClass('no_bookmark').addClass('hasbookmark');
                }

            } else {
                // 未收藏
                if (type == 'point') {
                    $('#pointbookmarkImage').removeClass('hasbookmark').addClass('no_bookmark');
                } else {
                    $('#linebookmarkImage').removeClass('hasbookmark').addClass('no_bookmark');
                }
            }
        }
        api.hideProgress();
    });
}
// 管点状态类别，管材等接口调用
function searchAllClass(type,element,defaultValue = null){
  var options = options;
  fnPost(`services/SNTGIS/SearchPipe/SearchAllClass?fieldname=${type}`,null,'application/json',true,false,function(ret,err){
    if(ret && ret.success){
      var result = ret.result;
      var options = '<option value="">请选择</option>';
      for(var i=0;i<result.length;i++){
        options+=`<option value=${result[i]}>${result[i]}</option>`;
      }
      $(element).append(options);
      if(defaultValue != null){
          $(element).val(defaultValue);
      }
    }
  });
}

// 查询管点和管线状态类别
function searchStateClass(element,defaultValue = null){
  fnPost(`services/SNTGIS/SearchPipe/SearchStateClass`,null,'application/json',true,false,function(ret,err){
    api.hideProgress();
    if(ret && ret.success){
      var result = ret.result;
      var options = '<option value="">请选择</option>';
      for(var i=0;i<result.length;i++){
        options+=`<option value=${result[i][1]}>${result[i][0]}</option>`;
      }
      $(element).append(options);
      if(defaultValue != null){
          $(element).val(defaultValue);
      }
    }
  });
}

// 新增管网--根据类型生成管点或者管线编号
function createNumber(type,callback){
     fnPost(`services/SNTGIS/EditPipeManage/CreatNumber?type=${type}`,null,'application/json',true,false,function(ret,err){
       if(ret && ret.success){
        callback(ret.result);
      } else {
        api.toast({
            msg: '编号生成失败',
            duration: 2000,
            location: 'bottom'
        });

      }
      api.hideProgress();
     })
}

// 新增管网--新增管点
function addNewPoint(body,callback){
  fnPost(`services/SNTGIS/EditPipeManage/AddPoint`,body,'application/json',true,false,function(ret,err){
    api.hideProgress();
    if(ret && ret.success){
      callback(ret.result);
    } else {
      api.toast({
          msg: '管点新增失败!',
          duration: 2000,
          location: 'top'
      });

    }
  });
}

// 首页管点管线编辑  根据编号生成wkt
function searchByNumber(data,type){
  // 用于删除或者编辑数据
  var selectPointOrLine = data;
  var number = null;
  if(type == 'Point'){
    number = data.pointnumbe
  }else {
      number = data.linenumber
  }
  fnPost('services/SNTGIS/SearchPipe/SearchByNumber?input='+number,null,'application/json',true,false,function(ret,err){
    if(ret && ret.success){
      if(type == 'Point'){
      var result = ret.result.point;
      }else {
      var result = ret.result.line;
      }
      selectPointOrLine.wkt = result.wkt;
      $api.setStorage('selectPointOrLine', selectPointOrLine);
      // 添加表示位置的图标
      if(type == 'Point'){
        navOverLay(selectPointOrLine, 'point'); //添加搜周边等
      }else {
        navOverLay(selectPointOrLine, 'line'); //添加搜周边等
      }
    }
  });
}

// 导航和搜周边overlay
function navOverLay(data = null, type = null, isLongPress = false) {
    var overlayPosition = null;
    var elementId = null;
    if (isLongPress == false) { //管点管线搜周边
        elementId = 'pointOrPipeNav';
        $('#pointOrPipeNav').show();
        var overlayPosition = null;
        var renderColor = null;
        // console.log(type);
        // console.log(JSON.stringify(data));
        if (type == 'point') {
            overlayPosition = data.coordinates;
            $('#goNav').attr('lon', overlayPosition[0]);
            $('#goNav').attr('lat', overlayPosition[1]);
            renderColor = 'dot';
             pointOrPipeInfoFeature(overlayPosition, renderColor);
             $('#searchAound').attr('params', JSON.stringify(data) );
        } else {
            overlayPosition = data.coordinates[0];
            $('#goNav').attr('lon', overlayPosition[0]);
            $('#goNav').attr('lat', overlayPosition[1]);
            renderColor = 'line';
           pointOrPipeInfoFeature(data.coordinates, renderColor);
           $('#searchAound').attr('params', JSON.stringify(data) );
        }
        // console.log(JSON.stringify(data));
        // $('#searchAound').attr('params', JSON.stringify(data) );

    } else { //长按搜周边
        $('#longpresspointOrPipeNav').show();
        elementId = 'longpresspointOrPipeNav';
        overlayPosition = data;
        $('#longpresspointOrPipeNav').show();
        $('#longPressgoNav').attr('lon', data[0]);
        $('#longPressgoNav').attr('lat', data[1]);
        pointOrPipeInfoFeature(data, 'image',data);
    }
    var element = document.getElementById(elementId)
        // 把图标呼叫到地图上.,需要一个ol.Overlay
    var navOverlay = new ol.Overlay({
        element: element
    });
    // 关键点,设置附加的图标在地图上的位置
    navOverlay.setPosition(overlayPosition);
    navOverlay.set('name', 'navOverlay');
    // 将图标添加到地图上
    map.addOverlay(navOverlay);
}
var hideLongPressOverlay = function() {
    $('#longpresspointOrPipeNav').hide();
    removeAddLayer('pointOrPipeInfoFeatureLayer', 18); //移除之前加的图标图层
    map.un('singleclick', hideLongPressOverlay);
}



// 管点信息和官网信息查询是显示的图标
function pointOrPipeInfoFeature(coordinates, type,longPressData = null) {
    removeAddLayer('pointOrPipeInfoFeatureLayer', 18); //移除之前加的图标图层
    if (type == 'dot' || type == 'image') {
        var pointFeature = new ol.Feature(new ol.geom.Point(coordinates));
    } else {
        var pointFeature = new ol.Feature(new ol.geom.LineString(coordinates));
        var startPointFeature = new ol.Feature(new ol.geom.Point(coordinates[0]));
        var endPointFeature = new ol.Feature(new ol.geom.Point(coordinates[1]));
    }

    if (type == 'dot') {
        var style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({
                    color: '#FF647C'
                }),

            })
        });
    } else if (type == 'line') {
        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#FF647C',
                width: 3,
            }),
            fill: new ol.style.Fill({
                color: '#FF647C'
            })
        })
    } else {
        var style = new ol.style.Style({
            image: new ol.style.Icon({
                src: '../../image/newGIS/location.png'
            })
        });
    }
    var startOrEndstyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: '#FF647C'
            }),

        })
    });
    pointFeature.setStyle(style);
    if (type == 'line') {
        startPointFeature.setStyle(startOrEndstyle);
        endPointFeature.setStyle(startOrEndstyle);
        var featuresAarry = [startPointFeature, pointFeature, endPointFeature];
    } else {
        var featuresAarry = [pointFeature];
    }
    var pointOrPipeInfoFeatureLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: featuresAarry
        })
    });
    pointOrPipeInfoFeatureLayer.set('name', 'pointOrPipeInfoFeatureLayer');
    map.addLayer(pointOrPipeInfoFeatureLayer);

    if(type == 'image'){
        var wkt = new ol.format.WKT().writeFeature(pointFeature);
        longPressData.wkt = wkt;
        var data = {
          lon:longPressData[0],
          lat:longPressData[1],
          wkt:wkt
        }
        $('#longPressAddPoint').attr('params', JSON.stringify(data));
        $('#longPresssearchAound').attr('params',JSON.stringify(data));
    }
}


// 延迟300毫秒加载数据 （因为打开win的时候有300毫秒延迟，所以加载动画可能不能显示问题）
function loadDelayTHMS(callback){
  setTimeout(()=>{
  callback();
  },300);
}

// 判断管点是否存在 长按新增管点，新增管网中地图画线判断管点是否存在

function whetherPointExists(params,callback){
  fnPost('services/SNTGIS/SearchPipe/SearchAround', {
      body: JSON.stringify({
          pageIndex: 1,
          maxResultCount: 10,
          wkt: params.wkt,
          distence:0.00001
      })
  }, 'application/json', true, false, function(ret, err) {
      if (ret && ret.success) {
       var point = ret.result.point;
       if(point.pointAttribute.length == 0){
         callback(true);
       } else {
        callback(false,point.pointAttribute);
       }
      }
      api.hideProgress();
  });
}
// 去除字符串中所有空格
function removeBblankSpace(value) {
  value = value.replace(/\s*/g,"");
  return value;
}

// 判断首页管点管线删除或者编辑时是否处于待审核状态
function IsCheckState(number,callback){
  fnPost(`services/SNTGIS/EditPipeManage/IsCheckState?input=${number}`, {}, 'application/json', true, false, function(ret, err) {
      if (ret && ret.success) {
        if(ret.result){
          callback(true);
        }else {
          callback(false);
        }
       }
      api.hideProgress();
  });
}
// // 获取地图配置 newgis
// function getAppMapSet(){
//   fnGet('services/SNTGIS/MapSet/GetAppMapSet',{},false,function(ret,err){
//     if(ret && ret.success){
//        if(ret.result != null){
//         var getAppMapSetConfig = ret.result;
//         //  console.log(JSON.stringify(ret.result));
//          getAppMapSetConfig.center = getAppMapSetConfig.center.split(',');
//          $api.setStorage('getAppMapSetConfig', getAppMapSetConfig);
//        }
//     } else {
//       // console.log(2)
//       api.toast({
//           msg: '网络错误',
//           duration: 2000,
//           location: 'top'
//       });
//
//     }
//   })
// }
