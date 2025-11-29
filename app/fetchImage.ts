import resume from '@/public/images/resume.png'
import expo from '@/public/images/expo.jpg'
import helper from '@/public/images/helper.png'
import { FetchImageValues } from '@/types';

export function fetchImage(input:FetchImageValues){
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