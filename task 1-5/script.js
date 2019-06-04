function polygone(ctx, poly, fill) {
    fill = fill || false
    ctx.beginPath();
    ctx.moveTo(poly[0].x, poly[0].y);
    for (i = 1; i < poly.length; i++) {
        ctx.lineTo(poly[i].x, poly[i].y);
    }

    ctx.closePath();
    if (fill) {
        ctx.fill();

    } else {
        ctx.stroke();

    }
}

function polygones() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    poly = [{
        x: 100,
        y: 100
    }, {
        x: 200,
        y: 100
    }, {
        x: 100,
        y: 200
    }, {
        x: 100,
        y: 200
    }];
    center = {
        x: poly[1].x - poly[0].x,
        y: poly[2].y - poly[1].y
    };

    ctx.rect(50, 20, 250, 150);
    ctx.clip();
    for (j = 0; j < 20; j++) {
        console.log(j)
        poly = poly.map(function(x) {
            return rotP(x, center, 20);
        })
        polygone(ctx, poly)
    }

}

function drawLine(line) {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(line.a.x, line.a.y);
        ctx.lineTo(line.b.x, line.b.y);
        ctx.stroke();
    }
}

function rotP(p, p2, angle) {

    rad = angle * (Math.PI / 180);
    pr = {
        x: p.x - p2.x,
        y: p.y - p2.y
    };
    x = pr.x;
    y = pr.y;
    pr.x = x * Math.cos(rad) - y * Math.sin(rad) + p2.x;
    pr.y = x * Math.sin(rad) + y * Math.cos(rad) + p2.y;

    return pr;
}

function rot(l, p, angle) {
    ll = Object.assign({}, l);
    ll.a = rotP(l.a, p, angle);
    ll.b = rotP(l.b, p, angle);
    return ll;
}

function scalePoly(poly, factor) {
    var ox = poly[0].x
    var oy = poly[0].y

    newC = poly.map(function(x) {
        return {
            x: (x.x - ox) * factor + ox,
            y: (x.y - oy) * factor + oy
        };
    })

    console.log(newC)
    return newC
}




function normLeft(poly) {
    return [poly[1], poly[2], poly[3], poly[0]];
}

function normRight(poly) {
    return [poly[2], poly[3], poly[0], poly[1]];
}

function pythagorasStep(ctx, poly, order, vect) {
    if (order == 0) {
        polygone(ctx, poly)
        return
    }

    polygone(ctx, poly)

    var l = scalePoly(poly, 1.414 / 2)
    var r = scalePoly(poly, 1.414 / 2)

    l = l.map(function(x) {
        return rotP({
            x: x.x,
            y: x.y
        }, poly[0], -135);
    })
    l = normLeft(l)


    r = r.map(function(x) {
        return {
            x: x.x + poly[1].x - poly[0].x,
            y: x.y + poly[1].y - poly[0].y
        }
    })
    r = r.map(function(x) {
        return rotP({
            x: x.x,
            y: x.y
        }, poly[1], -135);
    })
    r = normRight(r)

    pythagorasStep(ctx, l, order - 1)
    pythagorasStep(ctx, r, order - 1)
}

function pythagorasTree(order) {


    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var poly = [{
        x: 1100,
        y: 1100
    }, {
        x: 1200,
        y: 1100
    }, {
        x: 1200,
        y: 1200
    }, {
        x: 1100,
        y: 1200
    }];


    pythagorasStep(ctx, poly, 7)

}


function randPolygone(n) {

    var p = []
    var p0 = {
        x: 1000,
        y: 300
    }
    var r = 100;
    var angle = 0

    a0 = 0.75 * (2 * Math.PI / n)
    a1 = 0.40 * (2 * Math.PI / n)

    for (a = 0.0; a < 2.0 * Math.PI;) {
        x = p0.x + (r * Math.cos(a));
        y = p0.y + (r * Math.sin(a));
        a += a0 + (a1 * Math.random());
        p.push({
            x: x,
            y: y
        })
    }
    return p
}

function inside(point, vs) {
    var x = point.x,
        y = point.y;

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x,
            yi = vs[i].y;
        var xj = vs[j].x,
            yj = vs[j].y;

        var intersect = ((yi > y) != (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};



function intersects(l1, l2) {
    var a = l1[0].x,
        b = l1[0].y
    var c = l1[1].x,
        d = l1[1].y
    var p = l2[0].x,
        q = l2[0].y
    var r = l2[1].x,
        s = l2[1].y

    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};

function fullInside(l, poly) {
    var np = poly.slice();
    np.push(poly[0])
    var line
    for (var len = 0;; len++) {
        var line = np.slice(len, len + 2)
        if (line.length != 2) break
        if (intersects(l, line)) {
            return false
        }
    }

    var point = {
        x: (l[0].x + l[1].x) / 2,
        y: (l[0].y + l[1].y) / 2
    }

    return inside(point, poly)
}

function midpoint(p) {
    return {
        x: p.x / 2,
        y: p.y / 2
    };
}

function findEar(poly) {
    var np = poly.slice();
    np.push(poly[0])
    np.push(poly[1])
    for (var len = 0; np.length > 3; len++) {
        var triang = np.slice(len, len + 3)
        if (triang.length != 3) break

        if (fullInside([triang[0], triang[2]], poly)) {
            return len
        }
    }
}

function getTriangle(i, poly) {
    var np = poly.slice();
    np.push(poly[0])
    np.push(poly[1])

    return np.slice(i, i + 3)
}

function triangulate(ctx, poly) {
    var np = poly.slice();
    var colors = ['#993333', '#d28345', '#f4bf75', '#90a959', '#75b6ab', '#6b9fb5', '#aa769f', '#875636']
    var pFS = ctx.fillStyle
    for (var i = 0; np.length; i++) {
        var earPos = findEar(np)
        console.log(earPos)
        var triangle = getTriangle(earPos, np)
        ctx.fillStyle = colors[i % colors.length]
        if (triangle != false) {
            console.log(triangle)
            polygone(ctx, triangle, true)
        } else break

        if (earPos == np.length) {
            np = np.slice(1)
            console.log('here1')
        } else if (earPos == np.length - 1) {
            np = np.slice(0, np.length - 1)
            console.log('here2')
        } else {
            np.splice(earPos + 1, 1)
            console.log('here3')
        }

        console.log(np)
    }

    ctx.fillStyle = pFS

}

window.onload = function() {


     /*
     // 1
     angle = 2*(Math.PI/180);
     
     line = {
        a:{
            x:10, 
            y: 50
        },
        b:{
            x:50, 
            y: 90
        }
    };
     ll = rot(line, {x:50, y: 40}, -50);
    */

    /*
     // 2
     polygones();
    */

    /*
     // 3
     pythagorasTree()
    */


    /*
     // 4
     var canvas = document.getElementById('canvas');
     var ctx = canvas.getContext('2d');
     
     polygone(ctx, randPolygone(10))
    */

/*
    // 5
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var poly = [{
            x: 1000,
            y: 1000
        },
        {
            x: 1400,
            y: 1000
        },
        {
            x: 1400,
            y: 700
        },
        {
            x: 1800,
            y: 700
        },
        {
            x: 1800,
            y: 900
        },
        {
            x: 1500,
            y: 900
        },
        {
            x: 1500,
            y: 1300
        },
        {
            x: 1300,
            y: 1300
        },
        {
            x: 1400,
            y: 1200
        }
    ]
    triangulate(ctx, poly)
*/

}