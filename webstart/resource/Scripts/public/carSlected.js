/**
 * Created by zero on 2015/8/11.
 */
$(function(){
    //    选择车型
    $("#car_sel").click(function () {
        GetBrandInfo();
        $(".leftmask").show();
        $("#popBrand").show();
        SetPopHeight("popBrand");
        $("#popBrand .swleft").addClass("swleft-block");
    })

});


function ColseBrand() {
    // $("#popSerial").show();
    SetPopHeight("popSerial");
    $("#popBrand .swleft").removeClass("swleft-block");
    setTimeout(function(){
        $('#popBrand').hide();
        $(".leftmask").hide();
    },400)
}

function CloseSerial() {
    $("#popBrand").show();
    SetPopHeight("popBrand");
    $("#popSerial .swleft").removeClass("swleft-block");
    setTimeout(function(){
        $('#popSerial').hide();
        $("#popBrand .swleft").addClass("swleft-block");
    },400)

}

function ColseCar() {
    $("#popSerial").show();
    SetPopHeight("popSerial");
    $("#popCar .swleft").removeClass("swleft-block");
    setTimeout(function(){
        $('#popCar').hide();
        $("#popSerial .swleft").addClass("swleft-block");
    },400)
    //$(".leftmask").hide();
}

//选品牌
function SelectBrand(obj) {
    var $obj = $(obj);
    $("#carbrandid").val($obj.attr("brandid"));
    $("#carbrandname").val($obj.text());
    GetSerialInfo($obj);
    $("#popBrand").hide();
    $("#popSerial").show();
    //重新定位滚动条
    window.scrollTo(0, 0);
    SetPopHeight("popSerial");
    $obj.addClass('cur').siblings().removeClass('cur');
    $("#popSerial .swleft").addClass("swleft-block");
    $(this).addClass("cur").siblings().removeClass("cur");
    setTimeout(function(){
        $(".leftmask").show();
    },400)
    $("#popBrand .swleft").removeClass("swleft-block");

}
//选车系
function SelectSerial(obj) {
    var $obj = $(obj);
    $("#carmodelid").val($obj.attr("serialid"));
    $("#carmodelname").val($obj.text());
    GetCarInfo($obj);
    if ($("#hasdetailmodel").val() == "0") return false;
    $("#popSerial").hide();
    //重新定位滚动条
    window.scrollTo(0, 0);
    $("#popCar").show();
    SetPopHeight("popCar");
    $obj.addClass('cur').siblings().removeClass('cur');
    $("#popCar .swleft").addClass("swleft-block");
    setTimeout(function(){
        $(".leftmask").show();
    },400)
    $("#popSerial .swleft").removeClass("swleft-block");
}
//选车型
function SelectCar(obj) {
    var $obj = $(obj);
    $("#cardetailmodelid").val($obj.attr("modelid"));
    $("#cardetailmodelname").val($obj.text());
    var result = $("#carbrandname").val() + " " + $("#carmodelname").val() + " " + $("#cardetailmodelname").val();
    var carname = $("#car_sel_text").text(result);
    $("#popCar").hide();
    $obj.addClass('cur').siblings().removeClass('cur');
    $(".leftmask").hide();
    $("#popCar .swleft").removeClass("swleft-block");
    SubmitCarInfo();
}
function SetPopHeight(id) {
    window.scrollTo(0, 0);
    $('.leftmask').css('height', 0);
    $(".leftPopup,.tancbox").css('height', 'auto');
    var documentHeight = $(document).height(); // 页面内容的高度
    // var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var leftPopupHeight = $('#' + id).height(); // 弹出层高度
    leftPopupHeight = (documentHeight > leftPopupHeight) ? documentHeight : leftPopupHeight;
    // $('.leftPopup').css("top", scrollTop);
    $('.leftmask,.leftPopup,.tancbox').css('height', leftPopupHeight);
}