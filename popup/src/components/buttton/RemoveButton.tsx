import { Button } from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";

const RemoveButton = ({ buttonClick }: { buttonClick: () => void }) => {
  return (
    <Button
      size="md"
      variant="outlined"
      sx={{
        border: "1px solid white",
        borderRadius: "20px",
        color: "white",
        fontWeight: "md",
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
      startDecorator={<DeleteIcon fontSize="small" />}
      onClick={buttonClick}
    >
      Remove
    </Button>
  );
};

export default RemoveButton;
