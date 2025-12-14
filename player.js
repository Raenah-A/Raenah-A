
let ovenX = 50, ovenY = 56;
let counterX = 200, counterY = 150;
let posX = 100, posY = 100;


const FRAME_W = 40, FRAME_H = 40, SCALE = 1.3;
const FW = FRAME_W * SCALE, FH = FRAME_H * SCALE;

const ACC = 0.25;      
const FRICTION = 0.25;  
const MAX_SPEED = 4.0;  

let velX = 0, velY = 0;
let frame = 0, lastFrameUpdate = 0;
const keys = {};
const dirRow = { w:0, a:1, s:2, d:3 };
let direction = "s";

const player = document.getElementById("player");
const playerImg = player.querySelector("img");
const bg = document.getElementById("bg");

window.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (k in dirRow) keys[k] = true;
});
window.addEventListener("keyup", e => {
    const k = e.key.toLowerCase();
    if (k in dirRow) keys[k] = false;
});

function placeElementOnBG(element, x, y) {
    const b = bg.getBoundingClientRect();
    element.style.left = (b.left + x) + "px";
    element.style.top  = (b.top + y) + "px";
}

function handleInput() {
    if (keys.w) velY -= ACC, direction = "w";
    if (keys.s) velY += ACC, direction = "s";
    if (keys.a) velX -= ACC, direction = "a";
    if (keys.d) velX += ACC, direction = "d";
}

function applyFriction() {
    if (!keys.a && !keys.d) velX = Math.abs(velX)<0.1?0:velX+(velX>0?-FRICTION:FRICTION);
    if (!keys.w && !keys.s) velY = Math.abs(velY)<0.1?0:velY+(velY>0?-FRICTION:FRICTION);
}

function updatePosition() {
    velX = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, velX));
    velY = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, velY));
    posX += velX;
    posY += velY;
    posX = Math.max(0, Math.min(500-FW, posX));
    posY = Math.max(0, Math.min(500-FH, posY));
}

function updatePlayerAnimation(ts) {
    const moving = keys.w||keys.a||keys.s||keys.d;
    if (!moving) {
        playerImg.style.left = "0px";
        playerImg.style.top = -(dirRow[direction]*FRAME_H*SCALE) + "px";
        return;
    }
    if(ts - lastFrameUpdate >= 1000/28) {
        frame = (frame + 1)%6;
        lastFrameUpdate = ts;
    }
    playerImg.style.left = -(frame*FRAME_W*SCALE) + "px";
    playerImg.style.top  = -(dirRow[direction]*FRAME_H*SCALE) + "px";
}

/* ============================================================
   MAIN LOOP
   ============================================================ */
const oven = document.getElementById("oven");
const counter = document.getElementById("counter");

function loop(ts){
    handleInput();
    applyFriction();
    updatePosition();
    updatePlayerAnimation(ts);

    placeElementOnBG(player,posX,posY);
    placeElementOnBG(oven,ovenX,ovenY);
    placeElementOnBG(counter,counterX,counterY);

    if(typeof updateOven!=="undefined") updateOven(ts);

    requestAnimationFrame(loop);
}

loop();