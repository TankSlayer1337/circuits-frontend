import "./index.css"

import * as React from "react"
import { createRoot } from "react-dom/client"

import App from "./App"

import { configureAmplify } from "./amplify-configuration-provider"

configureAmplify()

createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
