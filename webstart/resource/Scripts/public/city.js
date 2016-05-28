/**
 * Created by zero on 2015/8/11.
 */
$(function(){
    //    选择城市
    $('#hand_city').click(function(){
        $('#SelectCity').show();
        $('.close_box').show();
    })
    $('.close_box').click(function(){
        $('#SelectCity').hide();
        $(this).hide();
    })
})