import React, { use, useContext, useMemo, useState } from "react";
import Lottie from "react-lottie-player";
import useForm from "../../hooks/useForm";
import lottieJson from "../../public/assets/animation/authPageAnim.json";
import { AiFillFacebook } from "react-icons/ai";
import Image from "next/image";
import {
  GlobalContext,
  GlobalDispatchContext,
} from "../../state/context/GlobalContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { BiLoaderCircle } from "react-icons/bi";
import handlePromise from "../../utils/handlePromise";
import { toast } from "react-hot-toast";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import LoadingOverlay from "../LoadingOverlay";
import useFetchCurrentUser from "../../utils/fetchCurrentUser";
const Auth = () => {
  const [isLoginForm, setisLoginForm] = useState(false);
  const { isAuthenticated, isOnboarded, isLoading } = useContext(GlobalContext);
  const disaptch = useContext(GlobalDispatchContext);
  const { fetchUser } = useFetchCurrentUser();
  const { form, onChangeHandler, resetForm } = useForm({
    email: "",
    password: "",
  });
  const {
    form: onBoardingForm,
    onChangeHandler: onBoardingFormOnChangeHandler,
  } = useForm({
    username: "",
    fullname: "",
  });

  const onboardingSubmitHandler = async (e) => {
    disaptch({
      type: "SET_LOADING",
      payload: {
        isLoading: true,
      },
    });
    e.preventDefault();
    setUserData();
    disaptch({
      type: "SET_LOADING",
      payload: {
        isLoading: false,
      },
    });
  };

  const authenticate = async () => {
    if (isLoginForm) {
      const [data, loginErr] = await handlePromise(
        signInWithEmailAndPassword(auth, form.email, form.password)
      );
      return loginErr;
    } else {
      const [data, signUpErr] = await handlePromise(
        createUserWithEmailAndPassword(auth, form.email, form.password)
      );
      return signUpErr;
    }
  };

  const setUserData = async () => {
    try {
      const userCollection = collection(db, "users");
      const userQuery = query(
        userCollection,
        where("username", "==", onBoardingForm.username)
      );
      const usersSnapshot = await getDocs(userQuery);
      if (usersSnapshot.docs.length > 0) {
        toast.error("Username already exists.");
        return;
      }
      await setDoc(doc(db, "users", auth.currentUser.email), {
        fullname: onBoardingForm.fullname,
        username: onBoardingForm.username,
        id: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      toast.success("Welcome to Instagram Clone by Dev Uday 🙏");
      disaptch({
        type: "SET_IS_ONBOARDED",
        payload: {
          isOnboarded: true,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    disaptch({
      type: "SET_LOADING",
      payload: {
        isLoading: true,
      },
    });
    let err = null;

    err = await authenticate();
    const userData = fetchUser();
    if (userData) {
      disaptch({
        type: "SET_USER",
        payload: {
          user: userData,
        },
      });
    }
    disaptch({
      type: "SET_LOADING",
      payload: {
        isLoading: false,
      },
    });
    if (err) {
      toast.error(err.message);
    }
    resetForm();
    if (!err)
      toast.success(
        `You have successfully ${isLoginForm ? "Logged In" : "Signed Up"}`
      );
  };

  const isDisabled = useMemo(() => {
    return !Object.values(form).every((value) => !!value);
  }, [form]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="flex h-4/5 w-4/5">
        <div className="w-full ">
          <Lottie
            loop
            animationData={lottieJson}
            play
            className="w-full h-full"
          />
        </div>
        <div className="relative w-full flex flex-col space-y-5  ">
          <div className="relative h-full w-full border border-gray-400 bg-white flex flex-col space-y-5 p-10 ">
            {isLoading && <LoadingOverlay />}
            {!isAuthenticated && (
              <form
                onSubmit={onSubmitHandler}
                className="flex flex-col space-y-5 items-center"
              >
                <Image
                  alt="logo"
                  src="/assets/logo.png"
                  height={200}
                  width={200}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  id="id"
                  onChange={onChangeHandler}
                  className="bg-gray-100 border hover:bg-transparent placeholder:text-sm rounded-sm focus:border-gray-400 focus:bg-transparent w-full py-1 px-2 outline-none"
                  placeholder="Email"
                />
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={onChangeHandler}
                  value={form.password}
                  placeholder="password"
                  className="bg-gray-100 border hover:bg-transparent placeholder:text-sm rounded-sm focus:border-gray-400 focus:bg-transparent w-full py-1 px-2 outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#0095F6] py-1 text-white active:scale-95 transform transition w-full disabled:bg-opacity-50 disabled:scale-100 rounded text-sm font-semibold"
                  disabled={isDisabled}
                >
                  {isLoginForm ? "Login" : "Sign Up"}
                </button>
              </form>
            )}
            {isAuthenticated && !isOnboarded && (
              <form
                onSubmit={onboardingSubmitHandler}
                className="flex flex-col space-y-5 items-center"
              >
                <Image
                  alt="logo"
                  src="/assets/logo.png"
                  height={200}
                  width={200}
                />
                <input
                  type="username"
                  name="username"
                  value={onBoardingForm.username}
                  id="id"
                  onChange={onBoardingFormOnChangeHandler}
                  className="bg-gray-100 border hover:bg-transparent placeholder:text-sm rounded-sm focus:border-gray-400 focus:bg-transparent w-full py-1 px-2 outline-none"
                  placeholder="Username"
                />
                <input
                  type="fullname"
                  name="fullname"
                  id="fullname"
                  onChange={onBoardingFormOnChangeHandler}
                  value={onBoardingForm.fullname}
                  placeholder="Full Name"
                  className="bg-gray-100 border hover:bg-transparent placeholder:text-sm rounded-sm focus:border-gray-400 focus:bg-transparent w-full py-1 px-2 outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#0095F6] py-1 text-white active:scale-95 transform transition w-full disabled:bg-opacity-50 disabled:scale-100 rounded text-sm font-semibold"
                  disabled={
                    !onBoardingForm.fullname || !onBoardingForm.username
                  }
                >
                  Lets Go!
                </button>
              </form>
            )}
            <div className="w-full flex items-center justify-center my-5 space-x-2">
              <div className="h-[1px] w-full bg-slate-400" />
              <div className="text-gray-400 font-semibold text-sm text-center">
                OR
              </div>
              <div className="h-[1px] w-full bg-slate-400" />
            </div>
            <div className="w-full flex  text-indigo-900 items-center justify-center text-center">
              <AiFillFacebook className="inline-block text-xl mr-2" />
              <span className="font-semibold text-sm">
                {isLoginForm ? "Log in with Facebook" : "Sign Up with Facebook"}
              </span>
            </div>
            {isLoginForm && (
              <div className="w-full text-center text-indigo-900 text-xs">
                Forgot your password?
              </div>
            )}
          </div>
          <div className="w-full border border-gray-400 bg-white  space-y-5 text-sm py-5 text-center">
            {isLoginForm
              ? " Don't Have an account?"
              : "Already Have an account ?"}
            <button
              onClick={() => setisLoginForm((prev) => !prev)}
              className="text-blue-600 ml-2 font-semibold"
            >
              {isLoginForm ? "Sign Up" : "Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
