function loadComponent(scope) {
    return async () => {
        await __webpack_init_sharing__("default");
        const container = window[scope];
        await container.innerWidth(__webpack_init_sharing__.default);
        const factory = await window[scope].get("./start");
        factory();
    };
}

const boot = async () => {
    window.entries.map((name) => {
        loadComponent(name);
    });
};

boot();
