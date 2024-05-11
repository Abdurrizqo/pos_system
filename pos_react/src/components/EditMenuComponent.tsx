import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form"
import useSession from "../hooks/useSession";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const MenuValidation = z.object({
    menuName: z.string()
        .min(3, { message: "minimal 3 karakter" })
        .max(120, { message: "maksimal 120 karakter" }),
    harga: z.string()
        .regex(/^\d+$/, 'nilai tidak valid'),
    pict: z.custom<FileList>()
        .nullable()
        .transform((file) => file && file.length > 0 && file)
        .refine((file) => !file || (!!file && file[0]?.size <= 2 * 1024 * 1024), {
            message: "maksimal 2mb.",
        })
        .refine((file) => !file || (!!file && file[0]?.type?.startsWith("image")), {
            message: "harus berupa file gambar.",
        }),
});

type AddMenuProps = {
    cancelEdit: () => void
    menuData?: MenuType
    statusEdit: (isPaid: boolean) => void
}

function EditMenuComponent({ cancelEdit, menuData, statusEdit }: AddMenuProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<MenuInput>({ resolver: zodResolver(MenuValidation) })
    const [previewUrl, setPreviewUrl] = useState<any>(null);
    const { getAuthDataFromSession } = useSession()
    const [isLoading, setIsloading] = useState<boolean>(false);

    useEffect(() => {
        if (menuData) {
            setValue('harga', menuData.harga.toString());
            setValue('menuName', menuData.menuName);
        }
    }, [])

    const onSubmit: SubmitHandler<MenuInput> = async (dataInput) => {
        const token = getAuthDataFromSession()?.token;

        setIsloading(true);
        const formData = new FormData();

        formData.append('menuName', dataInput.menuName);
        formData.append('harga', dataInput.harga);
        dataInput.pict && formData.append('pict', dataInput.pict[0], dataInput.pict[0].name);

        await axios.post(`http://127.0.0.1:8000/api/menu/${menuData?.id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            statusEdit(true);
        }).catch(() => {
            statusEdit(false);
        })
        setIsloading(false);
    }

    useEffect(() => {
        const subscription = watch((value) => {
            if (!value.pict) {
                return;
            }

            const reader = new FileReader();

            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            }

            reader.readAsDataURL(value.pict[0]);
        }
        )
        return () => subscription.unsubscribe()
    }, [watch])

    return (
        <div className='fixed z-40 top-0 bottom-0 left-0 right-0 bg-black/40'>
            <div className="w-full h-full flex gap-3 items-center justify-center">
                <div className="min-w-[24rem] max-w-[32rem] max-h-[36rem] bg-white rounded-lg p-5">
                    <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                        {previewUrl ? (<div className="flex justify-center">
                            <img className="w-28 h-28" src={previewUrl} />
                        </div>) : null}

                        <div className="w-full flex flex-col">
                            <input disabled={isLoading ? true : false} type="text" placeholder="Nama Menu" className="formStyle"  {...register('menuName')} />
                            {errors.menuName && <p className="text-xs text-red-400 pl-2">{errors.menuName.message}</p>}
                        </div>

                        <div className="w-full">
                            <div className="flex gap-3 justify-center items-center w-full">
                                <input disabled={isLoading ? true : false} type="number" placeholder="Harga" className="formStyle" {...register('harga')} />

                                <label htmlFor="fileInput" className={`customFileUpload ${isLoading ? 'bg-gray-400' : 'bg-orange-400'}`}>
                                    + Gambar
                                    <input id="fileInput" type="file" style={{ display: "none" }} {...register('pict')} />
                                </label>
                            </div>
                            {errors.harga && <p className="text-xs text-red-400 pl-2">{errors.harga.message}</p>}
                            {errors.pict && <p className="text-xs text-red-400 pl-2">{errors.pict.message}</p>}
                        </div>

                        <div className="w-full flex gap-3 items-center">
                            <button disabled={isLoading ? true : false} type="button" onClick={cancelEdit} className="flex-1 border border-red-400 rounded-full py-1 text-white bg-red-400 hover:bg-red-500 hover:text-white">Batal</button>
                            <button disabled={isLoading ? true : false} type="submit" className="flex-1 border border-orange-400 rounded-full py-1 text-orange-400 hover:bg-orange-400 hover:text-white">Edit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditMenuComponent