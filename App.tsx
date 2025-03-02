import React, { useState } from "react";
import { Container } from "@mui/material";
import LoginPage from "./components/LoginPage";
import { User, Post } from "../src/types/types";
import HomePage from "./components/HomePage"; 

// Predefined users
const users: User[] = [
  { id: 1, name: "Aftab", avatar: "/post1.png", password: "password1" },
  { id: 2, name: "Aleza", avatar: "/post2.jpg", password: "password2" },
  { id: 3, name: "Chanda", avatar: "/post3.jpg", password: "password3" },
  { id: 4, name: "Don SRK", avatar: "/post4.jpg", password: "password4" },
  { id: 5, name: "Shiraz Faqeer", avatar: "/post5.png", password: "password5" },
];

// Predefined posts
const defaultPosts: Post[] = users.map((user, index) => ({
  id: index + 1,
  user: user,
  content: `This is a post by ${user.name}`,
  image: user.avatar,
  comments: [
    {
      id: Date.now() + index,
      user: users[(index + 1) % users.length], // Picks the next user as commenter
      text: "This is a default comment!",
      replies: [],
    },
  ],
  likes: [],
}));

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const [postContent, setPostContent] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);


  // Handle login
  const handleLogin = (username: string, password: string) => {
    const user = users.find((u) => u.name === username && u.password === password);
    if (user) setLoggedInUser(user);
  };

  // Handle new post
  const handlePost = () => {
    if (!postContent.trim() && !selectedImage) return;

    const newPost: Post = {
      id: posts.length + 1,
      user: loggedInUser!,
      content: postContent,
      image: selectedImage,
      comments: [],
      likes: [],
    };

    setPosts([newPost, ...posts]);
    setPostContent("");
    setSelectedImage(null);
    setAudioFile(null);
    setSelectedFile(null)
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the file in state
    }
  };
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file); // Store the audio file in state
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {!loggedInUser ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <HomePage
          loggedInUser={loggedInUser}
          posts={posts}
          setPosts={setPosts}
          postContent={postContent}
          setPostContent={setPostContent}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handlePost={handlePost}
          handleImageUpload={handleImageUpload}
          handleFileUpload={handleFileUpload}
          handleAudioUpload={handleAudioUpload}

        />
      )}
    </Container>
  );
};

export default App;