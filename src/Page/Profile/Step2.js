const Step2 = ({setStep,onChangeStep}) =>{
    return (
        <>
        <button onClick={()=>setStep(3)}>step2</button>
        <button className="ml-2" onClick={()=>onChangeStep(3)}>Next</button>

        </>
    )
}
export default Step2