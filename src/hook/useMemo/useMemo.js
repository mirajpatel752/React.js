import { Button, Card, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import axios from "axios";
import Axios from "axios";

import { useMemo, useState } from "react";
import { useAsync } from "../../hooks/useAsync";

const UseMemo = () => {
  const [data, setData] = useState([]);
  const [apiType, setApiType] = useState("");

  const onFetching = () => {
    setApiType("onFetching");
    axios
      .get("https://jsonplacehcolder.typicode.com/albums/1/photos")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.log("come");
      });
  };

  const onawait = async () => {
    setApiType("onawait");
    const a = await axios.get("https://jsonplaceholder.typicode.com/albums");
    setData(a.data);
    console.log(a, "a");
  };

  const { execute, status, value, error } = useAsync((data) => {
    setApiType("execute");
    let url = "https://jsonplaceholder.typicode.com/comments";

    return postRequest(url);
  }, false);

  function postRequest(url) {
    return Axios.get(url);
  }

  const dataColumn = useMemo(() => {
    console.log("come UseMemo");
    let dataColumn = [];
    if (apiType == "onFetching") {
      dataColumn = data;
    } else if (apiType == "onawait") {
      dataColumn = data;
    } else if (apiType == "execute") {
      console.log("execute---");
      dataColumn = value.data;
    }
    return dataColumn;
  }, [data, value]);

  return (
    <>
      <div style={{ margin: "10px" }}>
        <Button type="primary" onClick={onFetching}>
          FETCHING
        </Button>
        <Button type="primary" onClick={onawait}>
          FETCHING--1
        </Button>
        <Button type="primary" onClick={execute}>
          FETCHING--2
        </Button>
      </div>
      <Row>
        {dataColumn.map((item) => (
          <>
            <Row>
              <Card
                hoverable
                style={{ width: 240, margin: "10px", borderRadius: "10px" }}
                cover={<img alt={item.id} src={item.thumbnailUrl} />}
              >
                <Meta title={item.title} description={item.email} />
              </Card>
            </Row>
          </>
        ))}
      </Row>
    </>
  );
};
export default UseMemo;
