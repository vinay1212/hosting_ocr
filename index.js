import express from 'express';
import path from 'path';
import { dirname} from "path";
import { fileURLToPath } from "url";
import multer from 'multer';
import mongoose from 'mongoose';
import detectText from './ocr_script.js';


const port = process.env.PORT || 3000

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const imageSchema = new mongoose.Schema({
    filename: String,
    path: String,
});
  
const Image = mongoose.model('Image', imageSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Destination folder for uploaded images
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
    },
});

// Initialize multer with storage options
const upload = multer({ storage: storage });

app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/index.html');
})

app.post('/submit',upload.single('file'), async(req, res)=>{
    // res.send("received");

    try {
        if (!req.file) {
          return res.status(400).send('No file uploaded.');
        }
        
        
        const image = new Image({
          filename: req.file.filename,
          path: req.file.path,
        });
    
        // await image.save();
        const img = req.file.filename;
    
        const output = 'output.txt';
        const jfile = await detectText(__dirname+'/uploads/'+img, output);
    
        await res.json(jfile);
    
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
})

app.listen(port, ()=>{
    console.log('listening on port 3000');
})