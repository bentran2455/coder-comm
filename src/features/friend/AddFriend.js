import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSentFriendRequests, getUsers } from "./friendSlice";
import {
  Stack,
  Typography,
  Card,
  Box,
  TablePagination,
  Container,
  Switch,
  FormControl,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import UserTable from "./UserTable";
import SearchInput from "../../components/SearchInput";

function AddFriend() {
  const [filterName, setFilterName] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();
  const [sentRequestFilter, setSentRequestFilter] = useState(false);

  const { currentPageUsers, usersById, totalUsers } = useSelector(
    (state) => state.friend
  );

  const users = currentPageUsers.map((userId) => usersById[userId]);

  const handleChangeSent = () => {
    setSentRequestFilter((prevState) => !prevState);
  };
  const handleSubmit = (searchQuery) => {
    setFilterName(searchQuery);
  };
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (sentRequestFilter) {
      dispatch(
        getSentFriendRequests({
          filterName,
          page: page + 1,
          limit: rowsPerPage,
        })
      );
    } else {
      dispatch(getUsers({ filterName, page: page + 1, limit: rowsPerPage }));
    }
  }, [filterName, page, rowsPerPage, dispatch, sentRequestFilter]);
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Add Friends
      </Typography>
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems="center">
            <SearchInput handleSubmit={handleSubmit} />

            <Typography
              variant="subtitle"
              sx={{ color: "text.secondary", ml: 1 }}
            >
              {totalUsers > 1
                ? `${totalUsers} users found`
                : totalUsers === 1
                ? `${totalUsers} user found`
                : "No user found"}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <FormControl component="fieldset" variant="standard">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={sentRequestFilter}
                      onChange={handleChangeSent}
                      name="sentRequestFilter"
                    />
                  }
                  label="Sent Requests"
                />
              </FormGroup>
            </FormControl>

            <TablePagination
              sx={{
                "& .MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon":
                  {
                    display: { xs: "none", md: "block" },
                  },
              }}
              component="div"
              count={totalUsers ? totalUsers : 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Stack>
          <UserTable users={users} />
        </Stack>
      </Card>
    </Container>
  );
}

export default AddFriend;
