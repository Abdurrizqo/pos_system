import { Link, Outlet } from "react-router-dom"
import { IoIosLogOut } from "react-icons/io";
import useSession from "../hooks/useSession";

function Kasir() {
  const { removeSession } = useSession()
  return (
    <>
      <div className="w-full bg-white h-20 z-40 flex justify-between border-b shadow-md fixed top-0 items-center p-3">
        <div className="flex gap-8">
          <Link className="hover:underline underline-offset-8 decoration-orange-400 hover:text-orange-400" to='/kasir'>Kasir</Link>
          <Link className="hover:underline underline-offset-8 decoration-orange-400 hover:text-orange-400" to='/kasir/riwayat-transaksi'>Riwayat Transaksi</Link>
        </div>

        <div onClick={removeSession} className="w-10 cursor-pointer btn-click h-10 rounded-full bg-orange-400 flex items-center justify-center">
          <IoIosLogOut className="text-2xl text-white" />
        </div>
      </div>

      <div className="w-full h-20"></div>

      <Outlet />
    </>
  )
}

export default Kasir