"use client";

import { useEffect, useState } from "react";
import { Tariff } from "@/types/tariff";

export const useTariffs = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://t-core.fit-hub.pro/Test/GetTariffs")
      .then(res => res.json())
      .then(data => {
        setTariffs(data.reverse()); // <-- переворачиваем массив
        setLoading(false);
      });
  }, []);

  console.log(tariffs);

  return { tariffs, loading };
};