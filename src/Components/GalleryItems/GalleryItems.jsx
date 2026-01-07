import React, { useMemo } from "react";
import { IconButton, Tooltip } from "@mui/material";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import EmojiReactionPicker from "../EmojiPicker/EmojiReactionPicker";

const GalleryItems = ({
  gallaryImg,
  handleShowImg,
  reactions,
  handleReactionChange,
  userId,
}) => {

  // ✅ Memoize expensive aggregation
  const aggregatedReactions = useMemo(() => {
    return reactions
      ?.filter(r => r.imageId === gallaryImg.id)
      .reduce((acc, curr) => {
        const existing = acc.find(item => item.emojis === curr.emojis);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ emojis: curr.emojis, count: 1 });
        }
        return acc;
      }, []);
  }, [reactions, gallaryImg.id]);

  return (
    <div className="group aspect-square overflow-hidden rounded-lg relative">
      <img
        src={gallaryImg.urls.small}
        alt={gallaryImg.alt_description}
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => handleShowImg(gallaryImg)}
      />

      {/* Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
        <div className="flex items-center gap-2 text-white flex-wrap">

          {/* Existing reactions */}
          {aggregatedReactions?.map((reaction, index) => {
            const userReacted = reactions?.some(
              r =>
                r.imageId === gallaryImg.id &&
                r.emojis === reaction.emojis &&
                r.userId === userId
            );

            return (
              <Tooltip
                key={index}
                title={`${reaction.count} reaction${reaction.count > 1 ? "s" : ""}`}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactionChange(gallaryImg.id, reaction.emojis);
                  }}
                  sx={{
                    color: "white",
                    backgroundColor: userReacted
                      ? "rgba(59,130,246,0.4)"
                      : "rgba(255,255,255,0.2)",
                    border: userReacted ? "1px solid #60a5fa" : "none",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  <span className="text-base">{reaction.emojis}</span>
                  <span className="ml-1 text-xs font-medium">
                    {reaction.count}
                  </span>
                </IconButton>
              </Tooltip>
            );
          })}

          {/* Add reaction */}
          <Tooltip title="Add reaction">
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={(e) => e.stopPropagation()}
            >
              <EmojiReactionPicker
                imageId={gallaryImg.id}
                toggleReaction={handleReactionChange}
                trigger={<AddReactionIcon fontSize="small" />}
              />
            </IconButton>
          </Tooltip>

        </div>
      </div>
    </div>
  );
};

export default React.memo(GalleryItems);
