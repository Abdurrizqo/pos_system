import { useEffect, useState } from "react";
import useSession from "../hooks/useSession";
import axios from "axios";

function TransaksiKasir() {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');

  const [isLoadingDetail, setIsloadingDetail] = useState<boolean>(false);
  const [errMessageDetail, setErrMessageDetail] = useState<string>('');

  const [selectedTransaksi, setSelectedTransaksi] = useState<string>('');
  const [dataDetailTransaksi, setDataDetailTransaksi] = useState<DetailTransaksiType | undefined>();
  const [listTransaksi, setListTransaksi] = useState<TransaksiResponse | undefined>(undefined);
  const { getAuthDataFromSession } = useSession()

  useEffect(() => {
    const token = getAuthDataFromSession()?.token;
    setErrMessage('');
    setIsloading(true);
    setSelectedTransaksi('');
    setDataDetailTransaksi(undefined);

    axios.get('http://127.0.0.1:8000/api/order', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setListTransaksi(res.data.data);
      setIsloading(false);
    }).catch((err) => {
      setErrMessage(err);
      setIsloading(false);
    })
  }, []);

  const showDetailTransaksi = async (idTransaksi: string) => {
    const token = getAuthDataFromSession()?.token;
    setSelectedTransaksi(idTransaksi);
    setIsloadingDetail(true);
    setDataDetailTransaksi(undefined);

    await axios.get(`http://127.0.0.1:8000/api/order/${idTransaksi}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setDataDetailTransaksi(res.data.data);
    }).catch((err) => {
      setErrMessageDetail(err);
    })
    setIsloadingDetail(false);
  }

  const changeStatusTransaksi = async (idTransaksi: string) => {
    const token = getAuthDataFromSession()?.token;

    await axios.put(`http://127.0.0.1:8000/api/order/${idTransaksi}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res.data.data)
    }).catch((err) => {
      console.log(err.response.data);
    })
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
    <div className="p-5 grid grid-cols-2 gap-5">

      <div className="w-full">
        <div className="flex flex-col gap-3">
          {listTransaksi?.order.map(item => {
            return (
              <div onClick={() => showDetailTransaksi(item.id)} className="relative w-full border rounded-lg shadow p-3 btn-click cursor-pointer" key={item.id}>
                {selectedTransaksi === item.id ? <div className="w-4 h-4 rounded-full absolute top-2 right-2 bg-orange-300"></div> : <></>}
                <p className="text-sm text-gray-400">{new Date(item.created_at).toLocaleString()}</p>
                <div className="flex justify-between items-center flex-wrap mt-3">
                  <p>{item.namaKasir}</p>
                  <p>Rp. {item.total_harga}</p>
                </div>
                {!item.isDelete ? <span className="mt-4 inline-block text-xs text-white bg-green-600 rounded-full px-4 py-[1px]">Transaksi Berhasil</span> : <span className="mt-4 inline-block text-xs text-white bg-red-600 rounded-full px-4 py-[1px]">Transaksi Dibatalkan</span>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="w-full relative">
        {(!isLoadingDetail && !dataDetailTransaksi && errMessageDetail) && (
          <div className="flex items-center gap-8 p-5 justify-center h-60 sticky top-28">
            <p className="text-gray-400 text-sm text-center">Terjadi Kesalahan, Tolong Coba Lagi</p>
          </div>
        )}

        {(isLoadingDetail && !dataDetailTransaksi) && (
          <div className="w-full sticky top-48 flex justify-center items-center">
            <div className="spinner"></div>
          </div>
        )}

        {(dataDetailTransaksi && !isLoadingDetail) && (
          <div className="w-full border rounded-lg p-3 sticky top-28">
            <div className="flex justify-between flex-wrap mb-3">
              <h1 className="poppins-bold text-xl">Pesanan</h1>
              <p className="text-sm text-gray-400">{new Date(dataDetailTransaksi.created_at).toLocaleString()}</p>
            </div>

            <div className="w-full mb-6">
              <p>Di Proses Oleh <span className="poppins-bold">{dataDetailTransaksi.namaKasir}</span></p>
            </div>

            <div className="flex flex-col gap-3 mb-8 max-h-72 overflow-auto">
              {dataDetailTransaksi.menu.map((item) => (
                <div className="p-2 border-b" key={item.id}>
                  <div className="grid grid-cols-4 w-full justify-items-center items-stretch">
                    <p>{item.namaMenu}</p>
                    <p className="text-sm text-gray-400">x{item.jumlah}</p>
                    <p className="text-sm text-gray-400">Rp. {item.hargaSatuan}</p>
                    <p>{item.jumlah * item.hargaSatuan}</p>
                  </div>
                </div>
              ))}
            </div>

            <h1 className="poppins-medium text-end text-lg">Rp. {dataDetailTransaksi.total_harga}</h1>

            {dataDetailTransaksi.isDelete ?
              <button onClick={() => changeStatusTransaksi(dataDetailTransaksi.idOrder)} className="text-white bg-green-500 px-4 py[2px] rounded-full text-sm btn-click">Simpan Transaksi</button>
              :
              <button onClick={() => changeStatusTransaksi(dataDetailTransaksi.idOrder)} className="text-white bg-red-500 px-4 py[2px] rounded-full text-sm btn-click">Batalkan Transaksi</button>}
          </div>
        )}
      </div>
    </div>
  )
}

export default TransaksiKasir