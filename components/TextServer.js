import React, { useEffect, useState } from "react";
import {
  AiTwotoneLike,
  AiTwotoneDislike,
  AiTwotoneDelete,
} from "react-icons/ai";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


export default function TextServer() {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");
  const [posters, setPosters] = useState("");

  // Récupérer l'ID utilisateur depuis le token
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      try {
        const decodedUser = jwtDecode(userToken);
        setUserId(decodedUser.userId);
      } catch (error) {
        console.error("Erreur de décodage du token :", error);
      }
    } else {
      console.warn("Token utilisateur non trouvé.");
    }
  }, []);

  // Récupérer plusieurs publications en utilisant `useEffect`
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get("https://cocote.onrender.com/posts");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Erreur lors de la récupération des publications :", error);
      }
    }

    fetchPosts();
  }, [userId]);

  // Récupérer le créateur d'une publication spécifique
  useEffect(() => {
    const fetchPoster = async (postId, userId) => {
      try {
        const response = await axios.get(
          `https://cocote.onrender.com/profile/${userId}`
        );
        setPosters(response.data.user.name)
      } catch (error) {
        console.error("Erreur lors de la récupération du créateur :", error);
      }
    };

    posts.forEach((post) => {
      if (post.user && !posters[post._id]) {
        fetchPoster(post._id, post.user);
      }
    });
  }, [posts]);

  const handleToggleReaction = async (postId, reactionType) => {
    try {
      if (userId) {
        await axios.post(
          `https://cocote.onrender.com/${reactionType}/${postId}`,
          { userId }
        );

        const response = await axios.get("https://cocote.onrender.com/posts");
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error(`Erreur lors du changement de réaction ${reactionType} :`, error);
    }
  };


  // Supprimer une publication (peut seulement être fait par le propriétaire de la publication)
  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(`https://cocote.onrender.com/posts/${postId}`);
      console.log('Publication supprimée avec succès :', response.data);
      // Mettre à jour l'état des publications en filtrant la publication supprimée
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la publication :', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      {posts?.map((post) => {
        return (
          <div key={post.id}>
            <p>{post.body}</p>
            <h1 className="mt-1 font-light text-[#c4c4c4]">
              {post.user === userId ? "Publié par vous" :  `Publié par ${posters}`}
            </h1>
            <div className="flex items-center gap-2 mt-2 mb-4">
              <button
                type="button"
                onClick={() => handleToggleReaction(post._id, "like")}
                className="flex text-xl"
              >
                <AiTwotoneLike /> <sub>{post.likes.length * 2}</sub>
              </button>
              <button
                type="button"
                onClick={() => handleToggleReaction(post._id, "dislike")}
                className="flex text-xl"
              >
                <AiTwotoneDislike /> <sub>{post.dislikes.length * 2}</sub>
              </button>

              {post.user === userId? <button
                type="button"
                onClick={() => handleDeletePost(post._id)}
                className="flex text-xl"
              >
                <AiTwotoneDelete />
              </button> : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}
