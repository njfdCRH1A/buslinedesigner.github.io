app.component('tab-about', {
    template:
    /* HTML */
    `<div class="container">
        <h1 class="fw-normal display-5">关于 Bus Line Designer</h1>
        <p class="lead"><b>Bus Line Designer 在 <a class="text-reset" href="https://github.com/buslinedesigner/buslinedesigner.github.io" target="_blank">GitHub</a> 和 <a class="text-reset" href="https://gitee.com/buslinedesigner/buslinedesigner" target="_blank">Gitee</a> 上开源，使用 APGL-3.0 协议。使用源代码时请务必注意遵守协议规定。</b></p>
        <br />
        <h1 class="fw-normal display-5">关于 BobLiu</h1>
        <p class="lead"><b>如果你喜欢 Bus Line Designer，可以捐赠支持我。您的支持就是我更新的动力。</b></p>
        <img src="assets/donate.png" style="max-width: 300px;" />
        <p class="lead"><b>也欢迎关注我的<a class="text-reset" href="https://space.bilibili.com/273163717" target="_blank">哔哩哔哩账号</a>。</b></p>
        <br />
        <h1 class="fw-normal display-5">说明</h1>
        <p class="lead"><b>效果不符合预期但可能无法修复的“特性”：</b></p>
        <ul>
            <li>#01 选择“多站台车站”时可能无法识别车站名或识别到附近其他车站名（高德地图数据储存问题）</li>
        </ul>
        <p class="lead"><b>未来准备添加的功能：</b></p>
        <ul>
            <li>文件功能兼容更多浏览器</li>
            <li>自动生成票价表</li>
            <li>自动生成相关图示</li>
        </ul>
    </div>`
})