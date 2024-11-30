'use client'
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Popover, Toolbar, Button, IconButton, List, ListItem, TextField, MenuItem, Select, InputLabel
} from "@mui/material";

const TimerContext = createContext();

export const useTimer = () => {
  return useContext(TimerContext);
};

const TimerProvider = ({ children }) => {
  const [isWorkTimerRunning, setIsWorkTimerRunning] = useState(false);
  const [workElapsedTime, setWorkElapsedTime] = useState(0);
  const [idleElapsedTime, setIdleElapsedTime] = useState(0);
  const [isIdleTimerRunning, setIsIdleTimerRunning] = useState(false);
  const [totalWorkTimeToday, setTotalWorkTimeToday] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState("");
  const [breakReason, setBreakReason] = useState("");
  const [selectedTask, setSelectedTask] = useState("");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const currentDate = new Date().toLocaleDateString();
    setTasks(savedTasks);
    setTotalWorkTimeToday(parseInt(localStorage.getItem(currentDate + ":WorkTime")) || 0);
    setIdleElapsedTime(parseInt(localStorage.getItem(currentDate + ":IdleTime")) || 0);
  }, []);

  // Save tasks in local storage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    let workInterval, idleInterval;

    if (isWorkTimerRunning) {
      workInterval = setInterval(() => {
        setWorkElapsedTime((prevTime) => prevTime + 1);
        setTotalWorkTimeToday((prevTime) => prevTime + 1);
      }, 1000);
      setIsIdleTimerRunning(false);
    } else {
      clearInterval(workInterval);
    }

    if (isIdleTimerRunning) {
      idleInterval = setInterval(() => {
        setIdleElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
      setIsWorkTimerRunning(false);
    } else {
      clearInterval(idleInterval);
    }

    return () => {
      clearInterval(workInterval);
      clearInterval(idleInterval);
    };
  }, [isWorkTimerRunning, isIdleTimerRunning]);

  const startWorkTimer = () => {
    if (!selectedTask) {
      const newTask = {
        task: currentTask,
        startTime: new Date().toISOString(),
        breakReason: "",
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
    setIsWorkTimerRunning(true);
    setIsIdleTimerRunning(false);
  };

  const stopWorkTimer = () => {
    setIsWorkTimerRunning(false);
    setIsIdleTimerRunning(true);
  };

  const resumePreviousTask = () => {
    const taskToResume = tasks.find(task => task.task === selectedTask);
    if (taskToResume) {
      const updatedTask = {
        ...taskToResume,
        startTime: new Date().toISOString(),
      };
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task === selectedTask ? updatedTask : task
        )
      );
      setIsWorkTimerRunning(true);
      setIsIdleTimerRunning(false);
    }
  };

  const handleBreakReasonChange = (e) => {
    setBreakReason(e.target.value);
  };

  return (
    <TimerContext.Provider
      value={{
        startWorkTimer,
        stopWorkTimer,
        resumePreviousTask,
        totalWorkTimeToday,
        workElapsedTime,
        idleElapsedTime,
        tasks,
        currentTask,
        setCurrentTask,
        setBreakReason,
        breakReason,
        selectedTask,
        setSelectedTask,
        handleBreakReasonChange,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const WorkTimer = () => {
  const {
    workElapsedTime, startWorkTimer, stopWorkTimer, resumePreviousTask,
    tasks, currentTask, setCurrentTask, selectedTask, setSelectedTask
  } = useTimer();

  return (
    <div>
      <h3>Work Timer</h3>
      <div>
        <TextField
          label="Current Task"
          value={currentTask}
          onChange={(e) => setCurrentTask(e.target.value)}
          disabled={!!selectedTask}
        />
        <InputLabel id="select-task-label">Select Previous Task</InputLabel>
        <Select
          labelId="select-task-label"
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {tasks.map((task, index) => (
            <MenuItem key={index} value={task.task}>{task.task}</MenuItem>
          ))}
        </Select>
      </div>
      <Button onClick={startWorkTimer}>Start New Task</Button>
      <Button onClick={resumePreviousTask}>Resume Selected Task</Button>
      <Button onClick={stopWorkTimer}>Stop</Button>
      <div>
        Time Elapsed: {Math.floor(workElapsedTime / 60)}:{workElapsedTime % 60}
      </div>
    </div>
  );
};

export const IdleTimer = () => {
  const { idleElapsedTime, breakReason, handleBreakReasonChange } = useTimer();

  return (
    <div>
      <h3>Idle Timer</h3>
      <TextField
        label="Break Reason"
        value={breakReason}
        onChange={handleBreakReasonChange}
      />
      <div>Idle Time: {Math.floor(idleElapsedTime / 60)}:{idleElapsedTime % 60}</div>
    </div>
  );
};

const TimerApp = () => {
  return (
    <TimerProvider>
      <div>
        <WorkTimer />
        <IdleTimer />
        <TaskList />
      </div>
    </TimerProvider>
  );
};

export const TaskList = () => {
  const { tasks } = useTimer();

  return (
    <div>
      <h3>Task List</h3>
      <List>
        {tasks.map((task, index) => (
          <ListItem key={index}>
            Task: {task.task} - Started at: {new Date(task.startTime).toLocaleTimeString()} - Break Reason: {task.breakReason}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TimerApp;
