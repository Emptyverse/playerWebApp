// 设置rem响应式布局
function adapter() {
    // 获取屏幕尺寸
    let deviceWidth = document.documentElement.clientWidth || window.innerWidth;
    if (deviceWidth >= 750) deviceWidth = 750;
    if (deviceWidth <= 320) deviceWidth = 320;
    // 设置rem 宽度变化 rem对应的像素也变化 750px => 1rem = 100px, 375px => 1rem = 50px
    // 获取html的字体大小 并设置rem
    const rootFontSize = (deviceWidth) / 7.5
    document.documentElement.style.fontSize = rootFontSize + 'px';
    // 1rem就等于 html 的font-size = ???px   rem是一个相对单位
    // 获取body元素并设置body元素的字体大小 并设置为0.3rem的大小
    document.querySelector('body').style.fontSize = 0.3 + 'rem';
}
// 默认调用remSize函数
adapter();
// 监听屏幕宽度变化 从而调用remSize函数改变字体相对大小
window.onresize = function () {
    adapter();
}