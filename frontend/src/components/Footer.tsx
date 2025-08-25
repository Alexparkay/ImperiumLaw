// import React from 'react';
// import { DiReact } from 'react-icons/di';
import { HiOutlineCircleStack } from 'react-icons/hi2';

const Footer = () => {
  return (
    <div className="w-full px-5 py-5 xl:m-0 mt-5 flex justify-between gap-2 font-semibold xl:text-sm">
      <span className="hidden xl:inline-flex text-sm">
        Imperium DB
      </span>
      <div className="flex gap-1 items-center">
        <span className="text-sm">© Imperium DB Admin Dashboard</span>
        <HiOutlineCircleStack className="text-2xl xl:text-xl 2xl:text-2xl text-primary" />
      </div>
    </div>
  );
};

export default Footer;
