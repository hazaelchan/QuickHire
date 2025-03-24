export default function PostAction({ icon, text, onClick, className }) {
    return (
        <button className={`flex items-center space-x-2 py-2 px-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 ${className}`} onClick={onClick}>
            <span>{icon}</span>
            <span className='hidden sm:inline text-sm font-medium'>{text}</span>
        </button>
    );
}  
