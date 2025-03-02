import React, { useState } from "react";
import { Paper, Typography, TextField, Button } from "@mui/material";
import styles from "../styles/LoginPage.module.scss";

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles["login-container"]}>
      <Paper className={styles["login-box"]}>
        <Typography variant="h5">Login</Typography>
        <TextField 
          fullWidth 
          label="Username" 
          margin="normal" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <TextField 
          fullWidth 
          label="Password" 
          type="password" 
          margin="normal" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <Button 
          fullWidth 
          variant="contained" 
          onClick={() => onLogin(username, password)}
        >
          Login
        </Button>
        <Typography className={styles["signup-link"]}>
          Don't have an account? <a href="#">Sign up</a>
        </Typography>
      </Paper>
    </div>
  );
};

export default LoginPage;