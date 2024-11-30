import { Button, TextField } from "@mui/material";

export const WorkTask = () => {
    const { currentTask, setCurrentTask } = useTimer();
    const [taskDescription, setTaskDescription] = useState(currentTask.description);
  
    const handleTaskStart = () => {
      setCurrentTask({ description: taskDescription, startTime: Date.now() });
    };
  
    return (
      <div>
        <h3>Current Work Task</h3>
        <TextField
          label="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleTaskStart}>
          Start Task
        </Button>
        {currentTask.startTime && (
          <p>
            Working on: <strong>{currentTask.description}</strong> since{" "}
            {new Date(currentTask.startTime).toLocaleTimeString()}
          </p>
        )}
      </div>
    );
  };
  