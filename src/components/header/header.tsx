import SpaceIcon from "@/assets/space.svg";
import { ReactNode } from "react";

function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="border-b border-gray-900 px-6 py-2 flex justify-center md:justify-between items-center">
      <div className="flex items-center justify-start gap-3">
        <h1 className="text-white text-xl font-bold flex items-center justify-start">
          <img src={SpaceIcon} alt="Space Icon" className="size-8 mr-2" />
          Space Generator
        </h1>
        <p className="text-gray-700 max-md:hidden">|</p>
        <p className="text-gray-500 text-sm max-md:hidden">
          Code and Deploy in 1-Click
        </p>
      </div>
      {children}
    </header>
  );
}

export default Header;
