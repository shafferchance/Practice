import React from "react";
import Message from "./Message";

const SayHelloFromA = React.lazy(() => import("application_a/SayHelloFromA"));

const App = () => (
    <>
        <Message />
        <React.Suspense fallback="...loading">
            <SayHelloFromA />
        </React.Suspense>
    </>
);

export default App;
