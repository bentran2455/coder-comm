import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch } from "react-redux";
import { deletePost } from "../features/post/postSlice";
import { LoadingButton } from "@mui/lab";
import { deleteComment } from "../features/comment/commentSlice";
import { DeleteContext } from "../features/post/PostCard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DeleteConfirmationModal = ({ deleteType, setOpen, open, item }) => {
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const setPage = React.useContext(DeleteContext);

  const handleDelete = () => {
    switch (deleteType) {
      case "post":
        dispatch(deletePost(item));
        setPage(0);
        break;
      case "comment":
        dispatch(deleteComment(item));

        break;
      default:
        return;
    }
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you really want to delete this {deleteType}?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            This {deleteType} will be lost forever.
          </Typography>
          <Box width="100%" display="flex" justifyContent="flex-end">
            <LoadingButton
              onClick={handleDelete}
              variant="contained"
              size="small"
              style={{ backgroundColor: "#ff5555" }}
            >
              Delete
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteConfirmationModal;
