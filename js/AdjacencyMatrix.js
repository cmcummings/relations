class AdjacencyMatrix {
    constructor() {
        this.numNodes = 0;
        this.matrix = [];
    }

    add() {
        this.numNodes += 1;

        // Add cell to every row
        for (let i = 0; i < this.matrix.length; i++) {
            this.matrix[i].push(0);
        }

        // Add row
        const row = []
        for (let i = 0; i < this.numNodes; i++) {
            row.push(0);
        }

        this.matrix.push(row);
    }

    update(fromNode, toNode, isRelated) {
        this.matrix[fromNode.index][toNode.index] = isRelated ? 1 : 0
    }

    row(i) {
        return this.matrix[i];
    }

    get reflexive() {
        for (let i = 0; i < this.matrix.length; i++) {
            if (this.matrix[i][i] == 0) {
                return false;
            }
        }
        
        return true;
    }

    get symmetric() {
        if (this.numNodes == 1) return true;
        for (let i = 0; i < this.matrix.length - 1; i++) {
            for(let j = i + 1; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j] != this.matrix[j][i]) {
                    return false;
                }
            }
        }

        return true;
    }

    get transitive() {
        
    }
}

export default AdjacencyMatrix