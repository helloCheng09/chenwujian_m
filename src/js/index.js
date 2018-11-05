let root = window.cwjMob

if (document.getElementById("jsCwjMob")) {
    // 晨午检 移动端 入口页面
    console.log(123)
} else if (document.getElementById("cwjDet")) {
    // 晨午检 移动端 详情页面
    console.log($)
    // 晨午检 切换
    root.tagToggle()
    // 展开请假学生
    root.leavePanel()
    // 展开发烧学生
    root.fashaoPanel()
    // 引入饼图
    root.renderBing(dataM, mountNode_M )
}