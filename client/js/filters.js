'use strict';

/* Filters */

app.filter("testing", function() {
    return function(text) {
        return String(text).replace(/-/g, "_");
    }
});