(function ($, root) {
  // 饼图
  let renderBing = (data, bingtuId) => {

    var chart = new F2.Chart({
      id: bingtuId,
      pixelRatio: window.devicePixelRatio
    });

    chart.source(data);
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.4,
      radius: 0.85
    });
    chart.axis(false);
    chart.legend(false);
    chart.tooltip(false);
    chart.interval().position('namekey*ratio').color('memo').adjust('stack');
    chart.render();

    // >>>>>>>>>>>>>>>>>>>>>>>>> labeling <<<<<<<<<<<<<<<<<<<<<<<<<<

    var ANCHOR_OFFSET = 5;
    var OFFSET = 15;
    var APPEND_OFFSET = 30;
    var LINEHEIGHT = 32;
    var coord = chart.get('coord'); // 获取坐标系对象
    var center = coord.center; // 极坐标圆心坐标
    var r = coord.circleRadius; // 极坐标半径
    var canvas = chart.get('canvas');
    var canvasWidth = chart.get('width');
    var canvasHeight = chart.get('height');
    var labelGroup = canvas.addGroup();
    var labels = [];

    function getEndPoint(center, angle, r) {
      return {
        x: center.x + r * Math.cos(angle),
        y: center.y + r * Math.sin(angle)
      };
    }

    // 绘制文本以及连接线
    function drawLabel(label) {
      var _data = label._data,
        _anchor = label._anchor,
        _router = label._router,
        fill = label.fill,
        y = label.y;

      var labelAttrs = {
        y: y,
        fontSize: 16, // 字体大小
        fill: '#808080',
        text: _data.memo + '\n' + _data.amount.toFixed(0) + '人',
        textBaseline: 'middle'
      };
      var lastPoint = {
        y: y
      };

      if (label._side === 'left') {
        // 具体文本的位置
        lastPoint.x = APPEND_OFFSET;
        labelAttrs.x = APPEND_OFFSET; // 左侧文本左对齐并贴着画布最左侧边缘
        labelAttrs.textAlign = 'left';
      } else {
        lastPoint.x = canvasWidth - APPEND_OFFSET;
        labelAttrs.x = canvasWidth - APPEND_OFFSET; // 右侧文本右对齐并贴着画布最右侧边缘
        labelAttrs.textAlign = 'right';
      }

      // 绘制文本
      var text = labelGroup.addShape('Text', {
        attrs: labelAttrs
      });
      labels.push(text);

      // 绘制锚点
      labelGroup.addShape('Circle', {
        attrs: {
          x: _anchor.x,
          y: _anchor.y,
          r: 2,
          fill: fill
        }
      });
      // 绘制连接线
      var points = void 0;
      if (_router.y !== y) {
        // 文本位置做过调整
        points = [_anchor, {
          x: _router.x,
          y: y
        }, lastPoint];
      } else {
        points = [_anchor, _router, lastPoint];
      }

      labelGroup.addShape('Polyline', {
        attrs: {
          points: points,
          lineWidth: 1,
          stroke: fill
        }
      });
    }

    function antiCollision(half, isRight) {
      var startY = center.y - r - OFFSET - LINEHEIGHT;
      var overlapping = true;
      var totalH = canvasHeight;
      var i = void 0;

      var maxY = 0;
      var minY = Number.MIN_VALUE;
      var boxes = half.map(function (label) {
        var labelY = label.y;
        if (labelY > maxY) {
          maxY = labelY;
        }
        if (labelY < minY) {
          minY = labelY;
        }
        return {
          size: LINEHEIGHT,
          targets: [labelY - startY]
        };
      });
      if (maxY - startY > totalH) {
        totalH = maxY - startY;
      }

      while (overlapping) {
        boxes.forEach(function (box) {
          var target = (Math.min.apply(minY, box.targets) + Math.max.apply(minY, box.targets)) / 2;
          box.pos = Math.min(Math.max(minY, target - box.size / 2), totalH - box.size);
        });

        // detect overlapping and join boxes
        overlapping = false;
        i = boxes.length;
        while (i--) {
          if (i > 0) {
            var previousBox = boxes[i - 1];
            var box = boxes[i];
            if (previousBox.pos + previousBox.size > box.pos) {
              // overlapping
              previousBox.size += box.size;
              previousBox.targets = previousBox.targets.concat(box.targets);

              // overflow, shift up
              if (previousBox.pos + previousBox.size > totalH) {
                previousBox.pos = totalH - previousBox.size;
              }
              boxes.splice(i, 1); // removing box
              overlapping = true;
            }
          }
        }
      }

      // step 4: normalize y and adjust x
      i = 0;
      boxes.forEach(function (b) {
        var posInCompositeBox = startY; // middle of the label
        b.targets.forEach(function () {
          half[i].y = b.pos + posInCompositeBox + LINEHEIGHT / 2;
          posInCompositeBox += LINEHEIGHT;
          i++;
        });
      });

      // (x - cx)^2 + (y - cy)^2 = totalR^2
      half.forEach(function (label) {
        var rPow2 = label.r * label.r;
        var dyPow2 = Math.pow(Math.abs(label.y - center.y), 2);
        if (rPow2 < dyPow2) {
          label.x = center.x;
        } else {
          var dx = Math.sqrt(rPow2 - dyPow2);
          if (!isRight) {
            // left
            label.x = center.x - dx;
          } else {
            // right
            label.x = center.x + dx;
          }
        }
        drawLabel(label);
      });
    }

    function addPieLabel(chart) {
      var halves = [
        [], // left
        [] // right
      ]; // 存储左右 labels
      labelGroup && labelGroup.clear();
      var geom = chart.get('geoms')[0];
      // 获取文本的信息
      var shapes = geom.get('container').get('children');
      shapes.forEach(function (shape) {
        var shapeAttrs = shape.attr();
        var origin = shape.get('origin');
        var startAngle = shapeAttrs.startAngle,
          endAngle = shapeAttrs.endAngle;

        var middleAngle = (startAngle + endAngle) / 2;
        var edgePoint = getEndPoint(center, middleAngle, r + ANCHOR_OFFSET);
        var routerPoint = getEndPoint(center, middleAngle, r + OFFSET);
        var label = {
          _anchor: edgePoint,
          _router: routerPoint,
          _data: origin._origin,
          x: routerPoint.x,
          y: routerPoint.y,
          r: r + OFFSET,
          fill: origin.color // 字体颜色
        };
        // 判断文本的方向
        if (edgePoint.x < center.x) {
          label._side = 'left';
          halves[0].push(label);
        } else {
          label._side = 'right';
          halves[1].push(label);
        }
      });

      var maxCountForOneSide = parseInt(canvasHeight / LINEHEIGHT, 10);

      halves.forEach(function (half, index) {
        // step 2: reduce labels
        if (half.length > maxCountForOneSide) {
          half.sort(function (a, b) {
            return b._percent - a._percent;
          });
          half.splice(maxCountForOneSide, half.length - maxCountForOneSide);
        }

        // step 3: distribute position (x and y)
        half.sort(function (a, b) {
          return a.y - b.y;
        });
        antiCollision(half, index);
        canvas.draw();
      });
    }

    addPieLabel(chart);
  }

  root.renderBing = renderBing
}(window.$, window.cwjMob || (window.cwjMob = {})))