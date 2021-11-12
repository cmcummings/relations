import Node from "./Node.js";
import Drawer from "./Drawer.js";

const canvas = document.getElementById("graph-canvas");
canvas.width = window.screen.width;
canvas.height = window.screen.height;

const drawer = new Drawer(canvas);

// State
const nodes = [new Node(100, 100)];

function refresh() {
    drawer.clear();
    drawer.drawGrid();

    nodes.map(node => drawer.drawNode(node));
}

refresh();

function addNode(x, y) {
    // Check if position is not too close to other nodes
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.intersectsWithPotentialNode(x, y)) return;
    }

    // Create node
    nodes.push(new Node(x, y));
    refresh();
}

function getNodeAtPosition(x, y) {
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.pointInNode(x, y)) return node;
    }
}

// Handle input

var dragging = false;
var connecting = false;
var dragStart; 
var fromNode;

function mouseDown(x, y) {
    let targetNode = getNodeAtPosition(x, y);
    if (targetNode == null) { 
        addNode(x, y);
    } else {
        fromNode = targetNode;
    }
}

function mouseDragging(x, y) {
    let targetNode = getNodeAtPosition(x, y);
    if (fromNode != null && targetNode != fromNode) {
        connecting = true;
        refresh();
        drawer.drawDirectedLine(fromNode.x, fromNode.y, x, y)
    }
}

function mouseUp(x, y) {
    if(fromNode) {
        let targetNode = getNodeAtPosition(x, y);
        if (targetNode && targetNode != fromNode) { // TODO add self-loops
            fromNode.relateTo(targetNode);
            refresh();
        }
        
        refresh();
    }

    fromNode = null;
}

const LEFT_MB = 0;

canvas.addEventListener("mousedown", mouse => {
    if (mouse.button != LEFT_MB) return;

    const x = mouse.clientX;
    const y = mouse.clientY;
    dragStart = {x: x, y: y};
    dragging = true;
    mouseDown(x, y);
})

canvas.addEventListener("mousemove", mouse => {
    if (mouse.button != LEFT_MB) return;

    if (dragging) {
        mouseDragging(mouse.clientX, mouse.clientY);
    }
})

canvas.addEventListener("mouseup", mouse => {
    if (mouse.button != LEFT_MB) return;

    dragging = false;
    mouseUp(mouse.clientX, mouse.clientY);
    dragStart = null;
})