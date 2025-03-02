import React from "react";
import { Container, Paper, Stack, Avatar, TextField, Button, IconButton, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import MicIcon from "@mui/icons-material/Mic";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { User, Post } from "../types/types";
import PostCard from "./PostCard";
//import PostInput from "./PostInput";

/**
 * Defines the props expected by the HomePage component.
 * This includes user data, post list, and handler functions.
 */
interface HomePageProps {
  loggedInUser: User;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  postContent: string;
  setPostContent: React.Dispatch<React.SetStateAction<string>>;
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  handlePost: () => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAudioUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * HomePage component that renders the main UI for user posts.
 * It includes a post input section, file upload options, and the posts list.
 */
const HomePage: React.FC<HomePageProps> = ({
  loggedInUser,
  posts,
  setPosts,
  postContent,
  setPostContent,
  selectedImage,
  //setSelectedImage,
  handlePost,
  handleImageUpload,
  handleFileUpload,
  handleAudioUpload
}) => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Post Input Section */}
      <Paper sx={{ p: 2, mb: 3, boxShadow: 3, backgroundColor: "white" }}>
        <Stack spacing={2}>
          {/* User Avatar and Text Input */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={loggedInUser.avatar} alt="User" />
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Stack>

          {/* Image Preview Section */}
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
            />
          )}

          {/* File Upload and Post Button */}
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            {/* Image Upload */}
            <input type="file" id="image-upload" hidden accept="image/*" onChange={handleImageUpload} />
            <label htmlFor="image-upload">
              <IconButton component="span">
                <ImageIcon />
                <Typography variant="caption">Photo</Typography>
              </IconButton>
            </label>

            {/* File Attachment */}
            <input type="file" id="file-upload" hidden accept="*" onChange={handleFileUpload} />
            <label htmlFor="file-upload">
              <IconButton component="span">
                <AttachFileIcon />
                <Typography variant="caption">Attach</Typography>
              </IconButton>
            </label>

            {/* Audio Upload */}
            <input type="file" id="audio-upload" hidden accept="audio/*" onChange={handleAudioUpload} />
            <label htmlFor="audio-upload">
              <IconButton component="span">
                <MicIcon />
                <Typography variant="caption">Audio</Typography>
              </IconButton>
            </label>

            {/* Post Button */}
            <Button
              variant="contained"
              startIcon={<Send />}
              disabled={!postContent.trim() && !selectedImage}
              onClick={handlePost}
            >
              Post
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Posts List Section */}
      <Stack spacing={3}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} setPosts={setPosts} loggedInUser={loggedInUser} />
        ))}
      </Stack>
    </Container>
  );
};

export default HomePage;