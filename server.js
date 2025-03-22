const express = require('express');
const { exec } = require('youtube-dl-exec');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());


app.post('/download', async (req, res) => {
    const { url } = req.body;

 
    if (!url || !url.includes('youtube.com/watch?v=')) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        
        const output = `./${Date.now()}.mp3`;

        
        await exec(url, {
            extractAudio: true,
            audioFormat: 'mp3',
            output: output
        });

        res.download(output, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ error: 'Failed to send the file' });
            }
        
            fs.unlinkSync(output);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to download the video' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});