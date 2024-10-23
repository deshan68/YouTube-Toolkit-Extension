import { Button } from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";

const RemoveButton = ({ buttonClick }: { buttonClick: () => void }) => {
  return (
    <Button
      variant="outlined"
      sx={{
        border: "1px solid #fff",
        borderRadius: "20px",
        color: "#fff",
        fontWeight: "600",
        fontSize: "12px",
        "&:hover": {
          bgcolor: "#fff",
          color: "#000",
        },
      }}
      startDecorator={
        <DeleteIcon
          sx={{
            fontSize: "18px",
          }}
        />
      }
      onClick={buttonClick}
    >
      Remove
    </Button>
  );
};

export default RemoveButton;
