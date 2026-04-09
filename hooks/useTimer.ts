"use client";

import { useEffect, useState } from "react";

export const useTimer = (
  initialSeconds: number = 120,
  onExpire?: () => void
) => {
  const [time, setTime] = useState(initialSeconds);

  useEffect(() => {
    if (time <= 0) {
      onExpire?.(); // 🔥 вызываем когда закончилось
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, onExpire]);

  return time;
};