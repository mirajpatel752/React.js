import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, postsSelector } from "../redux/post";
const Dashboard = () => {
  const dispatch = useDispatch();
  const { posts, loading, hasErrors } = useSelector(postsSelector);
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);
  return <>Dashboard</>;
};
export default Dashboard;
