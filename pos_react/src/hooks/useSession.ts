import axios from "axios";

function useSession() {
  const saveAuthDataToSession = (authData: LoginResponse) => {
    const authDataString = JSON.stringify(authData);
    sessionStorage.setItem('authData', authDataString);
  }

  const getAuthDataFromSession = () => {
    const authDataString = sessionStorage.getItem('authData');
    if (!authDataString) {
      window.location.replace('/login');
      return null;
    } else {
      const authData: LoginResponse = JSON.parse(authDataString);
      return authData;
    }
  }

  const removeSession = async () => {
    const token = getAuthDataFromSession()?.token;
    sessionStorage.clear();
    await axios.get('http://127.0.0.1:8000/api/logout', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    window.location.replace('/login');
  }

  return { saveAuthDataToSession, getAuthDataFromSession, removeSession };
}

export default useSession;
