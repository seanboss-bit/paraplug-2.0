import Link from "next/link";
import React from "react";
import { FaWhatsapp } from "react-icons/fa6";

const Whatsapp = () => {
  return (
    <div className="w-[60px] h-[60px] rounded-full fixed bg-[#25d366] overflow-hidden bottom-[7%] right-[3%] flex items-center justify-center cursor-pointer">
      <Link
        target="_blank"
        href={"https://wa.me/2348129198327"}
        rel="noreferrer"
      >
        <FaWhatsapp className="text-white text-[30px]"/>
      </Link>
    </div>
  );
};

export default Whatsapp;
