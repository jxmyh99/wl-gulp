function showMsg(msg,isHide){
    /*
     msg : 信息提示
     isHide : 是否自动隐藏
     true 隐藏
     false 不隐藏
     */
    var $msgBox = "<div class='m_tips' style='display:none;' id='tipsdialog'><p id='tipsmsg'></p></div>";
    $("body").append($msgBox);
    var $dialog = $("#tipsdialog");
    var $msg = $("#tipsmsg");
    $msg.html(msg);
    $dialog.show();
    if(isHide){
        setTimeout(function(){
            $msg.html("");
            $dialog.remove();
        }, 2000);
    }
}
// 带确认的信息
function showMenuMsg(msg,menu1,menu2,obj){
    /*
     msg : 提示信息
     menu 1 : 取消按钮
     menu 2 : 确定按钮
     */
    $(".layermcont").text(msg);
    $(".layermbtn").find('span:first').text(menu1);
    $(".layermbtn").find('span:last').text(menu2)
    $(".layermbtn").find('span').click(function(event) {
        if($(this).attr('type') == 0){
            $("#layer_menu").removeClass('layermshow').hide();
        }else{
            /*
             请看下$(this).attr('type') == 1
             如果操作成功请使用showMsg()来弹出信息。具体参数请看上面
             */
            $("#layer_menu").removeClass('layermshow').hide();
            obj.remove();
            showMsg('删除成功',true);
        }
    });
    $("#layer_menu").show(100,function(){
        $("#layer_menu").addClass('layermshow');
        $(document).on('click', function(event) {
            if($(event.target).closest('.layermchild').length == 0){
                $("#layer_menu").removeClass('layermshow').hide();
            }
            $(document).off('click');
        });
    });
}
function showMenuMsg1(msg,menu1,menu2) {
    /*
     msg : 提示信息
     menu 1 : 取消按钮
     menu 2 : 确定按钮
     */
    $(".layermcont").html(msg);
    $(".layermbtn").find('span:first').text(menu1);
    $(".layermbtn").find('span:last').text(menu2)
    $(".layermbtn").find('span').click(function (event) {
        if ($(this).attr('type') == 0) {
            $("#layer_menu").removeClass('layermshow').hide();
        } else {
            /*
             请看下$(this).attr('type') == 1
             如果操作成功请使用showMsg()来弹出信息。具体参数请看上面
             */
            $("#layer_menu").removeClass('layermshow').hide();
        }
    });
    $("#layer_menu").show(100, function () {
        $("#layer_menu").addClass('layermshow');
        $(document).on('click', function (event) {
            if ($(event.target).closest('.layermchild').length == 0) {
                $("#layer_menu").removeClass('layermshow').hide();
            }
            $(document).off('click');
        });
    });
}
function is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}
