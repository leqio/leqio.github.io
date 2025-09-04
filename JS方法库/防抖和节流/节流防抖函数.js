
// 1.防抖，相当于回城，多次触发，只在最后一次触发时，执行目标函数
function debounce(fn, delay = 500, immediate = false) {
    // 1.定义一个定时器，保存定时
    let timer = null;
    let isInvoke = false; //是否正在调用，false是未被调用

    const _debounce = function(...args) {
        // 触发后取消上一次定时
        if (timer) clearTimeout(timer);
        // 触发后执行可分两种：立即执行、定时执行
        // 判断是否需要立即执行，如果需要立即执行且未被调用时，立即执行
        if(immediate && !isInvoke) {
            fn.apply(this, args);
            isInvoke = true;
        } else { //否则重新设置定时，等待一段时间执行
            timer = setTimeout(() => {
                fn.apply(this, args);
				isInvoke = false;
            } , delay);
        }
    };
    return _debounce;
};

// 2.节流，相当于技能cd，限制目标函数调用的频率，比如：1s内不能调用2次
// lodash 在 opitons 参数中定义了一些选项，主要是以下三个：
    // leading：函数在每个等待时延的开始被调用，默认值为false
    // trailing：函数在每个等待时延的结束被调用，默认值是true
    // maxwait：最大的等待时间，因为如果 debounce 的函数调用时间不满足条件，可能永远都无法触发，因此增加了这个配置，保证大于一段时间后一定能执行一次函数
    // 根据 leading 和 trailing 的组合，可以实现不同的调用效果：
    // {leading: true, trailing: false}：只在延时开始时调用
    // {leading: false, trailing: true}：默认情况，即在延时结束后才会调用函数
    // {leading: true, trailing: true}：在延时开始时就调用，延时结束后也会调用
function throttle(fn, interval = 400, options = {leading: true, trailing: false}) {
    // 记录上次开始时间
    const {leading, trailing} = options;
    let lastTime = 0;
    let timer = null;

    const _throttle = function (...args) {
        // 获取当前触发时间
        const nowTime = new Date().getTime();
        if (!lastTime && !leading) lastTime = nowTime; //在函数第一次调用且 leading 为 false 时，不立即执行 fn 函数

        // 计算剩余等待时间
        const remainTime = interval - (nowTime - lastTime);

        // 若等待时间已达到，则清除timer立即执行,并记录执行时间
        if (remainTime <= 0) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            };
            fn.apply(this, args);
            lastTime = nowTime;
            return;
        };//如果不满足上述条件，即 remainTime 大于 0，表示还需要等待一段时间才能执行 fn 函数

        // 判断是否设置定时器在时延末尾执行函数,如果末尾执行且没有定时执行，则设置剩余时间后定时执行，且记录执行时间
        if (trailing && !timer) {
            timer = setTimeout(() => {
                timer = null;
                fn.apply(this, args);
                lastTime = !leading ? 0 : new Date().getTime();  //若时延开始执行记录lasttime为当前时间，时延开始不执行lasttime记录为0
            }, remainTime)
        }
    }
    return _throttle;
}