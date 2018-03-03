
// import { Images } from '../../lib/common.js';


ProfileImages.allow({
    insert: function () {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    },
    download: function() {
        return true;
    }
});

console.log("PERMISSIOS");
// console.log(Images);