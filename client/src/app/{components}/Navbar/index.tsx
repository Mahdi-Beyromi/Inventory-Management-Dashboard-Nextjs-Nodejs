"use client";
import { User,Bell, Menu, Sun, Link, Settings} from "lucide-react";

import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* left side */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-200 transition-all duration-300"
          onClick={() => {}}
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="relative">
          <input
            type="search"
            name=""
            id=""
            placeholder="Search..."
            className="pl-10 pr-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Bell />
          </div>
        </div>
      </div>
      {/* right side */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
            <div>
                <button onClick={() => {}}>
                    <Sun className="cursor-pointer text-gray-500 size={24}" />
                </button>
                
            </div>
            <div className="relative">
                <Bell className="cursor-pointer text-gray-500 size={24}" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    3
                </span>
            </div>
            <hr className="h-full border-r border-gray-200" />
            <div className="flex items-center gap-2">
                <button onClick={() => {}}>
                    <User className="cursor-pointer text-gray-500 size={24}" />
                </button>
            </div>
            <Link href="/settings">
                <Settings className="cursor-pointer text-gray-500 size={24}" />
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
