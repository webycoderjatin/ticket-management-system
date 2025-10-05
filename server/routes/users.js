const express = require('express');
const router = express.Router();
const admin = require('../middleware/admin');
const User = require('../models/User');

router.get("/", admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Server Error' } });
    }
})

router.patch("/:id/role", admin, async (req, res) => {
    try{
        const {role} = req.body
        if(!['Customer','Agent','Admin'].includes(role)){
            return res.status(400).json({
                error: {
                    code: 'INVALID_ROLE',
                    message: 'Invalid role'
                }
            })
        }

        const user = await User.findByIdAndUpdate(
             req.params.id,
      { role: role },
      { new: true }
        ).select('-password');

        if(!user){
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found.' } });
        }

        res.json(user)
    }catch(err){
        res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Server Error' } });
    }
})


module.exports = router