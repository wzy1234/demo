//********************************采购管理界面开始*********************************************************
var purTbody1=document.querySelector("#pur_table .intbody");
var purTbody2=document.querySelector("#pur_table2 .addtbody");
//导航按钮状态值；
var isadd=false;
var isSwitch=false;
var isRevamp=false;
//打开网页时最开始的页面（根据数据渲染出来的）
for(var i=0;i<purData.length;i++){
    render(i)
}
$('.intbody tr').eq(0).addClass('cheactive');
$(".tool_nav button").filter(".pur_save").addClass("static");

//1、首页增加按钮点击后呈现的页面，导航栏只有保存按钮是可以单击的，注（增加与修改是同一套原理与界面）
$(".tool_nav button").filter(".pur_add").click(function () {
    if(isadd||isRevamp){
        return
    }
    isadd=true;
    addN=1;
    //制作出来一张空表的表格，以供填写
    $('.addtbody').children().remove();
    $('#pur_num').val('自动编号');
    $("#pur_time").val('');
    $("#pur_menu input").attr("disabled",false);
    $("#pur_menu select").attr("disabled",false);
    $("#pur_store option").attr("selected",false);
    $("#pur_mold option").attr("selected",false);
    $("#supplier").val('');
    $("#pur_people").val('');
    newTr(addN);
    //单据日期栏右侧图标被点击，会出现时间选择图形
    $(".choiceDate").on("click", function () {
            $("#timeBox").css("display","block")
        }
    );
    $(".tool_nav button").addClass("static");
    $(".tool_nav button").filter(".pur_save").removeClass("static");
    $("#pur_table").hide();
    $("#pur_menu").show();
})

//1.1创建增加按钮点击后样式
function newTr(i) {
    var newElems=$("<tr height='30'>")
        .append("<td>"+i+"</td>")
        .append("<td><i class='glyphicon glyphicon-plus'>")
        .append("<td><b class='glyphicon glyphicon-remove'></b>")
        .append("<td><input type='text'>")
        .append("<td><input type='text'>")
        .append("<td><input type='text'>")
        .append("<td><input type='text' value='0' class='shuliang'>")
        .append("<td><input type='text' value='0' class='danjia'>")
        .append("<td><input type='text' class='zonge'>")
    $('.addtbody').append(newElems);
}

//1.2用到on处理将来事件，即动态获取元素
$('.addtbody').on('click','i',function () {
    if(isadd||isRevamp){
        addN++;
        newTr(addN);
    }
});
$('.addtbody').on('click','b',function () {
    if(isadd||isRevamp){
        if($('.addtbody').children('tr').length>1){
            $(this).parent().parent().remove();
        }
        newTotal();
    }
});

//1.3当数量和单价发生改变时，总价自动更改，同时处理合计的改变（封一个函数计算总和）
function newTotal() {
    var totalNumber=0;
    var totalAmount=0;
    $('.shuliang').each(function (index,elem) {
        totalNumber+=parseFloat($(elem).val())
    })
    $('#total_number').html(totalNumber)
    $('.zonge').each(function (index,elem) {
        totalAmount+=parseFloat($(elem).val())
    })
    $('#total_amount').html(totalAmount)
}
$('.addtbody').on('change','.shuliang',function () {
    var total=($(this).val())*($(this).parent().next().children('input').val())
    $(this).parent().next().next().children('input').val(total);
    newTotal();
});
$('.addtbody').on('change','.danjia',function () {
    var total=($(this).val())*($(this).parent().prev().children('input').val())
    $(this).parent().next().children('input').val(total);
    newTotal();
});

