import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import useSession from "../hooks/useSession";
import axios from "axios";
import LoadingComponent from "./LoadingComponent";

type TotalOrderProps = {
    listorder: OrderInput[],
    resetOrder: () => void,
    statusPaid: (isPaid: boolean) => void,
}

function TotalOrderComponent({ listorder, resetOrder, statusPaid }: TotalOrderProps) {
    const [totalHarga, setTotalHarga] = useState<number>(0);
    const [nilaiKembali, setNilaiKembali] = useState<string>('');
    const [totalTerbilang, setTotalTerbilang] = useState<string>('');
    const [izinBayar, setIzinBayar] = useState<boolean>(false);
    const { getAuthDataFromSession } = useSession();
    const [isLoading, setIsloading] = useState<boolean>(false);

    const {
        register,
        watch,
        handleSubmit,
    } = useForm<{ totalBayar: number }>()

    const watchTotalBayar = watch('totalBayar', 0);

    const onSubmit: SubmitHandler<{ totalBayar: number }> = async () => {
        const token = getAuthDataFromSession()?.token;

        setIsloading(true);
        await axios.post('http://127.0.0.1:8000/api/order', { 'totalHarga': totalHarga, 'menu': listorder }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            statusPaid(true)
            resetOrder()
        }).catch(() => {
            statusPaid(false)
        })
        setIsloading(false);
    }

    useEffect(() => {
        const amount = listorder.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.totalHargaSatuan;
        }, 0);

        const parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        setTotalTerbilang(parts.join(','));
        setTotalHarga(amount);
    }, [listorder])

    useEffect(() => {
        const amount = watchTotalBayar - totalHarga;
        if (amount >= 0) {
            const parts = amount.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            setNilaiKembali(parts.join('.'));
            setIzinBayar(true);
        } else {
            setNilaiKembali('');
            setIzinBayar(false);
        }
    }, [watchTotalBayar, totalHarga]);

    return (
        <>
            {isLoading ? <LoadingComponent /> : null}

            <div className="w-full col-span-2 relative">
                <div className="w-full border rounded-lg p-3 sticky top-28">
                    <div className="flex justify-between flex-wrap mb-6">
                        <h1 className="poppins-bold text-xl">Pesanan</h1>
                        <button onClick={resetOrder} className="text-sm text-red-400 poppins-medium active:scale-95 hover:scale-105">Reset</button>
                    </div>

                    <div className="flex flex-col gap-3 mb-8 max-h-60 overflow-auto">
                        {listorder.map((item) => {
                            return (
                                <div className="p-2 border-b" key={item.namaMenu}>
                                    <div className="grid grid-cols-4 w-full justify-items-center items-stretch">
                                        <p>{item.namaMenu}</p>
                                        <p className="text-sm text-gray-400">x{item.jumlah}</p>
                                        <p className="text-sm text-gray-400">Rp. {item.hargaSatuan}</p>
                                        <p>{item.totalHargaSatuan}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <h1 className="poppins-medium text-end text-lg">Rp. {totalTerbilang}</h1>

                    <form className="w-full mt-3" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex items-end gap-3 flex-col w-full mb-3">
                            <input type="number" className="w-1/3 text-end bg-white border shadow-orange-50 outline-none px-2 py-2 rounded-lg border-orange-400"  {...register('totalBayar')} />
                            {nilaiKembali ? <h1 className="poppins-medium text-end text-gray-400">Kembali Rp. {nilaiKembali}</h1> : <></>}
                        </div>
                        <button type="submit" disabled={!izinBayar} className={`w-full text-white text-center rounded-lg py-3 cursor-pointer ${izinBayar ? 'bg-orange-400' : 'bg-gray-400'}`}>Bayar</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default TotalOrderComponent