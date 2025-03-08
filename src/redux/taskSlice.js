import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  filter: "All",
  filteredTasks: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      state.filteredTasks = state.tasks.filter((task) =>
        state.filter === "All" ? true : task.priority === state.filter
      );
    },
    removeTask: (state, action) => {
      state.tasks.splice(action.payload, 1);
      state.filteredTasks = state.tasks.filter((task) =>
        state.filter === "All" ? true : task.priority === state.filter
      );
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.filteredTasks = state.tasks.filter((task) =>
        state.filter === "All" ? true : task.priority === state.filter
      );
    },
  },
});

export const { addTask, removeTask, setFilter } = taskSlice.actions;
export default taskSlice.reducer;
