import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import User from "./pages/User";
import Transaksi from "./pages/Transaksi";
import Islogin from "./components/Islogin";
import Kasir from "./pages/Kasir";
import MenuKasir from "./pages/MenuKasir";
import TransaksiKasir from "./pages/TransaksiKasir";
import IsOwner from "./components/IsOwner";
import IsEmployee from "./components/IsEmployee";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
        errorElement: <NotFound />,
    },
    {
        path: '/',
        element: <Islogin><IsOwner><Home /></IsOwner></Islogin>,
        errorElement: <NotFound />,
        children: [
            {
                path: '/menu',
                element: <Menu />
            },
            {
                path: '/user',
                element: <User />
            },
            {
                path: '/',
                element: <Transaksi />
            }
        ]
    },
    {
        path: '/kasir',
        element: <Islogin><IsEmployee><Kasir /></IsEmployee></Islogin>,
        errorElement: <NotFound />,
        children: [
            {
                path: '/kasir',
                element: <MenuKasir />
            },
            {
                path: 'riwayat-transaksi',
                element: <TransaksiKasir />
            }
        ]
    }

]);

export default router;