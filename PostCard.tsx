import React, { useState } from "react";
import { Post, Comment, User } from "../types/types";
import { Paper, Typography, TextField, Button, Avatar, Stack, Divider, IconButton } from "@mui/material";
import { Favorite, ChatBubbleOutline, Share, ExpandMore, ExpandLess } from "@mui/icons-material";

const PostCard: React.FC<{ post: Post; setPosts: React.Dispatch<React.SetStateAction<Post[]>>; loggedInUser: User }> = ({ post, setPosts, loggedInUser }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleLike = () => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likes: p.likes.includes(loggedInUser.id)
                ? p.likes.filter((id) => id !== loggedInUser.id)
                : [...p.likes, loggedInUser.id],
            }
          : p
      )
    );
  };

  const addComment = (parentId: number | null, text: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      user: loggedInUser,
      text,
      replies: [],
    };

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              comments: parentId
                ? addNestedComment(p.comments, parentId, newComment)
                : [...p.comments, newComment],
            }
          : p
      )
    );
    
    setCommentText("");
    setReplyText({});
    setReplyingTo(null);
  };

  const addNestedComment = (comments: Comment[], parentId: number, newComment: Comment): Comment[] => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, newComment] };
      }
      return { ...comment, replies: addNestedComment(comment.replies, parentId, newComment) };
    });
  };

  const countComments = (comments: Comment[]): number => {
    return comments.reduce((count, comment) => count + 1 + countComments(comment.replies), 0);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={post.user.avatar} />
        <Typography variant="h6">{post.user.name}</Typography>
      </Stack>
      <Typography>{post.content}</Typography>

      {post.image && <img src={post.image} alt="Post" style={{ width: "100%", marginTop: 8, borderRadius: 5 }} />}

      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 1 }}>
        <IconButton onClick={handleLike} color={post.likes.includes(loggedInUser.id) ? "error" : "default"}>
          <Favorite /> {post.likes.length}
        </IconButton>
        <IconButton onClick={() => setShowComments(!showComments)}>
          <ChatBubbleOutline /> {countComments(post.comments)}
        </IconButton>
        <IconButton>
          <Share />
        </IconButton>
      </Stack>

      {showComments && (
        <>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1}>
            {post.comments.map((comment) => (
              <NestedComment key={comment.id} comment={comment} addComment={addComment} replyText={replyText} setReplyText={setReplyText} replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
            ))}

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                fullWidth
                label="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button variant="contained" onClick={() => addComment(null, commentText)} disabled={!commentText.trim()}>
                Add Comment
              </Button>
            </Stack>
          </Stack>
        </>
      )}
    </Paper>
  );
};

const NestedComment: React.FC<{ comment: Comment; addComment: (parentId: number | null, text: string) => void; replyText: { [key: number]: string }; setReplyText: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>; replyingTo: number | null; setReplyingTo: React.Dispatch<React.SetStateAction<number | null>> }> = ({ comment, addComment, replyText, setReplyText, replyingTo, setReplyingTo }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Stack sx={{ pl: 4, mt: 2, borderLeft: "2px solid #ddd", paddingLeft: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={comment.user.avatar} sx={{ width: 30, height: 30 }} />
        <Typography variant="body2" fontWeight="bold">
          {comment.user.name}
        </Typography>
      </Stack>
      <Typography sx={{ mt: 0.5 }}>{comment.text}</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button variant="text" size="small" sx={{ color: "#1976D2", textTransform: "none" }} onClick={() => setReplyingTo(comment.id)}>
          Reply
        </Button>
        <IconButton size="small" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Stack>
      {replyingTo === comment.id && (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Reply..."
            size="small"
            variant="outlined"
            value={replyText[comment.id] || ""}
            onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
          />
          <Button variant="contained" size="small" onClick={() => addComment(comment.id, replyText[comment.id] || "")} disabled={!replyText[comment.id]?.trim()}>
            Post
          </Button>
        </Stack>
      )}
      {expanded && comment.replies.map((reply) => (
        <NestedComment key={reply.id} comment={reply} addComment={addComment} replyText={replyText} setReplyText={setReplyText} replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
      ))}
    </Stack>
  );
};

export default PostCard;