//1.1.1选择时间函数部分
var timeContent = document.getElementById('content');
var timeLink1 = document.getElementById('link1');
var timeLink2 = document.getElementById('link2');
var timeSpans = document.querySelectorAll('#box span span');
var timeN = 0;
timeFn(0);
function timeFn(timeN) {
    var now = new Date();
    var month = now.getMonth() + timeN;
    now.setMonth(month);
    var years = now.getFullYear();
    var months = now.getMonth();
    var today = now.getDate();
    now.setDate(1);
    var week1 = now.getDay();//本月第一天周几
    now.setMonth(month + 1);
    now.setDate(0);
    var last = now.getDate();//本月总天数
    var str = "";
    for (var i = 0; i < week1; i++) {
        str = `<div></div>`;
    }
    for (var i = 1; i < last + 1; i++) {
        if (i < today) {
            str += `<p index=${i}>${i}</p>`;
        }
        if (i == today) {
            str += `<p class='active2' index=${i}>${i}</p>`;
        }
        if (i > today) {
            str += `<p index=${i}>${i}</p>`;
        }
    }
    timeContent.innerHTML = str;
    timeSpans[1].innerHTML = months + 1;
    timeSpans[0].innerHTML = years;
    timeClick();
}
//点击左右切换月份
timeLink2.onclick = function () {
    timeN++;
    timeFn(timeN);
}
timeLink1.onclick = function () {
    timeN--;
    timeFn(timeN);
}
function timeClick() {
    var ps = timeContent.querySelectorAll("p");
    content.onclick = function (e) {
        var target = e.target;
        if (target.tagName.toLowerCase() == "p") {
            var timeR = target.getAttribute("index");
            for (var i = 0; i < ps.length; i++) {
                ps[i].className = "";
            }
            ps[timeR - 1].className = "active2";
            var choicetime=`${timeSpans[0].innerHTML}-${timeSpans[1].innerHTML}-${timeR}`;
            $("#pur_time").val(choicetime);
            $("#timeBox").css("display","none");
        }
    }
}

//2修改按钮有三种触发原因：页面一加载上来点击直接触发；或者在切换的详细页面点击触发；或者在增加按钮点击保存后再点击修改按钮
//同时需要注意，修改按钮点击，就相当于进入增加页面，增加的所有功能，它都具有
var linkNum=0;
$(".tool_nav button").filter(".pur_revamp").click(function () {
    if(isadd||isRevamp){
        return;
    }
    isRevamp=true;
    addN=purData[linkNum].detail.length;
    $('.addtbody').children().remove();
    //通过a链接切换的页面，再点击修改时，将a跳转后的页面彻底删除，用数据再重新渲染；
    $(".tool_nav button").addClass("static");
    $(".tool_nav button").filter(".pur_save").removeClass("static");
    linkRender(linkNum);
    notForbid();
    $('#pur_num').attr('disabled',true);
    $(".choiceDate").on("click", function () {
            $("#timeBox").css("display","block")
        }
    );
    $("#pur_table").hide();
    $("#pur_menu").show();
})

//3删除按钮操作，将第linkNum个数据删数，同时将tr的索引再重新设置，重新渲染数据时render函数就会重置索引，保存后的数据都能进行删除
$(".tool_nav button").filter(".pur_remove").click(function () {
    if(isadd||isRevamp){
        return;
    }
    //弹出一个提示层
    if(purData.length>0){
        $('#removeMask').css({
            opacity:1,
            "z-index":99
        })
    }else {
        alert("没有可删除的数据了");
        return
    }
    $('#removeInner span').html(purData[linkNum].djh)
})
// 3.1确定按钮被点击时
$('.make_sure').click(function () {
    $('#pur_table').show();
    $("#pur_menu").hide();
    $('.intbody').children().remove();
    $('.addtbody').children().remove();
    purData.splice(linkNum,1);
    $('#removeMask').css({
        opacity:0,
        "z-index":-99
    })
    for(var i=0;i<purData.length;i++){
        render(i);
    }
    // 删除后将它的下一个自动变成被选中，如没有下一个则，默认第0个
    if(purData.length>0){
        if(purData.length<=linkNum){
            linkNum=0;
        }
        $('.intbody tr').eq(linkNum).addClass('cheactive');
    }
})
// 3.2取消按钮被点击时
$('.cancel').click(function () {
    $('#removeMask').css({
        opacity:0,
        "z-index":-99
    })
})

//4查询按钮操作，查找页面确定按钮点击后，筛选出的页面，什么都没有就留空白，筛选出来呈现的页面和页面一加载上来的页面一样，各功能也一样
//******查询功能在切换时有点小问题，暂时没有做处理
$(".tool_nav button").filter(".pur_search").click(function () {
    if(isadd||isRevamp){
        return;
    }
$('#searchMask').css({
    opacity:1,
    "z-index":99
})
$('.sure_search button').unbind("click").click(function () {
    $('.intbody').children().remove();
    //将查找的条件提取出来，去数据里比对，筛选出想要的数据,由于时间筛选太复杂，暂时未做
    var searchObj={
        a:$('.coding input').val(),
        c:$('.search_supplier input').val(),
        d:$('.search_agent input').val(),
        e:{
            e1:$('.search_money1 input').val(),
            e2:$('.search_money2 input').val()
        }
    };
    $('#searchMask').css({
        opacity:0,
        "z-index":-99
    });
    filter(searchObj)
})

$('.btn_close').click(function () {
    $('#searchMask').css({
        opacity:0,
        "z-index":-99
    })
})
})

