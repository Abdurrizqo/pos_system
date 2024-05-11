import { useState } from "react";
import useSession from "../hooks/useSession";
import axios from "axios";

type DeleteUserProp = {
    cancelDelete: () => void
    userData?: UserType
    statusDelete: (isPaid: boolean) => void
}

function DeleteUserComponent({ cancelDelete, userData, statusDelete }: DeleteUserProp) {
    const { getAuthDataFromSession } = useSession();
    const [isLoading, setIsloading] = useState<boolean>(false);

    const deleteUser = async () => {
        const token = getAuthDataFromSession()?.token;

        setIsloading(true);
        await axios.delete(`http://127.0.0.1:8000/api/user/${userData?.id}`, {
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
                    <p className="text-center text-lg poppins-medium">Hapus User {userData?.name}</p>

                    <div className="w-full flex mt-10 justify-center items-center gap-10">
                        <button disabled={isLoading} className={`${isLoading ? 'bg-gray-400' : 'bg-orange-400'} rounded py-1 px-3 text-white btn-click`} onClick={cancelDelete}>Cancel</button>
                        <button
                            disabled={isLoading}
                            onClick={deleteUser}
                            className={`${isLoading ? 'bg-gray-300 border-gray-400 text-white' : 'bg-white border-red-400 text-red-400'} border py-1 px-3 btn-click rounded`}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteUserComponent