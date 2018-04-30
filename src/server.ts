import * as express from 'express';
import { SoundPlayer } from './main';

const app = express();
const player = new SoundPlayer();

app.set('json spaces', 10);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/sounds', (req, res) => {
    player.getAvailableSounds().then(sounds => res.send(sounds)).catch(err => res.status(500).send('An error occured'));
});

app.get('/api/sound/:filename', (req, res) => {
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

app.listen(3000);