import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import { SoundPlayer } from './main';
import { config } from './config';

const app = express();
const player = new SoundPlayer();

app.set('json spaces', 10);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use((req, res, next) => {
    console.log(`${(new Date()).toLocaleString()} ${req.socket.remoteAddress.replace('::ffff:', '')} ${req.method} ${req.url}`);
    next();
});

app.use(fileUpload());

app.get('/api/sounds', (req, res) => {
    player.getAvailableSounds().then(sounds => res.send(sounds)).catch(err => res.status(500).send('An error occured'));
});

app.get('/api/sounds/:filename', (req, res) => {
    player.playSound(req.params.filename).then(() => {
        res.send('success');
    }).catch((err: string) => {
        if (err.includes('could not be found')) {
            res.status(404).send('The requested file does not exist');
        } else {
            res.status(500).send('An error occured');
        }
    });
});

app.post('/api/upload', (req, res) => {
    if (!req.files) {
        res.status(400).send('No files were uploaded.');
    } else {
        let sampleFile = <fileUpload.UploadedFile>req.files.file;
        sampleFile.mv(`${config.soundDirectory}/${sampleFile.name}`, (err) => {
            if (err) {
                console.log(err);
                res.status(500).send(err)
            } else {
                res.send('File uploaded!');
            }
        });
    }
});


app.listen(3000);