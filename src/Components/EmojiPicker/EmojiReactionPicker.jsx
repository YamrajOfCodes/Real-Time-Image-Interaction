import EmojiPicker from "emoji-picker-react";
import { useState } from "react";

function EmojiReactionPicker({ imageId,toggleReaction }) {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emojiData) => {
    toggleReaction(imageId, emojiData.emoji);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="text-white text-xl"
      >
        ➕
      </button>

      {open && (
        <div
          className="absolute bottom-10 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="dark"
            width={300}
          />
        </div>
      )}
    </div>
  );
}

export default EmojiReactionPicker;