import axios from "axios";
import { useEffect, useState } from "react";
import useSession from "../hooks/useSession";
import { IoIosAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import TotalOrderComponent from "../components/TotalOrderComponent";
import { Flip, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function MenuKasir() {

    const [isLoading, setIsloading] = useState<boolean>(false);
    const [errMessage, setErrMessage] = useState<string>('');
    const [listMenu, setListMenu] = useState<MenuType[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<OrderInput[]>([]);
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
    }, []);

    function addMenu(menu: MenuType) {
        const updatedSelectedMenu = [...selectedMenu];
        const existingMenuIndex = updatedSelectedMenu.findIndex(item => {
            return item.namaMenu === menu.menuName;
        });

        if (existingMenuIndex !== -1) {
            updatedSelectedMenu[existingMenuIndex] = {
                ...updatedSelectedMenu[existingMenuIndex],
                jumlah: updatedSelectedMenu[existingMenuIndex].jumlah + 1,
                totalHargaSatuan: (updatedSelectedMenu[existingMenuIndex].jumlah + 1) * updatedSelectedMenu[existingMenuIndex].hargaSatuan
            };
        } else {
            updatedSelectedMenu.push({
                namaMenu: menu.menuName,
                hargaSatuan: menu.harga,
                jumlah: 1,
                totalHargaSatuan: menu.harga
            });
        }
        setSelectedMenu(updatedSelectedMenu);
    }

    function removeMenu(menu: MenuType) {
        const updatedSelectedMenu = [...selectedMenu];
        const existingMenuIndex = updatedSelectedMenu.findIndex(item => {
            return item.namaMenu === menu.menuName;
        });

        if (existingMenuIndex !== -1) {
            if (updatedSelectedMenu[existingMenuIndex].jumlah > 1) {
                updatedSelectedMenu[existingMenuIndex] = {
                    ...updatedSelectedMenu[existingMenuIndex],
                    jumlah: updatedSelectedMenu[existingMenuIndex].jumlah - 1,
                    totalHargaSatuan: (updatedSelectedMenu[existingMenuIndex].jumlah + 1) * updatedSelectedMenu[existingMenuIndex].hargaSatuan
                };
            } else {
                updatedSelectedMenu.splice(existingMenuIndex, 1);
            }
            setSelectedMenu(updatedSelectedMenu);
        }
    }

    const handleStatusPaid = (isPaid: boolean) => {
        if (isPaid) {
            toast.success('Pembayaran Berhasil', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Flip,
            });
        } else {
            toast.error('Pembayaran Gagal, Coba Lagi', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                transition: Flip
            });
        }
    };

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
            <div className="p-5 grid grid-cols-4 gap-2">
                <div className="w-full col-span-2 flex flex-col gap-4">
                    {listMenu.map((item) => {
                        return (
                            <div className="border shadow rounded-lg p-2 bg-white flex justify-start items-center gap-2" key={item.id}>
                                <div className="w-24 h-24 bg-gray-200 bg-cover bg-center rounded" style={{
                                    backgroundImage: `url("http://127.0.0.1:8000/storage/${item.pict}")`,
                                }}></div>

                                <div className="flex flex-1 justify-between items-center">
                                    <div className="w-full">
                                        <h1 className="truncate poppins-medium">{item.menuName}</h1>
                                        <h1 className="poppins-light text-gray-400 text-sm">Rp. {item.harga}</h1>
                                    </div>

                                    <div className="w-full flex justify-end gap-3">

                                        <button onClick={() => { removeMenu(item) }} className="btn-click bg-orange-400 rounded shadow w-6 h-6 flex justify-center items-center">
                                            <FiMinus className="text-xl" />
                                        </button>

                                        <button onClick={() => { addMenu(item) }} className="btn-click bg-orange-400 rounded shadow w-6 h-6 flex justify-center items-center">
                                            <IoIosAdd className="text-xl poppins-medium" />
                                        </button>

                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {selectedMenu.length > 0 ? <TotalOrderComponent statusPaid={handleStatusPaid} resetOrder={() => { setSelectedMenu([]) }} listorder={selectedMenu} /> : <>  </>}
            </div >
        </>
    )
}

export default MenuKasir