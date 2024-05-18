"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/public/assets/logo.png";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Link from "next/link";
import { GrLinkNext } from "react-icons/gr";
import { GiExitDoor } from "react-icons/gi";
import { BsFillGearFill } from "react-icons/bs";

export default function Dashboard() {
  const [text, setText] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [buttonStates, setButtonStates] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState({});
  const [profile, setProfile] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    image: "",
  });

  // Récupération de l'utilisateur depuis la base de données
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    if (!userToken) {
      router.push("/login");
      return;
    }

    try {
      const decodedUser = jwtDecode(userToken, secretKey);
      setUserId(decodedUser.userId);
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  }, []);

  // Récupération de l'utilisateur à l'aide de l'ID décodé
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

  // Gestion du changement de texte
  const handleChange = (e) => {
    setText(e.target.value);
  };

  // Traitement du texte saisi en paragraphes et initialisation des états des bouton
  const handleSubmit = (e) => {
    e.preventDefault();
    const paragraphRegex = /\n\s*\n/;
    const newParagraphs = text
      .split(paragraphRegex)
      .map((paragraph, index) => ({
        id: index + 1,
        content: `${index + 1}. ${paragraph}`,
      }));
    setParagraphs(newParagraphs);
    setButtonStates(newParagraphs.map(() => false));
    setText("");
  };

  // Basculer l'état d'édition d'un index spécifique
  const toggleButtonState = (index) => {
    setButtonStates((prevButtonStates) => {
      const newButtonStates = [...prevButtonStates];
      newButtonStates[index] = !newButtonStates[index];
      return newButtonStates;
    });
  };

  // Gérer la suppression
  const handleDelete = (index) => {
    const updatedParagraphs = paragraphs.filter((_, i) => i !== index);
    setParagraphs(updatedParagraphs);
  };

  // Gérer le changement de texte pour un paragraphe spécifique
  const handleContentChange = (index, newContent) => {
    setParagraphs((prevParagraphs) => {
      const updatedParagraphs = [...prevParagraphs];
      updatedParagraphs[index].content = newContent;
      return updatedParagraphs;
    });
  };

  // Gérer la mise à jour du post dans la base de données
  const handleUpdate = async (e, index) => {
    e.preventDefault();
    const paragraphId = paragraphs[index].id; // Supposer que chaque paragraphe a un identifiant unique
    setLoading((prevLoading) => ({ ...prevLoading, [paragraphId]: true }));
    try {
      const paragraphToUpdate = paragraphs[index];
      const response = await axios.post(
        `https://cocote.onrender.com/posts/${userId}`,
        { body: paragraphToUpdate.content }
      );
      console.log("Publication mise à jour avec succès :", response.data);
      setLoading((prevLoading) => ({ ...prevLoading, [paragraphId]: false }));
      setParagraphs([]);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du post :", error);
      setLoading((prevLoading) => ({ ...prevLoading, [paragraphId]: false }));
    }
  };

  // gérer la réception des entrées utilisateur pour la mise à jour du profil
  const handleProfileInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      // Gérer correctement les changements d'entrée de fichier
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    setImageLoading(true);

    // Vérifier s'il y a une image à télécharger
    if (formData.image) {
      const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_URL;
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", formData.image);
      cloudinaryFormData.append("upload_preset", "ml_default");

      try {
        const uploadRes = await axios.post(cloudinaryUrl, cloudinaryFormData);
        const imageUrl = uploadRes.data.url; // URL de Cloudinary

        // Maintenant que nous avons l'URL de l'image, nous pouvons l'envoyer avec d'autres données à notre backnd
        const dataToSend = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          image: imageUrl, // Envoyer l'URL de Cloudinary au backend
        };

        const response = await axios.patch(
          `https://cocote.onrender.com/profile/${userId}`,
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json", // Définir le type de contenu comme JSON
            },
          }
        );

        if (response.status === 200) {
          console.log("Profil mis à jour avec succès :", response.data);
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            // Rediriger l'utilisateur vers la page du tableau de bord
            router.push("/dashboard");
          }, 3000);
        } else {
          throw new Error(
            `Échec de la mise à jour du profil : code de statut ${response.status}`
          );
        }
      } catch (error) {
        console.error("Erreur pendant le téléchargement de l'image ou la mise à jour du profil :", error.message);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      } finally {
        setImageLoading(false);
    }
  } else {
      alert("Veuillez sélectionner une image à télécharger.");
      setImageLoading(false);
    }
  };

  // Gérer la déconnexion de l'utilisateur
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <main className="flex flex-col-reverse py-6 lg:flex-row bg-[#318ce7] w-full lg:h-[100vh] justify-center items-center px-6 lg:px-10">
      {profile && (
        <div className="w-[86.9%] h-[550px] lg:w-[60%] bg-gradient-to-r from-[#318ce7] to-red-100 absolute top-7 lg:top-40 rounded-2xl shadow-2xl">
          <button
            onClick={() => {
              setProfile(false);
              window.location.reload();
            }}
            className="w-full flex justify-end mt-4 gap-2 items-center"
          >
            Sortir
            <GiExitDoor className="text-2xl mr-4" />
          </button>
          {error && (
            <h1 className="w-full flex justify-center bg-red-600 text-white py-1 px-2">
              Échec de la mise à jour du profil... Veuillez sélectionner une image
            </h1>
          )}
          {success && (
            <h1 className="w-full flex justify-center bg-green-600 text-white py-1 px-2">
              Profil mis à jour avec succès
            </h1>
          )}
          <form
            enctype="multipart/form-data"
            onSubmit={handleProfileUpdate}
            class=" h-60 w-full rounded-t-2xl px-4 py-4 flex flex-col justify-center gap-2 mt-28"
          >
            <h1 className="flex font-bold gap-1">
              Sélectionnez une photo de profil :{" "}
              <input
                type="file"
                onChange={handleProfileInputChange}
                name="image"
              />
            </h1>
            <h1 className="flex flex-col font-bold gap-1">
              Nom d'utilisateur :{" "}
              <input
                type="text"
                name="username"
                placeholder={user?.name}
                className="py-1 px-2 rounded-lg h-12"
                value={formData.username}
                onChange={handleProfileInputChange}
              />
            </h1>
            <h1 className="flex flex-col font-bold gap-1">
              Email :{" "}
              <input
                type="email"
                name="email"
                placeholder={user?.email}
                className="py-1 px-2 rounded-lg h-12"
                value={formData.email}
                onChange={handleProfileInputChange}
              />
            </h1>
            <h1 className="flex flex-col font-bold gap-1">
              Mot de passe :{" "}
              <input
                type="password"
                name="password"
                placeholder="Entrez le nouveau mot de passe ici"
                className="py-1 px-2 rounded-lg h-12"
                value={formData.password}
                onChange={handleProfileInputChange}
              />
            </h1>
            {imageLoading ? (
              <button
                type="submit"
                className="bg-blue-300 py-2 px-2 w-40 rounded-xl font-bold shadow-2xl mt-2"
              >
                Mise à jour du profil...
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-300 py-2 px-2 w-40 rounded-xl font-bold shadow-2xl mt-2"
              >
                Mise à jour du profil
              </button>
            )}
          </form>
        </div>
      )}
      <div className="bg-white w-full h-[100vh] md:h-[40vh] lg:h-[80vh] xl:w-[80%] pb-4 rounded-2xl flex flex-col items-center justify-start overflow-y-auto">
        <div className="w-full flex justify-between px-6 py-6">
          <button
            onClick={() => setProfile(true)}
            className="flex gap-1 bg-black text-white py-1 px-2 rounded-xl items-center justify-center"
          >
            <h1>Paramètres</h1>
            <BsFillGearFill className="text-xl" />
          </button>
          <button
            onClick={handleLogout}
            className="flex text-white bg-black px-3 py-2 rounded-xl items-center justify-center gap-1"
          >
            Déconnexion
            <GiExitDoor className="text-xl" />
          </button>
        </div>
        <Image
          src={logo}
          alt="logo"
          className="lg:mt-16 xl:mt-1 lg:mb-6 w-40 h-20"
        />
        <div className="flex flex-col">
          <h1 className="flex gap-2 text-xl items-center">
            Bienvenue <span className="text-xl font-bold">{user?.name}</span>
            <Image
              src={user?.photo}
              alt={`Photo de profil de ${user?.name}`}
              width={32}
              height={32}
              className="border-2 rounded-full w-12 h-12"
            />
          </h1>
          <p className="font-light text-[14px] mb-4 flex gap-6 items-center mt-2">
            {user?.email}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full px-4 flex flex-col gap-3 lg:gap-6 xl:px-24"
        >
          <div className="flex flex-col w-full">
            <label>
              Écrivez votre texte ici <sup className="text-red-700">*</sup>
            </label>
            <textarea
              value={text}
              onChange={handleChange}
              placeholder="Entrez votre texte ici"
              required
              className="border-2 border-black px-4 py-2 w-full h-44 lg:h-14 xl:h-32 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-black px-2 py-2 lg:px-4 lg:py-2 rounded-xl font-bold text-white xl:w-32"
          >
            Soumettre le texte
          </button>
        </form>
        <div className="px-4 py-4 xl:px-24">
          {paragraphs.map((paragraph, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              {buttonStates[index] ? (
                <div>
                  <textarea
                    type="text"
                    value={paragraph.content}
                    className="border-2 border-black px-4 py-2 w-full h-44 lg:h-14 xl:h-32 rounded-lg overflow-y-auto"
                    onChange={(e) => handleContentChange(index, e.target.value)}
                  />
                </div>
              ) : (
                <p className="border overflow-y-auto px-4 py-2 mb-2">
                  {paragraph.content}
                </p>
              )}
              <button
                className="bg-black text-white px-4 py-2 rounded-xl"
                onClick={() => toggleButtonState(index)}
              >
                {buttonStates[index] ? "Terminé" : "Modifier"}
              </button>
              {!buttonStates[index] && (
                <button
                  className="border-2 px-4 py-2 ml-2 rounded-xl"
                  onClick={() => handleDelete(index)}
                >
                  Supprimer
                </button>
              )}
              <button
                onClick={(e) => handleUpdate(e, index)}
                className="border-2 px-4 py-2 ml-2 rounded-xl"
                disabled={loading[paragraphs[index].id] || false} // Utiliser l'identifiant du paragraphe pour vérifier l'état du chargement
              >
                {loading[paragraphs[index].id] ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </div>
          ))}
        </div>
        <Link
          href="/posts"
          className="font-light flex flex-row items-center gap-2"
        >
          Aller au post <GrLinkNext />
        </Link>
      </div>
    </main>
  );
}
