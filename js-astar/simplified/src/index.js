const test = [2, 4, 6, 8, 19];
// console.log(findIndex(8, test, true));

// const priority = new PriorityQueue();
// priority.push([0, 2]);
// priority.push([1, 5]);
// priority.push([3, 3]);
// priority.push([5, 1]);

// console.log(priority.queue);

class Test5 {
    constructor() {
        this.queue = [];
        return new Proxy(this, {
            get: function (target, key) {
                console.log(target, key);

                const returnProp =
                    key in target ? target[key] : target.queue.key;
                return returnProp;
            },
            set: function (target, key, value) {
                console.log(target, key, value);
                try {
                    target.queue[key] = value;
                    return true;
                } catch (_E) {
                    return false;
                }
            },
        });
    }

    push(value) {
        this.queue.push(value);
    }
}

const test2 = new Test5();
console.log(test2[0]);
test2[0] = 1;
console.log(test2[0]);
test2.push(2);
console.log(test2);
