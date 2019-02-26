/**
 *
 * @authors Simba
 * @version 1.0
 */

var oBox = document.getElementById("box");
init();
function init() {
    var oHeader = document.createElement("h2");
    oHeader.innerHTML = "飞机大战 v1.0";
    var level = ["初级难度", "中等难度", "高级难度", "噩梦难度"];
    var oUl = document.createElement("ul");
    oUl.className = "level";
    for (var i = 0; i < level.length; i++) {
        var oLi = document.createElement("li");
        oLi.innerHTML = level[i];
        (function (index) {
            oLi.onclick = function (e) {
                e = e || window.event;
                var mouseXY = {
                    x: e.clientX,
                    y: e.clientY
                };
                //alert(i);
                gameStart(index, mouseXY);
            }
        })(i);
        oUl.appendChild(oLi);
    }
    oBox.appendChild(oHeader);
    oBox.appendChild(oUl);
}

function gameStart(index, offset) {
    oBox.innerHTML = "";  //1、清空战场
    //2、产生我方战机
    score();
    var oPlane = myPlane(index, offset);
    enemyPlane(index, oPlane);
}
function score() {
    var score = document.createElement("div");
    score.id = "score";
    score.style.width = "50px";
    score.style.height = "30px";
    score.style.position = "absolute";
    oBox.appendChild(score);
    score.innerHTML = "score:0";
}
function myPlane(index, offset) {
    var oPlane = new Image();
    oPlane.src = "img/plane.png";
    oPlane.width = 60;
    oPlane.height = 36;
    oPlane.className = "plane";
    oBox.appendChild(oPlane);
    var _x = oBox.offsetLeft + 10 + oPlane.clientWidth / 2,
        _y = oBox.offsetTop + 10 + oPlane.clientHeight / 2;
    oPlane.style.left = offset.x - _x + "px";
    oPlane.style.top = offset.y - _y + "px";
    var leftMin = -oPlane.width / 2,
        leftMax = oBox.clientWidth - oPlane.width / 2;
    var topMin = 0,
        topMax = oBox.clientHeight - oPlane.height;
    document.onmousemove = function (e) {
        e = e || window.event;
        var _left = e.clientX - _x,
            _top = e.clientY - _y;
        _left = Math.min(leftMax, _left);
        _left = Math.max(leftMin, _left);
        _top = Math.min(topMax, _top);
        _top = Math.max(topMin, _top);
        oPlane.style.left = _left + "px";
        oPlane.style.top = _top + "px";
    }
    var spd;
    switch (index) {
        case 0: spd = 100; break;
        case 1: spd = 80; break;
        case 2: spd = 50; break;
        case 3: spd = 20; break;
    }
    var bulletTimer = setInterval(function () {
        var oBullet = new Image();
        oBullet.src = "img/bullet.png";
        oBullet.width = 6;
        oBullet.height = 22;
        oBullet.className = "bullet";
        oBullet.style.left = oPlane.offsetLeft + oPlane.width / 2 - oBullet.width / 2 + "px";
        oBullet.style.top = oPlane.offsetTop - oBullet.height + "px";
        oBox.appendChild(oBullet);
    }, spd);
    var bulletMove = setInterval(function () {
        var oBullet = document.querySelectorAll(".bullet");
        //console.log(oBullet.length);
        /*for(var i=oBullet.length;i>=0;i--){

        }*/
        for (var i = oBullet.length - 1; i >= 0; i--) {
            oBullet[i].style.top = oBullet[i].offsetTop - 6 + "px";
            if (oBullet[i].offsetTop <= -oBullet[i].height) {
                oBox.removeChild(oBullet[i]);
            }
        }
    }, 30);
    return oPlane;
}
function enemyPlane(index, myPlane) {
    var spd = 1000;
    var count = 0;
    switch (index) {
        case 0: spd = 1000; break;
        case 1: spd = 500; break;
        case 2: spd = 300; break;
        case 3: spd = 100; break;
    }
    var enemyTimer = setInterval(function () {
        var oEnemy = new Image();
        oEnemy.src = "img/enemy.png";
        oEnemy.width = 23;
        oEnemy.height = 30;
        oEnemy.speed = Math.random() * 2 + 1;
        oEnemy.className = "enemy";
        oEnemy.style.top = -oEnemy.height + "px";
        oEnemy.style.left = Math.random() * (oBox.clientWidth - oEnemy.width) + "px";
        oBox.appendChild(oEnemy);
    }, spd);
    var enemyMove = setInterval(function () {
        var oEnemies = document.querySelectorAll(".enemy");
        var oBullet = document.querySelectorAll(".bullet");
        for (var i = oEnemies.length - 1; i >= 0; i--) {
            oEnemies[i].style.top = oEnemies[i].offsetTop + oEnemies[i].speed + "px";
            //与子弹的碰撞
            for (var j = oBullet.length - 1; j >= 0; j--) {
                if (crash(oEnemies[i], oBullet[j])) {
                    //console.log("相撞了！");
                    boom(oEnemies[i], true);
                    oEnemies[i].parentNode ? oBox.removeChild(oEnemies[i]) : '';
                    oBullet[j].parentNode ? oBox.removeChild(oBullet[j]) : '';
                    //添加积分
                    count++;
                    var score = document.getElementById("score");
                    score.innerHTML = "score:" + count;

                }
            }
            //与我军的碰撞
            if (crash(oEnemies[i], myPlane)) {
                boom(oEnemies[i], true);
                boom(myPlane, false);
                gameover();
            }
            if (oEnemies[i].offsetTop >= oBox.clientHeight) {
                oBox.removeChild(oEnemies[i]);
            }
        }
    }, 20);
}
function gameover() {
    alert("游戏结束！");
    window.location = "plane.html";
}
function crash(objA, objB) {
    var objB_Bottom = objB.offsetTop + objB.height,
        objB_Right = objB.offsetLeft + objB.width,
        objB_Top = objB.offsetTop,
        objB_Left = objB.offsetLeft;

    var objA_Top = objA.offsetTop,
        objA_Left = objA.offsetLeft,
        objA_Bottom = objA.offsetTop + objA.height,
        objA_Right = objA.offsetLeft + objA.width;

    if (objB_Bottom < objA_Top || objB_Right < objA_Left || objB_Top > objA_Bottom || objB_Left > objA_Right) {
        return false;
    }
    else {
        return true;
    }
}
function boom(obj, bool) {
    var oFirework = new Image();
    console.log(bool);
    oFirework.src = bool ? "img/boom.png" : "img/boom2.png";
    oFirework.width = bool ? 23 : 60;
    oFirework.height = bool ? 30 : 36;
    oFirework.className = "fire";
    oFirework.style.left = obj.offsetLeft + "px";
    oFirework.style.top = obj.offsetTop + "px";
    oBox.appendChild(oFirework);
    (function (obj) {
        setTimeout(function () {
            obj.parentNode ? oBox.removeChild(obj) : '';
        }, bool ? 500 : 1000);
    })(oFirework);
}