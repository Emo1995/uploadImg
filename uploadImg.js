$('.upfile').bind('change',addImg);  
var imgNum = 0;
var files = [];
// 上传、添加图片
function addImg(){
    imgNum += this.files.length;    // 记录真正添加的图片数量
    // console.log(this.files[0]);
    if(imgNum > 3){
        $('.upload-msg').text("最多上传3张图片。");
        imgNum -= this.files.length;      // 注意上传失败的时候需要减少图片数量
    } else {
        for(var i=0; i<this.files.length; i++){     // this.files 为每次点击上传按钮后的多个文件的信息，数组形式
            var file = this.files[i];               // 得到单张图片的所有信息
            files.push(file);           // files为自己设置的装载所有文件信息的容器，方便添加、移除删掉的图片，最后发送给后端的为files数组
            // alert(file.type);        // image/jpg... input type="file"
            if(!/image\/(jpg|jpeg|bmp|gif)/.test(file.type)){    // 正则限定图片需求格式，可自定义
              $('.upload-msg').text("请上传图片文件。");
              imgNum -= this.files.length;
              return false;
            }
            var imgSize = file.size;
            if(imgSize>5*1024*1024){                  //在此限制图片的大小，自定义（此处限定5M）,单位字节（B）
                $('.upload-msg').text("每张图片不可大于5M,请重新选择。");
                imgNum -= this.files.length;
                return false;
            }
            var imgUrl = getImgURL(file);   // 获取图片url以供前端展示
            showImg(imgUrl);    // 显示图片缩略图

            if(imgNum >0){
                $('.upWord').text('继续上传');   // （根据需求自定一些前端样式）
            }
            if(imgNum >2) {
                $('.upfile').attr("disabled", true);
                $('.uploadBtn').css('borderColor','#BED7FF');
                $('.upWord').css('color','#BED7FF');
            }
        }
    }
    for(var k = 0; k < $('.img-wrap').length; k++){
        $('.delIcon').eq(k).on('click', delImg(k));     // 闭包上场～ 
    }
}
// 删除图片
function delImg(k){
    return function(){
        this.parentNode.remove();      // 点击删除按钮后，对应图片删除，
        files.splice(k,1);
        $('.upfile')[0].value = '';     // 删除图片后，再次添加同一张图片就会失效，此处困扰我时间比较久，打断点其实就会发现，
                                        // 本张和上一张图片相同导致 upload 并没有chnage【请看第一行】，所以此处我们需要将input的value置空
        imgNum--;
        if(imgNum < 3 ) {               // 此处的逻辑是根据我前端的展示写的，大家可以随意啦～ 图片超过三张按钮失效，但是删除到小于三张又会恢复了
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
function getImgURL(file) {      // 图片展示的关键就是得到 img 的 src，所以在此我们考虑兼容多个浏览器获取图片链接。
                                // 这里的逻辑有参考文档、网上的很多写法，但总有些不全，功能还在测试ing，有什么问题会再来修改。
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
