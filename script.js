document.addEventListener('DOMContentLoaded', function() {
    // 检查网址中是否包含 ?id= 参数
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
        // 如果有ID，尝试加载报告
        loadReport(userId);
    } else {
        // 如果没有ID，显示搜索输入页，隐藏报告页
        document.getElementById('search-section').style.display = 'block';
        document.getElementById('report-section').style.display = 'none';
    }
});

// 点击查询按钮的执行逻辑
function searchReport() {
    const inputId = document.getElementById('input-id').value.trim();
    if (inputId === '') {
        alert("请输入门牌编号！");
        return;
    }
    // 页面跳转，在网址后面带上输入的编号
    window.location.href = '?id=' + inputId;
}

// 返回重新查询
function backToSearch() {
    window.location.href = window.location.pathname; // 清除参数，回到初始页
}

// 加载并渲染报告核心逻辑
function loadReport(id) {
    if (carbonData[id]) {
        // 隐藏搜索页，显示报告页
        document.getElementById('search-section').style.display = 'none';
        document.getElementById('report-section').style.display = 'block';

        const info = carbonData[id];
        
        // 1. 更新基础文字内容
        document.getElementById('house-id').innerText = info.house;
        document.getElementById('total-carbon').innerText = info.total;
        document.getElementById('carbon-level').innerText = info.level;

        // 2. 根据评级动态显示对比文字
        let compareTxt = "处于平均水平";
        if (info.level.includes("低碳")) compareTxt = "优于全国 85% 的家庭";
        if (info.level.includes("中等")) compareTxt = "符合全国平均生活水平";
        if (info.level.includes("高碳")) compareTxt = "高于全国平均水平，需重点关注";
        document.getElementById('compare-text').innerText = compareTxt;

        // 3. 计算需要种多少棵树 (向上取整)
        // 公式参考自木鱼查询工具: 1棵树每年吸收约22kg CO2
        const treeCount = Math.ceil(info.total / 22);
        document.getElementById('tree-count').innerText = treeCount;

        // 4. 更新建议列表
        const adviceHtml = info.advices.map(item => `<li>${item}</li>`).join('');
        document.getElementById('advice-list').innerHTML = adviceHtml;

        // 5. 渲染饼图
        const chartDom = document.getElementById('pie-chart');
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: '60%',
                data: info.details,
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
            }]
        };
        myChart.setOption(option);
    } else {
        // 如果输入了错误的编号
        alert("未找到该编号的低碳档案，请确认输入是否正确（注意大小写）。");
        window.location.href = window.location.pathname; 
    }
}