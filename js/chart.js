//********************************报表统计界面开始*********************************************************
//1、自己封的图表函数
var canvas=document.getElementById("canvas");
canvas.width= 600;
canvas.height=400;
var context=canvas.getContext("2d");
chartSettings();
drawAxisLabelMarkers();
drawChartWithAnimation();
function chartSettings() {
//        图标设置
    cMargin = 25;
    cSpace = 60;
    cMarginSpace = cMargin + cSpace;
    cHeight=canvas.height-2*cMargin-cSpace;
    cWidth=canvas.width-2*cMargin-cSpace;
    cMarginHeight=cHeight+cMargin;
//        每个柱状条设置
    bMargin = 15;
    totalBars=purData.length;
    bWidth=(cWidth/totalBars)-bMargin;
//        找到最大值绘制图表
    maxDataValue=0;
    for(var i=0;i<totalBars;i++){
        if(purData[i].cgje>maxDataValue){
            maxDataValue=parseInt(purData[i].cgje)
        }
    }
    totalLabelsOnYAxis = 10;
//        context.font='12px Arial';
//        动画初始化值
    ctr = 0;
    numctr = 100;
    speed = 10;
}
//    画出图表的轴及轴上所对应的数据
function drawAxisLabelMarkers() {
    context.lineWidth=2;
//   画x轴
    drawAxis(cMarginSpace, cMarginHeight,cMarginSpace+cWidth,cMarginHeight);

//   画y轴
    drawAxis(cMarginSpace, cMarginHeight,cMarginSpace,cMargin);
    drawMarkers();
}
//   画x轴和y轴的函数
function drawAxis(x1,y1,x2,y2) {
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.closePath();
    context.stroke();
}
//    在x轴和y轴上画标记
function drawMarkers() {
    context.font='14px Arial';
    var numMarkers = parseInt(maxDataValue / totalLabelsOnYAxis);
    context.textAlign='right';
    context.fillStyle='#000';
//        y轴坐标值
    for(var i=0;i<=totalLabelsOnYAxis;i++){
        markerVal=i*numMarkers;
        markerValHeight=markerVal*cHeight;
        var xMarkers = cMarginSpace - 5;
        var yMarkers = cMarginHeight - (markerValHeight / maxDataValue);
        context.fillText(markerVal,xMarkers,yMarkers);
    }
//        x轴坐标值
    context.textAlign = 'center';
    for(var i=0;i<totalBars;i++){
        var MarkersX=cMarginSpace + bMargin+(i*(bWidth+bMargin))+(bWidth/2)
        var MarkersY=cMarginHeight + 15;
        context.fillText(purData[i].djrq,MarkersX,MarkersY,bWidth);
//           绘制y轴标题
        context.save();
        context.translate(cMargin + 10, cHeight / 2);
        context.rotate(-0.5*Math.PI);
        context.fillText('y轴数据', 0, 0);
        context.restore();
//           绘制x轴标题
        context.fillText('x轴数据', cMarginSpace +
            (cWidth / 2), cMarginHeight + 40);
    }
}
//    画图表和动画
function drawChartWithAnimation() {
    for(var i=0;i<totalBars;i++){
        var bVal=parseInt(purData[i].cgje);
        vHeight=(bVal/maxDataValue*cHeight)/numctr*ctr;
        bX=cMarginSpace+i*(bWidth+bMargin)+bMargin;
        bY=cMarginHeight-vHeight-2;
        drawRectangularBar(bX,bY,bWidth,vHeight,true);
    }
    if(ctr<numctr){
        ctr++;
        setTimeout(arguments.callee,speed);
    }
}
//    画图标里的矩形条
function drawRectangularBar(x,y,w,h,fill) {
    context.beginPath();
    context.rect(x,y,w,h);
    context.closePath();
    context.stroke();
    if(fill){
        var gradient=context.createLinearGradient(0,0,0,300);
        gradient.addColorStop(0,"green");
        gradient.addColorStop(1,'rgba(67,203,36,.15)');
        context.fillStyle=gradient;
        context.strokeStyle=gradient;
        context.fill();
    }
}

// 2、使用百度的echarts
var myChart=echarts.init(document.getElementById('my_chart'));
var option = {
        title: {
            text: '采购折线图'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['铅笔刀','A4纸','橡皮','铅笔']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['甲','乙','丙','丁']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name:'铅笔刀',
                type:'line',
                stack: '单价',
                data:[7, 8, 0, 2]
            },
            {
                name:'A4纸',
                type:'line',
                stack: '单价',
                data:[70, 60, 80, 50]
            },
            {
                name:'橡皮',
                type:'line',
                stack: '单价',
                data:[0, 0, 1, 2]
            },
            {
                name:'铅笔',
                type:'line',
                stack: '单价',
                data:[5, 0, 2, 0]
            }
        ]
    };
myChart.setOption(option);
//********************************报表统计界面结束*********************************************************
