import { IconButton, Stack, Typography } from "@mui/material";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { useDispatch } from "react-redux";
import { sendCommentReaction } from "./commentSlice";
import DeleteConfirmationModal from "../../components/DeleteConfimationModal";
import useAuth from "../../hooks/useAuth";

function CommentReaction({ comment }) {
  const [delModalOpen, setDelModalOpen] = React.useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch();

  const handleClick = (emoji) => {
    dispatch(sendCommentReaction({ commentId: comment._id, emoji }));
  };

  return (
    <>
      <DeleteConfirmationModal
        deleteType="comment"
        setOpen={setDelModalOpen}
        open={delModalOpen}
        item={comment}
      />
      <Stack direction="row" alignItems="center">
        <IconButton
          onClick={() => handleClick("like")}
          sx={{ color: "primary.main" }}
        >
          <ThumbUpRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography variant="body2" mr={1}>
          {comment?.reactions?.like}
        </Typography>

        <IconButton
          onClick={() => handleClick("dislike")}
          sx={{ color: "error.main" }}
        >
          <ThumbDownAltRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography variant="body2" mr={1}>
          {comment?.reactions?.dislike}
        </Typography>
        {user._id === comment.author._id && (
          <IconButton
            onClick={() => {
              setDelModalOpen(true);
            }}
            sx={{ color: "error.main" }}
          >
            <ClearIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Stack>
    </>
  );
}

export default CommentReaction;
