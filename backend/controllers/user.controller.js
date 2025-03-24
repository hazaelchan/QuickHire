import User from "../models/user.model.js";

// Get current logged-in user
export const getCurrentUser = async (req, res) => {
    try {
        const user = req.user; // This is set by the protectRoute middleware
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error in getCurrentUser controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get suggested connections for current user
export const getSuggestedConnections = async (req, res) => {
    try {
        const currentUser = req.user;
        const connections = await User.find({
            _id: { $ne: currentUser._id }, // Exclude current user
            connections: { $nin: [currentUser._id] } // Exclude existing connections
        })
        .limit(10)
        .select("name username profilePicture");

        res.json(connections);
    } catch (error) {
        console.error("Error in getSuggestedConnections controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get public profile by username
export const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username })
            .select("-password")
            .populate("connections", "name username profilePicture");
            
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        console.error("Error in getPublicProfile controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select("-password")
            .sort({ createdAt: -1 });
            
        res.json(users);
    } catch (error) {
        console.error("Error in getAllUsers controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get active users (last 15 minutes)
export const getActiveUsers = async (req, res) => {
    try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        
        const activeUsers = await User.find({
            lastActive: { $gte: fifteenMinutesAgo }
        }).select("name username profilePicture");

        res.json(activeUsers);
    } catch (error) {
        console.error("Error in getActiveUsers controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};
