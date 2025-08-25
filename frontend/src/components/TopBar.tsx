import React from 'react';
import { HiOutlineBell, HiOutlineQuestionMarkCircle } from 'react-icons/hi2';

const TopBar = () => {
  // Mock user/workspace data
  const userName = 'Alex Kaymakannov';
  const workspaceName = "Alex's Workspace";

  return (
    <header className="sticky top-0 z-20 bg-white h-14 flex items-center justify-end px-6 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        {/* User/Workspace Info */}
        <div className="flex items-center space-x-2">
          {/* Placeholder for Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            AK
          </div>
          <div className="text-xs">
            <div className="font-semibold text-gray-700">{userName}</div>
            <div className="text-gray-500">{workspaceName}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar; 