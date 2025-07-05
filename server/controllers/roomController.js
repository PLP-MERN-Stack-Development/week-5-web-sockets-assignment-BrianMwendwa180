const Room = require("../models/Room");

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        console.log("Rooms fetched:", rooms);
        res.status(200).json({
            success: true,
            data: rooms,
            count: rooms.length
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch rooms",
            message: error.message
        });
    }
};

exports.createRoom = async (req, res) => {
    const { name } = req.body;
    
    try {
        // Validate input
        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                error: "Room name is required"
            });
        }

        // Check if room already exists
        const existingRoom = await Room.findOne({ name: name.trim() });
        if (existingRoom) {
            return res.status(400).json({
                success: false,
                error: "Room with this name already exists"
            });
        }

        const room = await Room.create({ name: name.trim() });
        console.log("Room created:", room);
        
        res.status(201).json({
            success: true,
            data: room,
            message: "Room created successfully"
        });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create room",
            message: error.message
        });
    }
};

exports.joinRoom = async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.body; // Assuming you're passing user info
    
    try {
        // Validate input
        if (!roomId) {
            return res.status(400).json({
                success: false,
                error: "Room ID is required"
            });
        }

        // Find the room
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                error: "Room not found"
            });
        }

        // Add user to room (assuming your Room model has a participants array)
        if (userId && !room.participants.includes(userId)) {
            room.participants.push(userId);
            await room.save();
        }

        res.status(200).json({
            success: true,
            data: room,
            message: "Successfully joined room"
        });
    } catch (error) {
        console.error("Error joining room:", error);
        res.status(500).json({
            success: false,
            error: "Failed to join room",
            message: error.message
        });
    }
};

exports.leaveRoom = async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.body;
    
    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                error: "Room not found"
            });
        }

        // Remove user from room
        if (userId) {
            room.participants = room.participants.filter(id => id.toString() !== userId);
            await room.save();
        }

        res.status(200).json({
            success: true,
            data: room,
            message: "Successfully left room"
        });
    } catch (error) {
        console.error("Error leaving room:", error);
        res.status(500).json({
            success: false,
            error: "Failed to leave room",
            message: error.message
        });
    }
};

exports.getRoomById = async (req, res) => {
    const { roomId } = req.params;
    
    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                error: "Room not found"
            });
        }

        res.status(200).json({
            success: true,
            data: room
        });
    } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch room",
            message: error.message
        });
    }
};