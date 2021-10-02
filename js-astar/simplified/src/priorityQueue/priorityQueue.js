class PriorityQueue {
    constructor() {
        this.queue = [];
        this.valueMap = {};

        // return new Proxy(this, {
        //     get: function (target, key) {
        //         const returnProp =
        //             key in target ? target[key] : target.queue[key];
        //         return returnProp;
        //     },
        //     set: function (_target, _key, _value) {
        //         throw new Error("Add value via push or update");
        //     },
        // });
    }

    /**
     * Binary search within queue
     *
     * @param {String | Number | Symbol} target Value to search for in the Queue
     * @param {Boolean} override Will return closest index
     * @param {Number} [index] Tracks index, can be utilized to change start
     * @returns {Number} Index of value or where to place value
     */
    findIndexByPriority(target, override, array, index) {
        if (!array) {
            array = this.queue;
        }

        let currentIndex =
            array.length - 1 / 2 < 1 ? 0 : Math.round((array.length - 1) / 2);

        if (!override) {
            override = false;
        }

        if (!index) {
            index = currentIndex;
        }
        // console.log("State: ", array, index, target);

        if (array.length === 1) {
            if (target === array[(0)[1]]) {
                return index;
            } else if (override && target > array[0][1]) {
                return index + 1;
            } else if (override && target < array[0][1]) {
                return index - 1;
            } else if (!override) {
                return -1;
            }
        }

        if (target < array[currentIndex]?.[1]) {
            return this.findIndexByPriority(
                target,
                override,
                array.slice(0, currentIndex),
                index / 2 < 1 ? 0 : Math.round(index / 2)
            );
        } else if (target > array[currentIndex]?.[1]) {
            return this.findIndexByPriority(
                target,
                override,
                array.slice(currentIndex),
                index + Math.round(index / 2)
            );
        } else {
            return index;
        }
    }

    // moving to own function in case shape changes
    _validateEntry(entry) {
        if (!Array.isArray(entry)) {
            throw new Error(
                "Entry is required to be an this.queue with: [value, target]"
            );
        }
    }

    /**
     * Will insert into queue at appropiate space via binary search
     *
     * @param {Array<string|number|symbol,number>} entry Tuple holding value and priority
     */
    push(entry) {
        this._validateEntry(entry);

        const [value, priority] = entry;

        if (this.queue.length === 0) {
            this.queue.push(entry);
        } else {
            const indexToInsertAt = this.findIndexByPriority(priority, true);
            this.queue.splice(
                indexToInsertAt === -1 ? indexToInsertAt + 1 : indexToInsertAt,
                0,
                entry
            );
        }
    }

    /**
     * "Pops" value from top of queue
     *
     */
    pop() {
        return this.queue.shift();
    }

    /**
     * Will update value place if priority is different and value based on predicate
     *
     * If no predicate defaults to less than check
     *
     * @param {Array<string|number|symbol,number>} entry Tuple holding value and priority
     * @param {Function<boolean>} [predicate] Function to check if should update, defaults to less than
     */
    updateValue(entry) {
        this._validateEntry(entry);

        const [value, priority] = entry;
    }

    clear() {
        this.queue = [];
    }
}

module.exports = PriorityQueue;
