var imgNum = 0;
var files = [];
// 上传、添加图片
function addImg(){
    imgNum += this.files.length;
    // console.log(this.files[0]);
    if(imgNum > 3){
        $('.upload-msg').text("最多上传3张图片。");
        imgNum -= this.files.length;
    } else {
        for(var i=0; i<this.files.length; i++){
            var file = this.files[i];                    //上传的图片的所有信息
            files.push(file);

            alert(file.type);
            if(!/image\/(jpg|jpeg|bmp|gif)/.test(file.type)){  //首先正则限定需求格式
              $('.upload-msg').text("请上传图片文件。");
              imgNum -= this.files.length;
              return false;
            }
            //在此限制图片的大小
            var imgSize = file.size;
            //35160  计算机存储数据最为常用的单位是字节(B)
            if(imgSize>5*1024*1024){
                $('.upload-msg').text("每张图片不可大于5M,请重新选择。");
                imgNum -= this.files.length;
                return false;
            }
            var imgUrl = getImgURL(file);
            showImg(imgUrl);

            if(imgNum >0){
                $('.upWord').text('继续上传');
            }
            if(imgNum >2) {
                $('.upfile').attr("disabled", true);
                $('.uploadBtn').css('borderColor','#BED7FF');
                $('.upWord').css('color','#BED7FF');
            }
        }
    }
    for(var k = 0; k < $('.img-wrap').length; k++){
        $('.delIcon').eq(k).on('click', delImg(k));
    }
    // alert(files.length);
    // console.log(files);
}
function delImg(k){
    return function(){
        this.parentNode.remove();
        files.splice(k,1);
        $('.upfile')[0].value = '';
        imgNum--;
        if(imgNum < 3 ) {
            $('.upfile').attr("disabled", false);
            $('.uploadBtn').css('borderColor','#2E70FB');
            $('.upWord').css('color','#2E70FB');
        }
    }
}
// 显示图片缩略图
function showImg(url){
    var img='<div class="img-wrap"><img src="'+url+'"/><a class="delIcon">+</a><div>';
    $('.imgList').append(img);
    $('.upload-msg').text("");
}
// 获取图片链接
function getImgURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
     url = window.createObjectURL(file);
    } else if (window.URL != undefined) {       //支持webkit or chrome ie11 ie10 firefox oprea
     url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
     url = window.webkitURL.createObjectURL(file);
    } else if (document.all) {                   //IE9 及以下
        file.select();
        url = document.selection.createRange().text;
    }
    return url;
};
