const express = require("express")
const router = express.Router()
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const auth = require("../middleware/auth")


router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body

    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                error: {
                    code: 'USER_EXISTS',
                    field: 'email',
                    message: 'A user with this email already exists.'
                }
            })
        }

        user = new User({
            name,
            email,
            password,
            role
        })

        await user.save()

        res.status(201).json({ message: "User registered successfully" })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'An unexpected error occurred.'
            }
        })
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password.'
                }
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password.'
                }
            })
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err
                res.json({ token })
            }
        )

    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'An unexpected error occurred.'
            }
        })
    }

})

router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'An unexpected error occurred.'
            }
        })
    }
})




module.exports = router