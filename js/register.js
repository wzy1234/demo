window.onload=function () {
    var inputs=document.querySelectorAll("#register input");
    var prompt=document.querySelector("#prompt");
    inputs[2].onclick=function () {
        if(inputs[0].value==localStorage.getItem("user")&&inputs[1].value==localStorage.getItem("pass")){
            window.open("temples/index.html");
            window.close();
        }else{
            prompt.innerHTML="你输入的密码和账户名不匹配，是否忘记密码或忘记会员名"
            prompt.style.display="block";
        }
    }
    inputs[3].onclick=function () {
        var username=inputs[0].value;
        var password=inputs[1].value;
        localStorage.setItem("user",username);
        localStorage.setItem("pass",password);
        if(inputs[0].value&&inputs[1].value){
            window.open("temples/index.html");
            window.close();
        }else{
            prompt.innerHTML="输入的密码和账户名不能为空"
            prompt.style.display="block";
        }
    }
}
