$(function(){
    var oParent = $("#main");
    var aPin = $("#main > .pin");
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
});