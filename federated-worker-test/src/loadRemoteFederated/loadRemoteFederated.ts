import Methods from "remoteworker/Remote";

function setupRemoteFederated(url: string, scope: string, module: string) {
    const button = document.getElementById("packageMF");
    const federatedPakckageStatus = document.getElementById("packageMFStatus");

    if (!button) {
        throw new Error("Couldn't find federated package button");
    }

    if (!federatedPakckageStatus) {
        throw new Error("Couldn't find federated package status");
    }

    button.addEventListener("click", () => {
        // Download remote module
        const remotePackage = document.createElement("script");
        remotePackage.async = true;
        remotePackage.src = url;

        remotePackage.addEventListener("load", () => {
            document.head.removeChild(remotePackage);
            federatedPakckageStatus.innerText = "Status: Loaded";

            window[scope].get<Methods>(module).then((module) => {
                console.log(module, module());
                const { getData, thingTwo } = module();
                console.log(getData, thingTwo);
                federatedPakckageStatus.innerText = "Status: SUCCESS";
            });
        });

        federatedPakckageStatus.innerText = "Status: Fetching";
        document.head.appendChild(remotePackage);
    });
}

export default setupRemoteFederated;
