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