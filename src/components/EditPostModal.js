import * as React from "react";
import Modal from "@mui/material/Modal";
import PostForm from "../features/post/PostForm";
import { Box } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditPostModal = ({ post, open, setOpen }) => {
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PostForm post={post} handleClose={handleClose} />
        </Box>
      </Modal>
    </>
  );
};

export default EditPostModal;
