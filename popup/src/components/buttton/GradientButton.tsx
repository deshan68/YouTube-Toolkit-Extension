import { styled } from "@mui/system";
import Button from "@mui/joy/Button";

interface GradientButtonProps {
  fileName?: string;
}

const GradientButton = styled(Button)<GradientButtonProps>(({ fileName }) => ({
  width: "90%",
  background: fileName
    ? "linear-gradient(90deg, rgba(0,0,0,1) 10%, rgba(0,151,185,1) 100%)"
    : "rgba(0,0,0,1)",
  border: 0,
  borderRadius: 12,
  color: "white",
  height: 45,
  "&:hover": {
    backgroundColor: "rgba(0,0,0,1)",
  },
  ":disabled": {
    backgroundColor: "rgba(0,0,0,1)",
  },
}));

export default GradientButton;
