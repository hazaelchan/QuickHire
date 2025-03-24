import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const Post = () => {
    const { id } = useParams(); // Single declaration of id
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null); // Single declaration of error state
    const [loading, setLoading] = useState(true); // Single declaration of loading state

    useEffect(() => {
        const fetchPost = async () => {
            setError(null); // Reset error state before fetching
            try {
                const response = await axiosInstance.get(`/posts/${id}`);
                setLoading(false); // Set loading to false after fetching
                console.log("Fetched post data:", response.data); // Log the fetched post data
                if (response.data && response.data.id) { // Check if the post data is valid
                    setPost(response.data);
                } else {
                    setError("Post not found."); // Set error state if post data is invalid
                }
            } catch (error) {
                setError("Post not found."); // Set error state if fetch fails
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, [id]);

    const [selectedImage, setSelectedImage] = useState(null);

    const openModal = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="post">
            {loading ? (
                <p>Loading post...</p> // Show loading message
            ) : error ? (
                <p className="text-red-500">{error}</p> // Display error message
            ) : post ? (
                <>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                </>
            ) : (
                <p className="text-red-500">{error}</p> // Display error message
            )}

            {post.image && (
                <img
                    src={post.image}
                    alt="Post"
                    className="post-image"
                    onClick={() => openModal(post.image)}
                />
            )}

            {/* Image Modal */}
            {selectedImage && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Enlarged" className="modal-image" />
                        <button className="close-button" onClick={closeModal}>X</button>
                    </div>
                </div>
            )}

            {/* Styles */}
            <style jsx>{`
                .post-image {
                    width: 100%;
                    max-width: 400px;
                    cursor: pointer;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    position: relative;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 90%;
                    max-height: 90%;
                }
                .modal-image {
                    max-width: 100%;
                    max-height: 80vh;
                }
                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: red;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default Post;
