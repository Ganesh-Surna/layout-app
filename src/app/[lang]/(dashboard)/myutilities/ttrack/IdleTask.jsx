import { Button, TextField } from "@mui/material";

export const IdleTask = () => {
  const { idleTask, setIdleTask } = useTimer();
  const [breakReason, setBreakReason] = useState(idleTask.description);

  const handleBreakStart = () => {
    setIdleTask({ description: breakReason, startTime: Date.now() });
  };

  return (
    <div>
      <h3>Idle Task (Break)</h3>
      <TextField
        label="Reason for Break"
        value={breakReason}
        onChange={(e) => setBreakReason(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleBreakStart}>
        Start Break
      </Button>
      {idleTask.startTime && (
        <p>
          On break for: <strong>{idleTask.description}</strong> since{" "}
          {new Date(idleTask.startTime).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};
