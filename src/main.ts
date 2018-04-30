import { readdir } from 'fs';
import { Player } from 'sa-player';

import { config } from './config';

const supportedFormats: string[] = ['.mp3'];

export class SoundPlayer {
    /**
     * Lists the available sound files in the configured directory
     * @returns {Promise<string[]>} A list of compatible sound files
     * @memberof SoundPlayer
     */
    public getAvailableSounds(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            readdir(config.soundDirectory, (err, files) => {
                if (err) {
                    reject(err);
                }
                resolve(files.filter(file => supportedFormats.some(format => file.includes(format))));
            });
        });
    }

    /**
     * Plays the requested sound
     * @param {string} filename sound file to play
     * @returns {Promise<void>} 
     * @memberof SoundPlayer
     */
    public playSound(filename: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getAvailableSounds().then(sounds => {
                if (sounds.find(sound => sound === filename) === undefined) {
                    reject(`A sound with the name ${filename} could not be found`);
                }
                const player = new Player();
                player.play(`${config.soundDirectory}/${filename}`).then(resolve).catch(reject);
            }).catch(reject);
        });
    }
}