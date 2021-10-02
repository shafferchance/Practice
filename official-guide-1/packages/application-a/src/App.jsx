import React from "react";
import Message from "./Message";

const SayHelloFromB = React.lazy(() => import("application_b/SayHelloFromB"));

const App = () => (
    <>
        <Message />
        <React.Suspense fallback="...loading">
            <SayHelloFromB />
        </React.Suspense>
    </>
);

export default App;
