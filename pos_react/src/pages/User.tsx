import { useEffect, useState } from "react";
import useSession from "../hooks/useSession";
import axios from "axios";
import EditUserComponent from "../components/EditUserComponent";
import AddUserComponent from "../components/AddUserComponent";
import DeleteUserComponent from "../components/DeleteUserComponent";
import { Flip, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function User() {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isAddForm, setAddForm] = useState<boolean>(true);
  const [checkReload, setCheckReload] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [selecteduser, setSelectedUser] = useState<string | undefined>();
  const [listUsers, setListUsers] = useState<UserType[]>([]);
  const [userData, setuserData] = useState<UserType | undefined>(undefined);
  const [userDelete, setUserDelete] = useState<UserType | undefined>(undefined);
  const [isModalDeleteActiv, setIsModalDeleteActiv] = useState<boolean>(false);
  const { getAuthDataFromSession } = useSession()

  useEffect(() => {
    const token = getAuthDataFromSession()?.token;
    setErrMessage('');
    setIsloading(true);
    axios.get('http://127.0.0.1:8000/api/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setListUsers(res.data.data);
      setIsloading(false);
    }).catch((err) => {
      setErrMessage(err);
      setIsloading(false);
    })
    setCheckReload(false)
  }, [checkReload]);

  function changeToEdit(userData: UserType, idUser?: string) {
    setAddForm(false);
    setSelectedUser(idUser);
    setuserData(userData)
  }

  function backToAdd() {
    setAddForm(true);
    setSelectedUser(undefined);
  }

  function deleteModal(userData: UserType) {
    setUserDelete(userData);
    setIsModalDeleteActiv(true);
  }

  function refreshDelete(isSuccess: boolean) {
    if (isSuccess) {
      setUserDelete(undefined);
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
      setUserDelete(undefined);
      setIsModalDeleteActiv(false);
    }
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

      {userDelete && isModalDeleteActiv && <DeleteUserComponent
        userData={userDelete}
        cancelDelete={() => setIsModalDeleteActiv(false)}
        statusDelete={refreshDelete}
      />}

      {isAddForm
        ?
        <AddUserComponent
          refreshCompoenent={() => setCheckReload(true)} />
        :
        <EditUserComponent
          refreshCompoenent={() => {
            backToAdd();
            setCheckReload(true)
          }}
          idUser={selecteduser}
          userData={userData}
          cancelEdit={backToAdd} />}

      <div className="w-full h-full mb-20 p-5 flex flex-col items-center">
        <div className="w-1/2">
          {listUsers.map((item) => {
            return (
              <div className="p-3 border bg-white shadow-md rounded flex justify-between flex-wrap mb-5" key={item.id}>
                <h1 className="text-xl poppins-medium">{item.name}</h1>
                <div className="flex items-center gap-3 justify-start mt-2 text-sm flex-wrap">
                  <button onClick={() => { changeToEdit(item, item.id) }} className="rounded-full bg-sky-400 text-white py-[2px] px-3 btn-click hover:bg-sky-600">Edit</button>
                  <button onClick={() => { deleteModal(item) }} className="rounded-full bg-red-400 text-white py-[2px] px-3 btn-click hover:bg-red-600">Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default User