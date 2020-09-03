import {
    writable
} from 'svelte/store';

/*
 - The $saver += '!' assignment is equivalent to saver.set($name + '!').
*/

export const saver = writable([]);