"use client";
import React, { useState, useEffect } from "react";
import TextServer from "@/components/TextServer";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function Posts() {
  const router = useRouter();
  // Protéger la page contre les utilisateurs non connectés
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      router.push("/login");
      return;
    }
  }, []);
  return (
    <main className="flex flex-col-reverse py-6 lg:flex-row bg-[#318ce7] w-full lg:h-[100vh] justify-center items-center px-6 lg:px-10">
      <div className="bg-white w-full h-[100vh] md:h-[40vh] lg:h-[80vh] xl:w-[80%] pb-4 rounded-2xl flex flex-col items-center justify-start overflow-y-auto">
        <Header />
        <div className="px-6 lg:px-24">
          <TextServer />
        </div>
      </div>
    </main>
  );
}
