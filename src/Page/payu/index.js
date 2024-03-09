import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Container,
  Form,
} from "reactstrap";
import { ApiCall, GetApiCall } from "../../helper/axios";
const AffordabilityWidget = () => {
  const [formData, setFormData] = useState({
    key: "",
    txnid: "",
    amount: 0,
    productinfo: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    hash: "",
    surl: "",
    furl: "",
    payu_url: "",
  });

  const getPaymentDataForPayU = async (data) => {
    const header = {
      "access-token": localStorage.getItem("access_token"),
      id: "NTA3cnB1dG02YzZTUCs0cW1jZnJ4VC9MbVFmN3BUdFk5L3VtTDNiN09BWndmRllJRnF6ZGM1bG5pS2k0NWpuamJwQUFwR3BZZHhrSXVLd09FYTFIQmc9PQ==",
    };
    const res = await ApiCall("POST", "/continue-payment", data, header);
    if (res.data.status === "success") {
        setFormData(res.data.data);
    }
    document.getElementById("pay-u-submit-button").click();
  };

  console.log(formData,"formData")
  const checkPaymentMethod = async (planData) => {
    console.log(planData, "planData");
    const header = {
      "access-token": localStorage.getItem("access_token"),
      id: "NTA3cnB1dG02YzZTUCs0cW1jZnJ4VC9MbVFmN3BUdFk5L3VtTDNiN09BWndmRllJRnF6ZGM1bG5pS2k0NWpuamJwQUFwR3BZZHhrSXVLd09FYTFIQmc9PQ==",
    };
    const res = await GetApiCall("GET", "/check-payment-method", header);
    if (res?.data?.status === "success") {
      getPaymentDataForPayU(planData);
    }
  };

  useEffect(() => {
    const jsonData = `{
      "plan_data": [
          {
              "subs_type": 1,
              "plan_name": "Complete Business Solution ",
              "value": 1,
              "subs_txn_type": 1,
              "plan_type": 1
          }
      ],
      "subscription_type": "buy_now",
      "user_count": 0,
      "subs_type": 1,
      "gstapi_credit": "",
      "add_user": false,
      "company_id": "NTA3cnB1dG02YzZTUCs0cW1jZnJ4VC9MbVFmN3BUdFk5L3VtTDNiN09BWnY4OGdVTzJ6eDRZdUQyS2JuOVQxSXRsSW9naGIxSUp5YUF4dXgrak9kbVE9PQ==",
      "fname": "vjhvghv",
      "title": "vjhvghv jvjvjvh",
      "lname": "jvjvjvh",
      "address1": "317, 3, Silver Empire",
      "address2": "Mota Varachha Main Road, Surat",
      "city": "SURAT",
      "pincode": 394105,
      "state": 12,
      "country": 101,
      "email": "admin123@gmail.com",
      "mobile": "8140005609",
      "company_name": "BMAD & CO",
      "gst_in": "24AAZFB0707C1ZQ",
      "discount_code": "",
      "discount_id": "",
      "taxable_amt": "999.00",
      "gst_per": 18,
      "gst_amt": 179.82,
      "igst_amt": 0,
      "sgst_amt": 89.91,
      "cgst_amt": 89.91,
      "discount_amt": "0.00",
      "total_amt": "1178.82",
      "address_id": "VGhSWWtSZllFL0Nxb29iNHVzYkplZG9hSkU5bFhQbGkxRmh4VFl4UTFhdFNSUkZ2bFpYVFVGRXBtTXpFSklUaDdRdW1JSXNTcFRNL0pzOG9ERkd2Ync9PQ==",
      "subtotal_amt": "999.00",
      "plan_id": "2",
      "is_aff_disc": 0
    }`;
    const parsedData = JSON.parse(jsonData);
    if (parsedData) {
      checkPaymentMethod(parsedData);
    }
  }, []);

  return (
    <>

      <div className="hidden">
        <Container>
          <Form action={formData.payu_url} method="post">
            <Row className="pt-sm-2">
              <Col>
                <input type="text" name="key" value={formData.key}></input>
              </Col>
              <Col>
                <input type="" name="txnid" value={formData.txnid}></input>
              </Col>
              <Col>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                ></input>
              </Col>
              <Col>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                ></input>
              </Col>
              <Col>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                ></input>
              </Col>
              <Col>
                <input type="text" name="email" value={formData.email}></input>
              </Col>
              <Col>
                <input type="text" name="phone" value={formData.phone}></input>
              </Col>
              <Col>
                <input
                  type="text"
                  name="productinfo"
                  value={formData.productinfo}
                ></input>
              </Col>
              <Col>
                <input type="text" name="surl" value={formData.surl}></input>
              </Col>
              <Col>
                <input type="text" name="furl" value={formData.furl}></input>
              </Col>
              <Col>
                <input type="text" name="hash" value={formData.hash}></input>
              </Col>
              <Col sm>
                <button type="submit" id="pay-u-submit-button">
                  Pay
                </button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default AffordabilityWidget;


// https://stage.themunim.com/payment-success/caa390c3-da54-4dc4-8c06-7336cb81a31d
// https://docs.payu.in/docs/test-cards-upi-id-and-wallets