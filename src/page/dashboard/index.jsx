/* eslint-disable multiline-ternary */
import React, { useEffect } from "react";
import { ApiCall, GetApiCall } from "../../helper/axios";

const Dashboard = () => {
  const getImportFileLogListData = async () => {
    const header = { "access-token": localStorage.getItem("access_token") };
    const res = await GetApiCall("GET", `${"/get-import-progress"}`, header);
    if (res.data.status === "success") {
      console.log("come");
    } else {
      console.log("come22");
    }
  };
  useEffect(() => {
    getImportFileLogListData();
  }, []);

  const aliasNameCheck = async (flag, com_name, alias_name, name) => {
    formik.setFieldTouched(name);
    if (com_name !== "") {
      const header = { "access-token": localStorage.getItem("access_token") };
      const data = {
        id: location_state?.company_id,
        company_name: com_name,
        alias_name,
      };
      const res = await ApiCall(
        "POST",
        CommonApiEndPoint.check_company_name,
        data,
        header
      );
      if (res.data.statusCode === 200) {
        if (flag) {
          return res.data.data;
        } else {
          formik.setFieldValue("show_alias_name", res.data.data);
        }
      }
    }
  };

  const onchangeStatus = async (values) => {
    try {
      const header = {
        "access-token": localStorage.getItem("access_token"),
      };
      const data = {
        status: values.status === "1" ? 0 : 1,
        channel_type: Number(values.channel_type),
        id: selected_company_object.id,
      };
      const res = await ApiCall(
        "PUT",
        CommonApiEndPoint.update_connect_channel,
        data,
        header
      );
      if (res.data.status === "success") {
        handleFilter(
          {
            currentPage: 0,
            sorting: [{ id: "", desc: false }],
            columnFilters: [],
            is_filter_apply: false,
            filter_value: "",
          },
          dataList,
          location_state?.customFilterDetail?.id
        );
        notify(res.data.message, "success");
      } else {
        notify(res.data.message, "error");
      }
    } catch (error) {}
  };

  const handleDeleteAction = async (deleteID) => {
    const header = {
      "access-token": localStorage.getItem("access_token"),
      id: selected_company_object.id,
    };
    const res = await ApiCall(
      "DELETE",
      `${CommonApiEndPoint.delete_master_item}?id=${deleteID}`,
      null,
      header
    );
    if (res.data.status === "success") {
      console.log("success");
    } else {
      console.log("error");
    }
  };

  return (
    <div className="mobile-responsive-layout ">
      <div className="mb-1 position-relative justify-content-center">
        <div className="dashboard-main-layout">
          <h1> Hello e-commerce dashboard </h1>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;