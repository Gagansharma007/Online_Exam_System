import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
const TestTimer = ({ duration, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    useEffect(() => {
      if (timeLeft <= 0) {
        onTimeUp();
        return;
      }
  
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
  
      return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);
  
    return (
      <Typography variant="body1">
        Time Remaining: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
      </Typography>
    );
}

export default TestTimer