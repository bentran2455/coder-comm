import React from "react";
import useAuth from "../../hooks/useAuth";
import { Grid, Stack } from "@mui/material";
import ProfileScoreCard from "./ProfileScoreCard";
import ProfileAbout from "./ProfileAbout";
import ProfileSocialInfo from "./ProfileSocialInfo";
import PostList from "../post/PostList";
import PostForm from "../post/PostForm";

function Profile({ profile }) {
  const { user } = useAuth();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ProfileScoreCard profile={profile} />
          <ProfileAbout profile={profile} />
          <ProfileSocialInfo profile={profile} />
        </Stack>
      </Grid>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          {user._id === profile?._id && <PostForm />}
          <PostList userId={profile._id} />
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Profile;
