import { useContext } from "react";
import{ThemeContext ,FastName} from "./index"
const C =()=>{
    const fname =useContext(ThemeContext)
    const name =useContext(FastName)
    console.log(name,"name")
    return(
        <>
            <h1 style={fname}>hello {name.name}</h1>
            <h1 style={fname}>age {name.age}</h1>
        </>
    )
}
export default C;