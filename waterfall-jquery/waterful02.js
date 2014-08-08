/* 封装 */
$(function(){
    var oParent = $("#main");
    var aPin = $("#main > .pin");
    waterfall(oParent,aPin);
});

/**
 * 瀑布流功能
 * @param parent  父级元素
 * @param pin     子集，每个图片块
 */
    function waterfall(parent,pin){
        var iPinW = pin[0].offsetWidth;
        var num = Math.floor(document.documentElement.clientWidth/iPinW);
        parent.css({width: num*iPinW+"px",margin: "0 auto"});

        var compareArr = [];
        pin.each(function(i){
            if(i<num){
                compareArr[i]=pin[i].offsetHeight;
            }else{
                var minH = Math.min.apply({},compareArr);
                var minKey = getMinKey(compareArr,minH);
                $(pin[i]).css({
                    position:"absolute",
                    top:minH+"px",
                    left:pin[minKey].offsetLeft+"px"
                });
                //更新数组
                compareArr[minKey] += pin[i].offsetHeight;
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
