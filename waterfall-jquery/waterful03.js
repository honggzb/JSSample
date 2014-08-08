/* 3. 实现动态加载图片 */
$(function(){
    var data = [{"src":"0.jpg"},{"src":"1.jpg"},{"src":"2.jpg"},{"src":"3.jpg"},
        {"src":"4.jpg"},{"src":"5.jpg"},{"src":"6.jpg"},
        {"src":"7.jpg"},{"src":"8.jpg"}];
    waterfall("#main",".pin");

    $(window).scroll(function() {
        if(checkScrollPosition("#main",".pin")){
            var oParent = $("#main");
            for(i in data){
                var oPin = $("<div>").addClass("pin");
                oParent.append(oPin);
                var oBox = $("<div>").addClass("box");
                oPin.append(oBox);
                var oImg = $("<img>").attr("src","images/"+data[i].src);
                oBox.append(oImg);
            }
            waterfall("#main",".pin");
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
                $(aPin[i]).css({
                    position:"absolute",
                    top:minH+"px",
                    left:aPin[minKey].offsetLeft+"px"
                });
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
 *  检查只有滚动条到底部的时候再加载图片，否则不加载
 * @param parent
 * @param pin
 * @returns {boolean}
 */
function checkScrollPosition(parent,pin){
    var oParent = $(parent);
    var aPin = $(parent+">"+ pin);
    var lastPinH = aPin[aPin.length-1].offsetTop+Math.floor(aPin[aPin.length-1].offsetHeight/2);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var documentH = document.documentElement.clientHeight;
    return (lastPinH<scrollTop+documentH)?true:false;

}
