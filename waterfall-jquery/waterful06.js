/* 6 添加分页请求处理 */
$(function(){
    waterfall("#main",".pin");
    var ajaxState = true;
    var page=0;
    var requestNum = 5;
    $(window).scroll(function() {
        if(checkScrollPosition() && ajaxState){
            page++;
            ajaxState = false;
            $.ajax({
                type:"GET",
                url:"data.js",
                dataType: "jsonp",
                data:"page="+page+"&requestNum="+requestNum,
                jsonpCallback:"testDataCallBack",
                beforeSend:function(){
                    //加载前时候在页面底部显示loading图片
                    var oParent = $("#main");
                    var aPin = $("#main > .pin");
                    var lastPinH = aPin[aPin.length-1].offsetTop+aPin[aPin.length-1].offsetHeight;
                    var loadImg = $("<img>").addClass("loadImg").attr("src","images/loading.gif");
                    oParent.append(loadImg);
                    var loadH = Math.floor(oParent[0].offsetWidth-loadImg[0].offsetWidth)/2;
                    loadImg.css({
                            position:"absolute",
                            top:lastPinH+50+"px"
                    });
                    loadImg.css("left",loadH+"px")
                },
                success: function(data){
                    var oParent = $("#main");
                    for(i in data){
                        var oPin = $("<div>").addClass("pin");
                        oParent.append(oPin);
                        var oBox = $("<div>").addClass("box");
                        oPin.append(oBox);
                        var oImg = $("<img>").attr("src","images/"+data[i].src);
                        loadImg("images/"+data[i].src,callback,oImg);
                        oBox.append(oImg);
                    }
                    waterfall("#main",".pin");
                },
                complete: function(){
                    $(".loadImg").remove();  //加载完成后删除loadingtup
                    ajaxState = true;
                }
            });
        }
    });
});

/**
 * 瀑布流功能
 * @param parent  父级元素的id或class名称
 * @param pin     子集的id或class名称，每个图片块
 */
    function waterfall(parent,pin){
        var oParent = $(parent);
        var aPin = $(parent+">"+ pin);
        var iPinW = aPin[0].offsetWidth;
        var num = Math.floor(document.documentElement.clientWidth/iPinW);
        oParent.css({width: num*iPinW+"px",margin: "0 auto"});

        var compareArr = [];
        aPin.each(function(i){
            if(i<num){
                compareArr[i]=aPin[i].offsetHeight;
            }else{
                var minH = Math.min.apply({},compareArr);
                var minKey = getMinKey(compareArr,minH);
                setMoveStyle(aPin[i],minH,aPin[minKey].offsetLeft,i,2);
                //更新数组
                compareArr[minKey] += aPin[i].offsetHeight;
            }
        });
    }

    /**
     *  获取数组最小值的键值
     * @param arr    数组
     * @param minH   最小值
     * @returns      key
     */
    function getMinKey(arr,minH){
        for(key in arr){
            if(arr[key]==minH){
                return key;
            }
        }
    }
/**
 * 瀑布流图片块的运动风格
 * @param obj   运动的对象
 * @param top   运动的对象的top值
 * @param left  运动的对象的left值
 */
var startNum = 0;
function setMoveStyle(obj,top,left,index,style){
    //屏蔽不必要的运动
    if(index<=startNum){
        return;
    }
    var documentW = document.documentElement.clientWidth;
    $(obj).css("position","absolute");
    switch (style){
        case 1:
            $(obj).css({
                top:getTotalH()+"px",
                left:Math.floor((documentW-obj.offsetWidth)/2)+"px"
            });
            $(obj).stop().animate({
                top:top,
                left:left
            },1000);
            break;
        case 2:
            $(obj).css({
                opacity:0,
                filter:"alpha(opacity=0)",
                top:top+"px",
                left:left+"px"
            });
            $(obj).stop().animate({
                opacity:1
            },1000);
            break;
        case 3:
            $(obj).css("top",getTotalH()+"px");
            if(index%2){
                $(obj).css("left",-obj.offsetWidth+"px");
            }else{
                $(obj).css("left",documentW+"px");
            }
            $(obj).stop().animate({
                top:top,
                left:left
            },1000);
            break;
    }
    startNum = index;
}
/**
 *  检查只有滚动条到底部的时候再加载图片，否则不加载
 * @param parent
 * @param pin
 * @returns {boolean}
 */
function checkScrollPosition(){
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var documentH = document.documentElement.clientHeight;
    return (getLastH()<scrollTop+documentH)?true:false;
}
/**
 * 获取最后一个图片块的高度
 * @returns {number}
 */
function getLastH(){
    var oParent = $("#main");
    var aPin = $("#main > .pin");
    var lastPinH = aPin[aPin.length-1].offsetTop+Math.floor(aPin[aPin.length-1].offsetHeight/2);
    return lastPinH;
}
/**
 * 整个窗口的高度
 * @returns {number}
 */
function getTotalH(){
    var totalH = document.documentElement.scrollHeight || document.body.scrollHeight;
    return totalH;
}
/**
 * 图像预加载
 * @param url
 * @param callback
 */
function loadImg(url,fn,imgObj){
    var img = new Image();
    img.src = url;
    if(img.complete){
        fn(img.width,img.height,imgObj);
    }else{
        $(img).load(function(){
            fn(img.width,img.height,imgObj);
        });
    }
}
/**
 * 为预加载图像设置宽度和高度
 * @param w
 * @param h
 * @param imgObj
 */
function callback(w,h,imgObj){
    var scale = w/205;
    imgObj.css({width:205+"px",height:Math.floor(h/scale)+"px"});
}
