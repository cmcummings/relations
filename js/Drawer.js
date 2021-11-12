const NODE_RADIUS = 40;
const GRID_SIZE = 50;
const LINE_CP_OFFSET = 100;
const EDGE_OFFSET = Math.PI/6

class Drawer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    line(x1, y1, x2, y2) {
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = "rgb(235, 235, 235)";
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x < this.canvas.width; x += GRID_SIZE) {
            this.line(x, 0, x, this.canvas.height);
        }
    
        for (let y = 0; y < this.canvas.height; y += GRID_SIZE) {
            this.line(0, y, this.canvas.width, y);
        }
    }
    
    drawNode(node) {
        // Draw circle
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "gray";
        this.ctx.lineWidth = 2;
    
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
    
        // Draw label
        if (node.name == null) return;
    
        this.ctx.font = "16px Verdana";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(node.name, node.x, node.y);

        // Draw directed edges
        for(let i = 0; i < node.relations.length; i++) {
            let toNode = node.relations[i];

            // Calculate offsets

            this.drawDirectedLine(node.x, node.y, toNode.x, toNode.y);
        }
    }
    
    drawDirectedLine(x1, y1, x2, y2) {
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
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;
    
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.quadraticCurveTo(cx, cy, x2, y2);
        this.ctx.stroke();
    }
}

export default Drawer;