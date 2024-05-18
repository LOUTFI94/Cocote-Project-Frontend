/* eslint-disable */

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/assets/logo.png";
import illustrationImg from "@/public/assets/illustration.png";
import Link from "next/link";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://cocote.onrender.com/login",
        formData
      );

      // Enregistrer le token dans le local storage
      localStorage.setItem("token", response.data.token);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Rediriger l'utilisateur vers la page du tableau de bord
        router.push("/dashboard");
      }, 3000);

      // Réinitialiser le formulaire après une soumission réussie
      setFormData({
        email: "",
        password: "",
      });
    } catch (err) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    } finally {
      // Définir l'état de chargement sur false après une durée minimale
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="flex flex-col-reverse py-6 lg:flex-row bg-[#318ce7] w-full lg:h-[100vh] justify-center items-center px-6 lg:px-24">
      <div
        className="bg-[#8faecc] w-full h-[50vh] lg:w-[50%] lg:h-[80vh] shadow-2xl rounded-bl-2xl rounded-br-2xl lg:rounded-tl-2xl 
      lg:rounded-br-none flex flex-col items-center xl:justify-center"
      >
        <Image
          src={illustrationImg}
          alt="illustration"
          className="w-full h-40 xl:w-[600px] md:h-80 lg:mt-16"
        />
        <span className="px-4 xl:w-[500px]">
          <h1 className="font-bold text-3xl mb-2 text-center">
            Application de Développement de Texte Collectif
          </h1>
          <p className="font-light text-sm text-center">
            Autonomiser les Écrivains et Créateurs : Le Hub Ultime de Transformation de Texte pour une Expression Collective
          </p>
        </span>
      </div>
      <div
        className="bg-white w-full h-[50vh] md:h-[40vh] lg:w-[50%] lg:h-[80vh] rounded-tl-2xl lg:pt-10 rounded-tr-2xl lg:rounded-tl-none 
      pb-4 lg:rounded-tr-2xl lg:rounded-br-2xl flex flex-col items-center justify-start"
      >
        {error && (
          <h1 className="w-full bg-red-600 text-white justify-center items-center hidden lg:flex">
            Échec de la connexion, veuillez vérifier l'email ou le mot de passe
          </h1>
        )}
        {success && (
          <h1 className="w-full bg-green-600 text-white justify-center items-center hidden lg:flex py-2 mb-2">
            Connexion réussie... Redirection vers le tableau de bord
          </h1>
        )}
        <Image
          src={logo}
          alt="logo"
          className="lg:mt-16 xl:mt-24 lg:mb-6 w-40 h-20"
        />
        {error && (
          <h1 className="w-full bg-red-600 text-white flex justify-center items-center lg:hidden">
            Échec de la connexion, veuillez vérifier l'email ou le mot de passe
          </h1>
        )}
        {success && (
          <h1 className="w-full bg-green-600 text-white justify-center items-center lg:hidden flex py-2">
            Connexion réussie... Redirection vers le tableau de bord
          </h1>
        )}
        <h1 className="font-bold text-xl lg:mb-4">*Connectez-vous Ici*</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full px-4 xl:w-[500px] flex flex-col gap-3 lg:gap-6"
        >
          <div className="flex flex-col">
            <label>
              Email <sup className="text-red-700">*</sup>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrez votre email ici"
              required
              className="border-2 border-black px-2 h-10 lg:h-14 rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label>
              Mot de passe <sup className="text-red-700">*</sup>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe ici"
              required
              className="border-2 border-black px-2 h-10 lg:h-14 rounded-lg"
            />
          </div>
          {/* eslint-disable-line */}
          <p>
            Vous n'avez pas de compte ?{" "}
            <Link href="/" className="text-blue-500">
              inscrivez-vous
            </Link>
          </p>
          {loading ? (
            <button
              type="submit"
              className="bg-[#318ce7] px-2 py-2 lg:px-4 lg:py-4 rounded-xl font-bold text-white"
            >
              Connexion...
            </button>
          ) : (
            <button
              type="submit"
              className="bg-[#318ce7] px-2 py-2 lg:px-4 lg:py-4 rounded-xl font-bold text-white"
            >
              Connexion
            </button>
          )}
        </form>
      </div>
    </main>
  );
}
