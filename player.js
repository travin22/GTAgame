const moveUp = ["ArrowUp", "KeyW"];
const moveDown = ["ArrowDown", "KeyS"];
const moveLeft = ["ArrowLeft", "KeyA"];
const moveRight = ["ArrowRight", "KeyD"];
const allMove = [...moveUp, ...moveDown, ...moveLeft, ...moveRight];

export class Player {
    constructor(x, y, context, movementLimits) {
        this.velocity = 3;
        this.radius = 15;
        this.x = x;
        this.y = y;
        this.context = context;
        this.cursorPosition = {
            x: 0,
            y: 0
        }
        this.movementLimits = {
            minX: movementLimits.minX + this.radius,
            maxX: movementLimits.maxX - this.radius,
            minY: movementLimits.minY + this.radius,
            maxY: movementLimits.maxY - this.radius,
          };

        document.addEventListener('mousemove', event => {
            this.cursorPosition.x = event.clientX;
            this.cursorPosition.y = event.clientY;
        })

        this.keyMap = new Map();
        document.addEventListener('keydown', event => this.keyMap.set(event.code, true));
        document.addEventListener('keyup', event => this.keyMap.delete(event.code));

        this.image = new Image();
        this.image.src = "./img/player.png";
        this.imageWidth = 50;
        this.imageHeight = 60;
        this.isMoving = false;
        this.imageTick = 0;
    }

    drawImg() {
        const imageTickLimit = 18;
        let subX = 0;
        if (!this.isMoving) {
            subX = 0;
            this.imageTick = 0;
        } else {
            subX = this.imageTick > imageTickLimit ? this.imageWidth * 2 : this.imageWidth;
            this.imageTick++;
        }
        if (this.imageTick > imageTickLimit*2) {
            this.imageTick = 0;
        }

        this.context.drawImage(
            this.image,
            subX,
            0,
            this.imageWidth,
            this.imageHeight,
            this.x - this.imageWidth/2,
            this.y - this.imageHeight/2,
            this.imageWidth,
            this.imageHeight
        );
    }

    draw() {
        this.context.save();
        let angle = Math.atan2(this.cursorPosition.y - this.y, this.cursorPosition.x - this.x);
        this.context.translate(this.x, this.y);
        this.context.rotate(angle + Math.PI/2);
        this.context.translate(-this.x, -this.y);
        this.drawImg();
        this.context.restore();
    }

    update() {
        this.draw();
        this.isMoving = this.shouldMove(allMove);
        this.updatePosition();
        this.checkPosition();
    }

    updatePosition() {
        if (this.shouldMove(moveUp)) this.y -= this.velocity;
        if (this.shouldMove(moveDown)) this.y += this.velocity;
        if (this.shouldMove(moveLeft)) this.x -= this.velocity;
        if (this.shouldMove(moveRight)) this.x += this.velocity;
    }

    checkPosition() { 
        if (this.y < this.movementLimits.minY) this.y = this.movementLimits.minY;
        if (this.y > this.movementLimits.maxY) this.y = this.movementLimits.maxY;
        if (this.x < this.movementLimits.minX) this.x = this.movementLimits.minX;
        if (this.x > this.movementLimits.maxX) this.x = this.movementLimits.maxX;
    }

    shouldMove(keys) {
        return keys.some(key => this.keyMap.get(key));
    }
}