import { uuidv4 } from "@firebase/util";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsEmojiSmile, BsThreeDots } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { auth, db } from "../../lib/firebase";
import { GlobalContext } from "../../state/context/GlobalContext";

const Post = ({ id, username, image, caption, likesCount }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const commentData = useRef(null);
  const { user } = useContext(GlobalContext);
  const handleLikePost = async () => {
    // setIsLiked((prevState) => !prevState);
    // Save like data to firestore.

    const postLike = {
      postId: id,
      userId: auth.currentUser.uid,
      username: user?.username,
    };

    const postRef = doc(db, "posts", id);

    const likeRef = doc(db, `likes/${id}_${auth.currentUser.uid}`);

    if (isLiked) {
      await deleteDoc(likeRef);
      await updateDoc(postRef, {
        likesCount: (likesCount || 1) - 1,
      });
    } else {
      await setDoc(likeRef, postLike);
      await updateDoc(postRef, {
        likesCount: (likesCount || 0) + 1,
      });
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();

    const comment = {
      id: uuidv4(),
      username,
      comment: commentData.current.value,
      createdAt: serverTimestamp(),
    };
    commentData.current.value = "";
    const commentRef = doc(db, `posts/${id}/comments/${comment.id}`);
    await setDoc(commentRef, comment);
  };

  const likesRef = collection(db, "likes");
  useEffect(() => {
    const likesQuery = query(
      likesRef,
      where("postId", "==", id),
      where("userId", "==", auth.currentUser.uid)
    );
    const unsubscribeLike = onSnapshot(likesQuery, (snapshot) => {
      const like = snapshot.docs.map((doc) => doc.data());
      if (like.length !== 0) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    });

    const commentsRef = collection(db, `posts/${id}/comments`);
    const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      const comments = snapshot.docs.map((doc) => doc.data());
      setComments(comments);
    });

    return () => {
      unsubscribeLike();
      unsubscribeComments();
    };
  });

  return (
    <div className="flex flex-col  border">
      <div className="flex bg-white items-center p-2">
        <div className="flex space-x-2 items-center">
          <div className="w-10 h-10  border-2 border-pink-600 rounded-full"></div>
          <div>{username}</div>
        </div>
        <div className="select-none ml-auto">
          <BsThreeDots className="text-lg" />
        </div>
      </div>
      <div className="aspect-square relative  w-full h-full ">
        {
          <Image
            src={image}
            layout="fill"
            alt="caption"
            className="object-contain"
          />
        }
      </div>
      <div className="flex  justify-between p-2 text-lg">
        <div className="flex space-x-3 items-center ">
          <div onClick={handleLikePost}>
            {isLiked ? (
              <AiFillHeart
                size={25}
                className="text-red-500  hover:text-red-500/50 cursor-pointer "
              />
            ) : (
              <AiOutlineHeart
                size={25}
                className="text-black  hover:text-black/50 cursor-pointer "
              />
            )}
          </div>

          <div>
            <FaRegComment
              size={22}
              className="text-black  hover:text-black/50 cursor-pointer "
            />
          </div>
          <div>
            <IoShareOutline
              size={25}
              className="text-black  hover:text-black/50 cursor-pointer "
            />
          </div>
        </div>
        <div>
          <BsBookmark
            size={22}
            className="text-black  hover:text-black/50 cursor-pointer "
          />
        </div>
      </div>
      <div className="px-2">
        {likesCount !== 0 ? `${likesCount} Likes` : "Be the first one"}
      </div>
      <div className="px-2">{caption}</div>
      <div className="p-2">
        <div className="flex flex-col space-y-1">
          {comments.map((commentData) => (
            <div key={commentData.id} className="flex space-x-2">
              <div className="font-medium">{commentData.username}</div>
              <div>{commentData.comment}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-2">3 Hours Ago</div>
      <div className="px-2 py-4 mt-1 flex items-center border-t border-gray-200 space-x-2">
        <div>
          <BsEmojiSmile className="text-xl" />
        </div>
        <form onSubmit={handlePostComment} className="w-full flex px-2">
          <div className="w-full">
            <input
              ref={commentData}
              type="text"
              name={`comment${id}`}
              id={`comment${id}`}
              className="w-full outline-none bg-white"
              placeholder="Add a comment..."
            />
          </div>
          <div>
            <button className="text-blue-600 ml-2 font-semibold text-sm ">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
