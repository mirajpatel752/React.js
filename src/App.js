import { Col, Row } from "antd";
import FormDisabledDemo from "./form/index";
import Prentice from "./prectissh/prectish";
function App() {
  return (
    <div className="App">
      <h3>Developing user interfaces for web applications.</h3>
      <Row>
        <Col span={6}>
          <Prentice />
        </Col>
        <Col offset={8} span={6}>
          <FormDisabledDemo />
        </Col>
      </Row>
    </div>
  );
}

export default App;
