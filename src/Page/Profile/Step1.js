const Step1 = ({setStep,onChangeStep}) =>{
    return (
        <>
        <button onClick={()=>setStep(2)}>step1</button>
        <button className="ml-2" onClick={()=>onChangeStep(2)}>Next</button>

        </>
    )
}
export default Step1