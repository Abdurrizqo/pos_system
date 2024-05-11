import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import useSession from "../hooks/useSession";
import AddMenuComponent from "../components/AddMenuComponent";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Flip, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DeleteMenuComponent from "../components/DeleteMenuComponent";
import EditMenuComponent from "../components/EditMenuComponent";

function Menu() {
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [isModalActive, setModalActive] = useState<boolean>(false);
    const [errMessage, setErrMessage] = useState<string>('');
    const [listMenu, setListMenu] = useState<MenuType[]>([]);
    const [checkReload, setCheckReload] = useState<boolean>(false);
    const [menuDelete, setMenuDelete] = useState<MenuType | undefined>(undefined);
    const [menuEdit, setMenuEdit] = useState<MenuType | undefined>(undefined);
    const [isModalDeleteActiv, setIsModalDeleteActiv] = useState<boolean>(false);
    const [isModalEditActiv, setIsModalEditActiv] = useState<boolean>(false);

    const { getAuthDataFromSession } = useSession()

    useEffect(() => {
        const token = getAuthDataFromSession()?.token;
        setListMenu([]);
        setErrMessage('');
        setIsloading(true);
        axios.get('http://127.0.0.1:8000/api/menu', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            setListMenu(res.data.data);
            setIsloading(false);
        }).catch((err) => {
            setErrMessage(err);
            setIsloading(false);
        })
        setCheckReload(false)
    }, [checkReload]);

    function refreshDelete(isSuccess: boolean) {
        if (isSuccess) {
            setMenuDelete(undefined);
            setIsModalDeleteActiv(false);
            setCheckReload(true)
        } else {
            toast.error('Terjadi Kesalahan, Coba Lagi', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Flip
            })
            setMenuDelete(undefined);
            setIsModalDeleteActiv(false);
        }
    }

    function refreshEdit(isSuccess: boolean) {
        if (isSuccess) {
            setMenuEdit(undefined);
            setIsModalEditActiv(false);
            setCheckReload(true)
        } else {
            toast.error('Terjadi Kesalahan, Coba Lagi', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Flip
            })
            setMenuEdit(undefined);
            setIsModalEditActiv(false);
        }
    }
    function deleteModal(menuData: MenuType) {
        setMenuDelete(menuData);
        setIsModalDeleteActiv(true);
    }

    function editModal(menuData: MenuType) {
        setMenuEdit(menuData);
        setIsModalEditActiv(true);
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-8 p-5 justify-center h-60">
                <div className="spinner"></div>
            </div>
        )
    }

    if (errMessage) {
        return (
            <div className="flex gap-8 p-5 justify-center items-center mb-20 h-60">
                <div className="text-center">
                    <h1 className="text-gray-600 text-3xl poppins-bold">Kesalahan Server</h1>
                    <p className="text-gray-400 text-lg mt-2 poppins-medium">Coba Lagi Nanti</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <ToastContainer />
            {menuDelete && isModalDeleteActiv && <DeleteMenuComponent
                menuData={menuDelete}
                cancelDelete={() => {
                    setMenuDelete(undefined);
                    setIsModalDeleteActiv(false)
                }}
                statusDelete={refreshDelete}
            />}

            {menuEdit && isModalEditActiv && <EditMenuComponent
                menuData={menuEdit}
                cancelEdit={() => {
                    setMenuEdit(undefined);
                    setIsModalEditActiv(false)
                }}
                statusEdit={refreshEdit}
            />}

            {isModalActive ? <AddMenuComponent refreshPage={() => setCheckReload(true)} modalControl={() => { setModalActive(false) }} /> : null}

            <div onClick={() => setModalActive(!isModalActive)} className="w-12 h-12 btn-click cursor-pointer rounded-full fixed bottom-10 right-10 bg-amber-400 flex items-center justify-center">
                <IoIosAdd className="text-4xl text-white" />
            </div>

            <div className="flex flex-wrap gap-8 p-5 justify-center mb-20">

                {listMenu.map((item) => {
                    return (
                        <div key={item.id} className="w-72 h-60 bg-white rounded-lg border shadow-md p-2 relative">
                            <div className="w-full h-40 bg-gray-200 bg-cover bg-center rounded" style={{
                                backgroundImage: `url("http://127.0.0.1:8000/storage/${item.pict}")`,
                            }}></div>

                            <div className="mt-2 w-full">
                                <h1 className="truncate poppins-medium">{item.menuName}</h1>
                                <h1 className="poppins-light text-gray-400 text-sm">{item.harga}</h1>
                            </div>

                            <button onClick={() => { deleteModal(item) }} className="absolute -bottom-3 -right-2 bg-red-400 p-2 rounded-full btn-click"><FaTrash className="text-white" /></button>
                            <button onClick={() => { editModal(item) }} className="absolute -bottom-3 right-8 bg-green-400 p-2 rounded-full btn-click"><FaEdit className="text-white" /></button>
                        </div>
                    )
                })}

            </div>
        </>
    )
}

export default Menu