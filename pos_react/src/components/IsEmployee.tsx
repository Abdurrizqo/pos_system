import { ReactNode, useEffect } from "react"
import useSession from "../hooks/useSession"
import { useNavigate } from "react-router-dom"

function IsEmployee({ children }: { children: ReactNode }) {
    const { getAuthDataFromSession } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        const authData = getAuthDataFromSession();
        if (authData?.role === 'owner') {
            navigate('/', { replace: true });
        }
    })

    return (
        <>
            {children}
        </>
    )
}

export default IsEmployee