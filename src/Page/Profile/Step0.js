const Step0 = ({setStep,onChangeStep}) =>{
    return (
        <>
        <button onClick={()=>setStep(1)}>step0</button>
        <button className="ml-2" onClick={()=>onChangeStep(1)}>Next</button>
        </>
    )
}
export default Step0