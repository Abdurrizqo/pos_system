import useSession from "../hooks/useSession"
import axios from "axios"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Flip, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserValidation = z.object({
    name: z.string()
        .min(3, { message: "minimal 3 karakter" })
        .max(120, { message: "maksimal 120 karakter" }),
    username: z.string()
        .min(3, { message: "minimal 3 karakter" })
        .max(120, { message: "maksimal 120 karakter" }),
    password: z.string()
        .min(8, { message: "minimal 8 karakter" })
        .max(20, { message: "maksimal 20 karakter" }),
});

type EditUserProp = {
    cancelEdit: () => void
    idUser?: string,
    userData?: UserType
    refreshCompoenent: () => void
}

function EditUserComponent({ cancelEdit, idUser, userData, refreshCompoenent }: EditUserProp) {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<UserInput>({ resolver: zodResolver(UserValidation) })

    useEffect(() => {
        if (userData) {
            setValue('name', userData.name);
            setValue('username', userData.username);
        }
    }, [userData]);

    const { getAuthDataFromSession } = useSession();
    const [isLoading, setIsloading] = useState<boolean>(false);

    const onSubmit: SubmitHandler<UserInput> = async (dataInput) => {
        const token = getAuthDataFromSession()?.token;

        setIsloading(true);
        await axios.put(`http://127.0.0.1:8000/api/user/${idUser}`, dataInput, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            refreshCompoenent();
        }).catch(() => {
            toast.error('Edit User Gagal, Coba Lagi', {
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
        })
        setIsloading(false);
    }



    return (
        <>
            <ToastContainer />
            <div className="w-full p-5 border-t shadow-xl fixed left-0 right-0 bottom-0 bg-white">
                <form className="w-full flex flex-wrap gap-3 items-start" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col flex-1">
                        <input disabled={isLoading ? true : false} type="text" placeholder="Nama Pegawai" className="formStyle" {...register('name')} />
                        {errors.name && <p className="text-xs text-red-400">{errors.name?.message}</p>}
                    </div>

                    <div className="flex flex-col flex-1">
                        <input disabled={isLoading ? true : false} type="text" placeholder="Username" className="formStyle" {...register('username')} />
                        {errors.username && <p className="text-xs text-red-400">{errors.username?.message}</p>}
                    </div>

                    <div className="flex flex-col flex-1">
                        <input disabled={isLoading ? true : false} type="password" placeholder="Password" className="formStyle" {...register('password')} />
                        {errors.password && <p className="text-xs text-red-400">{errors.password?.message}</p>}
                    </div>

                    <button type="submit" className={`${isLoading ? 'bg-gray-400' : 'bg-orange-400'} rounded-full px-4 py-1 text-white btn-click hover:bg-orange-500`}>Edit</button>
                    <button onClick={cancelEdit} type="submit" className=" px-4 py-1 border border-orange-400 rounded-full text-orange-400 hover:bg-orange-400 hover:text-white">Cancel</button>
                </form>
            </div>
        </>
    )
}

export default EditUserComponent