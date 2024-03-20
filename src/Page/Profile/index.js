import { Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step0 from "./Step0";

const Profile = () => {
  const [state, setState] = useState();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://jsonplaceholder.typicode.com/users";
        const response = await fetch(url);
        const data = await response.json();
        setState(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        // alert("catch block")
        let userData = localStorage.getItem("user");
        setState(JSON.parse(userData));
      }
    };

    fetchData();
  }, []);

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  const [edit, setEdit] = useState(true);
  const [completedStep, setCompletedStep] = useState(edit ? 6 : 0);


  const pages = useMemo(() => {
    return {
      0: (props) => <Step0 {...props} />, // india  other option
      1: (props) => <Step1 {...props} />, // listing page  Flyremit  ,  Prefer
      2: (props) => <Step2 {...props} />, // Prefer
      3: (props) => <Step3 {...props} />, // Prefer
      4: (props) => <Step4 {...props} />,
      5: (props) => <Step5 {...props} />,
    };
  }, []);

  const onChangeStep = (stepNumber,flag) => {
    setCompletedStep(stepNumber);
    setStep(stepNumber);
  };
  const data = [0, 1, 2, 3, 4, 5];
  return (
    <>
      <div className="flex">
        <div className="ml-4 mr-4">
          {data.map((item) => {
            return (
              <div>
                <button
                  onClick={() => (completedStep >= item ? setStep(item) : null)}
                >
                  {item}
                </button>
                <br />
              </div>
            );
          })}
        </div>
        <div>
          {pages[step]({
            onChangeStep: onChangeStep,
            setStep,
            setEdit,
            setCompletedStep
          })}
        </div>
      </div>
      {/* <Table dataSource={state} columns={columns} />; */}
    </>
  );
};
export default Profile;

// CLIentID = "608745921575-qnqlgtgsuievb5474mh0pvsq91vk4eij.apps.googleusercontent.com"
// clientsecreat = "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"

// "608745921575-qnqlgtgsuievb5474mh0pvsq91vk4eij.apps.googleusercontent.com"
