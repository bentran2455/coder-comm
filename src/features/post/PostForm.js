import React, { useCallback, useEffect } from "react";
import { FormProvider, FTextField, FUploadImage } from "../../components/form";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { alpha, Box, Card, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { createPost, editPost } from "./postSlice";

const yupSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

const defaultValues = {
  content: "",
  image: "",
};

function PostForm({ post, handleClose }) {
  const { isLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data) => {
    if (!!post) {
      const postId = post._id;
      dispatch(editPost({ postId, data }));
      handleClose();
    } else {
      dispatch(createPost(data)).then(() => reset());
    }
  };

  useEffect(() => {
    if (!!post) {
      setValue("content", post.content);
      setValue("image", post.image);
    }
  }, [post, setValue]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );
  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FTextField
            name="content"
            multiline
            fullWidth
            rows={4}
            placeholder="Share what you thinking here..."
            sx={{
              "& fieldset": {
                borderWith: "1px !important",
                borderColor: alpha("#919eab", 0.32),
              },
            }}
          />
          <FUploadImage
            name="image"
            accept={{ "image/*": [".jpeg", ".png", ".jpg"] }}
            maxSize={3145728}
            onDrop={handleDrop}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              size="small"
              loading={isSubmitting || isLoading}
            >
              {!!post ? "Edit" : "Create"}
            </LoadingButton>
          </Box>
        </Stack>
      </FormProvider>
    </Card>
  );
}

export default PostForm;
