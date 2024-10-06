import React, { createContext } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

import DeleteConfirmationModal from "../../components/DeleteConfimationModal";
import EditPostModal from "../../components/EditPostModal";

export const DeleteContext = createContext();

function PostCard({ post, setPage }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useAuth();
  const [delModalOpen, setDelModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const ownPost = user._id === (post.author._id || post.author);
  const handleMenu = (event) => {
    if (!ownPost) {
      toast.warning("This is not your post");
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <DeleteContext.Provider value={setPage}>
      <Card>
        <DeleteConfirmationModal
          deleteType="post"
          setOpen={setDelModalOpen}
          open={delModalOpen}
          item={post}
        />
        <EditPostModal
          post={post}
          open={editModalOpen}
          setOpen={setEditModalOpen}
        />
        <CardHeader
          disableTypography
          avatar={
            <Avatar
              src={ownPost ? user.avatarUrl : post?.author?.avatarUrl}
              alt={ownPost ? user.name : post?.author?.name}
            />
          }
          title={
            <Link
              variant="subtitle2"
              color="text.primary"
              component={RouterLink}
              sx={{ fontWeight: 600 }}
              to={`/user/${post.author._id}`}
            >
              {ownPost ? user.name : post?.author?.name}
            </Link>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ display: "block", color: "text.secondary" }}
            >
              {fDate(post.createdAt)}
            </Typography>
          }
          action={
            <div>
              <IconButton onClick={handleMenu}>
                <MoreVertIcon sx={{ fontSize: 30 }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => setEditModalOpen(true)}>
                  Edit Post
                </MenuItem>
                <MenuItem onClick={() => setDelModalOpen(true)}>
                  Delete Post
                </MenuItem>
              </Menu>
            </div>
          }
        />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography>{post.content}</Typography>

          {post.image && (
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                height: 300,
                "& img": { objectFit: "cover", width: 1, height: 1 },
              }}
            >
              <img src={post.image} alt="post" />
            </Box>
          )}

          <PostReaction post={post} />
          <CommentList postId={post._id} />
          <CommentForm postId={post._id} />
        </Stack>
      </Card>
    </DeleteContext.Provider>
  );
}

export default PostCard;
