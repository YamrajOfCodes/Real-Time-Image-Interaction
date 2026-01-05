import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchImages } from "./lib/fetchImages";
import { useEffect, useRef, useState } from "react";
import ScrollLoader from "./Components/ScrollLoader/ScrollLoader";
import { imageStore } from "./stores/imageStore";
import { useUserStore } from "./stores/userStore";
import { db } from "./lib/InstantDbConnect";
import ImageModel from "./Components/ImageModel/ImageModel";
import GalleryItems from "./Components/GalleryItems/GalleryItems";
import { Circle, Eye } from "lucide-react";

function App() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["images"],
    queryFn: fetchImages,
    data: true,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length == 8 ? allPages.length + 1 : undefined;
    },
  });

  const { id, name, color } = useUserStore();
  const { isLoading: IsLoading, error: IsError, data: DbData } = db.useQuery({ comments: {}, reactions: {} });
  const [showComments, setShowComments] = useState(false);
  const [showSelectedImg, setShowSelectedImg] = useState(false);
  const [individualComment, setIndividualComment] = useState([]);
  const [recentupdate, setRecentUpdate] = useState(null);
  const prevReactionCount = useRef(0);
  const lastCommentIdRef = useRef(null);



  // Rewatch function

  const handleSubmitComment = async (e, commentData, setCommentData) => {
    e.preventDefault();


    if (!commentData.trim()) return;

    try {
      await db.transact(
        db.tx.comments[crypto.randomUUID()].update({
          userName: name,
          imageId: imgPicker.id,
          text: commentData,
          userId: id,
          createdAt: Date.now(),
        })
      );
      console.log("write ok");
      handleFeedData("added comment to");
    } catch (e) {
      console.error("write failed", e);
    }

    setCommentData('');
  }

  const latestReaction = DbData?.reactions
    ?.slice()
    ?.sort((a, b) => b.createdAt - a.createdAt)[0];

  const latestComment = DbData?.comments
    ?.slice()
    ?.sort((a, b) => b.createdAt - a.createdAt)[0];


  let latestActivity = null;

  if (latestReaction && latestComment) {
    latestActivity =
      latestReaction.createdAt > latestComment.createdAt
        ? { type: "reaction", data: latestReaction }
        : { type: "comment", data: latestComment };
  } else if (latestReaction) {
    latestActivity = { type: "reaction", data: latestReaction };
  } else if (latestComment) {
    latestActivity = { type: "comment", data: latestComment };
  }


  const handleFeedData = (feedData) => {
    setRecentUpdate(feedData);
    setTimeout(() => {
      setRecentUpdate(null);
    }, 2000);
  }


  const handleShowImg = (img) => {
    setShowSelectedImg(!showSelectedImg);
    setImg(img);
  }

  const obj = imageStore()
  const { imgPicker, setImg } = obj;
  const handleScroll = () => {
    const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;
    if (bottom && hasNextPage) {
      setTimeout(() => {
        fetchNextPage();
      }, 1000);
    }
  }

  const colorMap = {
    red: "bg-red-600",
    blue: "bg-blue-600",
    green: "bg-green-600",
    gray: "bg-gray-300",
  };

  const barColor =
    recentupdate !== null ? colorMap[color] : "bg-gray-300";


  useEffect(() => {
    const filteredComments = DbData?.comments?.filter((Comment, index) => Comment?.imageId === imgPicker?.id);
    setIndividualComment(filteredComments);
  }, [showSelectedImg, DbData?.comments])


  const handleReactionChange = async (imageId, newEmoji) => {
    try {
      // Find user's existing reaction for this image
      const existingUserReaction = DbData?.reactions?.find(
        r => r.imageId === imageId && r.userId === id
      );

      if (existingUserReaction) {
        if (existingUserReaction.emojis === newEmoji) {
          // Clicking same emoji - remove reaction (toggle off)
          await db.transact(
            db.tx.reactions[existingUserReaction.id].delete()
          );

        } else {
          // Switching to different emoji - delete old, add new
          await db.transact([
            db.tx.reactions[existingUserReaction.id].delete(),
            db.tx.reactions[crypto.randomUUID()].update({
              imageId: imageId,
              emojis: newEmoji,
              userId: id,
              createdAt: Date.now(),
            })
          ]);

        }
      } else {
        // No existing reaction - add new one
        await db.transact(
          db.tx.reactions[crypto.randomUUID()].update({
            userName: name,
            imageId: imageId,
            emojis: newEmoji,
            userId: id,
            createdAt: Date.now(),
          })
        );

      }
    } catch (error) {
      console.error("Reaction error:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage])

  useEffect(() => {
    const reactions = DbData?.reactions;
    if (!reactions) return;

    // 🚫 ignore deletes
    if (reactions.length <= prevReactionCount.current) {
      prevReactionCount.current = reactions.length;
      return;
    }

    // ✅ new reaction added
    const latestReaction = reactions
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    prevReactionCount.current = reactions.length;

    triggerActivity({
      type: "reaction",
      data: latestReaction,
    });
  }, [DbData?.reactions]);



  useEffect(() => {
    if (!DbData?.comments?.length) return;

    const latestComment = DbData.comments
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    if (latestComment.id !== lastCommentIdRef.current) {
      lastCommentIdRef.current = latestComment.id;

      triggerActivity({
        type: "comment",
        data: latestComment,
      });
    }
  }, [DbData?.comments]);
  const [activity, setActivity] = useState(null);

  const triggerActivity = (activityEvent) => {
    setActivity(activityEvent);

    setTimeout(() => {
      setActivity(null);
    }, 2000);
  };




  if (isLoading) return <div className="h-screen w-full flex justify-center items-center"><ScrollLoader /></div>
  if (error) return <div>Error loading images</div>;

  return (
    <div className="px-6 py-2">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-md flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
                Real-Time Image Interaction
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Circle className={`w-2 h-2 fill-current ${recentupdate !== null ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="hidden sm:inline">{recentupdate !== null ? 'Active' : 'Idle'}</span>
            </div>
          </div>
        </div>
      </header>


      <section
        className={`transition-all duration-300 border-b ${recentupdate !== null
            ? `bg-${color}-50 border-${color}-200`
            : 'bg-gray-50 border-gray-200'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">
            <div className="flex items-center justify-center gap-3">
              {activity ? (
                <>
                  <div className={`w-1 h-6 sm:h-8 ${barColor}`} />
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {activity.data.userName}
                    </span>{" "}
                    {activity.type === "reaction"
                      ? `reacted ${activity.data.emojis}`
                      : "commented"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}


            </div>
          </div>
        </div>
      </section>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-5 mb-10">
        {
          data?.pages.map((page, index) => {
            return page.map((img, i) => (
              <GalleryItems
                gallaryImg={img}
                key={index}
                handleShowImg={handleShowImg}
                reactions={DbData?.reactions}
                handleReactionChange={handleReactionChange}
                userId={id}
              />

            ));
          })
        }
      </div>
      <div>
        {
          fetchNextPage && <div className="w-full flex justify-center mt-2"><ScrollLoader /></div>
        }
      </div>

      {
        showSelectedImg &&
        <ImageModel
          showImg={setShowSelectedImg}
          showComments={showComments}
          setShowComments={setShowComments}
          imgSelector={imgPicker}
          individualComment={individualComment}
          ManageSubmitComment={handleSubmitComment}
          reactions={DbData?.reactions}
          userData={[id, color, name]}
          handleReactionChange={handleReactionChange}
        />
      }
    </div>
  );
}

export default App;
