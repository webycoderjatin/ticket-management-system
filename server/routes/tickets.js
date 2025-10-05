const express = require("express")
const router = express.Router()
const Ticket = require("../models/Ticket")
const auth = require("../middleware/auth")
const idempotencyCache = new Map();

router.post("/", auth, async (req, res) => {
    const idempotencyKey = req.header('Idempotency-Key');
    if (idempotencyKey) {
        if (idempotencyCache.has(idempotencyKey)) {
            console.log('Returning cached response for key:', idempotencyKey);
            return res.status(200).json(idempotencyCache.get(idempotencyKey));
        }
    }

    const { title, description, priority } = req.body
    try {
        const newTicket = new Ticket({
            title,
            description,
            priority,
            createdBy: req.user.id
        })

        // --- SLA LOGIC START ---
        const now = new Date();
        switch (priority) {
            case 'High':
                // Deadline is 1 hour from now
                newTicket.slaDeadline = new Date(now.getTime() + 60 * 60 * 1000);
                break;
            case 'Low':
                // Deadline is 24 hours from now
                newTicket.slaDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                break;
            case 'Medium':
            default:
                // Deadline is 4 hours from now
                newTicket.slaDeadline = new Date(now.getTime() + 4 * 60 * 60 * 1000);
                break;
        }
        // --- SLA LOGIC END ---


        const ticket = await newTicket.save()
        if (idempotencyKey) {
            idempotencyCache.set(idempotencyKey, ticket);
        }

        res.status(201).json(ticket);
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Server Error'
            }
        })
    }
})

router.get("/", auth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const offset = parseInt(req.query.offset) || 0

        const query = {}
        if (req.user.role === 'Customer') {
            query.createdBy = req.user.id
        }

        // --- SLA BREACH FILTER ---
        // Check for a query like ?breached=true
        if (req.query.breached === 'true') {
            // Find tickets whose deadline is in the past ($lt = less than)
            query.slaDeadline = { $lt: new Date() };
            // And whose status is not 'Closed' ($ne = not equal)
            query.status = { $ne: 'Closed' };
        }

        // --- SEARCH FILTER ---
        // Check for a query like ?search=download
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i'); // 'i' for case-insensitive
            // Find tickets where the title OR description match the search term
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { 'comments.0.text': searchRegex }
            ];
        }


        const tickets = await Ticket.find(query)
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)

        const next_offset = (tickets.length < limit) ? null : offset + tickets.length

        res.json({
            items: tickets,
            next_offset: next_offset
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Server Error'
            }
        })
    }

})


router.get("/:id", auth, async (req, res) => {
    const { id } = req.params
    try {
        const ticket = await Ticket.findById(req.params.id).populate(
            'comments.author', // The path to populate
            'name role'        // The fields we want (name and role)
        )
        .populate('timeline.user', 'name role');

        if (!ticket) {
            return res.status(400).json({
                error: {
                    code: 'NOT_FOUND',
                    message: 'A ticket with this ID was not found.'
                }
            })
        }

        if (req.user.role !== 'Agent' && ticket.createdBy.toString() !== req.user.id) {
            return res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'You are not authorized to view this ticket.'
                }
            })
        }

        res.json(ticket)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Server Error'
            }
        })
    }
})

router.patch('/:id', auth, async (req, res) => {
    if (req.user.role !== 'Agent') {
        return res.status(403).json({ error: { code: 'UNAUTHORIZED', message: 'Only agents can update tickets.' } });
    }


    const { status, version } = req.body;

    try {
        const originalTicket = await Ticket.findById(req.params.id);
        if (!originalTicket) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found.' } });
        }
        const oldStatus = originalTicket.status;
        

        const ticket = await Ticket.findOneAndUpdate(
            { _id: req.params.id, __v: version },
            {
                $set: { status: status },
                $inc: { __v: 1 }
            },
            { new: true }
        );


        if (!ticket) {
            return res.status(409).json({
                error: {
                    code: 'CONFLICT_ERROR',
                    message: 'This ticket has been modified by someone else. Please refresh and try again.'
                }
            });
        }

         if (oldStatus !== status) {
            const actionLog = {
                user: req.user.id,
                action: `changed status from "${oldStatus}" to "${status}"`
            };
            ticket.timeline.unshift(actionLog);
            await ticket.save();
        }
        const finalTicket = await Ticket.findById(ticket._id)
            .populate('comments.author', 'name role')
            .populate('timeline.user', 'name role');

        res.json(finalTicket);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Server Error' } });
    }
});

router.post("/:id/comments", auth, async (req, res) => {
    const { text } = req.body
    if (!text) {
        return res.status(400).json({
            error: {
                code: 'FIELD_REQUIRED',
                field: 'text',
                message: 'Comment text is required.'
            }
        })
    }

    try {
        let ticket = await Ticket.findById(req.params.id)

        if (!ticket) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found.' } });
        }
        const newComment = {
            text: text,
            author: req.user.id,
        }

        ticket.comments.unshift(newComment)
        await ticket.save()

        const finalTicket = await Ticket.findById(ticket._id)
            .populate('comments.author', 'name role')
            .populate('timeline.user', 'name role');

            
        res.status(201).json(ticket);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Server Error'
            }
        })
    }
})

module.exports = router