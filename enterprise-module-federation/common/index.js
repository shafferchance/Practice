const shareByVersion = (module) => {
    const vendorVersion = require(`${module}/package.json`).version;
    const trimmedVersion = vendorVersion.substring(0, vendorVersion.length - 2);
    return {
        [trimmedVersion]: module,
    };
};

const getRemoteEntryUrl = (port) => {
    return `//localhost:${port}/remoteEntry.js`;
};

const useDynamicScript = (args) => {
    const [ready, setReady] = React.useState(false);
    const [failed, setFailed] = React.useState(false);

    React.useEffect(() => {
        if (!args.url) {
            return;
        }

        const element = document.createElement("script");

        element.src = args.url;
        element.type = "text/javascript";
        element.async = true;

        setReady(false);

        element.onload = () => {
            console.log(`Dynamic Script Loaded: ${args.url}`);
            setReady(true);
        };

        element.onerror = () => {
            console.error(`Dynamic Script Error: ${args.url}`);
            setReady(false);
            setFailed(true);
        };

        document.head.appendChild(element);

        return () => {
            console.log(`Dynamic Script Removed: ${args.url}`);
            document.head.removeChild(element);
        };
    }, [args.url]);

    return {
        ready,
        failed,
    };
};

module.exports = {
    getRemoteEntryUrl,
    shareByVersion,
    useDynamicScript,
};
