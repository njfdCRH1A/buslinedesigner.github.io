const bld = Vue.createApp({
    setup() {
        const blankLineFile = {
            "fileVersion": 1,
            "cityName": "",
            "lineName": "",
            "lineColor": "#00D3FC",
            "remark": "",
            "lineType": 1,
            "company": "",
            "route": {
                "up": [],
                "down": []
            },
            "serviceTime": {
                "up": "",
                "down": ""
            },
            "fare": {
                "strategy": "multilevel",
                "enableRing": "0",
                "desc": "",
                "single": {
                    "price": "1.00"
                },
                "multilevel": {
                    "startPrice": "0.00",
                    "startingDistance": "0.00",
                    "magnification": "0.20",
                    "magnificationAttenuation": "0.00",
                    "increaseBase": "1.00",
                    "maxPrice": "Infinity",
                },
                "text": {
                    "text": ""
                },
                "customize": {
                    "formula": "0.2*distance"
                }
            }
        };
        return{
            blankLineFile,
        }
    },
    data() {
        return {
            currentTab: 'stations',
            tabs: [
                {id: 'stations', name: '设站'},
                {id: 'fare', name: '票价'},
                {id: 'schematic', name: '图示'},
                {id: 'settings', name: '设置'},
                {id: 'about', name: '关于'}
            ],
            settings: {
                general: {
                    mainDirection: {
                        name: '正方向',
                        current: '0',
                        default: '0',
                        options: [
                            {name: '上行', value: '0'},
                            {name: '下行', value: '1'},
                        ]
                    },
                    enableUndoFunc: {
                        name: '撤销功能',
                        current: '1',
                        default: '1',
                        options: [
                            {name: '禁用', value: '0'},
                            {name: '启用', value: '1'},
                        ]
                    },
                },
                map: {
                    showStationName: {
                        name: '在地图上显示站名',
                        current: '1',
                        default: '1',
                        options: [
                            {name: '不显示', value: '0'},
                            {name: '智能显示 (防碰撞)', value: '1'},
                            {name: '全部显示', value: '0.5'},
                        ]
                    },
                    showOpposite: {
                        name: '显示线路反向',
                        current: '0.4',
                        default: '0.4',
                        options: [
                            {name: '不显示', value: '0'},
                            {name: '半透明显示', value: '0.4'},
                            {name: '不透明显示', value: '1'},
                        ]
                    },
                    mapStyle: {
                        name: '地图风格',
                        current: 'amap://styles/normal',
                        default: 'amap://styles/normal',
                        options: [
                            {name: '默认', value: 'amap://styles/normal'},
                            {name: '马卡龙', value: 'amap://styles/macaron'},
                            {name: '草色青', value: 'amap://styles/fresh'},
                            {name: '远山黛', value: 'amap://styles/whitesmoke'},
                            {name: '月光银', value: 'amap://styles/light'},
                            {name: '靛青蓝', value: 'amap://styles/blue'},
                            {name: '极夜蓝', value: 'amap://styles/darkblue'},
                            {name: '雅土灰', value: 'amap://styles/grey'},
                            {name: '幻影黑', value: 'amap://styles/dark'},
                        ]
                    },
                    lineStrokeWidth: {
                        name: '线路宽度',
                        current: '6',
                        default: '6',
                        options: [
                            {name: '细', value: '2'},
                            {name: '较细', value: '4'},
                            {name: '默认', value: '6'},
                            {name: '较粗', value: '8'},
                            {name: '粗', value: '10'},
                        ]
                    },
                    stationLightness: {
                        name: '站点颜色明度',
                        current: '-64',
                        default: '-64',
                        options: [
                            {name: '黑', value: '-256'},
                            {name: '暗', value: '-64'},
                            {name: '较暗', value: '-32'},
                            {name: '正常', value: '0'},
                            {name: '较亮', value: '32'},
                            {name: '亮', value: '64'},
                            {name: '原版', value: 'origin'},
                        ]
                    },
                    stationStrokeWidth: {
                        name: '站点描边宽度',
                        current: '2',
                        default: '2',
                        options: [
                            {name: '细', value: '1'},
                            {name: '默认', value: '2'},
                            {name: '较粗', value: '3'},
                            {name: '粗', value: '4'},
                        ]
                    },
                    stationFillRadius: {
                        name: '站点大小',
                        current: '5',
                        default: '5',
                        options: [
                            {name: '小', value: '3'},
                            {name: '较小', value: '4'},
                            {name: '默认', value: '5'},
                            {name: '较大', value: '6'},
                            {name: '大', value: '7'},
                        ]
                    },
                },
                fare: {
                    fix: {
                        name: '票价精度',
                        current: '2',
                        default: '2',
                        options: [
                            {name: '整数', value: '0'},
                            {name: '小数点后一位', value: '1'},
                            {name: '小数点后两位', value: '2'},
                        ]
                    },
                    imageQuality: {
                        name: "图片保存质量",
                        current: '{"type":"image/png", "quality": 1.0}',
                        default: '{"type":"image/png", "quality": 1.0}',
                        options: [
                            {name: "PNG 无损", value: '{"type":"image/png", "quality": 1.0}'},
                            {name: "JPG 100%", value: '{"type":"image/jpeg", "quality": 1.0}'},
                            {name: "JPG 90%", value: '{"type":"image/jpeg", "quality": 0.9}'},
                            {name: "JPG 80%", value: '{"type":"image/jpeg", "quality": 0.8}'},
                            {name: "JPG 50%", value: '{"type":"image/jpeg", "quality": 0.5}'},
                            {name: "JPG 25%", value: '{"type":"image/jpeg", "quality": 0.25}'},
                        ]
                    },
                    enableCellColor: {
                        name: '多级票价单元格颜色',
                        current: '1',
                        default: '1',
                        options: [
                            {name: '黑白', value: '0'},
                            {name: '彩色', value: '1'},
                        ]
                    },
                    showStationAhead: {
                        name: '在表格左侧显示站名',
                        current: '0',
                        default: '0',
                        options: [
                            {name: '不显示', value: '0'},
                            {name: '显示', value: '1'},
                        ]
                    },
                    showStationBehind: {
                        name: '在表格右侧显示站名',
                        current: '1',
                        default: '1',
                        options: [
                            {name: '不显示', value: '0'},
                            {name: '显示', value: '1'},
                        ]
                    },
                }
            },
            announcement: {
                lastUpdated: Date.parse('2022/7/22 16:00:00'),
                content: 'Bus Line Designer V2 更新啦！更新内容详见↓ https://mp.weixin.qq.com/s/enIH9huxBGnFJwf47siqBg'
            },
            lineFile: deepClone(this.blankLineFile),
            originalLineFile: deepClone(this.blankLineFile),
            undoable: false,
            fileInput: VueReactivity.shallowRef(null),
            fileReader: VueReactivity.shallowRef(null),
            clipboard: new ClipboardJS('#copyLine'),
            modalConfirm: {
                title: '',
                content: ''
            },
            modalLineSearch: {
                dataSource: 'AMap',
                lineName: '',
                city: '',
                chelaile: {
                    province: '',
                    city: '',
                },
                advanced: null,
                CitiesLoadingPrompt: '正在加载列表…'
            },
            modalLineSearchAdvanced: {
                data: []
            },
            toast: {
                title: '',
                subtitle: '',
                content: '',
                autohide: true
            },
            regions: {},
            chelaileTempData: {}
        }
    },
    mounted() {
        if(new Date().getDay() == 4){
            for(var i = 0; i < 50; i++){
                console.warn('KaiFengCai crazy thursday V me 50');
            }
        }

        window.onbeforeunload = function(e) {
            var e = window.event || e;
            e.returnValue = ("确定离开页面吗？现有线路内容将丢失。请确保已保存当前线路。");
        };

        this.clipboard.on('success', this.copyLine);
        this.clipboard.on('error', this.copyLineFailed);
        this.fileInput = document.createElement('input');
        this.fileInput.setAttribute('type', 'file');
        this.fileInput.addEventListener('change', this.readFile);
        this.fileReader = new FileReader();
        this.fileReader.addEventListener('load', this.loadLineFromFile);

        var savedSettings;
        if(savedSettings = localStorage.getItem('settings')){
            savedSettings = JSON.parse(savedSettings);
            for(const type in savedSettings){
                for(const item in savedSettings[type]){
                    this.settings[type][item].current = savedSettings[type][item].current;
                }
            }
        }else{
            localStorage.setItem('settings', JSON.stringify(this.settings));
        }

        var announcementLastRead = localStorage.getItem('announcementLastRead') ? localStorage.getItem('announcementLastRead') : 0;
        if(announcementLastRead < this.announcement.lastUpdated){
            this.showMessage(["公告", "", this.announcement.content, false]);
            localStorage.setItem('announcementLastRead', Date.now());
        }

        getContents("https://chelaile-forward.herokuapp.com/api.php?api=goocity%2Fcity!morecities.action%3Fsign%3D%26s%3Dandroid%26v%3D%26vc%3D245", this.loadRegions);
    },
    methods: {
        setTab(tabId) {
            this.currentTab = tabId;
            this.loadLine();
        },
        toggleTab(tabId) {
            this.setTab(tabId.tab);
        },

        saveOriginal(){
            if(this.settings.general.enableUndoFunc.current == "1"){
                this.originalLineFile = deepClone(this.lineFile);
                this.undoable = true;
            }
        },
        undo(){
            if(this.undoable){
                this.lineFile = deepClone(this.originalLineFile);
                this.undoable = false;
                this.$refs.tabStation.undo();
            }else{
                this.showMessage(["撤销失败", "", "没有可以撤销的内容了…"]);
            }
        },

        loadLineFromReality(){
            this.showModalConfirm("读取线路", "确定读取线路吗？现有线路内容将丢失，请确保已保存当前线路哦~", this.showModalLineSearch);
        },
        loadLineFromRealitySearch(advanced = false){
            if(!this.modalLineSearch.lineName){
                this.showMessage(["读取线路", "", "读取线路失败: 未填写线路名称"]);
                return;
            }
            this.showMessage(["读取线路", "", "正在加载线路…"]);
            if(this.modalLineSearch.dataSource == "AMap"){
                var lineSearch = new AMap.LineSearch({
                    pageIndex: 1,
                    pageSize: advanced?12:1,
                    city: this.modalLineSearch.city || "全国",
                    extensions: "all"
                });
                lineSearch.search(this.modalLineSearch.lineName, advanced?this.getLineFromAmapAdvanced:this.getLineFromAmapUp);
            }else if(this.modalLineSearch.dataSource == "chelaile"){
                if(!this.modalLineSearch.chelaile.city.id){
                    this.showMessage(["读取线路", "", "读取线路失败: 没有选择城市", false]);
                }else{
                    this.modalLineSearch.advanced = advanced;
                    getContents("https://chelaile-forward.herokuapp.com/cdn.php?api=bus%2Fquery!nSearch.action%3Fsign%3D%26s%3D%26v%3D%26vc%3D245%26cityId%3D" + this.modalLineSearch.chelaile.city.id + "%26key%3D" + encodeURIComponent(encodeURIComponent(this.modalLineSearch.lineName)), this.getLineFromChelaile);
                }
            }
        },
        getLineFromAmapAdvanced(status, result){
            if(status != "complete"){
                this.showMessage(["读取线路", "", "读取线路失败: " + status, false]);
                return;
            }else if(!result.lineInfo.length){
                this.showMessage(["读取线路", "", "读取线路失败: 没有结果", false]);
                return;
            }

            this.modalLineSearchAdvanced.data = result.lineInfo;
            var m = new bootstrap.Modal(document.getElementById("modalLineSearchAdvanced"));
            m.show();
        },
        getLineFromAmapAdvancedSelect(selected){
            this.getLineFromAmapUp("complete", {lineInfo: [this.modalLineSearchAdvanced.data[selected]]});
        },
        getLineFromAmapUp(status, result){
            if(status != "complete"){
                this.showMessage(["读取线路", "", "读取线路失败: " + status, false]);
                return;
            }else{
                this.lineFile = deepClone(this.blankLineFile);
                var line = result.lineInfo[0];
                var districtSearch = new AMap.DistrictSearch({
                    level: 'city',
                    subdistrict: 0
                })
                districtSearch.search(line.citycode, this.getLineFromAmapCitySearch);

                this.lineFile.lineName = line.name.replace(/\(.*\)$/, '').replace("内环", "").replace("外环", "").replace("内圈", "").replace("外圈", "");
                this.lineFile.company = line.company;

                if(!line.basic_price || !line.total_price){
                    this.lineFile.fare.strategy = 'text';
                    this.lineFile.fare.text.text = '未知';
                }else if(line.basic_price == line.total_price){
                    this.lineFile.fare.strategy = 'single';
                    this.lineFile.fare.single.price = line.basic_price;
                }else{
                    this.lineFile.fare.strategy = 'text';
                    this.lineFile.fare.text.text = '多级票价 ' + line.basic_price + '~' + line.total_price + '元';
                }
                if(line.stime.length && line.etime.length){
                    this.lineFile.serviceTime.up = line.stime.slice(0, 2) + ':' + line.stime.slice(2) + '~' + line.etime.slice(0, 2) + ':' + line.etime.slice(2);
                }else if(line.timedesc){
                    var time = JSON.parse(decodeURIComponent(line.timedesc));
                    this.lineFile.serviceTime.up = time.allRemark;
                }else{
                    this.lineFile.serviceTime.up = '未知';
                }
                var isBilateral = (line.direc != line.id);
                this.lineFile.lineType = line.loop * 2 + !isBilateral * 1 + 1;
                if(line.uicolor){
                    this.lineFile.lineColor = '#' + line.uicolor;
                }
                this.setStationsFromAmap('up', line.path, line.via_stops);
                if(isBilateral){
                    var lineSearch = new AMap.LineSearch({
                        pageIndex: 1,
                        pageSize: 1,
                        city: city,
                        extensions: "all"
                    });
                    lineSearch.searchById(line.direc, this.getLineFromAmapDown);
                }else{
                    this.loadLine();
                    this.showMessage(["读取线路", "", "读取现有线路内容成功~"]);
                }
                return;
            }
        },
        getLineFromAmapDown(status, result){
            if(status != "complete"){
                this.loadLine();
                this.showMessage(["读取线路", "", "读取线路下行失败: " + status, false]);
                return;
            }else{
                var line = result.lineInfo[0];
                if(line.stime.length && line.etime.length){
                    this.lineFile.serviceTime.down = line.stime.slice(0, 2) + ':' + line.stime.slice(2) + '~' + line.etime.slice(0, 2) + ':' + line.etime.slice(2);
                }else if(line.timedesc){
                    var time = JSON.parse(decodeURIComponent(line.timedesc));
                    this.lineFile.serviceTime.down = time.allRemark;
                }else{
                    this.lineFile.serviceTime.down = '未知';
                }
                this.setStationsFromAmap('down', line.path, line.via_stops);
                this.loadLine();
                this.showMessage(["读取线路", "", "读取现有线路内容成功~"]);
                return;
            }
        },
        getLineFromAmapCitySearch(status, result){
            if(status == "complete"){
                this.lineFile.cityName = result.districtList[0].name;
                this.loadLine();
            }
        },
        setStationsFromAmap(direction, path, stations){
            var route = this.lineFile.route[direction];
            var stationCount = 0;
            path.forEach((node, index) => {
                var newNode;
                if(stations[stationCount].location.getLng() == node.getLng() && stations[stationCount].location.getLat() == node.getLat()){
                    newNode = {
                        'type': 'station',
                        'name': stations[stationCount].name,
                        'lng': stations[stationCount].location.getLng(),
                        'lat': stations[stationCount].location.getLat()
                    };
                    stationCount ++;
                }else{
                    newNode = {
                        'type': 'waypoint',
                        'name': '途经点 #' + Math.abs(CRC32C.str('(' + node.getLng() + ',' + node.getLat() + ')')).toString(16).toUpperCase(),
                        'lng': node.getLng(),
                        'lat': node.getLat()
                    };
                }
                route.splice(index, 0, newNode);
            });
        },
        getLineFromChelaile(searchResult){
            try{
                searchResult = JSON.parse(searchResult).jsonr;
            }catch(e){this.showMessage(["读取线路", "", "读取线路失败: " + e, false]);}
            if(searchResult.status != "00"){
                this.showMessage(["读取线路", "", "读取线路失败: " + searchResult.status, false]);
                return;
            }else if(!searchResult.data.result.lineCount){
                this.showMessage(["读取线路", "", "读取线路失败: 没有结果", false]);
                return;
            }

            if(this.modalLineSearch.advanced){
                this.modalLineSearchAdvanced.data = searchResult.data.result.lines;
                var m = new bootstrap.Modal(document.getElementById("modalLineSearchAdvanced"));
                m.show();
            }
            else{
                this.getLineFromChelaileIntro(searchResult.data.result.lines[0]);
            }
        },
        getLineFromChelaileAdvanced(index){
            this.getLineFromChelaileIntro(this.modalLineSearchAdvanced.data[index]);
        },
        getLineFromChelaileIntro(lineIntro){
            this.chelaileTempData.lineIdUp = lineIntro.lineId;
            this.chelaileTempData.cityId = this.modalLineSearch.chelaile.city.id;
            this.lineFile = deepClone(this.blankLineFile);
            this.lineFile.lineName = lineIntro.name;
            this.lineFile.cityName = this.modalLineSearch.chelaile.city.name;
            getContents("https://chelaile-forward.herokuapp.com/api.php?api=bus%2Fline!lineDetail.action%3Fsign%3D%26s%3D%26v%3D%26lineName%3D1%26cityId%3D" + this.chelaileTempData.cityId + "%26lineId%3D" + encodeURIComponent(encodeURIComponent(this.chelaileTempData.lineIdUp)), this.getLineFromChelaileUpDetails);
        },
        getLineFromChelaileUpDetails(data){
            try{
                data = JSON.parse(data).jsonr;
            }catch(e){this.showMessage(["读取线路", "", "读取线路失败: " + e, false]);}
            this.chelaileTempData.stationsUp = data.data.stations;
            this.chelaileTempData.lineIdDown = data.data.otherlines.length ? data.data.otherlines[0].lineId : null;
            var isLoop = (data.data.line.startSn == data.data.line.endSn);
            var isBilateral = (data.data.otherlines.length > 0);
            this.lineFile.lineType = isLoop * 2 + !isBilateral * 1 + 1;
            this.lineFile.serviceTime.up = data.data.line.firstTime + ' ~ ' + data.data.line.lastTime;
            if(!data.data.line.price){
                this.lineFile.fare.strategy = 'text';
                this.lineFile.fare.text.text = '未知';
            }else if(data.data.line.price.search('~') >= 0){
                this.lineFile.fare.strategy = 'text';
                this.lineFile.fare.text.text = '多级票价 ' + data.data.line.price;
            }else{
                this.lineFile.fare.strategy = 'single';
                this.lineFile.fare.single.price = data.data.line.price.replace('元', '');
            }
            getContents("https://chelaile-forward.herokuapp.com/api.php?api=" + encodeURIComponent(data.data.jxPath.replace('http://api.chelaile.net.cn/', '')), this.getLineFromChelaileUpRoute);
        },
        getLineFromChelaileUpRoute(data){
            this.setRouteFromChelaile('up', this.chelaileTempData.stationsUp, JSON.parse(data).jsonr.data);
            if(this.chelaileTempData.lineIdDown){
               getContents("https://chelaile-forward.herokuapp.com/api.php?api=bus%2Fline!lineDetail.action%3Fsign%3D%26s%3D%26v%3D%26lineName%3D1%26cityId%3D" + this.chelaileTempData.cityId + "%26lineId%3D" + encodeURIComponent(encodeURIComponent(this.chelaileTempData.lineIdDown)), this.getLineFromChelaileDownDetails);
            }
            else{
                this.loadLine();
                this.showMessage(["读取线路", "", "读取现有线路内容成功~"]);
            }
        },
        getLineFromChelaileDownDetails(data){
            try{
                data = JSON.parse(data).jsonr;
            }catch(e){this.showMessage(["读取线路", "", "读取线路失败: " + e, false]);}
            this.chelaileTempData.stationsDown = data.data.stations;
            this.lineFile.serviceTime.down = data.data.line.firstTime + ' ~ ' + data.data.line.lastTime;
            getContents("https://chelaile-forward.herokuapp.com/api.php?api=" + encodeURIComponent(data.data.jxPath.replace('http://api.chelaile.net.cn/', '')), this.getLineFromChelaileDownRoute);
        },
        getLineFromChelaileDownRoute(data){
            this.setRouteFromChelaile('down', this.chelaileTempData.stationsDown, JSON.parse(data).jsonr.data);
            this.loadLine();
            this.showMessage(["读取线路", "", "读取现有线路内容成功~"]);
        },
        setRouteFromChelaile(direction, stations, route){
            var nodes = route.tra.split(';');
            nodes.forEach(node => {
                var info = node.split(',');
                var newNode;

                var lngLat = wgs84ToGcj02(info[0], info[1]);
                var lng = lngLat[0];
                var lat = lngLat[1];

                if(info.length == 3){
                    var station = stations[parseInt(info[2]) - 1];
                    newNode = {
                        type: 'station',
                        name: station.sn,
                        lng: lng,
                        lat: lat,
                    };
                }else{
                    newNode = {
                        type: 'waypoint',
                        name: '途经点 #' + Math.abs(CRC32C.str('(' + lng + ',' + lat + ')')).toString(16).toUpperCase(),
                        lng: lng,
                        lat: lat
                    };
                }
                this.lineFile.route[direction].push(newNode);
            });

            var lastStation = stations[stations.length - 1];
            var lastStationLngLat = wgs84ToGcj02(lastStation.wgsLng, lastStation.wgsLat);
            this.lineFile.route[direction].push({
                type: 'station',
                name: lastStation.sn,
                lng: lastStationLngLat[0],
                lat: lastStationLngLat[1],
            });
        },
        loadLine(lineFile = null) {
            if(lineFile){
                this.lineFile = deepClone(lineFile);
            }
            this.undoable = false;
            this.$refs.tabStation.loadLine();
        },

        loadRegions(data){
            try{
                JSON.parse(data).jsonr.data.cities.forEach(city => {
                    var province = city.cityProvince.replace('省', '');
                    if(province == '新绛') province = '新疆';
                    if(province !== ''){
                        if(!this.regions.hasOwnProperty(province)){
                            this.regions[province] = {name: province, cities: []};
                        }
                        this.regions[province].cities.push({name: city.cityName, id: city.cityId});
                    }
                });
                if(!JSON.parse(data).jsonr.data.cities.length){
                    throw "没有获取到数据";
                }
            }catch(e){
                modalLineSearch.CitiesLoadingPrompt = '加载失败: ' + e + '，请刷新页面后再试';
            }
        },

        loadLineFromFile(){
            try{
                this.lineFile = deepClone(this.blankLineFile);
                deepCopy(this.lineFile, JSON.parse(this.fileReader.result));
            }catch(e){
                this.showMessage(["读取线路", "", "读取线路失败: " + e, false]);
                return;
            }
            this.loadLine();
            this.showMessage(["读取线路", "", "读取文件中的线路成功~"]);
        },
        uploadLine() {
            this.showModalConfirm("读取线路", "确定读取线路吗？现有线路内容将丢失，请确保已保存当前线路哦~", this.getFile);
        },
        getFile() {
            if(document.createEvent) {
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                this.fileInput.dispatchEvent(event);
            }
            else {
                this.fileInput.click();
            }
        },
        readFile() {
            if(!this.fileInput.files.length){
                return;
            }
            this.fileReader.readAsText(this.fileInput.files[0]);
        },
        loadLineFromClipboard(line){
            try{
                this.lineFile = deepClone(this.blankLineFile);
                deepCopy(this.lineFile, JSON.parse(line));
            }catch(e){
                this.showMessage(["读取线路", "", "读取线路失败: " + e, false]);
                return;
            }
            this.loadLine();
            this.showMessage(["读取线路", "", "读取剪贴板中的线路成功~"]);
        },
        newLine() {
            this.showModalConfirm("新建线路", "确定新建线路吗？现有线路内容将丢失，请确保已保存当前线路哦~", this.loadBlankLine);
        },
        loadBlankLine(){
            this.lineFile = deepClone(this.blankLineFile);
            this.loadLine();
            this.showMessage(["新建线路", "", "新建空白线路成功~"]);
        },
        downloadLine() {
            this.showMessage(["保存线路", "", "正在尝试保存线路到文件，如保存失败，请尝试保存到剪贴板。", false]);
            downloadFile(
                (this.lineFile.lineName.length?this.lineFile.lineName:'未命名线路') + '.bll',
                JSON.stringify(this.lineFile),
                "application/json"
            );
        },
        copyLine() {
            this.showMessage(['保存线路', '', '线路信息已保存至剪贴板~']);
        },
        copyLineFailed() {
            this.showMessage(['保存线路', '', '线路信息保存失败，请手动复制：'.JSON.stringify(lineFile)]);
        },
        pasteLine() {
            this.showModalConfirm("读取线路", "确定读取线路吗？现有线路内容将丢失，请确保已保存当前线路哦~", this.getLineFromClipboard);
        },
        getLineFromClipboard(){
            this.showMessage(["读取线路", "", "正在尝试从剪贴板读取线路，如读取失败，请尝试将内容保存到文件中，再从文件读取。", false]);
            navigator.clipboard.readText().then(this.loadLineFromClipboard);
        },
        showModalConfirmForComponents(data){
            this.showModalConfirm(data.title, data.content, data.execute);
        },
        showModalConfirm(title, content, execute){
            this.modalConfirm.title = title;
            this.modalConfirm.content = content;
            document.getElementById("modalConfirmOK").onclick = execute;
            var m = new bootstrap.Modal(document.getElementById("modalConfirm"));
            m.show();
        },
        showModalLineSearch(){
            this.modalLineSearch.lineName = '';
            // this.modalLineSearch.city = '';
            var m = new bootstrap.Modal(document.getElementById("modalLineSearch"));
            m.show();
        },
        showMessage(data) {
            this.toast.title = data[0];
            this.toast.subtitle = data[1];
            this.toast.content = data[2];
            this.toast.autohide = false; // 将就一下
            // this.toast.autohide = data.length == 4 ? data[3] : true;
            // TODO: ⬆⬇这种写法貌似偶尔会导致显示不出来，下次一定改
            var t = new bootstrap.Toast(document.getElementById("liveToast"));
            t.show();
        },
    },
    watch: {
        settings: {
            handler(newVal){
                localStorage.setItem('settings', JSON.stringify(newVal));
                try{
                    this.$refs.tabStation.loadMapLine(false, false);
                }catch(e){};
            },
            immediate: false,
            deep: true
        }
    }
})