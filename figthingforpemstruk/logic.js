const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = 1423;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
class Sprite {
    constructor({position, velocity, color = "red", offset}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastkey;
        this.attackbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }

        this.color = color;
        this.isAttacking;
        this.health = 100;
    }

    draw(){
        c.fillStyle= this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        if (this.isAttacking){
            //attackbox
            c.fillStyle = 'green';
            c.fillRect(
                this.attackbox.position.x, 
                this.attackbox.position.y, 
                this.attackbox.width, 
                this.attackbox.height)
        }
    }

    update() {
        this.draw()
        this.attackbox.position.x = this.position.x + this.attackbox.offset.x
        this.attackbox.position.y = this.position.y
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else this.velocity.y += gravity
    }

    attack(){
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

const player = new Sprite({
    position : {
        x:0,
        y:0
    },
    velocity: {
        x:0,
        y:10
    },
    offset: {
        x: 0,
        y: 0
    }
})



const enemy = new Sprite({
    position : {
        x:400,
        y:100
    },
    velocity: {
        x:0,
        y:0
    },

    color: "blue",
    offset: {
        x: -50,
        y: 0
    }
})



console.log(player);

const keys = {
    a: {
        pressed:false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangular_collision({rectangle1, rectangle2}){
    return(
        rectangle1.attackbox.position.x + rectangle1.attackbox.width >= rectangle2.position.x && rectangle1.attackbox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackbox.position.y + rectangle1.attackbox.height >= rectangle2.position.y && rectangle1.attackbox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determine_winner({player, enemy, timer_id}){
    clearTimeout(timer_id);
    document.querySelector('.displaytext').style.display = 'flex';
    if (player.health === enemy.health){
        document.querySelector('.displaytext').innerHTML = 'Tie!!';
    } else if (player.health > enemy.health) {
        document.querySelector('.displaytext').innerHTML = 'Player 1 Wins';
    } else if (player.health < enemy.health) {
        document.querySelector('.displaytext').innerHTML = 'Player 2 Wins';
    }
}

let timer = 60;
let timer_id;
function decrease_timer(){
    if (timer > 0) {
        timer_id = setTimeout(decrease_timer, 1000)
        timer--;
        document.querySelector('.timer').innerHTML = timer;
    }
    if (timer === 0) {
        determine_winner({player, enemy, timer_id});
    }
}

decrease_timer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 5
    }

    if (
        rectangular_collision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    ){
        player.isAttacking = false;
        enemy.health -= 20
        document.querySelector('.enemy-health2').style.width = enemy.health + '%';
    }

    if (
        rectangular_collision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ){
        enemy.isAttacking = false;
        player.health -= 20
        document.querySelector('.player-health2').style.width = player.health + '%';
    }

    //end game based on health
    if (enemy.health <= 0 ||  player.health <= 0) {
        determine_winner({player, enemy, timer_id});
    }
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd' :
            keys.d.pressed = true;
            player.lastkey = 'd';
            break;
        case 'a' :  
            keys.a.pressed = true;
            player.lastkey = 'a';
            break;
        case 'w' :  
            player.velocity.y = -20;
            break;

        case ' ':
            player.attack();
            break;

        case 'ArrowRight' :
            keys.ArrowRight.pressed = true;
            enemy.lastkey = 'ArrowRight';
            break;
        case 'ArrowLeft' :  
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = 'ArrowLeft';
            break;
        case 'ArrowUp' :  
            enemy.velocity.y = -20;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd' :
            keys.d.pressed = false;
            break;
        case 'a' :
            keys.a.pressed = false;
            break;
    }
    
    switch (event.key) {
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false;
            break;
    }
})