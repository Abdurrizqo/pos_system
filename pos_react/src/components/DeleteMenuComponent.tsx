import { useState } from "react";
import useSession from "../hooks/useSession";
import axios from "axios";

type DeleteMenuProps = {
    cancelDelete: () => void
    menuData?: MenuType
    statusDelete: (isPaid: boolean) => void
}

function DeleteMenuComponent({ cancelDelete, menuData, statusDelete }: DeleteMenuProps) {
    const { getAuthDataFromSession } = useSession();
    const [isLoading, setIsloading] = useState<boolean>(false);

    const deleteMenu = async () => {
        const token = getAuthDataFromSession()?.token;

        setIsloading(true);
        await axios.delete(`http://127.0.0.1:8000/api/menu/${menuData?.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            statusDelete(true);
        }).catch(() => {
            statusDelete(false);
        })
        setIsloading(false);
    }

    return (
        <div className='fixed z-40 top-0 bottom-0 left-0 right-0 bg-black/40'>
            <div className="w-full h-full flex gap-3 items-center justify-center">
                <div className="min-w-[24rem] max-w-[32rem] max-h-[36rem] bg-white rounded-lg p-3">
                    <p className="text-center text-lg poppins-medium">Hapus Menu {menuData?.menuName}</p>

                    <div className="w-full flex mt-10 justify-center items-center gap-10">
                        <button disabled={isLoading} className={`${isLoading ? 'bg-gray-400' : 'bg-orange-400'} rounded py-1 px-3 text-white btn-click`} onClick={cancelDelete}>Cancel</button>
                        <button
                            disabled={isLoading}
                            onClick={deleteMenu}
                            className={`${isLoading ? 'bg-gray-300 border-gray-400 text-white' : 'bg-white border-red-400 text-red-400'} border py-1 px-3 btn-click rounded`}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteMenuComponent