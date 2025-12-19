const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Doctor = require("../../models/doctor");

function doctorAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.sender = {
            "id": payload.id,
            "userType": payload.userType
        };

        if (payload.userType == "Doctor") {
            try {
                let doctor = await Doctor.findOne({
                    'userId': mongoose.Types.ObjectId(req.sender.id)
                });
                if (!doctor) {
                    return res.status(404).json({ message: 'Doctor not found' });
                }
                req.sender.doctorId = doctor._id;
                next();
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    });
}

module.exports = doctorAuth;
