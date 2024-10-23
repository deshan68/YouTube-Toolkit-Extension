import { Box } from "@mui/material";
import { FadedDivider } from "./FadedDivider";

const Test = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "90%" }}>
      Test
      <FadedDivider />
    </Box>
  );
};

export default Test;

// const routes = [
//   {
//     level: 1,
//     id: 1,
//     title: "Explore",
//     description: "Explore the world",
//     icon: "ExploreIcon",
//     iconBgColor: "#FF0000",
//     component: "ExploreScreen",
//     chileElement: [
//       {
//         level: 2,
//         id: 2,
//         title: "subtitle syncer",
//         description: "sync subtitle",
//         icon: "subIcon",
//         iconBgColor: "#FF9200",
//         component: "SubtitleSyncerScreen",
//       },
//       {
//         level: 2,
//         id: 3,
//         title: "playlist",
//         description: "playlist description",
//         icon: "playlistIcon",
//         iconBgColor: "#FF9200",
//         component: "PlaylistScreen",
//         childElements: [
//           {
//             level: 3,
//             id: 7,
//             title: "playlist 1",
//             description: "playlist description",
//             icon: "playlistIcon",
//             iconBgColor: "#FF9190",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     level: 1,
//     id: 4,
//     title: "Settings",
//     description: "Settings",
//     icon: "SettingsIcon",
//     iconBgColor: "#FF0000",
//     component: "SettingsScreen",
//     chileElement: [
//       {
//         level: 2,
//         id: 5,
//         title: "theme",
//         description: "sync subtitle",
//         icon: "subIcon",
//         iconBgColor: "#FF9200",
//         component: "ThemeScreen",
//       },
//       {
//         level: 2,
//         id: 6,
//         title: "trash",
//         description: "playlist description",
//         icon: "playlistIcon",
//         iconBgColor: "#FF9200",
//         component: "TrashScreen",
//       },
//     ],
//   },
// ];
