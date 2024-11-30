'use client';
import React, { useState, useEffect } from 'react';
import { Button, TextField, Select, MenuItem } from '@mui/material';

const TaskManager = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    return storedTasks || [];
  });
  const [taskName, setTaskName] = useState('');
  const [currentTask, setCurrentTask] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [breakReason, setBreakReason] = useState('');
  const [taskStartTime, setTaskStartTime] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    if (taskStartTime) {
      const timerId = setInterval(() => {
        console.log('Timer is running');
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [taskStartTime]);

  const startTask = () => {
    const newTask = {
      id: tasks.length + 1,
      name: taskName || `Task ${tasks.length + 1}`,
      startTime: new Date(),
      endTime: null,
      type: 'work',
    };
    setTasks([...tasks, newTask]);
    setCurrentTask(newTask);
    setTaskStartTime(new Date());
    setIsWorking(true);
    setTaskName('');
    localStorage.setItem('tasks', JSON.stringify([...tasks, newTask]));
  };

  const resumeTask = () => {
    const resumedTask = {
      ...currentTask,
      id: tasks.length + 1,
      startTime: new Date(),
      endTime: null,
    };
    setTasks([...tasks, resumedTask]);
    setCurrentTask(resumedTask);
    setTaskStartTime(new Date());
    setIsWorking(true);
    localStorage.setItem('tasks', JSON.stringify([...tasks, resumedTask]));
  };

  const takeBreak = () => {
    const breakEntry = {
      id: tasks.length + 1,
      name: breakReason || 'Break',
      startTime: taskStartTime,
      endTime: new Date(),
      type: 'break',
    };
    const updatedTasks = [...tasks, breakEntry];
    setTasks(updatedTasks);
    setCurrentTask(null);
    setTaskStartTime(null);
    setIsWorking(false);
    setBreakReason('');
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const selectTaskToResume = (taskId) => {
    const taskToResume = tasks.find((task) => task.id === taskId);
    setSelectedTaskId(taskId);
    setCurrentTask(taskToResume);
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <div>
        {!isWorking ? (
          <>
            <TextField
              label="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <Button variant="contained" onClick={startTask}>
              Start Task
            </Button>
          </>
        ) : (
          <>
            <TextField
              label="Break Reason"
              value={breakReason}
              onChange={(e) => setBreakReason(e.target.value)}
            />
            <Button variant="contained" onClick={takeBreak}>
              Take Break
            </Button>
            <Button variant="contained" onClick={resumeTask}>
              Resume Task
            </Button>
          </>
        )}
      </div>

      <div>
        <h3>Task History</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.name} | Start: {new Date(task.startTime).toLocaleTimeString()}{' '}
              {task.endTime && `| End: ${new Date(task.endTime).toLocaleTimeString()}`}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Resume Previous Task</h3>
        <Select
          value={selectedTaskId}
          onChange={(e) => selectTaskToResume(e.target.value)}
        >
          {tasks.map((task) => (
            <MenuItem key={task.id} value={task.id}>
              {task.name}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={resumeTask}>
          Resume Selected Task
        </Button>
      </div>
    </div>
  );
};

export default TaskManager;
