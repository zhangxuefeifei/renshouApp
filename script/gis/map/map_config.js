// 接口地址
var GisUrl= $api.getStorage('GisUrl');
var Config =$api.getStorage('Config');
var mapconfig = {
    maxZoom: Config.maxZoom,                                            //最大缩放级别
    minZoom: Config.minZoom,                                             //最小缩放级别
    initialZoom: Config.initialZoom,                                         //初始缩放级别
    center: [ Config.centerX,Config.centerY],                                //初始中心坐标
    dataSourceName:Config.dataSourceName,
    pointdataSetName: Config.pointdataSetName,
    linedataSetName:Config.linedataSetName
};
var mapurl=(window.isLocal ? window.server : ""+GisUrl+"") + Config.mapurl;
var layername={
	pipepoint:Config.pipepoint,
	pipeline:Config.pipeline
}

//网络服务
var serviceUrl = GisUrl+Config.serviceUrl;
//数据服务，用于编辑
var editUrl =  GisUrl+Config.editUrl;
