import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./redux/taskSlice";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});
