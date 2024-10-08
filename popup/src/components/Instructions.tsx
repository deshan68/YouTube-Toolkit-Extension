import { Box, List, ListItem, Typography } from "@mui/joy";
import { FadedDivider } from "./FadedDivider";
import { instructions } from "../constants/constants";
import DoneIcon from "@mui/icons-material/Done";

const Instructions = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "90%" }}>
      <FadedDivider />
      <List aria-labelledby="decorated-list-demo" sx={{ p: 0, pt: 1 }}>
        {instructions.map((i, index) => (
          <ListItem key={index}>
            <DoneIcon
              fontSize="inherit"
              sx={{ color: "#989898", fontWeight: "sm" }}
            />
            <Typography
              sx={{ color: "#989898", fontWeight: "sm" }}
              fontSize="sm"
            >
              {i}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Instructions;
