class AVLNode {
    constructor(value, pointers) {
        this.parent = pointers?.parent;
        this.left = pointers?.left;
        this.right = pointers?.right;
        this.value = value;
        this.balancingFactor = 0;

        // TODO: Figure out when to calculate balancing factor
    }
}

class AVL {
    constructor() {
        this.current = undefined;
        this.head = undefined;
    }

    _traversal(value, current = this.head) {
        if (value < current?.value) {
            if (current.left) {
                return this._traversal(value, current.left);
            } else {
                return [-1, current];
            }
        }

        if (value > current?.value) {
            if (current.right) {
                return this._traversal(value, current.right);
            } else {
                return [1, current];
            }
        }

        return [0, current];
    }

    calculateBalancingFactor(node) {
        const leftScore =
            (node.left?.balancingFactor ?? 0) + (node.left ? 1 : 0);
        const rightScore =
            (node.right?.balancingFactor ?? 0) + (node.right ? 1 : 0);

        node.balancingFactor = leftScore - rightScore;

        if (node.parent) {
            return this.calculateBalancingFactor(node.parent);
        }
    }

    insert(value) {
        const [direction, parent] = this._traversal(value);

        if (!parent) {
            this.head = new AVLNode(value);
            return true;
        }

        switch (direction) {
            case -1: {
                parent.left = new AVLNode(value, { parent });
                this.calculateBalancingFactor(parent.left);
                break;
            }
            case 0: {
                const temp = parent;
                parent = new AVLNode(value, {
                    parent: temp.parent,
                    left: temp,
                });
                this.calculateBalancingFactor(parent);
                break;
            }
            case 1: {
                parent.right = new AVLNode(value, { parent });
                this.calculateBalancingFactor(parent.right);
                break;
            }
            default: {
                throw new Error("Invalid direction recieved from traversal");
            }
        }
    }

    delete(value) {
        const [direction, node] = this._traversal(value);

        if (direction !== 0) {
            throw new Error("Couldn't find node");
        }

        const deleteNode = node;

        // Since this is a BST, only the two cases should be possible
        if (deleteNode.value < deleteNode.parent.value) {
            // Re-Attaching detacted left tree
            const leftNode = deleteNode.right ?? deleteNode.left;
            if (leftNode !== deleteNode.left) {
                leftNode.left = deleteNode.left;
            }
            deleteNode.parent.left = leftNode;
            leftNode.parent = deleteNode.parent;
            this.calculateBalancingFactor(leftNode);
        } else {
            // Re-Attaching detacted right tree
            const rightNode = deleteNode.left ?? deleteNode.right;
            console.log(
                deleteNode.value,
                deleteNode.left?.value,
                deleteNode.right?.value
            );
            if (rightNode !== deleteNode.right) {
                rightNode.right = deleteNode.right;
            }
            deleteNode.parent.right = rightNode;
            rightNode.parent = deleteNode.parent;
            this.calculateBalancingFactor(rightNode);
        }
    }
}

module.exports = {
    AVL,
    AVLNode,
};
