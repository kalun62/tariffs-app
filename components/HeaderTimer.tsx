"use client";

import { useTimer } from "@/hooks/useTimer";
import Image from "next/image";
import starYellow from "@/public/images/star-yellow.png";
import starWhite from "@/public/images/star-white.png";
import starRed from "@/public/images/star-red.png";

export const HeaderTimer = ({
  onExpire,
  highlightError,
}: {
  onExpire?: () => void;
  highlightError?: boolean;
}) => {
  const time = useTimer(120, onExpire);

  const minutes = Math.floor(time / 60).toString().padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");

  let starImg = starYellow;
  let timerColor = "#FFBB00";

  if (time <= 30 && time > 0) {
    starImg = starWhite;
    timerColor = "#ff4d49";
  }

  if (time === 0) {
    starImg = starRed;
    timerColor = "#ff4d49";
  }

  const pulseClass = time <= 30 && time > 0 ? "animate-pulse" : "";
  const errorClass = highlightError ? "text-red-500 animate-pulse" : "";

  return (
    <header className="fixed top-0 left-0 w-full bg-[#1D5B43] p-2 md:p-4 z-50 shadow-md flex flex-col items-center">
      <div className="text-base font-bold text-white text-[16px] md:text-[24px]">
        Успейте открыть пробную неделю
      </div>

      <div
        className={`flex items-center mt-1 text-2xl font-bold text-[32px] md:text-[40px] ${pulseClass} ${errorClass}`}
        style={{ color: timerColor, transition: "color 0.5s ease-in-out" }}
      >
        <Image src={starImg} alt="звезда" width={12} height={12} className="mr-2" />
        {minutes}:{seconds}
        <Image src={starImg} alt="звезда" width={12} height={12} className="ml-2" />
      </div>
    </header>
  );
};