
"use strict";

self.onmessage = function(evt) {
    setTimeout(function() {
        self.postMessage('here we are: ' + evt.data);
    }, 1500);
};