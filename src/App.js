import { Col, Row } from "antd";
import FormDisabledDemo from "./form/index";
import Prentice from "./prectissh/prectish";
import UseSyncExternalStore from "./hook/useSyncExternalStore/useSyncExternalStore";
import UseMemo from "./hook/useMemo/useMemo";
function App() {
  return (
    <div className="App">
      <h3>Developing user interfaces for web applications.</h3>
      <Row>
        <Col span={6}>
          {/* <Prentice /> */}
          {/* <UseSyncExternalStore /> */}
          <UseMemo />

        </Col>
        <Col offset={8} span={6}>
          {/* <FormDisabledDemo /> */}
        </Col>
      </Row>
    </div>
  );
}

export default App;
