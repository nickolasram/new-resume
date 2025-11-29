import resume from '@/public/images/resume.png'
import expo from '@/public/images/expo.jpg'
import helper from '@/public/images/helper.png'
import { fetchImageValues } from '@/types';

export function fetchImage(input:fetchImageValues){
    switch (input){
        case 'helper main':
            return helper.src;
        case 'expo main':
            return expo.src;
        case 'resume main':
            return resume.src;
        default:
            return resume.src
    }
}