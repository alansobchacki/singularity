import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface CreatePostButtonProps {
  onClick?: () => void;
}

const CreatePostButton = ({ onClick }: CreatePostButtonProps) => {
  return (
    <IconButton
      color="primary"
      aria-label="add"
      onClick={onClick}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        padding: '12px',
      }}
    >
      <AddCircleIcon />
    </IconButton>
  );
};

export default CreatePostButton;
