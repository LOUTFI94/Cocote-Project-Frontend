Documentation Cocote
1. Aperçu du Projet

Description :

Cocote est un outil conçu l'ellaboration collective de textes, traitant les textes ajouter, les divisant en paragraphes, permettant ainsi aux utilisateurs de mettre à jour des textes sélectionnés, d'aimer ou de ne pas aimer des publications de textes, et d'autoriser uniquement le créateur du post des textes à modifier ou supprimer une publication.
2. Prérequis

Outils/Bibliothèques/Logiciels :

    Next.js (pour le développement frontend)
    Tailwind CSS (pour le stylisme)
    Node.js (environnement d'exécution)
    Express.js (cadre backend)
    MongoDB (base de données)
    Git (pour le contrôle de version)
    Render.com (hébergement backend)
    Vercel.com (hébergement frontend)

    Implémentation des Fonctionnalités d'Inscription et de Connexion

Implémentation Frontend

Page d'Inscription :

Pour commencer le projet, on est allé dans pages.js pour concevoir le formulaire d'inscription. Le formulaire créé permet aux utilisateurs de saisir leur nom d'utilisateur, leur email et leur mot de passe. mise en place une fonctionnalité pour gérer les soumissions de formulaires, qui envoie les détails de l'utilisateur au backend pour l'inscription.

Page de Connexion :

Ensuite, on a travaillé sur pages/login.js pour concevoir le formulaire de connexion. Ce formulaire permet aux utilisateurs de saisir leur email et leur mot de passe. et veillé à ce que le formulaire gère les soumissions en envoyant les informations d'identification de l'utilisateur au backend pour l'authentification.

Implémentation Backend

Inscription de l'Utilisateur :

Création d'une route backend (POST /register) spécifiquement pour l'inscription des utilisateurs. Dans cette route, on a extrait le nom d'utilisateur, l'email et le mot de passe du corps de la requête. puis la mise en œuvre d'une validation des entrées pour m'assurer que tous les champs sont correctement remplis. Pour des raisons de sécurité, on a haché le mot de passe avant de le stocker dans la base de données. Ensuite, créé un nouveau document utilisateur dans la base de données et configuré la réponse pour renvoyer soit un message de succès, soit l'objet utilisateur en cas de succès de l'inscription.

Connexion de l'Utilisateur :

Pour la fonctionnalité de connexion, on a mit en place une autre route backend (POST /login). Cette route extrait l'email et le mot de passe du corps de la requête. on a validé les champs d'entrée puis recherché dans la base de données l'utilisateur avec l'email fourni. on a comparé le mot de passe haché stocké avec le mot de passe fourni lors de la tentative de connexion. Si les informations d'identification étaient valides, puis généré un jeton JWT avec les informations de l'utilisateur et l'avons renvoyé au frontend.

En suivant ces étapes, nous avons réussi à implémenter les fonctionnalités d'inscription et de connexion. Le projet propose désormais une authentification sécurisée des utilisateurs via des mots de passe hachés et des jetons JWT, avec une interaction transparente entre les formulaires frontend et les processus backend.

    Page Tableau de Bord (Fonctionnalité et Implémentation)

La page Tableau de Bord permet aux utilisateurs de gérer leurs profils, de créer et mettre à jour des publications, et de se déconnecter de l'application.
Aperçu des Composants

Le composant Tableau de Bord est un composant fonctionnel utilisant les hooks de React pour la gestion de l'état et les effets secondaires. Il offre des fonctionnalités pour la gestion du profil utilisateur, la création et la mise à jour de publications.
Variables d'État

    text : Stocke le texte d'entrée pour la création de publications.
    paragraphs : Stocke les paragraphes traités à partir du texte d'entrée.
    buttonStates : Gère l'état d'édition de chaque paragraphe.
    userId : Stocke l'ID utilisateur décodé du jeton JWT.
    user : Stocke les données du profil utilisateur récupérées.
    loading : Gère l'état de chargement des mises à jour de publications.
    profile : Bascule l'affichage du formulaire de mise à jour du profil.
    imageLoading : Gère l'état de chargement des téléchargements d'images de profil.
    success : Indique l'état de succès des mises à jour du profil.
    error : Indique l'état d'erreur des mises à jour du profil.
    formData : Stocke les entrées utilisateur pour les mises à jour du profil.

Cycle de Vie et Effets du Composant
Récupération des Données Utilisateur

    Obtenir et Décoder le Jeton Utilisateur :
        Au montage du composant, le jeton JWT est récupéré à partir du localStorage.
        Le jeton est décodé pour extraire l'ID utilisateur.
        Si aucun jeton n'est trouvé, l'utilisateur est redirigé vers la page de connexion.
    Récupérer le Profil Utilisateur :
        En utilisant l'ID utilisateur décodé, une requête API est effectuée pour récupérer les données du profil utilisateur.
        Les données utilisateur récupérées sont stockées dans la variable d'état user.

Gestionnaires d'Événements

    Gérer le Changement de Texte :
        Met à jour l'état text au fur et à mesure que l'utilisateur tape dans le champ de saisie.

    Gérer la Soumission du Formulaire :
        Traite le texte d'entrée en paragraphes.
        Initialise les buttonStates pour gérer les états d'édition des paragraphes.

    Basculer l'État du Bouton :
        Bascule l'état d'édition d'un paragraphe spécifique.

    Gérer la Suppression :
        Supprime un paragraphe spécifique.

    Gérer le Changement de Contenu :
        Met à jour le contenu d'un paragraphe spécifique lors de l'édition.

    Gérer la Mise à Jour :
        Envoie une publication mise à jour au backend et gère l'état de chargement.

    Gérer le Changement de Saisie du Profil :
        Met à jour l'état formData en fonction des saisies utilisateur pour les mises à jour de profil.

    Gérer la Mise à Jour du Profil :
        Gère la soumission du formulaire de mise à jour de profil, y compris le téléchargement de l'image de profil sur Cloudinary et la mise à jour du profil utilisateur dans le backend.

    Gérer la Déconnexion :
        Efface le jeton utilisateur du localStorage et redirige vers la page de connexion.

    Documentation de la Page Publications

Ce document fournit un aperçu et une explication détaillée du composant Publications dans une application basée sur React. La page Publications est conçue pour afficher des publications aux utilisateurs authentifiés et inclut des mesures de protection pour garantir que seuls les utilisateurs connectés peuvent y accéder.
Aperçu

Le composant Publications est un composant fonctionnel React utilisant des hooks pour la gestion de l'état et les effets secondaires. Les principales fonctionnalités incluent :

    Protéger la page contre les accès non authentifiés.
    Afficher un en-tête et le contenu des publications.

Variables d'État et Effets
Protection de la Page

    Au montage du composant, le hook useEffect vérifie si un jeton JWT est présent dans le localStorage.
    Si aucun jeton n'est trouvé, l'utilisateur est redirigé vers la page de connexion.

    Le Composant TextServer.js

Le composant TextServer est responsable de la récupération et de l'affichage des publications, de la gestion des réactions des utilisateurs (likes et dislikes) et de la suppression des publications par les utilisateurs.
Aperçu

Le composant TextServer est un composant fonctionnel React utilisant des hooks pour la gestion de l'état et les effets secondaires. Les principales fonctionnalités incluent :

    Récupérer et afficher des publications.
    Récupérer les détails des utilisateurs pour chaque publication.
    Gérer les réactions des utilisateurs (likes et dislikes).
    Permettre aux utilisateurs de supprimer leurs propres publications.

Variables d'État et Effets
Variables d'État

    posts : Tableau pour stocker la liste des publications récupérées du serveur.
    userId : Chaîne pour stocker l'ID de l'utilisateur connecté.
    posters : Objet pour stocker les noms des utilisateurs qui ont posté chaque publication.

Effets

    Récupération de l'ID Utilisateur à partir du Jeton :
        Au montage du composant, le hook useEffect vérifie si un jeton JWT est présent dans le localStorage.
        Si le jeton est trouvé, il le décode pour extraire l'ID utilisateur et définit la variable d'état userId.
    Récupération des Publications :
        Un autre hook useEffect récupère la liste des publications du serveur et définit la variable d'état posts.
    Récupération des Détails des Auteurs :
        Un troisième hook useEffect récupère les détails des auteurs (nom d'utilisateur) pour chaque publication et les stocke dans l'objet d'état posters.

7. Résumé

    Forkez le dépôt sur GitHub.
    Clonez le dépôt forké sur votre machine locale.
    Installez les dépendances pour le frontend et le backend.
    Configurez les variables d'environnement.
    Exécutez les serveurs frontend et backend.
    Vérifiez et interagissez avec l'application.

8. Utilisation

Utilisation du Projet :

    Étape 1 : Naviguez vers la page d'accueil.
    Étape 2 : Créez une nouvelle publication en saisissant du texte.
    Étape 3 : Divisez automatiquement le texte en paragraphes.
    Étape 4 : Mettez à jour n'importe quel paragraphe en le sélectionnant et en modifiant le texte.
    Étape 5 : Aimez ou n'aimez pas les publications à l'aide des boutons fournis.
    Étape 6 : Seul le créateur peut supprimer sa publication à l'aide de l'option de suppression.
