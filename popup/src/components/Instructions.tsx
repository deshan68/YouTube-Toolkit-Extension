import { Box, List, ListItem, Typography } from "@mui/material";
import { instructions } from "../constants/constants";

const Instructions = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "90%",
        bgcolor: "#262626",
        borderRadius: "20px",
        // px: 1,
        py: 1.5,
        my: 1,
      }}
    >
      <List sx={{ p: 0 }} dense={true} disablePadding={false}>
        {instructions.map((i, index) => (
          <ListItem key={index}>
            <Typography sx={{ color: "#989898", fontSize: "12px" }}>
              {i}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Instructions;
