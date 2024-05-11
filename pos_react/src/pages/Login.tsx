import { SubmitHandler, useForm } from "react-hook-form"
import useSession from "../hooks/useSession";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";

function Login() {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const { saveAuthDataToSession } = useSession();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
  } = useForm<LoginInput>()

  useEffect(() => {
    const authDataString = sessionStorage.getItem('authData');
    if (!authDataString) {
      null;
    } else {
      const authData: LoginResponse = JSON.parse(authDataString);
      if (authData.role === 'owner') {
        navigate('/', { replace: true });
      } else if (authData.role === 'employee') {
        navigate('/kasir', { replace: true });
      }
    }
  }, [])

  const onSubmit: SubmitHandler<LoginInput> = async (dataInput) => {
    setIsloading(true);
    await axios.post('http://127.0.0.1:8000/api/login', dataInput)
      .then((res) => {
        saveAuthDataToSession(res.data.data);
        if (res.data.data.role === 'owner') {
          navigate('/', { replace: true })
        } else {
          navigate('/kasir', { replace: true })
        }
      })
      .catch((err) => {
        setErrMessage(err.response.data.message);
      })
    setIsloading(false);
  }

  return (
    <>
      {isLoading ? <LoadingComponent /> : null}

      <div className="w-full min-h-screen flex justify-center items-center bg-gray-100">
        <div className="min-w-[24rem] rounded-lg border shadow p-4 bg-white">
          {errMessage ? <ErrorMessage /> : null}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="w-full flex flex-col gap-2 mb-8">
              <label className="poppins-medium text-sm">Username</label>
              <input type="text" className="w-full border px-2 outline-none py-3 rounded-md" {...register('username')} />
            </div>

            <div className="w-full flex flex-col gap-2 mb-12">
              <label className="poppins-medium text-sm">Password</label>
              <input type="password" className="w-full border px-2 outline-none py-3 rounded-md" {...register('password')} />
            </div>

            <button className="w-full py-3 bg-orange-400 rounded-xl text-white btn-click">Login</button>
          </form>
        </div>
      </div></>
  )
}

function ErrorMessage() {
  return (
    <div className="p-2 rounded-lg bg-red-100 text-red-500 text-center mb-3">Username Atau Password Salah</div>
  )
}

export default Login