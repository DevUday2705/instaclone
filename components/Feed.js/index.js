import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { BsThreeDots } from "react-icons/bs";
import {
  GlobalContext,
  GlobalDispatchContext,
} from "../../state/context/GlobalContext";
import Header from "../Header";
import Modal from "../Modal";
import Post from "../Post";
import { db, storage } from "../../lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uuid } from "uuidv4";
import { uuidv4 } from "@firebase/util";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
const Feed = () => {
  const { user } = useContext(GlobalContext);
  console.log(user);
  const [file, setFile] = useState("");
  const [media, setMedia] = useState({
    src: "",
    isUploading: false,
    caption: "",
  });
  const dispatch = useContext(GlobalDispatchContext);
  const { isUploadPostModalOpen } = useContext(GlobalContext);
  const closeModal = () => {
    dispatch({
      type: "SET_IS_UPLOAD_POSTMODAL_OPEN",
      payload: {
        isUploadPostModalOpen: false,
      },
    });
  };

  const handlePostMedia = async (url) => {
    const postId = uuidv4();
    const postRef = doc(db, "posts", postId);
    const post = {
      id: postId,
      image: url,
      caption: media.caption,
      username: user.username,
      createdAt: serverTimestamp(),
    };
    try {
      await setDoc(postRef, post);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  };

  const currentImage = useRef(null);

  const handleUploadMedia = async () => {
    // Do stuff with firebase storage.
    if (!file) return toast.error("Please select Image First");
    setMedia((prev) => ({ ...prev, isUploading: true }));
    const toastId = toast.loading(
      "Uploading may take some time, Please wait. "
    );

    const postName = `posts/${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, postName);

    try {
      const uploadTask = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);

      await handlePostMedia(url);

      console.log(url);
      toast.success("Uploaded Successfully !", {
        id: toastId,
      });
    } catch (err) {
      toast.error("Failed to upload Image", {
        id: toastId,
      });
    } finally {
      setMedia((prev) => ({
        src: "",
        isUploading: false,
        caption: "",
      }));
      dispatch({
        type: "SET_IS_UPLOAD_POSTMODAL_OPEN",
        payload: {
          isUploadPostModalOpen: false,
        },
      });
    }
  };

  const handleRemovePost = () => {
    setFile("");
    currentImage.current.src = "";
  };

  useEffect(() => {
    const reader = new FileReader();
    const handleEvent = (e) => {
      // Do something with event

      switch (e.type) {
        case "load":
          setMedia((prev) => ({ ...prev, src: reader.result }));
          break;
        case "error":
          console.log(e);
          return toast.error("Something Not working");
        default:
          break;
      }
    };
    if (file) {
      reader.addEventListener("load", handleEvent);
      reader.addEventListener("error", handleEvent);
      reader.readAsDataURL(file);
    }
    return () => {
      reader.removeEventListener("load", handleEvent);
      reader.removeEventListener("error", handleEvent);
    };
  }, [file]);

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setLoading(true);
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => doc.data());
      setPosts(posts);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full bg-[#FAFAFA] h-full">
      <Header />
      <Modal isOpen={isUploadPostModalOpen} closeModal={closeModal}>
        <div className="w-screen h-screen max-w-3xl max-h-[70vh] flex  flex-col items-center">
          <div className=" text-xl border-b py-4 text-center font-semibold border-black w-full">
            Create new post
          </div>
          <div className="flex justify-center items-center w-full h-full">
            {!file ? (
              <>
                <label
                  htmlFor="post"
                  className="bg-[#0095F6] py-2 px-4 text-white active:scale-95 transform transition disabled:bg-opacity-50 disabled:scale-100 rounded text-sm font-semibold cursor-pointer"
                >
                  Select From Computer
                </label>
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  multiple={false}
                  accept="image/jpeg, image/png, image/jpg"
                  className="hidden"
                  type="file"
                  value={file.name || ""}
                  name="post"
                  id="post"
                />
              </>
            ) : (
              <div className="flex aspect-video items-center flex-col gap-4 ">
                {file && (
                  <input
                    type="image"
                    src={media.src}
                    className="w-44 object-contain"
                    ref={currentImage}
                  />
                )}
                <input
                  type="text"
                  name="caption"
                  value={media.caption}
                  onChange={(e) =>
                    setMedia((prev) => ({ ...prev, caption: e.target.value }))
                  }
                  id="caption"
                  className="bg-gray-100 border hover:bg-transparent placeholder:text-sm rounded-sm focus:border-gray-400 focus:bg-transparent w-full py-1 px-2 outline-none"
                  placeholder="Write a caption..."
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleUploadMedia}
                    className="bg-[#0095F6] py-2 px-4 text-white active:scale-95 transform transition disabled:bg-opacity-50 disabled:scale-100 rounded text-sm font-semibold cursor-pointer"
                  >
                    Upload
                  </button>
                  <button
                    onClick={handleRemovePost}
                    className="bg-[#0095F6] py-2 px-4 text-white active:scale-95 transform transition disabled:bg-opacity-50 disabled:scale-100 rounded text-sm font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <div className="grid w-full grid-cols-3 mx-auto  gap-6 max-w-screen-lg">
        <div className="w-full  mt-20 col-span-2 flex flex-col gap-y-4 ">
          <section className="overflow-x-scroll bg-white flex space-x-4 border border-gray-200 p-4 ">
            {new Array(10).fill(0).map((_, i) => (
              <div
                key={i}
                className="flex-none ring-1 ring-offset-2 rounded-full bg-black/50 h-14 w-14"
              ></div>
            ))}
          </section>
          <section className="flex flex-col space-y-3">
            {posts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
          </section>
        </div>
        <div className="col-span-1 mt-20 fixed right-[10%] max-w-sm">
          <div className="flex">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
            eligendi voluptatum qui omnis aut. Aspernatur neque molestias vitae
            harum distinctio cum odit magnam nisi optio. Laboriosam dignissimos
            voluptatibus, aspernatur quisquam iste asperiores quod qui explicabo
            repellendus ipsum! Doloribus sequi exercitationem debitis
            voluptatibus incidunt fugit ipsa? Vero sapiente, dolore enim
            inventore autem veniam vel aspernatur rerum odit natus corrupti
            iusto molestias? A veritatis est iure, quidem voluptates corporis
            ipsa nam iste molestias quod facere repudiandae cumque aliquid
            harum! Unde, est. Accusantium commodi ducimus natus, non libero quo
            nesciunt nam, eos corporis ipsam omnis harum, illo odio iste debitis
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
