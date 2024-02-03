import { combineReducers } from "redux";
import postsReducer from "../redux/post";
const rootReducer = combineReducers({
  posts: postsReducer,
});

export default rootReducer;