//5保存按钮点击时保存数据到data，导航上所有按钮恢复原始状态，相当于同时跳转到切换的详细页面
//注意：一定要考虑数据的覆盖问题，是点击增加按钮的话，数据是添加到数组中，如果是修改的话，就要修改数据的具体位置，替换为保存后的数据
$(".tool_nav button").filter(".pur_save").click(function () {
    if(!isadd&&!isRevamp){
        return
    }
    if($('#pur_time').val()==""){
        alert("请选择“时间")
        return
    }
    $(".tool_nav button").removeClass("static");
    //判断单据号是否已经存在了，取巧办法，直接看单据号input的内容是不是“自动编号”
    if($('#pur_num').val()=="自动编号"){
        var num=purData.length;
        var obj = {};
        obj.djh=`jh00${num+1}`;
        saveData(obj);
        purData.push(obj);
        linkNum=num
    }else{
        var pNum=$('#pur_num').val()
        //单据号格式为jh001,要将它与元数组进行匹配，找到它后再进行替换
        for(let i=0;i<purData.length;i++){
            if(purData[i].djh==pNum){
                saveData(purData[i]);
                linkNum=i;
            }
        }
    }
    console.log(purData);
    //处理下保存页面的跳转问题
    forbid();
    isadd=false;
    isRevamp=false;
    isSwitch=true;
})

//6 与点击切换按钮点相关函数操作
$('.intbody').on('click','a',function () {
    //原始界面a标签被点击后，会进入到对应订单号详细的页面
    $('#pur_table').css('display','none');
    $('.intbody').children().remove();
    $('#pur_menu').css('display','block');
    linkRender($(this).attr("index"));
    isSwitch=true;
    forbid();
});

$(".tool_nav button").filter(".pur_switchover").click(function () {
    if(isadd||isRevamp){
        return;
    }
    if(isSwitch==false){
        $('#pur_table').hide();
        $('.intbody').children().remove();
        $("#pur_menu").show();
        linkRender(linkNum);
        forbid();
    }else{
        $('#pur_table').show();
        $("#pur_menu").hide();
        $('.intbody').children().remove();
        $('.addtbody').children().remove();
        for(var i=0;i<purData.length;i++){
            render(i)
        }
        $('.intbody tr').eq(linkNum).addClass('cheactive');
    }
    isSwitch=!isSwitch;
})

//将页面的所有input禁止输入功能
function forbid() {
    $("#pur_menu input").attr("disabled",true);
    $("#pur_menu select").attr("disabled",true);
}
//将页面的所有input禁止输入功能撤消
function notForbid() {
    $("#pur_menu input").attr("disabled",false);
    $("#pur_menu select").attr("disabled",false);
}

//页面一加载就呈现的函数
function render(i) {
    var str1 = "";
    str1 = `<tr _index=${i}>
            <td>${i + 1}</td>
            <td><a href="javascript:;" index=${i}>${purData[i].djh}</a></td>
            <td>${purData[i].djrq}</td>
            <td>${purData[i].gys}</td>
            <td>${purData[i].cgy}</td>
            <td>${purData[i].cgje}</td>
        </tr>`;
    purTbody1.innerHTML += str1;
    $('.intbody tr').on('click',function () {
        $('.intbody tr').removeClass('cheactive');
        $(this).addClass('cheactive');
        linkNum=$(this).attr('_index');
    })
}

//点击a标签后跳转，渲染出来的页面
function linkRender(n){
    $('#pur_num').val(purData[n].djh);
    $("#pur_time").val(purData[n].djrq);
    $("#pur_store option").eq(purData[n].ck).attr("selected",true);
    $("#pur_mold option").eq(purData[n].cglx).attr("selected",true);
    $("#supplier").val(purData[n].gys);
    $("#pur_people").val(purData[n].cgy);

    for(var i=0;i<purData[n].detail.length;i++){
        var newElems=$("<tr height='30'>")
                .append("<td>"+(i+1)+"</td>")
                .append("<td><i class='glyphicon glyphicon-plus'>")
                .append("<td><b class='glyphicon glyphicon-remove'></b>")
                .append(`<td><input type='text' value=${purData[n].detail[i].chmc}>`)
                .append(`<td><input type='text' value=${purData[n].detail[i].chbm}>`)
                .append(`<td><input type='text' value=${purData[n].detail[i].dw}>`)
                .append(`<td><input type='text' class='shuliang' value=${purData[n].detail[i].cgsl}>`)
                .append(`<td><input type='text' class='danjia' value=${purData[n].detail[i].cgdj}>`)
                .append(`<td><input type='text' class='zonge' value=${purData[n].detail[i].cgje}>`)
        $('.addtbody').append(newElems);
    }
    newTotal();
}

