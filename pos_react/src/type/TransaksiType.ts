type TransaksiResponse = {
    order: {
        id: string,
        namaKasir: string,
        total_harga: number,
        created_at: string,
        isDelete: boolean
    }[];
    balance: number
}

type OrderMenuType = {
    created_at: string;
    hargaSatuan: number;
    id: string;
    jumlah: number;
    namaMenu: string;
    orderId: string;
    updated_at: string;
}

type DetailTransaksiType = {
    created_at: string;
    idOrder: string;
    isDelete: boolean;
    menu: OrderMenuType[];
    namaKasir: string;
    total_harga: number;
}