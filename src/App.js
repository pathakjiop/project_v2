import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import CloudIcon from "@mui/icons-material/Cloud";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addTask, removeTask, setFilter } from "./redux/taskSlice";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const drawerWidth = 280;

const App = () => {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("New York");

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.filteredTasks);
  const allTasks = useSelector((state) => state.tasks.tasks);

  // Count tasks by priority for Pie Chart
  const highCount = allTasks.filter((t) => t.priority === "High").length;
  const mediumCount = allTasks.filter((t) => t.priority === "Medium").length;
  const lowCount = allTasks.filter((t) => t.priority === "Low").length;

  // Fetch Weather Data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_OPENWEATHER_API_KEY&units=metric"
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather data", error);
      }
    };
    fetchWeather();
  }, [location]);

  const handleAddTask = () => {
    if (task.trim() !== "") {
      dispatch(addTask({ text: task, priority }));
      setTask("");
    }
  };

  const handleDeleteTask = (index) => {
    dispatch(removeTask(index));
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            padding: 2,
          },
        }}
      >
        {/* Profile Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Avatar
            src="https://via.placeholder.com/100"
            sx={{ width: 80, height: 80, marginBottom: 1 }}
          />
          <Typography variant="h6">John Doe</Typography>
          <Typography variant="body2" color="textSecondary">
            Developer
          </Typography>
        </Box>
        <List>
          <ListItem button onClick={() => dispatch(setFilter("All"))}>
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
            <ListItemText primary="All Tasks" />
          </ListItem>
          <ListItem button onClick={() => dispatch(setFilter("High"))}>
            <ListItemIcon>
              <CloudIcon />
            </ListItemIcon>
            <ListItemText primary="High Priority" />
          </ListItem>
          <ListItem button onClick={() => dispatch(setFilter("Medium"))}>
            <ListItemIcon>
              <CloudIcon />
            </ListItemIcon>
            <ListItemText primary="Medium Priority" />
          </ListItem>
          <ListItem button onClick={() => dispatch(setFilter("Low"))}>
            <ListItemIcon>
              <CloudIcon />
            </ListItemIcon>
            <ListItemText primary="Low Priority" />
          </ListItem>
        </List>
        <br />
        <br />
        {/* Pie Chart */}
        <Grid item xs={4}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6">Task Distribution</Typography>
            <Pie
              data={{
                labels: ["High", "Medium", "Low"],
                datasets: [
                  {
                    data: [highCount, mediumCount, lowCount],
                    backgroundColor: ["#ff6b6b", "#feca57", "#1dd1a1"],
                  },
                ],
              }}
            />
          </Card>
        </Grid>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f8f9fa" }}
      >
        {/* Top Navigation Bar */}
        <AppBar position="static" sx={{ backgroundColor: "#2E3B55" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Task Manager
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Weather Display */}
        {weather && (
          <Box
            sx={{
              background: "#e3f2fd",
              padding: 2,
              borderRadius: 2,
              marginTop: 2,
            }}
          >
            <Typography variant="h6">
              Weather in {location}: {weather.main.temp}°C,{" "}
              {weather.weather[0].description}
            </Typography>
          </Box>
        )}

        {/* Task Input */}
        <Box
          sx={{
            padding: 2,
            marginTop: 2,
            background: "#fff",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6">Add A Task</Typography>
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Task"
                fullWidth
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <Select
                fullWidth
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                fullWidth
                sx={{ height: "100%" }}
                onClick={handleAddTask}
              >
                Add Task
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Task List and Pie Chart */}
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          <Grid item xs={8}>
            {tasks.length > 0 ? (
              tasks.map((t, index) => (
                <Card
                  key={index}
                  sx={{
                    background:
                      t.priority === "High"
                        ? "#ffebee"
                        : t.priority === "Medium"
                        ? "#fff3e0"
                        : "#e8f5e9",
                    marginTop: 2,
                  }}
                >
                  <CardContent
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography>{t.text}</Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        Priority: {t.priority}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => handleDeleteTask(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography sx={{ marginTop: 2 }}>No tasks found.</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default App;
