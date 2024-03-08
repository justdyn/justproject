const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imagesrc: './assets/img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imagesrc: './assets/img/shop.png',
    scale: 2.75,
    frame_max: 6
})

const player = new Fighter({
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
    },
    imagesrc: './assets/img/samuraiMack/Idle.png',
    frame_max: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imagesrc: './assets/img/samuraiMack/Idle.png',
            frame_max: 8
        },
        run: {
            imagesrc: './assets/img/samuraiMack/Run.png',
            frame_max: 8
        },
        jump: {
            imagesrc: './assets/img/samuraiMack/Jump.png',
            frame_max: 2
        },
        fall: {
            imagesrc: './assets/img/samuraiMack/Fall.png',
            frame_max: 2
        },
        attack1: {
            imagesrc: './assets/img/samuraiMack/Attack1.png',
            frame_max: 6
        },
        takehit: {
            imagesrc: './assets/img/samuraiMack/Take Hit - white silhouette.png',
            frame_max: 4
        },
        death: {
            imagesrc: './assets/img/samuraiMack/Death.png',
            frame_max: 6
        }

    },
    attackbox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})



const enemy = new Fighter({
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
    },
    imagesrc: './assets/img/kenji/Idle.png',
    frame_max: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imagesrc: './assets/img/kenji/Idle.png',
            frame_max: 4
        },
        run: {
            imagesrc: './assets/img/kenji/Run.png',
            frame_max: 8
        },
        jump: {
            imagesrc: './assets/img/kenji/Jump.png',
            frame_max: 2
        },
        fall: {
            imagesrc: './assets/img/kenji/Fall.png',
            frame_max: 2
        },
        attack1: {
            imagesrc: './assets/img/kenji/Attack1.png',
            frame_max: 4
        },
        takehit: {
            imagesrc: './assets/img/kenji/Take hit.png',
            frame_max: 3
        },
        death: {
            imagesrc: './assets/img/kenji/Death.png',
            frame_max: 7
        }

    },
    attackbox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
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

decrease_timer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -5
        player.switch_sprite('run')
    } else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5
        player.switch_sprite('run')
    } else {
        player.switch_sprite('idle')
    }

    // player jumping
    if (player.velocity.y < 0){
        player.switch_sprite('jump')
    } else if (player.velocity.y > 0){
        player.switch_sprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switch_sprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switch_sprite('run')
    } else {
        enemy.switch_sprite('idle')
    }

    // enemy jumping
    if (enemy.velocity.y < 0){
        enemy.switch_sprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switch_sprite('fall')
    }

    //detect a collision and enemy get hit
    if (
        rectangular_collision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking &&  player.frame_current === 4
    ){
        enemy.takehit()
        player.isAttacking = false;
        document.querySelector('.enemy-health2').style.width = enemy.health + '%';
    }

    // player miss
    if (player.isAttacking && player.frame_current === 4){
        player.isAttacking = false;
    }
    
    // player get hit
    if (
        rectangular_collision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.frame_current === 2
    ){
        player.takehit()
        enemy.isAttacking = false;
        document.querySelector('.player-health2').style.width = player.health + '%';
    }

    if (enemy.isAttacking && enemy.frame_current === 2){
        enemy.isAttacking = false;
    }

    //end game based on health
    if (enemy.health <= 0 ||  player.health <= 0) {
        determine_winner({player, enemy, timer_id});
    }
}

animate();

window.addEventListener('keydown', (event) => {
    if (!player.dead){
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
        }
    }
    
    if (!enemy.dead) {
        switch (event.key) {
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