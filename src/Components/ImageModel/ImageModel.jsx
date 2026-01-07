import { MessageCircle, X, Heart, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import EmojiReactionPicker from '../EmojiPicker/EmojiReactionPicker';

const ImageModel = (
    {
        showImg,
        showComments,
        setShowComments,
        imgSelector,
        individualComment,
        ManageSubmitComment,
        handleReactionChange,
        userData,
        reactions,
    }) => {
    const [commentText, setCommentText] = useState('');
    const [id, color] = userData;

    useEffect(() => {

    }, [individualComment])

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex justify-center items-center"
            onClick={() => showImg(false)}
        >
            <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                onClick={() => showImg(false)}
            >
                <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <div
                className="relative w-full h-full md:max-w-7xl md:w-full md:h-[90vh] flex flex-col md:flex-row bg-black md:rounded-lg overflow-hidden md:shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`flex-1 flex items-center justify-center bg-black p-4 ${showComments ? 'hidden md:flex' : 'flex'}`}>
                    <div>
                        <img
                            src={imgSelector.urls.regular}
                            alt={imgSelector.alt_description || "Selected image"}
                            className="max-h-full max-w-full object-contain"
                        />
                        <div className="flex items-center gap-2 text-white">
                            {reactions
                                ?.filter((reaction) => reaction.imageId === imgSelector.id)
                                .reduce((acc, curr) => {
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
                                        r => r.imageId === imgSelector.id && r.emojis === element.emojis && r.userId === id
                                    );

                                    return (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReactionChange(imgSelector.id, element.emojis);
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
                                imageId={imgSelector.id}
                                toggleReaction={handleReactionChange}
                            />

                        </div>
                    </div>

                    {/* Mobile: Comments toggle button */}
                    <button
                        onClick={() => setShowComments(true)}
                        className="md:hidden absolute bottom-6 right-6 bg-white text-gray-900 rounded-full p-4 shadow-lg flex items-center gap-2"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className={`${showComments ? 'flex' : 'hidden md:flex'} w-full md:w-96 bg-white flex-col`}>
                    <button
                        onClick={() => setShowComments(false)}
                        className="md:hidden p-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-semibold">Back to image</span>
                    </button>
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {imgSelector.user?.name?.charAt(0) || 'P'}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm md:text-base">{imgSelector.user?.name || 'Photographer'}</h3>
                                <p className="text-xs text-gray-500">Posted 2 hours ago</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {individualComment?.length == 0 ? (
                            <div className="text-center text-gray-400 py-8">
                                <p>No comments yet</p>
                                <p className="text-sm mt-1">Be the first to comment!</p>
                            </div>
                        ) : (
                            individualComment?.map((comment, index) => {
                                return (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className={`w-8 h-8  rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 bg-blue-400`}>
                                            {
                                                comment.userName.slice(0,1)
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-gray-100 rounded-lg p-3">
                                                <p className="font-semibold text-sm text-gray-900">{comment.userName}</p>
                                                <p className="text-sm text-gray-700 mt-1 break-words">{comment.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && commentText.trim()) {
                                        ManageSubmitComment(e);
                                    }
                                }}
                                placeholder="Add a comment..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <button
                                onClick={(e) => { ManageSubmitComment(e, commentText, setCommentText) }}
                                disabled={!commentText.trim()}
                                className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageModel
