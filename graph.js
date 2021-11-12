const canvas = document.getElementById("graph-canvas");

const GRID_SIZE = 50;
const NODE_RADIUS = 40;
const LINE_CP_OFFSET = 100;

canvas.width = window.screen.width;
canvas.height = window.screen.height;

const ctx = canvas.getContext("2d");

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function line(x1, y1, x2, y2) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawGrid() {
    ctx.strokeStyle = "rgb(235, 235, 235)";
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        line(x, 0, x, canvas.height);
    }

    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
        line(0, y, canvas.width, y);
    }
}

function drawNode(x, y, label) {
    // Draw circle
    ctx.fillStyle = "white";
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    // Draw label
    if (label == null) return;

    ctx.font = "16px Verdana";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y);
}

function drawDirectedLine(x1, y1, x2, y2) {

    // Calculate control point position
    let cx, cy;

    const mx = Math.floor((x1 + x2)/2); // Midpoint X
    const my = Math.floor((y1 + y2)/2); // Midpoint Y

    if (x1 == x2) {
        cx = mx + LINE_CP_OFFSET;
        cy = my;
    } else if (y1 == y2) {
        cx = mx;
        cy = my - LINE_CP_OFFSET;
    } else {
        const direction = x2 > x1 ? 1 : -1
        const a = Math.atan((y2 - y1)/(x2 - x1));
        const s = (y2 - y1)/(x2 - x1);
        cx = mx + direction * LINE_CP_OFFSET * Math.cos(Math.PI/2 - a);
        cy = (-1/s)*(cx - mx) + my;
    }

    // Draw line
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.stroke();
}

drawGrid();
drawNode(100, 100, "s0");

function refresh() {
    clear();
    drawGrid();
}

var dragging = false;
var dragStart;
var dragEnd;

function mouseDragging(x, y) {
    refresh();
    drawDirectedLine(dragStart.x, dragStart.y, x, y);
}

function mouseDragEnd() {

}

canvas.addEventListener("mousedown", mouse => {
    dragStart = {x: mouse.clientX, y: mouse.clientY};
    dragging = true;
})

canvas.addEventListener("mousemove", mouse => {
    if (dragging) {
        mouseDragging(mouse.clientX, mouse.clientY);
    }
})

canvas.addEventListener("mouseup", mouse => {
    dragging = false;
    dragEnd = {x: mouse.clientX, y: mouse.clientY};
    mouseDragEnd();
    dragStart = null;
    dragEnd = null;
    mousePosition = null;
})