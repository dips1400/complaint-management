// import React from "react";
//  import ReactDOM from "react-dom/client";
//   import { RouterProvider, createRouter } from "@tanstack/react-router"
//   import { routeTree } from "./routeTree.gen" // if generated
//   const router = createRouter({ routeTree, })
//   declare module "@tanstack/react-router" { interface Register { router: typeof router } } ReactDOM.createRoot(document.getElementById("root")!).render( <React.StrictMode> <RouterProvider router={router} /> </React.StrictMode>, )

import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

import "../src/styles.css" // ✅ THIS IS THE MISSING PIECE

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)