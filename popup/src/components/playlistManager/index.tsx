import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  colorsArray,
  defaultPlaylist,
  InputFieldStyles,
  slideIn,
} from "../../constants/constants";
import { useEffect, useState } from "react";
import SavedVideos from "../SavedVideos";
import { PlaylistItem } from "../../utils/types";
import { getStorage, setStorage } from "../../../../shared/chrome-utils";

interface SetPlaylistFunction<T> {
  (updateFunction: (prevPlayList: T) => T): void;
}

const PlaylistManager = ({
  clickedPlayListItemId,
  setClickedPlayListItemId,
  setTitle,
}: {
  clickedPlayListItemId: number | null;
  setClickedPlayListItemId: (id: number | null) => void;
  setTitle: (title: string) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [playList, setPlayList] = useState<PlaylistItem[]>(defaultPlaylist);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickItem = (id: number, title: string) => {
    setClickedPlayListItemId(null);
    setTitle(title);
    setClickedPlayListItemId(id);
  };

  const getStoredPlayList = async () => {
    const storedPlayList = await getStorage<PlaylistItem[]>("playlist");

    if (storedPlayList) setPlayList(storedPlayList);
  };

  useEffect(() => {
    getStoredPlayList();
  }, []);

  if (clickedPlayListItemId) {
    return (
      <Box
        sx={{
          animation: `${slideIn} 0.2s ease-in-out`,
        }}
      >
        <SavedVideos
          clickedPlayListItemId={clickedPlayListItemId}
          playList={playList}
          setPlayList={setPlayList}
        />
      </Box>
    );
  }

  return (
    <>
      {/* floating button */}
      <Box
        sx={{
          position: "absolute",
          bottom: "12%",
          right: "5%",
          bgcolor: "#fff",
          width: "70px",
          height: "36px",
          borderRadius: "18px",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}
        onClick={handleClickOpen}
      >
        <Typography
          sx={{
            fontSize: "12px",
          }}
        >
          New
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 0.5,
          overflowY: "auto",
          minHeight: "520px",
        }}
      >
        {playList.map((i) => (
          <Box
            key={i.folderName}
            onClick={() => handleClickItem(i.id, i.folderName)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 0.5,
              "&:hover": {
                cursor: "pointer",
                bgcolor: "#262626",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: 1,
              }}
            >
              <Box
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  bgcolor: i.folderColor,
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontSize: "12px", color: "#fff" }}>
                  {i.folderName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#989898",
                    fontStyle: !i.folderDescription ? "italic" : null,
                  }}
                >
                  {i.folderDescription || <>No Description</>}
                </Typography>
              </Box>
            </Box>
            <NavigateNextIcon sx={{ fontSize: "14px", color: "#fff" }} />
          </Box>
        ))}

        <AddNewPlayListDialog
          open={open}
          handleClose={handleClose}
          setPlayList={setPlayList}
        />
      </Box>
    </>
  );
};

export default PlaylistManager;

const AddNewPlayListDialog = ({
  open,
  handleClose,
  setPlayList,
}: {
  open: boolean;
  handleClose: () => void;
  setPlayList: SetPlaylistFunction<PlaylistItem[]>;
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [folderColor, setFolderColor] = useState<string>("#fff");
  const [error, setError] = useState<boolean>(false);

  const handleCreatePlayList = async () => {
    if (!title) {
      setError(true);
      return;
    }

    let newPlaylist;
    setPlayList((prev) => {
      newPlaylist = [
        ...prev,
        {
          id: Math.floor(Math.random() * 1001),
          folderDescription: description,
          folderName: title,
          videoIdList: [],
          folderColor: folderColor,
        },
      ];
      return newPlaylist;
    });
    await setStorage("playlist", JSON.stringify(newPlaylist));

    handleClose();
    setError(false);
    setTitle("");
    setDescription("");
    setFolderColor("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          bgcolor: "#1E1E1E",
          p: 0,
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ fontSize: "14px", color: "#fff", fontWeight: "bold", pb: 1.5 }}
      >
        New Playlist
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 1.5,
        }}
      >
        <input
          placeholder="Title"
          style={InputFieldStyles}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          style={InputFieldStyles}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1 }}>
          {colorsArray.map((i: string) => (
            <Box
              sx={{
                height: "20px",
                width: "20px",
                bgcolor: i,
                borderRadius: "10px",
                cursor: "pointer",
                border: folderColor === i ? "1px solid white" : "none",
              }}
              onClick={() => setFolderColor(i)}
            />
          ))}
        </Box>
        {error && (
          <Typography sx={{ fontSize: "10px", color: "red" }}>
            Title required
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            bgcolor: "#1E1E1E",
            width: "65px",
            height: "26px",
            borderRadius: "18px",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            border: "1px solid #fff",
          }}
          onClick={() => {
            setTitle("");
            setDescription("");
            setFolderColor("");
            setError(false);
            handleClose();
          }}
        >
          <Typography
            sx={{
              fontSize: "10px",
              color: "#fff",
            }}
          >
            Cancel
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "#fff",
            width: "65px",
            height: "26px",
            borderRadius: "18px",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
          onClick={handleCreatePlayList}
        >
          <Typography
            sx={{
              fontSize: "10px",
            }}
          >
            Create
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
