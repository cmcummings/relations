const NODE_RADIUS = 40;
const GRID_SIZE = 50;
const LINE_CP_OFFSET_SCALE = 0.4;
const EDGE_OFFSET = Math.PI/6;
const ARROW_ANGLE = Math.PI/6;

class Drawer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }

    clear() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.closePath();
    }
    
    drawLineRaw(x1, y1, x2, y2) {
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.drawLineRaw(x1, y1, x2, y2);
    }

    drawLineDashed(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([10, 10]);
        this.drawLineRaw(x1, y1, x2, y2);
        this.ctx.setLineDash([]);
    }
    
    drawGrid() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(235, 235, 235)";
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x < this.canvas.width; x += GRID_SIZE) {
            this.drawLine(x, 0, x, this.canvas.height);
        }
    
        for (let y = 0; y < this.canvas.height; y += GRID_SIZE) {
            this.drawLine(0, y, this.canvas.width, y);
        }
    }
    
    drawNode(node) {
        // Draw directed edges
        let reflexive = false;
        let totalAngle = 0;
        for(let i = 0; i < node.relations.length; i++) {
            let toNode = node.relations[i];

            if (node == toNode) {
                reflexive = true;
                continue;
            }

            const a = Math.atan2(toNode.y - node.y, toNode.x - node.x);
            const sx = node.x + NODE_RADIUS * Math.cos(a - EDGE_OFFSET);
            const sy = node.y + NODE_RADIUS * Math.sin(a - EDGE_OFFSET);
            const ex = toNode.x - NODE_RADIUS * Math.cos(a + EDGE_OFFSET);
            const ey = toNode.y - NODE_RADIUS * Math.sin(a + EDGE_OFFSET);

            this.drawEdge(sx, sy, ex, ey);

            totalAngle += a;
        }

        // Draw self-directed loop
        if (reflexive) {
            // Position is based on the other edge positions
            // The self-directed loop should be as far away from the other edges as possible
            const a = totalAngle/node.relations.length + Math.PI;
            const x = node.x + NODE_RADIUS * Math.cos(a);
            const y = node.y + NODE_RADIUS * Math.sin(a);

            this.ctx.beginPath();
            this.ctx.lineWidth = 1;
            this.ctx.arc(x, y, 2*NODE_RADIUS/3, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
    
        // Draw node
        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;

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
    }
    
    drawEdge(x1, y1, x2, y2) {
        // Calculate control point position
        let cx, cy;
    
        const mx = Math.floor((x1 + x2)/2); // Midpoint X
        const my = Math.floor((y1 + y2)/2); // Midpoint Y
        const a = Math.atan2(y2 - y1, x2 - x1); // Angle
        const d = Math.hypot(y2 - y1, x2 - x1); // Distance

        const cpos = LINE_CP_OFFSET_SCALE * d; // Control Point Offset Scale

        if (x1 == x2) {
            cx = mx + (y2 > y1 ? 1 : -1) * cpos;
            cy = my;
        } else if (y1 == y2) {
            cx = mx;
            cy = my - (x2 > x1 ? 1 : -1) * cpos;
        } else {
            const s = (y2 - y1)/(x2 - x1);
            cx = mx + cpos * Math.cos(Math.PI/2 - a);
            cy = (-1/s)*(cx - mx) + my;
        }
    
        // Draw directed edge
        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;
    
        // Draw line
        this.ctx.moveTo(x1, y1);
        this.ctx.quadraticCurveTo(cx, cy, x2, y2);

        // Draw arrow
        const a2 = a + EDGE_OFFSET;
        this.ctx.lineTo(x2 - 10 * Math.cos(a2 - ARROW_ANGLE), y2 - 10 * Math.sin(a2 - ARROW_ANGLE));
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(x2 - 10 * Math.cos(a2 + ARROW_ANGLE), y2 - 10 * Math.sin(a2 + ARROW_ANGLE));

        this.ctx.stroke();
    }
}

export default Drawer;