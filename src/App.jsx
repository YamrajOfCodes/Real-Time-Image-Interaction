import { Eye } from "lucide-react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { db } from "./lib/InstantDbConnect";
import { fetchImages } from "./lib/fetchImages";
import { useUserStore } from "./stores/userStore";
import { imageStore } from "./stores/imageStore";
import ScrollLoader from "./Components/ScrollLoader/ScrollLoader";
import ImageModel from "./Components/ImageModel/ImageModel";
import GalleryItems from "./Components/GalleryItems/GalleryItems";
import FeedSection from "./Components/FeedSection/FeedSection";


function App() {
  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["images"],
    queryFn: fetchImages,
    data: true,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length == 8 ? allPages?.length + 1 : undefined;
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
  const [activity, setActivity] = useState(null);
  const Dbreactions = DbData?.reactions;
  const DbComments = DbData?.comments;
  const obj = imageStore()
  const { imgPicker, setImg } = obj;

const handleSubmitComment = useCallback(async (e, commentData, setCommentData) => {
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
    handleFeedData("added comment to image");
  } catch (e) {
    console.error("write failed", e);
  }

  setCommentData("");
}, [id, name, imgPicker?.id]);



  const handleFeedData = (feedData) => {
    setRecentUpdate(feedData);
    setTimeout(() => {
      setRecentUpdate(null);
    }, 2000);
  }




const handleShowImg = useCallback((img) => {
  setShowSelectedImg(true);
  setImg(img);
}, [setImg]);






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
   }

 const barColor = recentupdate !== null ? colorMap[color] : "bg-gray-300";


  useEffect(() => {
    const filteredComments = DbData?.comments?.filter((Comment, index) => Comment?.imageId === imgPicker?.id);
    setIndividualComment(filteredComments);
  }, [showSelectedImg, DbData?.comments])


 const handleReactionChange = useCallback(async (imageId, newEmoji) => {
  try {
    const existingUserReaction = DbData?.reactions?.find(
      r => r.imageId === imageId && r.userId === id
    );

    if (existingUserReaction) {
      if (existingUserReaction.emojis === newEmoji) {
        await db.transact(
          db.tx.reactions[existingUserReaction.id].delete()
        );
      } else {
        await db.transact([
          db.tx.reactions[existingUserReaction.id].delete(),
          db.tx.reactions[crypto.randomUUID()].update({
            imageId,
            emojis: newEmoji,
            userId: id,
            createdAt: Date.now(),
          })
        ]);
      }
    } else {
      await db.transact(
        db.tx.reactions[crypto.randomUUID()].update({
          userName: name,
          imageId,
          emojis: newEmoji,
          userId: id,
          createdAt: Date.now(),
        })
      );
    }
  } catch (error) {
    console.error("Reaction error:", error);
  }
}, [DbData?.reactions, id, name]);


  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage])


  useEffect(() => {
    const reactions = DbData?.reactions;
    if (!reactions) return;

    if (reactions.length <= prevReactionCount.current) {
      prevReactionCount.current = reactions.length;
      return;
    }

    const latestReaction = reactions
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    prevReactionCount.current = reactions.length;

    triggerActivity({
      type: "reaction",
      data: latestReaction,
    });
  }, [Dbreactions]);



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
  }, [DbComments]);


  const triggerActivity = (activityEvent) => {
    setActivity(activityEvent);
    setTimeout(() => {
      setActivity(null);
    }, 2000);
  };

  if (isPending) return <div className="h-screen w-full flex justify-center items-center"><ScrollLoader /></div>
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
              <h1 className="text-md sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
                Real-Time Image Interaction
              </h1>
            </div>
          </div>
        </div>
      </header>

      <FeedSection
        letestUpdate={recentupdate}
        activity={activity}
        barColor={barColor}
      />

    <Box mt={5} mb={10} px={2}>
  <Grid container spacing={2} justifyContent={"center"}>
    {data?.pages.map((page, pageIndex) =>
      page.map((img, imgIndex) => (
        <Grid
          item
          key={`${pageIndex}-${img.id ?? imgIndex}`}
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <GalleryItems
            gallaryImg={img}
            handleShowImg={handleShowImg}
            reactions={DbData?.reactions}
            handleReactionChange={handleReactionChange}
            userId={id}
          />
        </Grid>
      ))
    )}
  </Grid>
</Box>
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
