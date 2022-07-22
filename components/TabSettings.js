bld.component('tab-settings', {
    props: {
        settings: {
            type: Object,
            required: true
        },
    },
    template:
    /* HTML */
    `
    <div class="container" id="tabSettings">
        <h1><span class="fw-normal display-5">设置</span></h1>
        <div class="row justify-content-between">
            <div class="col-12 col-md-4 mb-3 p-md-3">
                <div class="card">
                    <div class="card-header">通用设置</div>
                    <div class="card-body form-control" style="border: 0px;">
                        <div class="mb-3" v-for="(item, index) in settings.general">
                            <label class="form-label" v-text="item.name"></label>
                            <select class="form-select" v-model="item.current">
                                <option v-for="(option, index) in item.options" :value="option.value" v-text="option.name"></option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-4 mb-3 p-md-3">
                <div class="card">
                    <div class="card-header">地图设置</div>
                    <div class="card-body form-control" style="border: 0px;">
                        <div class="mb-3" v-for="(item, index) in settings.map">
                            <label class="form-label" v-text="item.name"></label>
                            <select class="form-select" v-model="item.current">
                                <option v-for="(option, index) in item.options" :value="option.value" v-text="option.name"></option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-4 mb-3 p-md-3">
                <div class="card">
                    <div class="card-header">票价设置</div>
                    <div class="card-body form-control" style="border: 0px;">
                        <div class="mb-3" v-for="(item, index) in settings.fare">
                            <label class="form-label" v-text="item.name"></label>
                            <select class="form-select" v-model="item.current">
                                <option v-for="(option, index) in item.options" :value="option.value" v-text="option.name"></option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {},
    computed: {}
})