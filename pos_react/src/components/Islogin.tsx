import { ReactNode, useEffect } from "react"
import useSession from "../hooks/useSession"
import { useNavigate } from "react-router-dom"

function Islogin({ children }: { children: ReactNode }) {
    const { getAuthDataFromSession } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        const authData = getAuthDataFromSession();
        if (!authData) {
            navigate('/login', { replace: true });
        }
    })

    return (
        <>
            {children}
        </>
    )
}

export default Islogin