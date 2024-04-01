class Sprite {
    constructor({position, imagesrc, scale = 1, frame_max = 1, offset = {x:0, y:0}}) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imagesrc;
        this.scale = scale;
        this.frame_max = frame_max;
        this.frame_current = 0;
        this.frame_elapsed = 0;
        this.frame_hold = 5;
        this.offset = offset;
    }

    draw(){
        c.drawImage(
            this.image,
            this.frame_current * (this.image.width / this.frame_max),
            0,
            this.image.width / this.frame_max,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.frame_max) * this.scale, 
            this.image.height * this.scale);
    }

    animate_frame(){
        this.frame_elapsed++

        if (this.frame_elapsed % this.frame_hold === 0){
            if (this.frame_current < this.frame_max - 1){
                this.frame_current++;
            } else {
                this.frame_current = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animate_frame();
    }
}

class Fighter extends Sprite {
    constructor({
        position, 
        velocity, 
        color = "red",  
        imagesrc, 
        scale = 1, 
        frame_max = 1,
        offset = {x:0, y:0},
        sprites,
        attackbox = {offset: {}, width: undefined, height: undefined}
    }) {
        super({
            position,
            imagesrc,
            scale,
            frame_max,
            offset
        })
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
            offset: attackbox.offset,
            width: attackbox.width,
            height: attackbox.height
        }

        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.frame_current = 0;
        this.frame_elapsed = 0;
        this.frame_hold = 5;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imagesrc
        }
    }

    update() {
        this.draw()

        if (!this.dead)
        this.animate_frame()

        //attackboxes
        this.attackbox.position.x = this.position.x + this.attackbox.offset.x
        this.attackbox.position.y = this.position.y + this.attackbox.offset.y

        // c.fillRect(this.attackbox.position.x, this.attackbox.position.y, this.attackbox.width, this.attackbox.height)
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        

        //gravity
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330
        } else this.velocity.y += gravity
    }

    attack(){
        this.switch_sprite('attack1');
        this.isAttacking = true;
        
    }

    takehit(){
        this.health -= 20

        if (this.health <= 0){
            this.switch_sprite('death')
        } else this.switch_sprite('takehit')
    }

    switch_sprite(sprite){
        if (this.image === this.sprites.death.image) {
            if (this.frame_current === this.sprites.death.frame_max - 1)
                this.dead = true;
            return
        }

        // override all other animation with the attack animation
        if (this.image === this.sprites.attack1.image && this.frame_current < this.sprites.attack1.frame_max - 1)   
            return

        //override whem fighter get hit
        if (this.image === this.sprites.takehit.image && this.frame_current < this.sprites.takehit.frame_max - 1)
            return

        switch (sprite){
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.frame_max = this.sprites.idle.frame_max
                    this.frame_current = 0
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.frame_max = this.sprites.run.frame_max
                    this.frame_current = 0
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.frame_max = this.sprites.jump.frame_max
                    this.frame_current = 0
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.frame_max = this.sprites.fall.frame_max
                    this.frame_current = 0
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.frame_max = this.sprites.attack1.frame_max
                    this.frame_current = 0
                }
                break;
            case 'takehit':
                if (this.image !== this.sprites.takehit.image){
                    this.image = this.sprites.takehit.image
                    this.frame_max = this.sprites.takehit.frame_max
                    this.frame_current = 0
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.frame_max = this.sprites.death.frame_max
                    this.frame_current = 0
                }
                break;
        }
    }
}