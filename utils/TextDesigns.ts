import figlet from 'figlet';
import { style } from 'ascii-art';

declare type Colors = 'Red' | 'Green' | 'Bright Cyan';

export const logFiglet = (text: string) => {
    console.log('\n');
    figlet(text, {
    }, (err, result) => {
        console.log(err || result);
    });  
};  

export const logColoredText = (text: string, color: string) => {
        console.log(style(text, color.toString(), true));
};