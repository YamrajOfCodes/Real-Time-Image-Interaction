import React from 'react'
import EmojiReactionPicker from '../EmojiPicker/EmojiReactionPicker';

const GalleryItems = ({ gallaryImg, handleShowImg, reactions, handleReactionChange,userId }) => {
    return (
        <div
            key={gallaryImg.id}
            className="group aspect-square overflow-hidden rounded-lg relative"
        >
            <img
                src={gallaryImg.urls.small}
                alt={gallaryImg.alt_description}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handleShowImg(gallaryImg)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">

                {/* Emoji reaction bar */}
                <div className="flex items-center gap-2 text-white">
                    {reactions
                        ?.filter((reaction) => reaction.imageId === gallaryImg.id)
                        .reduce((acc, curr) => {
                            // Find if this emoji already exists in accumulator
                            const existing = acc.find(item => item.emojis === curr.emojis);

                            if (existing) {
                                existing.count++;
                            } else {
                                acc.push({ ...curr, count: 1 });
                            }

                            return acc;
                        }, [])
                        .map((element, index) => {
                            const userReacted = reactions?.some(
                                r => r.imageId === gallaryImg.id && r.emojis === element.emojis && r.userId === userId
                            );

                            return (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReactionChange(gallaryImg.id, element.emojis);
                                    }}
                                    className={`flex items-center gap-1 backdrop-blur-sm px-2 py-1 rounded-full transition ${userReacted
                                        ? 'bg-blue-500/40 border border-blue-400'
                                        : 'bg-white/20 hover:bg-white/30'
                                        }`}
                                >
                                    <span className="text-base">{element.emojis}</span>
                                    <span className="text-xs font-medium">{element.count}</span>
                                </button>
                            );
                        })
                    }
                    <EmojiReactionPicker
                        imageId={gallaryImg.id}
                        toggleReaction={handleReactionChange}
                    />

                </div>
            </div>
        </div>
    )
}

export default GalleryItems
