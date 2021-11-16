import Node from "./Node.js";
import Drawer from "./Drawer.js";
import AdjacencyMatrix from "./AdjacencyMatrix.js";

const canvas = document.getElementById("graph-canvas");
canvas.width = window.screen.width;
canvas.height = window.screen.height;

const drawer = new Drawer(canvas);

// State
const nodes = [];
const matrix = new AdjacencyMatrix();

const matrixTable = document.getElementById("matrix-table");
const relfexiveProp = document.getElementById("prop-reflexive")
const symmetricProp = document.getElementById("prop-symmetric")

function updateMatrixTable() {
    // Update table
    let body = "";
    let head = "<tr><td></td>";
    
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        head += "<td>" + node.name + "</td>";
        body += "<tr>";
        body += "<td>" + node.name + "</td>";
        matrix.row(node.index).map(bool => body += "<td>" + bool + "</td>");
        body += "</tr>";
    }

    head += "</tr>";

    matrixTable.innerHTML = head + body;

    // Update properties
    if (matrix.reflexive) {
        relfexiveProp.innerHTML = "reflexive";
        relfexiveProp.className = "true";
    } else {
        relfexiveProp.innerHTML = "not reflexive";
        relfexiveProp.className = "false";
    }

    if (matrix.symmetric) {
        symmetricProp.innerHTML = "symmetric";
        symmetricProp.className = "true";
    } else {
        symmetricProp.innerHTML = "not symmetric";
        symmetricProp.className = "false";
    }
}

function refresh() {
    drawer.clear();
    drawer.drawGrid();

    nodes.map(node => drawer.drawNode(node));
}

refresh();

function collidesWithNode(x, y, ignoreNode) {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node != ignoreNode && node.intersectsWithPotentialNode(x, y)) return true;
    }
    return false;
}

function addNode(x, y) {
    // Check if position is not too close to other nodes
    if (collidesWithNode(x, y)) return;

    // Create node
    nodes.push(new Node(x, y));
    refresh();

    matrix.add();
    updateMatrixTable();
}

function getNodeAtPosition(x, y) {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.pointInNode(x, y)) return node;
    }
}

// Handle input

var dragging = false;
var draggingNode = false;
var dragStart;
var fromNode;

function mouseDown(x, y, shift) {
    let targetNode = getNodeAtPosition(x, y);
    if (targetNode == null) { 
        addNode(x, y);
    } else {
        fromNode = targetNode;
        if (shift) {
            draggingNode = true;
        }
    }
}

function mouseDragging(x, y) {
    if (draggingNode) {
        if (!collidesWithNode(x, y, fromNode)) {
            fromNode.moveTo(x, y);
            refresh();
        }
    } else {
        if (fromNode != null) {
            refresh();
            drawer.drawLineDashed(fromNode.x, fromNode.y, x, y)
        }
    }
}

function mouseUp(x, y) {
    if(fromNode && !draggingNode) {
        let targetNode = getNodeAtPosition(x, y);
        if (targetNode != null) {
            if(fromNode.isRelatedTo(targetNode)) {
                fromNode.unrelate(targetNode);
                matrix.update(fromNode, targetNode, false);
            } else {
                fromNode.relateTo(targetNode);
                matrix.update(fromNode, targetNode, true);
            }

            updateMatrixTable();

            refresh();
        }
        
        refresh();
    }

    draggingNode = false;
    fromNode = null;
}

const LEFT_MB = 0;

canvas.addEventListener("mousedown", mouse => {
    if (mouse.button != LEFT_MB) return;

    const x = mouse.clientX;
    const y = mouse.clientY;
    dragStart = {x: x, y: y};
    dragging = true;
    mouseDown(x, y, mouse.shiftKey);
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