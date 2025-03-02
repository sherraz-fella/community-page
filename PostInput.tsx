import React, { useState } from "react";
import {
  Paper,
  Stack,
  Avatar,
  Button,
  Typography,
} from "@mui/material";
import {
  Send,
  Image as ImageIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
} from "@mui/icons-material";
import { User, Post } from "../types/types";
import styles from "./PostInput.module.scss"; // Import SCSS Module

interface PostInputProps {
  loggedInUser: User;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostInput: React.FC<PostInputProps> = ({ loggedInUser, setPosts }) => {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handlePost = () => {
    if (!postContent.trim() && !selectedImage && !selectedFile && !audioFile)
      return;

    setPosts((prevPosts) => [
      ...prevPosts,
      {
        id: Date.now(),
        user: loggedInUser,
        content: postContent,
        image: selectedImage,
        file: selectedFile ? selectedFile.name : null,
        audio: audioFile ? audioFile.name : null,
        comments: [],
        likes: [],
      },
    ]);

    setPostContent("");
    setSelectedImage(null);
    setSelectedFile(null);
    setAudioFile(null);
  };

  const handleFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  return (
    <Paper className={styles["post-container"]}>
      <Stack className={styles["input-section"]}>
        <Avatar src={loggedInUser.avatar} alt="User" className={styles["user-avatar"]} />
        <input
          className={styles["post-input"]}
          placeholder="What's on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
      </Stack>

      {selectedImage && (
        <img src={selectedImage} alt="Preview" className={styles["preview-image"]} />
      )}

      <Stack className={styles["action-buttons"]}>
        <label htmlFor="image-upload" className={styles["upload-button"]}>
          <input
            type="file"
            id="image-upload"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setSelectedImage(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <ImageIcon />
          <Typography variant="caption">Photo</Typography>
        </label>

        <label htmlFor="file-upload" className={styles["upload-button"]}>
          <input
            type="file"
            id="file-upload"
            hidden
            onChange={(e) => handleFileSelection(e, setSelectedFile)}
          />
          <AttachFileIcon />
          <Typography variant="caption">Attach</Typography>
        </label>

        <label htmlFor="audio-upload" className={styles["upload-button"]}>
          <input
            type="file"
            id="audio-upload"
            hidden
            accept="audio/*"
            onChange={(e) => handleFileSelection(e, setAudioFile)}
          />
          <MicIcon />
          <Typography variant="caption">Audio</Typography>
        </label>

        <Button
          variant="contained"
          startIcon={<Send />}
          className={styles["post-button"]}
          disabled={!postContent.trim() && !selectedImage && !selectedFile && !audioFile}
          onClick={handlePost}
        >
          Post
        </Button>
      </Stack>
    </Paper>
  );
};

export default PostInput;