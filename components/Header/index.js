import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsSearch } from "react-icons/bs";
import {
  Home,
  Add,
  Compass,
  Heart,
  Messenger,
  Person,
} from "../Header/HeaderIcons/index";
import HeaderIcon from "../Header/HeaderIcon";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

const Header = () => {
  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  const HEADER_ITEMS = [
    {
      icon: Home,
      url: "/",
      name: "Home",
    },
    {
      icon: Add,
      url: "/",
      name: "Add",
    },
    {
      icon: Compass,
      url: "/",
      name: "Compass",
    },

    {
      icon: Heart,
      url: "/",
      name: "Heart",
    },
    {
      icon: Messenger,
      url: "/",
      name: "Messenger",
    },
    {
      icon: Person,
      url: "/",
      name: "Person",
    },
  ];
  return (
    <header className="h-16 fixed items-center bg-white flex justify-around shadow-md w-full">
      <div>
        <Link href="/">
          <Image
            className="cursor-pointer select-none"
            alt="logo"
            src="/assets/logo.png"
            height={200}
            width={120}
          />
        </Link>
      </div>
      <div className="flex bg-gray-100 space-x-2 items-center focus:border-gray-400 rounded-lg px-2 border">
        <label htmlFor="search">
          <BsSearch className="text-sm text-gray-400" />
        </label>
        <input
          name="search"
          placeholder="search"
          type="search"
          className="bg-gray-100  hover:bg-transparent placeholder:text-sm rounded-sm  focus:bg-transparent w-full  py-1 px-2 outline-none transition"
        />
      </div>
      <div className="flex space-x-2 items-center ">
        <div className="flex space-x-4">
          {HEADER_ITEMS.map((item) => (
            <HeaderIcon name={item.name} Icon={item.icon} key={item.name} />
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="bg-[#0095F6] py-1 text-white active:scale-95 transform transition  disabled:bg-opacity-50 disabled:scale-100 rounded text-sm px-6 h-4/5 font-semibold"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
