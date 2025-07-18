"use client";

import { DndContext } from "@dnd-kit/core";

import { LeftSideBar } from "@/components/LeftSideBar";
import { RightSideBar } from "@/components/RightSideBar";

import { MiddlePanel } from "../components/MiddlePanel";

export default function Dashboard() {
  return (
    <DndContext
      onDragEnd={(event) => {
        if (event.over?.id === "drop-zone" && event.active.id === "source") {
          alert("Dropped");
        }
      }}
    >
      <div
        className="flex items-start"
        style={{ height: "calc(100vh - 88px)" }}
      >
        <div className="flex w-1/6 items-center justify-center rounded-md border border-gray-400">
          <LeftSideBar />
        </div>
        <div
          className="flex flex-1 items-center justify-center overflow-y-auto rounded-md border border-gray-400"
          style={{ height: "calc(100vh - 88px)" }}
        >
          <MiddlePanel />
        </div>
        <div className="flex w-2/8 items-center justify-center overflow-y-auto rounded-md border border-gray-400">
          <RightSideBar />
        </div>
      </div>
    </DndContext>
  );
}

// import { LeftSideBar } from "@/components/LeftSideBar";

// const Dashboard = () => {
//   return (
//     <div className="flex h-screen items-start">
//       <div className="flex w-1/4 items-start justify-center border border-gray-400">
//         <LeftSideBar />
//       </div>
//       <div className="flex h-full w-1/2 items-center justify-center border border-gray-400">
//         Middle Panel
//       </div>
//       <div className="flex h-full w-1/4 items-center justify-center border border-gray-400">
//         Right Sidebar
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
