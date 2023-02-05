import { useSelector, useDispatch } from 'react-redux';
import { selectCount } from '../reduxStore/container/container';
const ShowData = ()=>{
    const count = useSelector(selectCount);
    console.log(count,"count")
    return(
        <>
         <h5>{count.name}</h5>
         <h5>{count.select}</h5>
         <h5>{count.number}</h5>
         <h5>{count.messages}</h5>


        </>
    )
}

export default ShowData;