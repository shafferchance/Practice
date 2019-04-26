export function makeRequest(opts) {
    console.log(opts.body);
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(opts.method, opts.url);
        xhr.responseType = "json";
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(opts.body);
    });
}