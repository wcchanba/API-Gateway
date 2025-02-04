const express = require('express')
const bcrypt = require('bcryptjs')
const randomstring = require('randomstring')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

// ============================= User Management =============================
// add user 
router.post('/users/add', async (req,res) => {
    const newUser = {
        ...req.body,
        secret: randomstring.generate(20)
    }
    const user = new User(newUser)

    try {
        await user.save()
        const userObject = user.toObject()
        delete userObject._id
        delete userObject.__v
        delete userObject.password
        delete userObject.tokens
        res.status(201).send(userObject)
    } catch (error) {
        res.status(400).send(error)
    }
})

// user login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password, req.body.secret)
        const token = await user.generateAuthToken()
        res.send({ token })
    } catch (error) {
        res.status(400).send()
    }
})

// user logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// user logout all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// change password
router.post('/users/changepassword', auth, async (req, res) => {
    try {
        const newPassword = await bcrypt.hash(req.body.password, 8)
        const user = await User.findOneAndUpdate({ username: req.user.username }, { password: newPassword })

        if (!user) {
            return res.status(404).send()
        }

        res.send('Password changed!')
    } catch (error) {
        res.status(400).send(error)
    }
})

// find user 
router.get('/users/find', auth, async (req,res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})

// update user data by ID
router.patch('/users/update/:id', async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username']
    const isValidOperation= updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update])

        await user.save()
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// delete user
router.delete('/users/delete/:id', async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.send(500).send(error)
    }
})

module.exports = router