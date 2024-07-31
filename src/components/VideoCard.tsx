import { Card, CardContent, CardCover, Typography } from "@mui/joy";
import { VideoDetails } from "../utils/types";
import { truncateTitle } from "../utils/utils";
import defaultCover from "../assets/default.png";

interface VideoDetailsProps {
  videoDetails: VideoDetails;
  isSubtitlesFoundFromLocal: boolean;
}

const VideoCard = ({ videoDetails }: VideoDetailsProps) => {
  return (
    <Card
      sx={{
        width: "310px",
        height: "180px",
        border: "none",
        borderRadius: "20px",
        padding: 0,
      }}
    >
      <CardCover>
        <img
          src={videoDetails.thumbnailUrl || defaultCover}
          loading="lazy"
          alt=""
        />
      </CardCover>
      <CardCover
        sx={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
        }}
      />
      <CardContent sx={{ justifyContent: "flex-end", height: "100%", m: 2 }}>
        <Typography level="title-lg" textColor="#fff">
          {truncateTitle(videoDetails.title, 20)}
        </Typography>
        <Typography level="body-xs" textColor="#989898">
          {truncateTitle(videoDetails.authorName, 20)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
