const Step4 = ({setStep,onChangeStep,setCompletedStep}) =>{
    return (
        <>
        <button onClick={()=>setStep(5)}>step4</button>
        <button className="ml-2" onClick={()=>onChangeStep(5)}>Next</button>
        <button className="ml-8" onClick={() => setCompletedStep(4)}>MIRAJ</button>
        </>
    )
}
export default Step4