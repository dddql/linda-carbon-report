document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id && carbonData[id]) {
        const info = carbonData[id];
        
        // 更新文字内容
        document.getElementById('house-id').innerText = info.house;
        document.getElementById('total-carbon').innerText = info.total;
        document.getElementById('carbon-level').innerText = info.level;

        // 更新建议列表
        const adviceHtml = info.advices.map(item => `<li>${item}</li>`).join('');
        document.getElementById('advice-list').innerHTML = adviceHtml;

        // 渲染饼图
        const chartDom = document.getElementById('pie-chart');
        const myChart = echarts.init(chartDom);
        const option = {
            series: [{
                type: 'pie',
                radius: '60%',
                data: info.details,
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
            }]
        };
        myChart.setOption(option);
    } else {
        document.body.innerHTML = "<h2 style='text-align:center;margin-top:50px;'>未找到您的低碳档案，请确认链接无误。</h2>";
    }
});