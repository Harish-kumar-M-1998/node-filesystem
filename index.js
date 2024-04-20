const express = require('express');
const fs = require('fs');

const bodyParser = require('body-parser'); 
const { v4: uuidv4 } = require('uuid'); 

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.get('/', (req, res)=>{

    //Sending response status
    res.status(200).send(`
    <h1 style="background-color:skyblue;padding:10px 0px;text-align:center">
    Express Server is Connected !</h1>
    <div style="text-align:center">
    <p><span style="background-color:lightgreen;font-size:18px"> To Create a New txt file</span> --> <a href="/new-create-write-read-txt">Click Here</a></p>
    <p><span style="background-color:skyblue;font-size:18px">To Retrieve All txt file</span> --> <a href="/read-all-txtFiles">Click Here</a></p>
    </div>
    `);
    
});




//Creating new data-time.txt file andread it's inside content
app.get('/new-create-write-read-txt', (req, res) => {
    try {
        const currentTimeStamp = new Date().toISOString(); // Current timestamp
        const safeFileName = currentTimeStamp.replace(/:/g, '-'); // Replace colons to prevent file system errors
        const directoryPath = './TimeStamp';
        const filePath = `${directoryPath}/${safeFileName}.txt`; // Updated file path with a safe file name

        // Check if TimeStamp directory exists, if not create it
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }

        const content = `Current TimeStamp : ${currentTimeStamp}`; // Content of the txt file
        fs.writeFileSync(filePath, content, 'utf8'); // Creating the txt file
        let data = fs.readFileSync(filePath, 'utf8'); // Reading the created txt file content

        // Sending response status and data
        res.status(200).send(`<div style="background-color:green;padding:10px 0px;text-align:center;color:white">
            <h1>File created successfully!</h1>
            <p>Txt File Name : ${safeFileName}.txt</p>
            <p>Txt File Content : ${data}</p>
            <p><a href="/" style="color:yellow">Back to Home</a></p>
        </div>`);
    } catch (err) {
        // Error handling if anything goes wrong
        res.status(500).send(`<h1 style="background-color:red;padding:10px 0px;text-align:center;color:white">
            Error: ${err.message}</h1>`);
    }
});



app.get('/read-all-txtFiles', (req, res) => {
    try {
        // Reading all files in the TimeStamp directory
        const files = fs.readdirSync('./TimeStamp');// It return all files in an array
        // console.log(files);

        // Filter out only the text files
        const txtFiles = files.filter(file => file.endsWith('.txt'));// It return all txt files in an array
        // console.log(txtFiles);

        // Sending response status and data
        res.status(200).send(`<h1 style="background-color:blue;padding:10px 0px;text-align:center;color:white">
        All Retrieved Text Files<p><a href="/" style="color:yellow">Back to Home</a></p></h1><ul>${txtFiles.map(file => 
            `<dl style="display: list-item;list-style-type: disc;">
            <dt><b>File Name : </b>${file}</dt>
            <dd style="display: list-item;list-style-type: circle;"><b>File Content : </b>${fs.readFileSync(`./TimeStamp/${file}`, 'utf8')}</dd>
            </dl>`).join('')}</ul>`);
    } catch (err) {

        //Throwing error if anything goes wrong
        res.status(500).send(`<h1 style="background-color:red;padding:10px 0px;text-align:center;color:white">
        Error reading files: ${err.message}</h1>`);
    }
});


//listening to the created server port
app.listen(PORT, ()=>{
    console.log(`Server running in the port : ${PORT}`);
})