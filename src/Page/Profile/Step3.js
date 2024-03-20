const Step3 = ({ setStep, onChangeStep, setCompletedStep }) => {
  return (
    <>
      <button onClick={() => setStep(4)}>step3</button>
      <button className="ml-2" onClick={() => onChangeStep(4)}>
        Next
      </button>
      <button className="ml-8" onClick={() => setCompletedStep(3)}>MIRAJ</button>
    </>
  );
};
export default Step3;
