const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();

const app = express();

//Middleware 
app.use(cors())
app.use(express.json());

// connection code
mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("Database connected")).catch(err=>console.error('Mongose connection error',err))

// contact schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

// contact module

const Contact = new mongoose.model('Contacts', contactSchema);

// get method

app.get('/api/contacts', async(req,res)=>{
      try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// post method
app.post('/api/contacts', async(req,res)=>{
    try {
        const { name, email, phone, address } = req.body;
        const contact = new Contact({ name, email, phone, address });
        const savedContact = await contact.save();
        res.status(201).json(savedContact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// update method

app.put('/api/contacts/:id', async(req,res)=>{
     try {
        const { name, email, phone, address } = req.body;
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address },
            { new: true }
        );
        if (!updatedContact) return res.status(404).json({ message: 'Contact not found' });
        res.json(updatedContact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// delete method

app.delete('/api/contacts/:id', async(req,res)=>{
     try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) return res.status(404).json({ message: 'Contact not found' });
        res.json({ message: 'Contact deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
// Connecting to the database
const PORT = process.env.PORT || 7000;
app.listen(PORT,()=>console.log(`Server is running at ${PORT}`));