//将数据保存到对象中
function saveData(s) {
    s.djrq=$("#pur_time").val();
    s.ck=$("#pur_store").find('option:selected').val()||0;
    s.cglx=$("#pur_mold").find('option:selected').val()||0;
    s.gys=document.getElementById('supplier').value||"";
    s.cgy=document.getElementById('pur_people').value||"";
    s.cgje=document.getElementById('total_amount').innerHTML||0;
    s.detail=[];
    for(var i=0;i<purTbody2.rows.length;i++){
        s.detail[i]={};
        s.detail[i].chmc=purTbody2.rows[i].cells[3].children[0].value||"";
        s.detail[i].chbm=purTbody2.rows[i].cells[4].children[0].value||"";
          s.detail[i].dw=purTbody2.rows[i].cells[5].children[0].value||"";
        s.detail[i].cgdj=purTbody2.rows[i].cells[6].children[0].value||"";
        s.detail[i].cgsl=purTbody2.rows[i].cells[7].children[0].value||"";
        s.detail[i].cgje=purTbody2.rows[i].cells[8].children[0].value||"";
    }
}

//筛选数据方法
function filter(obj) {
    console.log(obj);
    var  x=[];
    var x1=[];
    var x3=[];
    var x4=[];
    var x5=[];
    for(let i=0;i<purData.length;i++){
        if(obj.a!=""&&obj.a==purData[i].djh){
            x1.push(i);
        }
        if(obj.c!=""&&obj.c==purData[i].gys){
            x3.push(i);
        }
        if(obj.d!=""&&obj.d==purData[i].cgy){
            x4.push(i);
        }
        if(obj.e.e1!=""&&obj.e.e2!=""){
            if(parseFloat(obj.e.e1)<=parseFloat(purData[i].cgje)&&parseFloat(purData[i].cgje)<=parseFloat(obj.e.e2)){
                x5.push(i);
            }
        }
    }
    //取查询结果的交集，先两两找相同的提取出来，再将找到的进行相同的提取,要把是空数组的条件想进去
    var resultArr=[];
    var resultArr1=[];
    var result1=[];
    if(x3.length==0){
        if(x4.length!=0&&x5.length!=0){
            resultArr=checkSame(x4,x5);
        }
        else if(x4.length!=0&&x5.length==0){
            resultArr=x4;
        }
        else if(x4.length==0&&x5.length!=0){
            resultArr=x5;
        }
        else{
            resultArr=[]
        }
    }else{
        if(x4.length==0&&x5.length==0){
            resultArr=x3;
        }
        else if(x4.length!=0&&x5.length!=0){
            result1=checkSame(x3,x4);
            resultArr=checkSame(x5,result1);
        }
        else if(x4.length!=0&&x5.length==0){
            resultArr=checkSame(x3,x4);
        }
        else if(x4.length==0&&x5.length!=0){
            resultArr=checkSame(x3,x5);
        }
    }
    if(x1.length!=0){
        resultArr1=checkSame(x1,resultArr);
        for(let i=0;i<resultArr1.length;i++){
            render(resultArr1[i])
        }
    }else{
        for(let i=0;i<resultArr.length;i++){
            render(resultArr[i])
        }
    }
}

//取两个数组相同的元素,此函数只能比对按顺序排列的数组，数组可先排序，此项目中push是按顺序push的
function checkSame(arr1,arr2){
    var a1=0;
    var b1=0;
    var result=[];
    while(a1<arr1.length&&b1<arr2.length){
        if(arr1[a1]<arr2[b1]){
            a1++;
        }else if(arr1[a1]>arr2[b1]){
            b1++;
        }else{
            result.push ( arr1[a1] );
            a1++;
            b1++;
        }
    }
    return result;
}
//********************************采购管理界面结束*********************************************************
