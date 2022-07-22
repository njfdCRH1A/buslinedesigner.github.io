bld.component('tab-fare', {
    props: {
        line: {
            type: Object,
            required: true
        },
        settings: {
            type: Object,
            required: true
        },
    },
    template:
    /* HTML */
    `
    <div class="container" id="tabFare">
        <h1><span class="fw-normal display-5">{{ title }}</span><span class="fw-normal display-7">{{ subtitle }}</span></h1>
        <div class="row justify-content-between">
            <div class="col-12 col-md-3 mb-3 p-md-3">
                <div class="card TabFareCard1">
                    <div class="card-header" :title="fareDesc">票价选项</div>
                    <div class="card-body" style="overflow-y:auto; overflow-x:hidden;">
                        <div class="mb-3">
                            <label class="form-label" for="fareType">计价策略</label>
                            <select class="form-select" id="fareType" v-model="line.fare.strategy">
                                <option value="distance">公里数表</option>
                                <option value="single">单一票价</option>
                                <option selected value="multilevel">多级票价</option>
                                <option value="text">文本描述</option>
                                <option value="partition" disabled>分区票价 (暂不支持)</option>
                                <option value="customize" disabled>自定义 (暂不支持)</option>
                            </select>
                        </div>
                        <div v-if="isRingLine && line.fare.strategy!='text'">
                            <div class="mb-3">
                                <label class="form-label">考虑环线最近距离</label>
                                <select class="form-select" v-model="line.fare.enableRing">
                                    <option value="0" text="禁用"></option>
                                    <option value="1" text="启用"></option>
                                </select>
                            </div>
                        </div>
                        <div v-if="line.fare.strategy=='distance'"></div>
                        <div v-if="line.fare.strategy=='multilevel'">
                            <div class="mb-3">
                                <label class="form-label">起步价</label>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" style="border-right: none;" autocomplete="off" placeholder="0.00" v-model.trim.lazy="line.fare.multilevel.startPrice" />
                                    <span class="input-group-text" style="background-color: white; border-left: none;">元</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">加价起算里程</label>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" style="border-right: none;" autocomplete="off" placeholder="0.00" v-model.trim.lazy="line.fare.multilevel.startingDistance" />
                                    <span class="input-group-text" style="background-color: white; border-left: none;">公里</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">每公里加价</label>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" style="border-right: none;" autocomplete="off" placeholder="0.20" v-model.trim.lazy="line.fare.multilevel.magnification" />
                                    <span class="input-group-text" style="background-color: white; border-left: none;">元</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">加价衰减</label>
                                <input type="text" class="form-control" style="border-right: none;" autocomplete="off" placeholder="0.00" value="暂不支持" disabled readonly />
                                <!-- v-model.trim.lazy="line.fare.multilevel.magnificationAttenuation" -->
                            </div>
                            <div class="mb-3">
                                <label class="form-label">票价上限</label>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" style="border-right: none;" autocomplete="off" placeholder="Infinity" v-model.trim.lazy="line.fare.multilevel.maxPrice" />
                                    <span class="input-group-text" style="background-color: white; border-left: none;">元</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">累进</label>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" style="border-right: none;" autocomplete="off" placeholder="1.00" v-model.trim.lazy="line.fare.multilevel.increaseBase" />
                                    <span class="input-group-text" style="background-color: white; border-left: none;">元</span>
                                </div>
                            </div>
                        </div>
                        <div v-if="line.fare.strategy=='single'">
                            <div class="mb-3">
                                <label class="form-label">票价</label>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" style="border-right: none;" autocomplete="off" placeholder="1.00" v-model.trim.lazy="line.fare.single.price" />
                                    <span class="input-group-text" style="background-color: white; border-left: none;">元</span>
                                </div>
                            </div>
                        </div>
                        <div v-if="line.fare.strategy=='text'">
                            <div class="mb-3">
                                <label class="form-label">票价描述</label>
                                <input type="text" class="form-control" autocomplete="off" placeholder="多级票价" v-model.trim.lazy="line.fare.text.text" />
                            </div>
                        </div>
                        <div v-if="line.fare.strategy=='customize'">
                            <div class="mb-3">
                                <label class="form-label">计算公式</label>
                                <input type="text" class="form-control" autocomplete="off" placeholder="0.2*distance" v-model.trim.lazy="line.fare.customize.formula" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-9 mb-3 p-md-3">
                <div class="card TabFareCard2">
                    <div class="card-header">
                        <span>{{ line.fare.strategy == "distance" ? "公里数表" : "票价表" }}</span>
                    </div>
                    <div class="card-body" style="overflow: scroll; background-color: white;">
                        <table class="table table-responsive table-sm" style="table-layout: fixed; background-color: white; border-bottom: none; transform-origin: center center; user-select: none;" id="fareTable">
                            <tbody> <!-- 我真服了 html2canvas 的bug了，本来挺简洁的几句非得被搞成这幅样子，html2canvas 程序员，你知道我的痛吗?! -->
                                <tr> <!-- 空白行，用于排版 -->
                                    <td class="TabFareTablePlaceholder" :width="(maxStationNameLength * 18) + 'px'" height="0px"></td>
                                    <td v-for="count in (Object.getOwnPropertyNames(fareTable).length - 1)" class="TabFareTablePlaceholder" :width="cellWidth" height="0px"></td>
                                    <td v-if="settings.fare.showStationBehind.current == '1'" class="TabFareTablePlaceholder" :width="(maxStationNameLength * 18) + 'px'" height="0px"></td>
                                </tr>
                                <tr v-for="(fareRow, index) in fareTable">
                                    <td class="TabFareTableStationAhead" :style="(index == 0)?{ borderRight: 'none' }:{}" colspan="1">{{ settings.fare.showStationAhead.current == '1' ? fareRow.station : '' }}</td>
                                    <td v-for="fareItem in fareRow.data" class="TabFareTableData" :style="cellColor(fareItem)">{{ fareItem }}</td>
                                    <td v-if="settings.fare.showStationBehind.current == '1'" class="TabFareTableStationBehind" :colspan="fareTable.length-index">{{ fareRow.station }}</td>
                                </tr>
                                <tr>
                                    <td v-for="count in (Object.getOwnPropertyNames(fareTable).length - 1)" :class="(count != 1)?'TabFareTableDataRowPlaceholder':'TabFareTablePlaceholder'"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer">
                        <div class="pull-right" role="group" style="float: left">
                            <input type="range" class="form-range" min="1" max="5.32" step="0.01" v-model="tableScale" @input="scaleTable()" />
                        </div>
                        <div class="btn-group btn-group-sm pull-right" role="group" style="float: right">
                            <button type="button" class="btn btn-outline-primary" title="保存表格" @click="downloadTable()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
                                    <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>
                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                                </svg>
                            </button>
                            <button type="button" class="btn btn-outline-primary" title="保存图片" @click="getImage()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-image" viewBox="0 0 16 16">
                                    <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                                    <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5V14zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            tableScale: 3.16,
        }
    },
    methods: {
        stationDistance(direction, startStationId, endStationId){
            var route = this.line.route[direction].slice(startStationId, endStationId + 1);
            var path = [];
            route.forEach(node => {
                path.push([node.lng, node.lat]);
            });
            return (AMap.GeometryUtil.distanceOfLine(path) / 1000);
        },
        fareCalculate(startStationId, endStationId) {
            if(this.line.fare.strategy != 'single' && this.line.fare.strategy != 'text'){
                var distance = Math.abs(this.stationsWithDistance[endStationId].distance - this.stationsWithDistance[startStationId].distance);

                // 环线计算绕一圈距离
                if(this.isRingLine && this.line.fare.enableRing == "1"){
                    var ringDistance = Math.abs(this.stationsWithDistance[this.stationsWithDistance.length - 1].distance
                                       - this.stationsWithDistance[endStationId].distance)
                                       + this.stationsWithDistance[startStationId].distance;
                    if(ringDistance < distance){
                        distance = ringDistance;
                    }
                }

                distance = Math.ceil(distance * Math.pow(10, 1)) / Math.pow(10, 1);
            }

            switch(this.line.fare.strategy){
                case 'distance':
                    return distance;
                case 'single':
                    return (parseFloat(this.line.fare.single.price)).toFixed(parseInt(this.settings.fare.fix.current));
                case 'multilevel':
                    distance = distance - parseFloat(this.line.fare.multilevel.startingDistance);
                    if(distance < 0) distance = 0;

                    var fare = distance * parseFloat(this.line.fare.multilevel.magnification);

                    fare += parseFloat(this.line.fare.multilevel.startPrice);

                    if(fare > parseFloat(this.line.fare.multilevel.maxPrice)){
                        fare = parseFloat(this.line.fare.multilevel.maxPrice);
                    }

                    return (Math.ceil(fare / parseFloat(this.line.fare.multilevel.increaseBase)) * this.line.fare.multilevel.increaseBase).toFixed(parseInt(this.settings.fare.fix.current));
                case 'text':
                    return '未知';
                case 'partition':
                case 'customize':
                default:
                    return '暂不支持';
            }
        },
        cellColor(fare){
            if(this.line.fare.strategy != 'multilevel' || this.settings.fare.enableCellColor.current != "1"){ // 不是多级 或者没开彩色
                return {backgroundColor: 'white', color: 'black'};
            }else{
                var hue;
                if(this.minMaxPrice.startPrice == this.minMaxPrice.maxPrice){ // 虽然是多级 但是只有一种票价
                    hue = 120;
                }else{
                    hue = 120 - ((parseFloat(fare) - this.minMaxPrice.startPrice) / (this.minMaxPrice.maxPrice - this.minMaxPrice.startPrice) * 120);
                }

                return {backgroundColor: 'hsl(' + hue + ', 80%, 75%)', color: 'hsl(' + hue + ', 100%, 20%)'};
            }
        },
        scaleTable(){
            // document.getElementById('fareTable').style.zoom = 0.1 * Math.pow(this.tableScale, 2);
            // ⬆这样虽然不会有留白bug和裁切bug，但是缩放的时候会巨卡，而且保存图片的分辨率不变
            document.getElementById('fareTable').style.transform = 'scale(' + 0.1 * Math.pow(this.tableScale, 2) + ')';
        },
        downloadTable(){
            this.$emit('toast', ['保存表格', '', '正在保存票价表为表格…', false]);
            var table = [];
            this.fareTable.forEach(fareRow => {
                var row = [];
                if(this.settings.fare.showStationAhead.current == '1'){
                    row.push(fareRow.station);
                }
                fareRow.data.forEach(fareItem => {
                    row.push(fareItem);
                });
                if(this.settings.fare.showStationBehind.current == '1'){
                    row.push(fareRow.station);
                }
                table.push(row);
            });

            var name = this.line.lineName ?? '未命名线路';

            var workbook = {
                SheetNames: [name],
                Sheets: {}
            };
            workbook.Sheets[name] = XLSX.utils.aoa_to_sheet(table);
            file = XLSX.write(workbook, {bookType: 'xlsx', bookSST: true, type: 'array'});

            downloadFile(name + '-票价表.xlsx', file, "application/octet-stream");
            this.$emit('toast', ['保存表格', '', '保存票价表为表格成功~']);
        },
        getImage() {
            this.$emit('toast', ['保存图片', '', '正在保存票价表为图片，若站点数较多，可能需要花费较长时间并出现网页无响应现象，请耐心等候…', false]);
            html2canvas(document.getElementById('fareTable'), {scale: 2}).then(this.getBlob, (err) => {
                this.$emit('toast', ['保存图片', '', '保存票价表为图片失败: ' + err, false]);
            });
        },
        getBlob(canvas) {
            window.abc = canvas;
            var imageQuality = JSON.parse(this.settings.fare.imageQuality.current);
            setTimeout(() => {
                canvas.toBlob(this.downloadImage, imageQuality.type, imageQuality.quality);
            });
        },
        downloadImage(blob){
            var name = this.line.lineName ?? '未命名线路';
            try{
                if(!blob){
                    throw 'Blob 为空';
                }
                downloadFile(name + '-票价表' + (JSON.parse(this.settings.fare.imageQuality.current).type == 'image/png' ? '.png' : '.jpg'), blob, "", false);
            }catch(e){
                this.$emit('toast', ['保存图片', '', '保存票价表为图片失败: ' + e + '，也许是图片太大了？缩小表格或在设置中调整图片清晰度后再试吧…']);
                return;
            }
            this.$emit('toast', ['保存图片', '', '保存票价表为图片成功~ Tips: 放大表格后保存图片更清晰哦~']);
        },
    },
    computed: {
        fareTable() {
            var fareTable = [];

            this.stationsWithDistance.forEach((currentStation, currentIndex) => {
                var data = [];
                this.stationsWithDistance.slice(0, currentIndex).forEach((stationAhead, stationIndex) => {
                    data.push(this.fareCalculate(stationIndex, currentIndex));
                });
                fareTable.push({data: data, station: currentStation.name});
            });
            return fareTable;
        },
        fareDesc() {
            var desc;
            switch(this.line.fare.strategy){
                case 'multilevel':
                    desc = "多级票价 " + this.minMaxPrice.startPrice + "~" + this.minMaxPrice.maxPrice + "元";
                    break;
                case 'single':
                    desc = "单一票价 " + this.line.fare.single.price + "元";
                    break;
                case 'text':
                    desc = this.line.fare.text.text;
                    break;
                case 'partition':
                case 'customize':
                default:
                    desc = "暂不支持";
                    break;
            }
            this.line.fare.desc = desc;
            return desc;
        },
        minMaxPrice() {
            var startPrice = Infinity;
            var maxPrice = 0;
            switch(this.line.fare.strategy){
                case 'multilevel':
                    if(this.fareTable.length){
                        this.fareTable.forEach(fareRow => {
                            fareRow.data.forEach(fare => {
                                if(parseFloat(fare) < startPrice){
                                    startPrice = parseFloat(fare);
                                }
                                if(parseFloat(fare) > maxPrice){
                                    maxPrice = parseFloat(fare);
                                }
                            });
                        });
                    }else{
                        startPrice = maxPrice = 0;
                    }
                    break;
                case 'single':
                    startPrice = maxPrice = parseFloat(this.line.fare.single.price);
                    break;
                case 'text':
                case 'partition':
                case 'customize':
                default:
                    startPrice = maxPrice = null;
                    break;
            }
            return {startPrice: startPrice, maxPrice: maxPrice};
        },
        maxStationNameLength(){
            var maxLength = 0;
            this.stationsWithDistance.forEach((station) => {
                if(station.name.length > maxLength){
                    maxLength = station.name.length;
                }
            });
            return maxLength;
        },
        cellWidth(){
            switch(this.line.fare.strategy){
                case 'distance':
                    return 12 * 4 + 'px';
                case 'single':
                case 'multilevel':
                    return 12 * (this.minMaxPrice.maxPrice.toString().length + parseInt(this.settings.fare.fix.current) + 2) + 'px';
                case 'text':
                    return 2 * 24 + 'px';
                case 'partition':
                case 'customize':
                default:
                    return 4 * 24 + 'px';
            }
        },
        stationsWithDistance() {
            var stations = {'up': [], 'down': []};
            var stationsOverall = [];
            var firstStationUp, lastStationDown;

            this.line.route.up.forEach((node, index) => {
                if(node.type == "station"){
                    if(!stations.up.length){ // 上行第一站
                        firstStationUp = index;
                    }
                    node.id = index;
                    node.distance = this.stationDistance('up', firstStationUp, index);
                    stations.up.push(node);
                }
            });
            for(var index = this.line.route.down.length - 1; index >= 0; index--){ // 反着来
                var node = this.line.route.down[index];
                if(node.type == "station"){
                    if(!stations.down.length){ // 下行最后一站
                        lastStationDown = index;
                    }
                    node.id = index;
                    node.distance = this.stationDistance('down', index, lastStationDown);
                    stations.down.push(node);
                }
            }

            if(!this.isBilateral){
                stationsOverall = stations.up;
            }else{
                var pointerUp = 0, pointerDown = 0;
                var stationsCountUp = stations.up.length, stationsCountDown = stations.down.length;
                while(true){
                    if(pointerUp >= stationsCountUp && pointerDown >= stationsCountDown){
                        break;
                    }else if(pointerUp >= stationsCountUp){ // 结尾出现了下行单向站
                        stations.down.slice(pointerDown, stationsCountDown).forEach((station) => {
                            stationsOverall.push({
                                name: station.name + ' (' + (this.settings.general.mainDirection.current === '0' ? '下行' : '上行') + '单向)',
                                distance: station.distance
                            });
                        });
                        break;
                    }else if(pointerDown >= stationsCountDown){ // 结尾出现了上行单向站
                        stations.up.slice(pointerUp, stationsCountUp).forEach((station) => {
                            stationsOverall.push({
                                name: station.name + ' (' + (this.settings.general.mainDirection.current === '0' ? '上行' : '下行') + '单向)',
                                distance: station.distance
                            });
                        });
                        break;
                    }

                    var stationUp = stations.up[pointerUp], stationDown = stations.down[pointerDown];
                    if(stationUp.name == stationDown.name){ // 双向站
                        stationsOverall.push({
                            name: stationUp.name,
                            distance: (stationUp.distance + stationDown.distance)/2
                        });
                        pointerUp ++;
                        pointerDown ++;
                    }else{
                        var offset = stations.down.slice(pointerDown, stationsCountDown).findIndex((station) => {
                            return station.name == stationUp.name;
                        });
                        if(offset === -1){ // 上行单向
                            stationsOverall.push({
                                name: stationUp.name + ' (' + (this.settings.general.mainDirection.current === '0' ? '上行' : '下行') + '单向)',
                                distance: stationUp.distance
                            });
                            pointerUp ++;
                        }else{ // pointerDown ~ (pointerDown + offset) 中间夹的是下行单向
                            stations.down.slice(pointerDown, pointerDown + offset).forEach((station) => {
                                stationsOverall.push({
                                    name: station.name + ' (' + (this.settings.general.mainDirection.current === '0' ? '下行' : '上行') + '单向)',
                                    distance: station.distance
                                });
                            });
                            pointerDown += offset;
                        }
                    }
                }

                stationsOverall.sort((a, b)=>{
                    return a.distance - b.distance;
                })
            }

            return stationsOverall;
        },
        title() {
            return this.line.lineName.length?this.line.lineName:'未命名线路';
        },
        subtitle() {
            var startStationName, endStationName;
            var routeUp = this.line.route.up;
            var routeDown = this.line.route.down;
        
            // 获取上行起讫站
            if(routeUp.length){
                var startStation = routeUp.find((node) => {
                    return node.type == "station"
                });
                if(startStation){
                    startStationName = startStation.name;
                }
                if(this.isRingLine) {
                    endStationName = startStationName;
                } else {
                    routeUp.forEach(node => {
                        if(node.type == "station"){
                            endStationName = node.name;
                        }
                    });
                }
            }
        
            // 获取下行起讫站，如果和上行不同就在上行的起讫站后面加括号
            if(this.isBilateral && routeDown.length){
                var startStationNameDown, endStationNameDown;
                var startStationDown = routeDown.find((node) => {
                    return node.type == "station"
                });
                if(startStationDown){
                    startStationNameDown = startStationDown.name;
                }
                if(this.isRingLine) {
                    endStationNameDown = startStationNameDown;
                } else {
                    routeDown.forEach(node => {
                        if(node.type == "station"){
                            endStationNameDown = node.name;
                        }
                    });
                }

                if(endStationName && startStationNameDown != endStationName){
                    endStationName = endStationName + ' / ' + startStationNameDown;
                }
                if(startStationName && endStationNameDown != startStationName){
                    startStationName = startStationName + ' / ' + endStationNameDown;
                }
                if(!startStationName){
                    startStationName = endStationNameDown;
                }
                if(!endStationName){
                    endStationName = startStationNameDown;
                }
            }
        
            // 返回结果
            if(startStationName && endStationName){
                return ('\u2002' + startStationName + (this.isBilateral?" ⇌ ":" ⇀ ") + endStationName);
            }
        },
        isBilateral() {
            return (this.line.lineType % 2) == 1;
        },
        isRingLine() {
            return this.line.lineType >= 3;
        }
    }
})