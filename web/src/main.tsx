import {StrictMode} from "react"
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from "react-router-dom"

import LoginPage from "./pages/LoginPage"
import ProductsPage from "./pages/ProductsPage"
import Layout from "./components/Layout"
import {AuthProvider} from "@/context/auth/AuthProvider.tsx";
import {createRoot} from "react-dom/client";
import "./index.css"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "sonner";
import QueryStateContextProvider from "@/context/query-state/QueryStateProvider.tsx";
import SignupPage from "@/pages/SignupPage.tsx";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 0,
            retry: false
        },
    },
})

const router = createBrowserRouter([
    {
        path: '/',
        Component() {
            return <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <QueryStateContextProvider>
                        <Outlet/>
                        <Toaster richColors/>
                    </QueryStateContextProvider>
                </AuthProvider>
            </QueryClientProvider>
        },
        children: [
            {
                path: "/login",
                element: <LoginPage/>,
            },
            {
                path:"/signup",
                element: <SignupPage/>,
            },
            {
                path: "/",
                // element: <ProtectedRoute/>,
                children: [
                    {
                        element: <Layout/>,
                        children: [
                            {index: true, element: <Navigate to="/products" replace/>},
                            {path: "products", element: <ProductsPage/>},
                        ],
                    },
                ],
            },
        ]
    }
])


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
)
