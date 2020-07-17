import {
    writable
} from 'svelte/store';

// to get the chosen chekbox "answer" (in multiple choices case)
export const multiChoiceCheck = writable([]);