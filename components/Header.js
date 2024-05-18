"use client";
import React, { useState, useEffect } from "react";
import logo from "@/public/assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Link from "next/link";
import { IoArrowBackCircle } from "react-icons/io5";

export default function Header() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Obtenir l'utilisateur depuis la base de données
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

    try {
      const decodedUser = jwtDecode(userToken, secretKey);
      setUserId(decodedUser.userId);
    } catch (error) {
      console.error("Erreur de décodage du token :", error);
    }
  }, []);

  // Obtenir l'utilisateur en utilisant l'Id décod
  useEffect(() => {
    const url = `https://cocote.onrender.com/profile/${userId}`;

    axios
      .get(url)
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("Erreur :", error);
      });
  }, [userId]);

  // Gérer la fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <div className="bg-white w-full h-[100vh] md:h-[40vh] lg:h-[80vh] xl:w-[80%] pb-4 rounded-2xl flex flex-col items-center justify-start">
      <div className="w-full flex justify-between items-center px-6 py-6">
        <Link href="/dashboard"><IoArrowBackCircle className="text-3xl" /></Link>
        <button
          onClick={handleLogout}
          className="flex text-white bg-black px-3 py-2 rounded-xl"
        >
          Se déconnecter
        </button>
      </div>
      <Image
        src={logo}
        alt="logo"
        className="lg:mt-16 xl:mt-1 lg:mb-6 w-40 h-20"
      />
      <h1 className="flex gap-2 text-xl">
        Bienvenue <span className="text-xl font-bold">{user?.name}</span>
      </h1>
      <p className="font-light text-[14px] mb-4">{user?.email}</p>
    </div>
  );
}
