"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, useRef, useEffect } from "react"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { Link, useParams } from "react-router-dom"
import { MoreHorizontal, ThumbsUp, Trash2, LinkIcon, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import PostAction from "./PostAction"

const Post = ({ post }) => {
  const { postId } = useParams()
  const { data: authUser } = useQuery({ queryKey: ["authUser"] })
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(post.comments || [])
  const [showOptions, setShowOptions] = useState(false)
  const [isLiked, setIsLiked] = useState(post.likes.includes(authUser._id))
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const optionsRef = useRef(null)
  const isOwner = authUser._id === post.author._id

  const queryClient = useQueryClient()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast.success("Post deleted successfully", {
        icon: "🗑️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, { content: newComment })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast.success("Comment added", {
        icon: "💬",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      })
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to add comment")
    },
  })

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/like`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["post", postId] })
    },
  })

  const handleDeletePost = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4">
          <p className="font-medium">Delete this post?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-200 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deletePost()
                toast.dismiss(t.id)
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000 },
    )
    setShowOptions(false)
  }

  const handleLikePost = async () => {
    if (isLikingPost) return

    // Optimistic update
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))

    likePost()
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      createComment(newComment)
      setNewComment("")
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            name: authUser.name,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date(),
        },
      ])
    }
  }

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${post._id}`
    navigator.clipboard.writeText(postUrl)
    toast.success("Link copied to clipboard", {
      icon: "🔗",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    })
    setShowOptions(false)
  } 

  const openMediaModal = (media) => {
    setSelectedMedia(media)
    setShowMediaModal(true)
  }

  return (
    // Main post container using a white background for a clean look
    <div className="mb-6 overflow-hidden animate-slide-up rounded-lg shadow bg-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Link to={`/profile/${post?.author?.username}`} className="flex items-center group">
            <img
              src={post.author.profilePicture || "/avatar.png"}
              alt={post.author.name}
              className="w-12 h-12 rounded-full mr-3 border-2 border-white shadow-sm group-hover:shadow-md transition-all"
            />
            <div>
              <h3 className="font-semibold group-hover:text-blue-600 transition-colors text-gray-900">{post.author.name}</h3>
              <p className="text-xs text-gray-500">{post.author.headline}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </Link>

          <div className="relative" ref={optionsRef}>
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>

            {showOptions && (
              // Options menu with white background
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 animate-fade-in">
                {isOwner && (
                  <button
                    onClick={handleDeletePost}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete post
                  </button>
                )}
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LinkIcon size={16} className="mr-2" />
                  Copy link to post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <p className="mb-4 break-words whitespace-pre-wrap overflow-hidden text-gray-800">
          {post.content}
        </p>

        {post.media && post.media.length > 0 && (
          <div className={`grid ${post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-2 mb-4 w-full`}>
            {post.media.map((mediaItem, index) => (
              <div
                key={index}
                className={`relative w-full overflow-hidden rounded-lg cursor-pointer transform transition-transform hover:scale-[1.02] ${post.media.length === 1 ? "aspect-auto" : "aspect-square"}`}
                onClick={() => openMediaModal(mediaItem)}
              >
                {mediaItem.type === "image" ? (
                  <img
                    src={mediaItem.url || "/placeholder.svg"}
                    alt={`Post media ${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <video className="w-full h-full object-cover rounded-lg" poster={mediaItem.thumbnail}>
                    <source src={mediaItem.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {mediaItem.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-blue-500 border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-gray-500 border-t border-b border-gray-200 py-1 my-2">
          <div className="flex items-center">
            {likeCount > 0 && (
              <div className="flex items-center text-xs">
                <div className="bg-blue-100 p-1 rounded-full">
                  <ThumbsUp size={12} className="text-blue-500" />
                </div>
                <span className="ml-1">{likeCount}</span>
              </div>
            )}
          </div>
          {comments.length > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </button>
          )}
        </div>

        <div className="flex justify-between text-gray-600 pt-1">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={isLiked ? "text-blue-500" : ""}
              />
            }
            text={isLiked ? "Liked" : "Like"}
            onClick={handleLikePost}
          />
          <PostAction
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-message-square"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            }
            text="Comment"
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-share-2"
              >
                <path d="M18 8a6 6 0 0 0-6-6c-3.31 0-6 2.69-6 6a6 6 0 0 0 6 6c3.31 0 6-2.69 6-6z"></path>
                <path d="M6 16a6 6 0 0 0 6 6c3.31 0 6-2.69 6-6a6 6 0 0 0-6-6c-3.31 0-6 2.69-6 6z"></path>
                <line x1="12" x2="12" y1="8" y2="16"></line>
              </svg>
            }
            text="Share"
          />
          <PostAction
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-send-horizontal"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
            }
            text="Send"
          />
        </div>

        {showComments && (
          <div className="mt-4">
            <h4 className="mb-2 font-semibold text-gray-900">Comments</h4>
            {comments.map((comment) => (
              // Comment card with a white background that blends into the post
              <div key={comment._id} className="mb-2 p-2 rounded-md bg-white shadow border border-gray-100">
                <div className="flex items-start">
                  <img
                    src={comment.user?.profilePicture || "/avatar.png"}
                    alt={comment.user?.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{comment.user?.name}</p>
                    <p className="text-xs text-gray-600">{comment.content}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <form onSubmit={handleAddComment} className="flex items-center mt-3">
              <img
                src={authUser?.profilePicture || "/avatar.png"}
                alt={authUser?.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-grow p-2 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                disabled={isAddingComment}
              >
                {isAddingComment ? "Commenting..." : "Post"}
              </button>
            </form>
          </div>
        )}
      </div>
      {showMediaModal && selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full bg-white rounded-xl overflow-hidden">
            <button
              onClick={() => setShowMediaModal(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all"
            >
              <X size={24} />
            </button>
            <div className="h-full flex items-center justify-center">
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.url || "/placeholder.svg"}
                  alt="Media"
                  className="max-h-[90vh] max-w-full object-contain"
                />
              ) : (
                <video controls autoPlay className="max-h-[90vh] max-w-full">
                  <source src={selectedMedia.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Post
