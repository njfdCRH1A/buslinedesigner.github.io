// TabStation.js
// “设站”面板

app.component('tab-station', {
    props: {
        line: {
            type: Object,
            required: true
        }
    },
    setup() {
        const map = VueReactivity.shallowRef(null);
        return{
            map,
        }
    },
    mounted() {
        this.mapInit();
    },
    template:
    /* HTML */
    `
    <div class="container">
        <div class="alert alert-primary alert-dismissible d-flex align-items-center" role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#info-fill" /></svg>
            <div>本应用现阶段<b>仅供测试</b>，<b>不保证功能稳定性</b>。如出现问题，请及时向BobLiu反馈。<span v-if="!chrome">为获得更好的体验，建议使用 <a href="https://google.cn/chrome/" class="alert-link" target="_blank">Chrome</a> 浏览器。</span>建了一个公测QQ频道，<a href="https://qun.qq.com/qqweb/qunpro/share?inviteCode=lM5QZ" class="alert-link" target="_blank">大家来玩呀～</a></div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <h1><span class="fw-normal display-5">{{ title }}</span><span class="fw-normal display-7">{{ subtitle }}</span></h1>
        <div class="row justify-content-around">
            <div class="col-12 col-md-3 card mb-3 TabStationCard1">
                <div class="card-header">基本信息</div>
                <div class="card-body" style="overflow-y:auto; overflow-x:hidden;">
                    <div class="mb-3">
                        <label class="form-label" for="lineName">线路名称</label>
                        <input type="text" class="form-control" id="lineName" placeholder="未命名线路" v-model.trim="line.lineName"/>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="lineType">线路类型</label>
                        <select class="form-select" id="lineType" v-model.number="line.lineType">
                            <option selected value="1">双向线路</option>
                            <option value="2">单向线路</option>
                            <option value="3">双向环线</option>
                            <option value="4">单向环线</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="company">运营公司</label>
                        <input type="text" class="form-control" id="company" placeholder="填写运营公司名称" v-model.trim="line.company" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="company">所在地区</label>
                        <input type="text" class="form-control" id="city" placeholder="填写城市名称或地区行政代码" v-model.trim="cityName" @change="searchCity()" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="length">{{ isBilateral?"上行信息":"线路信息" }}</label>
                        <input type="text" class="form-control" id="infoUp" placeholder="0站 / 0.0km" v-model.trim="infoUp" disabled readonly />
                    </div>
                    <div class="mb-3" v-if="isBilateral">
                        <label class="form-label" for="length">下行信息</label>
                        <input type="text" class="form-control" id="infoDown" placeholder="0站 / 0.0km" v-model.trim="infoDown" disabled readonly />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="length">线路备注</label>
                        <textarea class="form-control" rows="1" v-model.trim="line.remark"></textarea>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-3 card mb-3 TabStationCard2">
                <div class="card-header">{{ showStationsOnly?"线路站点":"线路节点" }}</div>
                    <div class="card-body" style="padding: 0px; overflow-y:auto; overflow-x:hidden;">
                        <div v-if="!showStationsOnly" class="list-group list-group-flush">
                            <a v-if="!nodes.length" href="javascript: void(0)" class="list-group-item list-group-item-action">使用添加节点工具在地图上单击即可添加</a>
                            <a v-for="(node, index) in nodes" class="list-group-item list-group-item-action" :class="{ active: selectedNode == index }" @click="selectNode(index, false)">
                                <svg v-if="node.type == 'station'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-record-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                </svg>
                                <svg v-if="node.type == 'waypoint'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="16" fill="currentColor"></svg>
                                <input v-if="renameEnabled && selectedNode == index" v-model.trim="node.name" type="text" class="h-100" style="border-style: none" @keypress="renameKeyPress()"/>
                                <span v-else>{{ node.name }}</span>
                            </a>
                        </div>
                        <div v-if="showStationsOnly" class="list-group list-group-flush">
                        <a v-if="!nodes.length" href="javascript: void(0)" class="list-group-item list-group-item-action">使用添加节点工具在地图上单击即可添加</a>
                        <a v-for="station in stations" class="list-group-item list-group-item-action" :class="{ active: selectedNode == station.id }" @click="selectNode(station.id, false)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-record-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="16" fill="currentColor"></svg>
                            <input v-if="renameEnabled && selectedNode == station.id" v-model.trim="station.name" type="text" class="h-100" style="border-style: none" @keypress="renameKeyPress()"/>
                            <span v-else>{{ station.name }}</span>
                        </a>
                    </div>
                    <div style="border-width: 1px 0 0 0; border-style: solid; border-color: rgba(0,0,0,.125);"></div>
                </div>
                <div class="card-footer">
                    <div class="btn-group btn-group-sm pull-right" role="group" style="float:left" :hidden="!isBilateral">
                        <button type="button" class="btn btn-outline-primary" :class="{ active: selectedDirection == 'up' }" @click="setDirection('up')">上行</button>
                        <button type="button" class="btn btn-outline-primary" :class="{ active: selectedDirection == 'down' }" @click="setDirection('down')">下行</button>
                    </div>
                    <div class="btn-group btn-group-sm pull-right" role="group" style="float:right">
                        <button type="button" class="btn btn-outline-primary" :class="{ active: showStationsOnly }" title="只显示站点" @click="setShowStationsOnly()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-record-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-primary" :class="{ active: renameEnabled }" title="重命名当前节点" @click="renameEnabled = !renameEnabled; loadMapLine(false)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-input-cursor-text" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M5 2a.5.5 0 0 1 .5-.5c.862 0 1.573.287 2.06.566.174.099.321.198.44.286.119-.088.266-.187.44-.286A4.165 4.165 0 0 1 10.5 1.5a.5.5 0 0 1 0 1c-.638 0-1.177.213-1.564.434a3.49 3.49 0 0 0-.436.294V7.5H9a.5.5 0 0 1 0 1h-.5v4.272c.1.08.248.187.436.294.387.221.926.434 1.564.434a.5.5 0 0 1 0 1 4.165 4.165 0 0 1-2.06-.566A4.561 4.561 0 0 1 8 13.65a4.561 4.561 0 0 1-.44.285 4.165 4.165 0 0 1-2.06.566.5.5 0 0 1 0-1c.638 0 1.177-.213 1.564-.434.188-.107.335-.214.436-.294V8.5H7a.5.5 0 0 1 0-1h.5V3.228a3.49 3.49 0 0 0-.436-.294A3.166 3.166 0 0 0 5.5 2.5.5.5 0 0 1 5 2z"/>
                                <path d="M10 5h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4v1h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4v1zM6 5V4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-primary" title="更改当前节点类型" @click="changeNode(selectedNode)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                                <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-danger" v-if="!showStationsOnly" title="删除当前节点" @click="deleteNode()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-danger" v-if="showStationsOnly" title="删除当前站点" @click="deleteNodes()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-5 card mb-3 TabStationCard3" id="mapPanel">
	            <div class="card-header" @click="loadMapLine(true); map.resize()">
                    <span>线路走向</span>
                </div>
	            <div class="card-body" id="amap"></div>
	            <div class="card-footer">
                    <div class="btn-group btn-group-sm pull-right" role="group" style="float: left">
                        <button type="button" class="btn btn-outline-primary" :class="{ active: satelliteEnabled }" @click="setSatelliteLayer()" title="卫星图层">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-front" viewBox="0 0 16 16">
                                <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm5 10v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2v5a2 2 0 0 1-2 2H5z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-primary" :class="{ active: mapEnabled }" @click="setMapLayer()" title="地图图层">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-union" viewBox="0 0 16 16">
                                <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-primary" @click="panelFullScreen()" title="面板全屏">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-window-fullscreen" viewBox="0 0 16 16">
                                <path d="M3 3.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm1.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm1 .5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z"/>
                                <path d="M.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5H.5ZM1 5V2h14v3H1Zm0 1h14v8H1V6Z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-primary" @click="setMapTool('watch');mapFullScreen()" title="地图全屏">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-fullscreen" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="btn-group btn-group-sm pull-right" role="group" style="float: right">
                        <button type="button" class="btn btn-outline-primary" :class="{ active: selectedMapTool == 'watch' }" @click="setMapTool('watch')" title="切换为看图模式">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-index" viewBox="0 0 16 16">
                                <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 1 0 1 0V6.435a4.9 4.9 0 0 1 .106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 0 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.035a.5.5 0 0 1-.416-.223l-1.433-2.15a1.5 1.5 0 0 1-.243-.666l-.345-3.105a.5.5 0 0 1 .399-.546L5 8.11V9a.5.5 0 0 0 1 0V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-primary" :class="{ active: selectedMapTool == 'newStationSmart' }" @click="setMapTool('newStationSmart')" title="切换为智能选站模式">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-primary" :class="{ active: selectedMapTool == 'newStation' }" @click="setMapTool('newStation')" title="切换为新建站点模式">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-primary" :class="{ active: selectedMapTool == 'newWaypoint' }" @click="setMapTool('newWaypoint')" title="切换为新建途经点模式">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="btn-group btn-group-sm pull-right me-2" role="group" style="float: right">
                        <button type="button" class="btn btn-outline-primary" :class="{ active: selectedMapMode == 'before' }" @click="setMapMode('before')" title="在当前节点前操作">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-up" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-primary" :class="{ active: selectedMapMode == 'after' }" @click="setMapMode('after')" title="在当前节点后操作">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            cityName: '',
            selectedDirection: 'up',
            selectedNode: 0,
            selectedMapTool: 'watch',
            selectedMapMode: 'after',
            showStationsOnly: true,
            renameEnabled: false,
            satelliteEnabled: false,
            mapEnabled: true,
            mapItems: {
                polyline: null,
                markers: [],
                infowindow: null,
                satelliteLayer: null
            },
            chrome: true
        }
    },
    methods: {
        // mapInit()
        // 初始化地图div
        mapInit() {
            AMapLoader.load({
                "key": window.AMapKey,
                "version": "2.0",
                "plugins": ['AMap.PlaceSearch', 'AMap.Driving', 'AMap.DistrictSearch', 'AMap.LineSearch']
            }).then((AMap)=>{
                this.map = new AMap.Map('amap', {
                    showIndoorMap: false,
                    rotateEnable: false,
                    doubleClickZoom: false,
                    isHotspot: false,
                    resizeEnable: true,
                    features: ['bg', 'road', 'point'],
                    defaultCursor: 'move'
                });
                this.map.on('click', function(e) {
                    this.clickPoint(e.lnglat.getLng(), e.lnglat.getLat());
                }, this);
                this.loadMapLine(true);
                this.satelliteLayer = new AMap.TileLayer.Satellite();
                this.map.resize();
                this.chrome = AMap.Browser.chrome; // Browser check
            }).catch((e)=>{
                console.error(e);
            });
            /* map.setFeatures(['bg', 'road']); */
            return;
        },

        // mapFullScreen
        // 地图div全屏
        mapFullScreen(){
            var div = document.getElementById('amap');
            if(div.requestFullscreen){
                div.requestFullscreen();
            }else if(div.webkitRequestFullScreen){
                div.webkitRequestFullScreen();
            }else if(div.mozRequestFullScreen){
                div.mozRequestFullScreen();
            }else if(div.msRequestFullscreen){
                div.msRequestFullscreen();
            }
            this.map.resize();
            return;
        },
        // panelFullScreen
        // 地图面板全屏
        panelFullScreen(){
            var div = document.getElementById('mapPanel');
            if(div.requestFullscreen){
                div.requestFullscreen();
            }else if(div.webkitRequestFullScreen){
                div.webkitRequestFullScreen();
            }else if(div.mozRequestFullScreen){
                div.mozRequestFullScreen();
            }else if(div.msRequestFullscreen){
                div.msRequestFullscreen();
            }
            this.map.resize();
            return;
        },

        // clickPoint
        // 在地图上点击一个点
        clickPoint(lng, lat) {
            if(this.selectedMapTool == 'watch'){
                return;
            }
            this.newNode(lng, lat);
        },
        // clickNode
        // 在地图上点击一个节点
        clickNode(e) {
            if(this.selectedMapTool == 'watch'){
                this.selectedNode = e.target.getExtData();
                this.selectNode(this.selectedNode);
            }else{
                this.clickPoint(this.nodes[e.target.getExtData()].lng, this.nodes[e.target.getExtData()].lat);
            }
        },
        // clickPolyline
        // 在地图上点击折线
        clickPolyline(e) {
            this.clickPoint(e.lnglat.getLng(), e.lnglat.getLat());
        },
        // deleteNode
        // 删除列表中选中的节点
        deleteNode() {
            this.line.route[this.trueDirection].splice(this.selectedNode, 1);
            this.selectedNode -= 1;
            if(this.selectedNode < 0){
                this.selectedNode = 0;
            }
            this.loadMapLine(false);
        },
        // deleteNodes
        // 删除上一个站点至选中节点间的所有节点（仅限智能规划模式）
        deleteNodes() {
            if(this.selectedNode == 0){
                this.nodes.splice(0, 1);
            }else{
                var lastStation = 0;
                this.nodes.slice(0, this.selectedNode).forEach((node, index) => {
                    if(node.type == 'station'){
                        lastStation = index;
                    }
                });
                this.nodes.splice(lastStation + 1, this.selectedNode - lastStation);
                this.selectedNode = lastStation;

                if(this.selectedNode != this.nodes.length - 1){
                    var nextStation = this.nodes.findIndex((node, index) => {
                        return (index > this.selectedNode) && (node.type == 'station');
                    });
                    this.nodes.splice(this.selectedNode + 1, nextStation - this.selectedNode - 1);

                    var drivingSearch = new AMap.Driving({
                        policy: AMap.DrivingPolicy.LEAST_TIME
                    });
                    AMap.Event.addListener(drivingSearch, "complete", this.autoSetRouteBehind);
                    drivingSearch.search(
                        new AMap.LngLat(this.nodes[this.selectedNode].lng, this.nodes[this.selectedNode].lat),
                        new AMap.LngLat(this.nodes[this.selectedNode + 1].lng, this.nodes[this.selectedNode + 1].lat)
                    );
                }
            }
            this.loadMapLine(false);
        },
        // changeNode
        // 更改节点类型（站点/途经点）
        changeNode(index) {
            this.setShowStationsOnly(false);
            if(this.trueDirection == 'up'){
                this.line.route.up[index].type == 'station'?
                this.line.route.up[index].type = 'waypoint':
                this.line.route.up[index].type = 'station';
            }else{
                this.line.route.down[index].type == 'station'?
                this.line.route.down[index].type = 'waypoint':
                this.line.route.down[index].type = 'station';
            }
            this.loadMapLine(false);
        },
        // newNode
        // 新建一个节点
        newNode(lng, lat) {
            index = this.selectedNode;
            if(this.selectedMapMode == 'after'){
                index += 1;
            }
            var newNode;
            if(this.selectedMapTool == 'watch'){
                return;
            }else if(this.selectedMapTool == 'newWaypoint'){
                newNode = {
                    'type': 'waypoint',
                    'name': '途经点 #' + this.positionId(lng, lat),
                    'lng': lng,
                    'lat': lat
                }
            }else{
                var stationSearch = new AMap.PlaceSearch({
                    city: '全国',
                    type: '公交车站',
                    pageSize: 1,
                    pageIndex: 1,
                    map: null,
                    panel: null
                });
                stationSearch.searchNearBy('', [lng, lat], 200, this.autoRenameStation);
                newNode = {
                    'type': 'station',
                    'name': '正在生成站名…',
                    'lng': lng,
                    'lat': lat
                };
                if(this.selectedMapTool == 'newStationSmart' && this.nodes.length){
                    var drivingSearch = new AMap.Driving({
                        policy: AMap.DrivingPolicy.LEAST_TIME
                    });
                    AMap.Event.addListener(drivingSearch, "complete", this.autoSetRouteAhead);
                    drivingSearch.search(
                        new AMap.LngLat(this.nodes[this.selectedNode].lng, this.nodes[this.selectedNode].lat),
                        new AMap.LngLat(lng, lat)
                    );
                }
            }
            if(this.trueDirection == 'up'){
                this.line.route.up.splice(index, 0, newNode);
            }else{
                this.line.route.down.splice(index, 0, newNode);
            }
            if(this.selectedMapMode == 'after'){
                this.selectedNode += 1;
            }
            if(this.selectedNode < 0 || this.selectedNode >= this.nodes.length){
                this.selectedNode = 0;
            }
            this.loadMapLine(false);
        },
        // newNode => autoRenameStation
        // 新建节点后自动命名车站
        autoRenameStation(status, result){
            if(status == "complete") {
                this.nodes[this.selectedNode].name = result.poiList.pois[0].name.replace(/\(.*\)$/, '');
            } else {
                this.nodes[this.selectedNode].name = '新站点 #'+ this.positionId(this.nodes[this.selectedNode].lng, this.nodes[this.selectedNode].lat);
            }
        },
        // newNode => autoSetRouteAhead
        // 新建节点后自动规划上一节点至当前站路径并搜索至下一节点路径（仅限自动设站模式）
        autoSetRouteAhead(result){
            if(result.routes[0].steps.length){
                var lastLngLat;
                result.routes[0].steps.forEach(step => {
                    step.path.forEach(lnglat => {
                        if(this.selectedNode && lnglat.getLng() == this.nodes[this.selectedNode - 1].lng && lnglat.getLat() == this.nodes[this.selectedNode - 1].lat){
                            return;
                        }
                        this.nodes.splice(this.selectedNode, 0, {
                            'type': 'waypoint',
                            'name': '途经点 #' + this.positionId(lnglat.getLng(), lnglat.getLat()),
                            'lng': lnglat.getLng(),
                            'lat': lnglat.getLat()
                        });
                        lastLngLat = lnglat;
                        this.selectedNode ++;
                    });
                });
                this.nodes[this.selectedNode].lng = lastLngLat.getLng();
                this.nodes[this.selectedNode].lat = lastLngLat.getLat();

                if(this.selectedNode != this.nodes.length - 1){
                    var nextStation = this.nodes.findIndex((node, index) => {
                        return (index > this.selectedNode) && (node.type == 'station');
                    });
                    this.nodes.splice(this.selectedNode + 1, nextStation - this.selectedNode - 1);

                    var drivingSearch = new AMap.Driving({
                        policy: AMap.DrivingPolicy.LEAST_TIME
                    });
                    AMap.Event.addListener(drivingSearch, "complete", this.autoSetRouteBehind);
                    drivingSearch.search(
                        new AMap.LngLat(this.nodes[this.selectedNode].lng, this.nodes[this.selectedNode].lat),
                        new AMap.LngLat(this.nodes[this.selectedNode + 1].lng, this.nodes[this.selectedNode + 1].lat)
                    );
                }

                this.loadMapLine(false);
            }
        },
        // newNode => autoSetRouteAhead => autoSetRouteBehind
        // 新建节点后自动规划当前站至下一节点路径（仅限自动设站模式）
        // deleteNodes => autoSetRouteBehind
        // 删除节点后自动重新规划（仅限“只显示站点”时）
        autoSetRouteBehind(result){
            var lastLngLat;
            var originStation = this.selectedNode;

            result.routes[0].steps.forEach(step => {
                step.path.forEach(lnglat => {
                    if(this.selectedNode && lnglat.getLng() == this.nodes[this.selectedNode].lng && lnglat.getLat() == this.nodes[this.selectedNode].lat){
                        return;
                    }
                    this.nodes.splice(this.selectedNode + 1, 0, {
                        'type': 'waypoint',
                        'name': '途经点 #' + this.positionId(lnglat.getLng(), lnglat.getLat()),
                        'lng': lnglat.getLng(),
                        'lat': lnglat.getLat()
                    });
                    lastLngLat = lnglat;
                    this.selectedNode ++;
                });
            });

            this.selectedNode = originStation;
            this.loadMapLine(false);
        },
        // selectNode
        // 在节点列表中选中节点
        selectNode(index, setCenter = false) {
            try{
                this.mapItems.infoWindow.close();
            }catch(e){}
            if(this.selectedNode == index){
                this.mapItems.infoWindow = new AMap.InfoWindow({
                    content: this.nodes[this.selectedNode].name + "<br /><small>(" + this.nodes[this.selectedNode].lng + ", "
                        + this.nodes[this.selectedNode].lat + ")</small>",
                    closeWhenClickMap: true
                });
                var position = new AMap.LngLat(this.nodes[this.selectedNode].lng, this.nodes[this.selectedNode].lat);
                this.mapItems.infoWindow.open(this.map, position);
            }else{
                this.selectedNode = index;
            }
            if(setCenter){
                this.map.setCenter([this.nodes[index].lng, this.nodes[index].lat]);
            }
        },

        // setDirection
        // 切换上下行
        setDirection(direction) {
            if(this.selectedNode < 0){
                this.selectedNode = 0;
            }
            if(this.line.route.up.length && this.line.route.down.length){
                var selectedNodeName = this.nodes[this.selectedNode].name;
                this.selectedDirection = direction;
                this.selectedNode = this.nodes.findIndex((node) => {
                    return (node.name == selectedNodeName);
                });
                if(this.selectedNode < 0){
                    this.selectedNode = 0;
                }
            }else{
                this.selectedDirection = direction;
                this.selectedNode = 0;
            }
            this.loadMapLine(false);
        },
        // setMapMode
        // 切换添加节点的位置（选中节点之前/之后）
        setMapMode(mode){
            this.selectedMapMode = mode;
            if(mode == 'before' && this.selectedMapTool == 'newStationSmart'){
                this.setMapTool('newStation');
            }
        },
        // setMapTool
        // 切换地图工具（查看/智能设站/新站点/新节点）
        setMapTool(tool){
            try{
                this.mapItems.infowindow.close();
            }catch(e){};

            this.selectedMapTool = tool;

            if(tool == 'watch'){
                this.map.setDefaultCursor('move');
            }else if(tool == 'newStationSmart'){
                this.map.setDefaultCursor('crosshair');
                this.setShowStationsOnly(true);
                this.setMapMode('after');
            }else{ // newStation / newWaypoint
                this.map.setDefaultCursor('crosshair');
                this.setShowStationsOnly(false);
            }
        },
        // setShowStationsOnly
        // 设置是否只显示站点
        setShowStationsOnly(option){
            if(option === null){
                option = !this.showStationsOnly;
            }
            this.showStationsOnly = option;
            if(this.nodes.length && option == true && this.nodes[this.selectedNode].type != 'station'){
                this.selectedNode = this.nodes.findIndex((node, index) => {
                    return (index > this.selectedNode) && (node.type == 'station');
                });
                if(this.selectNode == -1){
                    this.selectedNode = 0;
                }
            }
            if(option == true && this.selectedMapTool != 'watch' && this.selectedMapTool != 'newStationSmart'){
                this.setMapTool('watch');
            }else if(option == false && this.selectedMapTool != 'newStation' && this.selectedMapTool != 'newWaypoint'){
                this.setMapTool('watch');
            }
        },
        // setSatelliteLayer
        // 设置是否显示卫星图层
        setSatelliteLayer() {
            if(this.satelliteEnabled) {
                this.map.remove(this.satelliteLayer);
            } else {
                this.map.add(this.satelliteLayer);
            }
            this.satelliteEnabled = !this.satelliteEnabled;
        },
        // setMapLayer
        // 设置是否显示地图图层
        setMapLayer() {
            if(this.mapEnabled) {
                this.map.setFeatures([]);
            } else {
                this.map.setFeatures(['bg', 'road', 'point']);
            }
            this.mapEnabled = !this.mapEnabled;
        },
        // renameKeyPress
        // 重命名模式开启时，按下回车完成重命名（退出重命名模式）
        renameKeyPress(e) {
            e = e?e:event;
            if(e.keyCode == 13) {
                this.renameEnabled = false;
            }
        },

        // searchCity
        // “所在区域”变动后，搜索所填城市
        searchCity(){
            if(!this.cityName){
                return;
            }
            var districtSearch = new AMap.DistrictSearch({
                level: 'city',
                subdistrict: 0
            })
            districtSearch.search(this.cityName, this.getCity)
        },
        // searchCity => getCity
        // 搜索到所填城市后，切换到该城市，若未搜索到则复原
        getCity(status, result){
            if(status == "complete"){
                this.cityName = result.districtList[0].name;
                this.line.cityName = result.districtList[0].name;
                this.map.setCity(result.districtList[0].adcode);
            }else{
                this.cityName = this.line.cityName;
            }
        },

        // Vue.app.loadLine => loadLine
        // 刷新线路信息（加载线路后调用）
        loadLine() {
            this.setMapTool("watch");
            this.selectedNode = 0;
            this.selectedDirection = "up";
            this.renameEnabled = false;
            this.$nextTick(() => {
                this.loadMapLine(true);
            });
        },

        // loadMapLine
        // 在地图上重新绘制线路
        loadMapLine(resetCenter = true){
            try {
                this.map.remove(this.mapItems.polyline);
                this.map.remove(this.mapItems.markers);
                this.mapItems.infowindow.close();
            } catch(e) {}
            if(this.nodes.length){
                var path = [];
                this.nodes.forEach((node) => {
                    path.push(new AMap.LngLat(node.lng, node.lat));
                });
                this.mapItems.polyline = new AMap.Polyline({
                    path: path,
                    zIndex: 15,
                    strokeWeight: 6,
                    strokeColor: '#00D3FC',
                    strokeOpacity: 1,
                    showDir: true,
                    lineJoin: 'round',
                    lineCap: 'round'
                });
                this.mapItems.polyline.on('click', this.clickPolyline, this);
                this.mapItems.markers = [];
                this.stations.forEach((station) => {
                    var marker = new AMap.Marker({
                        position: new AMap.LngLat(station.lng, station.lat),
                        zIndex: 20,
                        offset: new AMap.Pixel(0, 0),
                        anchor: 'center',
                        icon: './assets/station.png',
                        extData: station.id
                    });
                    marker.on('click', this.clickNode, this);
                    this.mapItems.markers.push(marker);
                });
                this.map.add(this.mapItems.polyline);
                this.map.add(this.mapItems.markers);
            }
            if(resetCenter){
                this.map.setFitView()
            }
        },

        // positionId
        // 根据经纬度返回一个编码过的神秘序号
        // 别问，问就是避免不同节点同名或同节点不同名
        positionId(lng, lat){
            return ('00000000' + Math.abs(CRC32C.str('(' + lng + ',' + lat + ')')).toString(16).toUpperCase()).slice(-8);
        },
    },
    computed: {
        title() {
            return this.line.lineName.length?this.line.lineName:'未命名线路';
        },
        subtitle() {
            var routeUp = deepClone(this.line['route']['up']);
            if(routeUp.length){
                var startStation = routeUp.find((node) => {return node.type == "station"}).name;
                if(this.isRingLine) {
                    var endStation = startStation;
                } else {
                    var endStation = routeUp.reverse().find((node) => {return node.type == "station"}).name;
                }
                startStation = startStation ? startStation : "起点站";
                endStation = endStation ? endStation : "终点站";
                if(this.isBilateral){
                    return ('\u2002' + startStation + " ⇌ " + endStation);
                } else {
                    return ('\u2002' + startStation + " ⇀ " + endStation);
                }
            } else {
                return "";
            }
        },
        isBilateral() {
            return (this.line.lineType % 2) == 1;
        },
        isRingLine() {
            return this.line.lineType >= 3;
        },
        trueDirection() {
            return this.isBilateral?this.selectedDirection:'up';
        },
        nodes() {
            return this.line['route'][this.trueDirection];
        },
        stations() {
            var stations = [];
            this.nodes.forEach((node, index) => {
                if(node.type == "station"){
                    node.id = index;
                    stations.push(node);
                }
            });
            return stations;
        },
        infoUp() {
            var length = 0, stationCount = 0;
            var route = [];
            if(this.line['route']['up'].length){
                this.line['route']['up'].forEach(node => {
                    route.push([node.lng, node.lat]);
                    if(node.type == 'station'){
                        stationCount ++;
                    }
                });
                length = AMap.GeometryUtil.distanceOfLine(route);
            }
            return stationCount + "站 / " + (length / 1000).toFixed(1) + "km";
        },
        infoDown() {
            var length = 0, stationCount = 0;
            var route = [];
            if(this.line['route']['down'].length){
                this.line['route']['down'].forEach(node => {
                    route.push([node.lng, node.lat]);
                    if(node.type == 'station'){
                        stationCount ++;
                    }
                });
                length = AMap.GeometryUtil.distanceOfLine(route);
            }
            return stationCount + "站 / " + (length / 1000).toFixed(1) + "km";
        },
    }
})