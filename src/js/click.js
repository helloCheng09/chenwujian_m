(function ($, root) {
    // 晨检 午检 切换
    let tagToggle = () => {
        let lastIndex = 0
        let curIndex
        $(".tag-p  .tag-item").each(function () {
            $(this).on("click", function () {
                let curIndex = $(this).index()
                console.log(curIndex)
                if (curIndex != lastIndex) {
                    $(this).addClass("select")
                    $(".tag-p  .tag-item").eq(lastIndex).removeClass("select")
                    let curEle = $(".main-con-p").eq(curIndex)
                    let lastEle = $(".main-con-p").eq(lastIndex)
                    curEle.show()
                    lastEle.hide()
                }
                lastIndex = curIndex
            })
        })
    }
    // 展开请假学生
    let leavePanel = () => {
        $("#showLeave").on("click", function () {
            let status = $(this).attr("show-status")
            if (status === "off") {
                $(this).find(".arrow-toggle img").addClass("rotate")
                $(this).next(".qingjia-detail").find(".qj-list").show("fast")
                $(this).attr("show-status", "open")
            } else {
                $(this).find(".arrow-toggle img").removeClass("rotate")
                $(this).next(".qingjia-detail").find(".qj-list").hide("fast")
                $(this).attr("show-status", "off")
            }
        })
    }

    // 展开体温异常学生
    let fashaoPanel = () => {
        $("#showFashao").on("click", function () {
            let status = $(this).attr("show-status")
            if (status === "off") {
                $(this).find(".arrow-toggle img").addClass("rotate")
                $(this).next(".yichang-list").show("fast")
                $(this).attr("show-status", "open")
            } else {
                $(this).find(".arrow-toggle img").removeClass("rotate")
                $(this).next(".yichang-list").hide("fast")
                $(this).attr("show-status", "off")
            }
        })
    }

    root.fashaoPanel = fashaoPanel
    root.leavePanel = leavePanel
    root.tagToggle = tagToggle

}(window.$, window.cwjMob || (window.cwjMob = {})))