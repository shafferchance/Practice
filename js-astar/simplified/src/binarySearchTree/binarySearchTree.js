class BSTNode {
    constructor(value, pointers) {
        this.parent = pointers?.parent;
        this.left = pointers?.left;
        this.right = pointers?.right;
        this.value = value;
    }
}

class BST {
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

    insert(value) {
        const [direction, parent] = this._traversal(value);

        if (!parent) {
            this.head = new BSTNode(value);
            return true;
        }

        switch (direction) {
            case -1: {
                parent.left = new BSTNode(value, { parent });
                break;
            }
            case 0: {
                const temp = parent;
                parent = new BSTNode(value, {
                    parent: temp.parent,
                    left: temp,
                });
                break;
            }
            case 1: {
                parent.right = new BSTNode(value, { parent });
                break;
            }
            default: {
                throw new Error("Invalid direction recieved from traversal");
            }
        }
    }

    update(value, newValue, current) {
        const [direction, parent] = this._traversal(value);

        if (!parent) {
            this.head = new BSTNode(value);
            return true;
        }

        switch (direction) {
            case -1: {
                parent.left = new BSTNode(value, { parent });
                break;
            }
            case 0: {
                const temp = parent;
                parent = new BSTNode(value, {
                    parent: temp.parent,
                    left: temp,
                });
                break;
            }
            case 1: {
                parent.right = new BSTNode(value, { parent });
                break;
            }
            default: {
                throw new Error("Invalid direction recieved from traversal");
            }
        }
    }

    delete() {}
}

module.exports = {
    BST,
    BSTNode,
};