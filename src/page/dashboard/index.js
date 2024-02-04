import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDataRequest } from "../../redux/actions";
const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state);
  console.log(data, loading, error, " data, loading, error ");

  useEffect(() => {
    dispatch(fetchDataRequest());
  }, [dispatch]);
  return <>Dashboard</>;
};
export default Dashboard;
