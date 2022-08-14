//获取DOM
const table = document.querySelector('table')
const food = document.querySelector('.food')
const game = document.querySelector('.game')
const end = document.querySelector('.end')
const sc = document.querySelector('.score')
const btn = document.querySelector('button')
let snake =document.querySelectorAll('.snake')
setInterval(()=>{
    snake = document.querySelectorAll('.snake')
},100)


let score = -100        //得分

//节流函数
function throttle(fn,time=100){
    let timer
    return function(...args){
        if(timer == null){
            const ret = fn.apply(this,args)
            timer = setTimeout(()=>{timer = null},time)
            return ret
        }
    }
}


//绘制地图
const trNum = table.offsetHeight/20
const tdNum = table.offsetWidth/20
const tr = []
const td = []
for(i=0;i<trNum;i++){
    tr[i] = document.createElement('tr')
    table.appendChild(tr[i])
    for(j=0;j<tdNum;j++){
        td[j] = document.createElement('td')
        tr[i].appendChild(td[j])
    }
}


//初始化蛇
function newSnake(){
    snake[0].style.backgroundColor = 'yellow'
    snake[0].style.top = `${Math.floor(Math.random()*30)*20}px`
    snake[0].style.left = `${Math.floor(Math.random()*40)*20}px`
    for(i=1;i<snake.length;i++){
        game.removeChild(snake[i])
    }
}
newSnake()


//刷新食物
function newFood(){
    //让食物不会刷新到蛇身上
    food.style.top = `${Math.floor(Math.random()*30)*20}px`
    food.style.left = `${Math.floor(Math.random()*40)*20}px`
    score += 100
}
//初始化食物
newFood()


//控制蛇的移动
let timer
let timerOut
let m
function fn(value){
    switch (value) {
        case 38:
            clearTimeout(m)
            snake[0].style.top = parseInt(snake[0].style.top)-20+'px'
            m = setTimeout(()=>{
                snake[0].style.top = parseInt(snake[0].style.top)-20+'px'
                // moveSnakeBody()
            },600)
            break;
        case 40:
            clearTimeout(m)
            snake[0].style.top = parseInt(snake[0].style.top)+20+'px'
            m = setTimeout(()=>{
                snake[0].style.top = parseInt(snake[0].style.top)+20+'px'
                // moveSnakeBody()
            },600)
            break;
        case 37:
            clearTimeout(m)
            snake[0].style.left = parseInt(snake[0].style.left)-20+'px'
            m = setTimeout(()=>{
                snake[0].style.left = parseInt(snake[0].style.left)-20+'px'
                // moveSnakeBody()
            },600)
            break;
        case 39:
            clearTimeout(m)
            snake[0].style.left = parseInt(snake[0].style.left)+20+'px'
            m = setTimeout(()=>{
                snake[0].style.left = parseInt(snake[0].style.left)+20+'px'
                // moveSnakeBody()
            },600)
            break;
    }
    // moveSnakeBody()
}
const move = throttle(fn)
document.onkeydown = function(e){
    switch (e.keyCode) {
        case 38:
            clearTimeout(timerOut)
            clearInterval(timer)
            timer = setInterval(()=>{
                timerOut = setTimeout(()=>{ 
                    snake[0].style.top = parseInt(snake[0].style.top)-20+'px' 
                    // moveSnakeBody()
                },600)
            },600)
            break;
        case 40:
            clearTimeout(timerOut)
            clearInterval(timer)
            timer = setInterval(()=>{
                timerOut = setTimeout(()=>{ 
                    snake[0].style.top = parseInt(snake[0].style.top)+20+'px' 
                    // moveSnakeBody()
                },600)
            },600)
            break;
        case 37:
            clearTimeout(timerOut)
            clearInterval(timer)
            timer = setInterval(()=>{
                timerOut = setTimeout(()=>{ 
                    snake[0].style.left = parseInt(snake[0].style.left)-20+'px' 
                    // moveSnakeBody()
                },600)
            },600)
            break;
        case 39:
            clearTimeout(timerOut)
            clearInterval(timer)
            timer = setInterval(()=>{
                timerOut = setTimeout(()=>{ 
                    snake[0].style.left = parseInt(snake[0].style.left)+20+'px' 
                    // moveSnakeBody()
                },600)
            },600)
            break;
    }
    move(e.keyCode)
}


//获取蛇头和食物的位置
let headX,headY,foodX,foodY
let snakeBody = []


//获取蛇头移动轨迹及撞墙判定及获取蛇头和食物的位置
const movePath = [
    {
        X:snake[0].style.left,
        Y:snake[0].style.top
    }
]
setInterval(()=>{
    //获取蛇头和食物的位置
    headX = snake[0].style.left
    headY = snake[0].style.top
    foodX = food.style.left
    foodY = food.style.top
    if(headX == foodX && headY == foodY){
        newFood()       //刷新食物
        //增加蛇的长度
        snakeBody.push(document.createElement('div'))
        game.appendChild(snakeBody[snakeBody.length-1])
        snakeBody[snakeBody.length-1].style.display = 'none'
        snakeBody[snakeBody.length-1].className = 'snake'
    }
    //记录轨迹
    if(headX != movePath[movePath.length-1].X || headY != movePath[movePath.length-1].Y){
        movePath.push(
            {
                X:headX,
                Y:headY
            }
        )
    }
    //撞墙判定
    if(parseInt(headX)<0 || parseInt(headX)>=800 || parseInt(headY)<0 || parseInt(headY)>=600){
        startAgain()
    }
    //咬到蛇身判定
    for(i=movePath.length-2;i>=movePath.length-snake.length;i--){
        if((headX == movePath[i].X && headY == movePath[i].Y) || (headX == movePath[movePath.length-3].X && headY == movePath[movePath.length-3].Y)){
            startAgain()
        }
    }
},50)

let timer2 = setInterval(moveSnakeBody,50)

//蛇身随蛇头移动
function moveSnakeBody(){
    for(i=1;i<snake.length;i++){
        snake[i].style.left = movePath[movePath.length-i-1].X
        snake[i].style.top = movePath[movePath.length-i-1].Y
    }
    snake[snake.length-1].style.display = 'flex'
}


//重新开始
let scoreArr = []
function startAgain(){
    scoreArr.push(score)
    sc.innerHTML = scoreArr[0]
    newFood()
    newSnake()
    clearInterval(timer2)
    end.style.display = 'flex'
    food.style.display = 'none'
    snake[0].style.display = 'none'
}
btn.onclick = ()=>{
    scoreArr = []
    clearInterval(timer)
    end.style.display = 'none'
    food.style.display = 'flex'
    snake[0].style.display = 'flex'
    score = -100
    newFood()
    timer2 = setInterval(moveSnakeBody,50)
}

