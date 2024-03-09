import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"

const GoogleLogin = () => {

    const  login  = useGoogleLogin({
        onSuccess: async(response) =>{
            try {
                const  res  = await axios.get("https://www.googleapis.com.oauth2/v3/userinfo",
                {
                    headers:{
                        Authorization:`Bearer ${response.access_token}`
                    }
                }
                )
                console.log(res,"res")
            } catch (error) {
                
            }
        }
        })
    
    return (
        <>
        <button onClick={() => login()}>
            Google  login
        </button>
        </>
    )
}
export default GoogleLogin