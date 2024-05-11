import axios from "axios";
import { useEffect, useState } from "react";
import useSession from "../hooks/useSession";
import { useSearchParams } from "react-router-dom";

function Transaksi() {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');

  const [isLoadingDetail, setIsloadingDetail] = useState<boolean>(false);
  const [errMessageDetail, setErrMessageDetail] = useState<string>('');

  const [selectedTransaksi, setSelectedTransaksi] = useState<string>('');
  const [dataDetailTransaksi, setDataDetailTransaksi] = useState<DetailTransaksiType | undefined>();
  const [listTransaksi, setListTransaksi] = useState<TransaksiResponse | undefined>(undefined);

  const [totalPendapatan, setTotalPendapatan] = useState<string>('');
  const [isValidDate, setIsValidDate] = useState<boolean>(true);

  const { getAuthDataFromSession } = useSession()

  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let url = '';
    if (!searchParams.get('mulai') && !searchParams.get('akhir')) {
      url = 'http://127.0.0.1:8000/api/order';
    } else {
      url = `http://127.0.0.1:8000/api/order?tanggalMulai=${searchParams.get('mulai')}&tanggalAkhir=${searchParams.get('akhir')}`;
    }

    const token = getAuthDataFromSession()?.token;
    setErrMessage('');
    setIsloading(true);
    setSelectedTransaksi('');
    setDataDetailTransaksi(undefined);

    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setListTransaksi(res.data.data);
      const parts = res.data.data.balance.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      setTotalPendapatan(parts.join(','));
      setIsloading(false);
    }).catch((err) => {
      setErrMessage(err);
      setIsloading(false);
    })
  }, [searchParams]);

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

  const [formData, setFormData] = useState({
    mulai: '',
    akhir: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsValidDate(true);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.akhir < formData.mulai || !formData.akhir || !formData.mulai) {
      setIsValidDate(false);
    } else {
      setSearchParams({ mulai: formData.mulai, akhir: formData.akhir });
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
      <div className="w-full p-5 sticky top-0 left-0 right-0 bg-white z-40 border-b shadow-sm flex gap-3 flex-wrap">
        <form className="w-full flex-1" onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4 items-center ">
            <div className="flex flex-wrap gap-4 items-center">
              <input type="date" className="border p-2 rounded-lg border-gray-400" name="mulai" value={formData.mulai}
                onChange={handleChange} />
              <input type="date" className="border p-2 rounded-lg border-gray-400" name="akhir" value={formData.akhir}
                onChange={handleChange} />
            </div>
            <div>
              <button type="submit" className="bg-orange-400 text-white rounded-lg py-[2px] px-4">Cari</button>
            </div>
          </div>
          {!isValidDate && <p className="text-red-400 text-xs mt-1">*Tanggal Mulai Harus Kurang Dari Tanggal Akhir</p>}
        </form>

        <div className="flex-1 flex justify-end items-center">
          <p className="text-gray-400">Total Pendapatan Rp. <span className="poppins-bold text-orange-400">{totalPendapatan}</span></p>
        </div>
      </div>

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
                  <div className="p-2 border-b" key={item.namaMenu}>
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

            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Transaksi