import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";

const PostCreation = ({ user }) => {
	const [content, setContent] = useState("");
	const [media, setMedia] = useState([]);
	const [mediaPreviews, setMediaPreviews] = useState([]);

	const queryClient = useQueryClient();

	const { mutate: createPostMutation, isPending } = useMutation({
		mutationFn: async (postData) => {
			const res = await axiosInstance.post("/posts/create", postData, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		onSuccess: () => {
			resetForm();
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to create post");
		},
	});

	const handlePostCreation = async () => {
		try {
			const postData = { content };
			if (media.length > 0) {
				postData.media = await Promise.all(media.map(async (file) => {
					return {
						file: await readFileAsDataURL(file),
						type: file.type.startsWith('video/') ? 'video' : 'image'
					};
				}));
			}

			createPostMutation(postData);
		} catch (error) {
			console.error("Error in handlePostCreation:", error);
		}
	};

	const resetForm = () => {
		setContent("");
		setMedia([]);
		setMediaPreviews([]);
	};

	const handleMediaChange = (e) => {
		const files = Array.from(e.target.files);
		if (files.length + media.length > 4) {
			toast.error("You can upload a maximum of 4 files");
			return;
		}

		const validFiles = files.filter(file => {
			if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
				return true;
			}
			toast.error(`Unsupported file type: ${file.type}`);
			return false;
		});

		validFiles.forEach(file => {
			readFileAsDataURL(file).then(dataUrl => {
				setMedia(prev => [...prev, file]);
				setMediaPreviews(prev => [...prev, {
					url: dataUrl,
					type: file.type.startsWith('video/') ? 'video' : 'image'
				}]);
			});
		});
	};

	const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};


{/* for the create post, and editing the padding  of the textarea */}
return (
	<div className='bg-secondary rounded-lg shadow mb-4 p-4'>
		<div className='flex space-x-3'>
			<img src={user.profilePicture || "/avatar.png"} alt={user.name} className='size-12 rounded-full' />
			<textarea
				placeholder="What's on your mind?"
				className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px] overflow-wrap-break-word break-words'
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
		</div>

		{mediaPreviews.length > 0 && (
				<div className='mt-4 grid grid-cols-2 gap-2'>
					{mediaPreviews.map((preview, index) => (
						<div key={index} className='relative'>
							{preview.type === 'image' ? (
								<img src={preview.url} alt={`Media ${index}`} className='w-full h-auto rounded-lg' />
							) : (
								<video controls className='w-full rounded-lg'>
									<source src={preview.url} type='video/mp4' />
									Your browser does not support the video tag.
								</video>
							)}
							<button
								onClick={() => {
									setMedia(prev => prev.filter((_, i) => i !== index));
									setMediaPreviews(prev => prev.filter((_, i) => i !== index));
								}}
								className='absolute top-1 right-1 bg-red-500 text-white rounded-full size-6 flex items-center justify-center hover:bg-red-600 transition-colors'
							>
								×
							</button>
						</div>
					))}
				</div>
			)}

			<div className='flex justify-between items-center mt-4'>
				<div className='flex space-x-4'>
					<label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
						<Image size={20} className='mr-2' />
						<span>Media</span>
						<input 
							type='file' 
							accept='image/*, video/*' 
							className='hidden' 
							onChange={handleMediaChange}
							multiple
						/>
					</label>
				</div>
				<button
				
					className={`bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200 ${
						content.trim() !== '' || media.length > 0 
						? 'animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
						: ''
					}`}
					onClick={handlePostCreation}
					disabled={isPending || (content.trim() === '' && media.length === 0)}
				>
					{isPending ? <Loader className='size-5 animate-spin' /> : "Share"}
				</button>
			</div>
		</div>
	);
};
export default PostCreation;

