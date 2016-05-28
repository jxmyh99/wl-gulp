/**
 * Created by zero on 2015/11/10.
 * endtime : 结束时间
 * dom : 倒计时要存放的父盒子
 * starttime : 为开始时间 默认为当前时间
 */
'use strict';
function showDate(endtime,currenttime,dom,callback){
    var endtime =new Date(endtime).getTime()*1;//结束时间
    function FreshTime()
    {
        var d, h, m,s;
        var nowtime = new Date(currenttime).getTime() * 1;//当前时间
        var lefttime= (endtime-nowtime)/1000 ; //得到的为秒
        d= parseInt(lefttime/(24*60*60)) ;//得到的是天
        h= parseInt((lefttime/(60*60))%24) ;//得到的是小时
        m= parseInt((lefttime/60)%60) ;//得到 的是分钟
        s= lefttime%60 ;//得到的是秒
        function min(s){
            var m;
            if(s < 10){
                m = "0"+s;
            }else{
                m = s
            }
            return m;
        }
        dom.html("距离报名结束还剩<i>"+min(d)+"</i>天<i>"+min(h)+"</i>小时<i>"+min(m)+"</i>分");
        if(lefttime<=0){
            dom.html("报名已结束");
            clearInterval(sh);//清除定时器
        }
        if(callback)
            callback(lefttime)

    }

    FreshTime();
    var sh;
    sh= setInterval(FreshTime,1000) ;//开启定时器
}