import users from "../Models/Auth.js"
import jwt from "jsonwebtoken"
export const login = async (req, res) => {
    const { email, location } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            try {
                const newUser = await users.create({ 
                    email,
                    lastLoginLocation: location || 'Unknown',
                    loginHistory: [{
                        timestamp: new Date(),
                        location: location || 'Unknown'
                    }]
                });
                
                console.log('📍 New login from:', location || 'Unknown');

                const token = jwt.sign({
                    email: newUser.email,
                    id: newUser._id
                }, process.env.JWT_SECERT, {
                    expiresIn: "1h"
                });
                res.status(200).json({ result: newUser, token });
            } catch (error) {
                res.status(500).json({ mess: error.message });
                return;
            }
        } else {
            existingUser.lastLoginLocation = location || 'Unknown';
            existingUser.loginHistory = existingUser.loginHistory || [];
            existingUser.loginHistory.push({
                timestamp: new Date(),
                location: location || 'Unknown'
            });
            await existingUser.save();

            console.log('📍 Login from:', location || 'Unknown');

            const token = jwt.sign({
                email: existingUser.email,
                id: existingUser._id
            }, process.env.JWT_SECERT, {
                expiresIn: "1h"
            });
            res.status(200).json({ result: existingUser, token });
        }
    } catch (error) {
        res.status(500).json({ mess: error.message });
        return;
    }
}


