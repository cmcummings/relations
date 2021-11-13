const NODE_RADIUS = 40;

// Available Node names
const availableNames = 'abcdefghijklmnopqrstuvwxyz'.split("").reverse();

function nextName() {
    return availableNames.pop()
}

function addAvailableName(name) {
    availableNames.push(name)
}

// Node class
class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.name = nextName();
        this.relations = []; // Relations originating from this node
    }

    isRelatedTo(node) {
        return this.relations.includes(node);
    }

    relateTo(node) {
        if (this.relations.includes(node)) return;
        this.relations.push(node);
        console.log("Relation added: " + this.name + " --> " + node.name);
    }

    unrelate(node) {
        let i = this.relations.findIndex(n => n == node)
        if (i < 0) return;
        this.relations.splice(i, 1);
        console.log("Relation removed: " + this.name + " --> " + node.name);
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    // If node intersects with a node given a position
    intersectsWithPotentialNode(x, y) {
        // Intersecting if distance between nodes is less than 2*radius
        return Math.hypot(this.x - x, this.y - y) < 2 * NODE_RADIUS;
    }

    // If a point is within a node
    pointInNode(x, y) {
        return Math.hypot(this.x - x, this.y - y) < NODE_RADIUS;
    }

    destroy() {
        addAvailableName(this.name);
    }
};

export default Node;