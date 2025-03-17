import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

interface CreatePostButtonProps {
  onClick?: () => void;
  size: number;
  state: boolean;
}

const CreateContentButton = ({
  onClick,
  size,
  state,
}: CreatePostButtonProps) => {
  return (
    <IconButton
      color="primary"
      aria-label="add"
      onClick={onClick}
      sx={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        padding: "12px",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      {state ? (
        <RemoveCircleIcon sx={{ fontSize: size }} />
      ) : (
        <AddCircleIcon sx={{ fontSize: size }} />
      )}
    </IconButton>
  );
};

export default CreateContentButton;
