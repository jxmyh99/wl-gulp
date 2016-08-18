'use strict';

export default class Header {
    constructor() {
        this.name = 'header';
        console.log('%s header', this.name);
        for (var i = 0; i < 1000; i++) {}
    }
}
