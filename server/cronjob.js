SyncedCron.config({
    // Log job run details to console
    log: true,

    // Use a custom logger function (defaults to Meteor's logging package)
    logger: null,

    // Name of collection to use for synchronisation and logging
    collectionName: 'cronHistory',

    // Default to using localTime
    utc: false
});

SyncedCron.add({
    name: 'Crunch some important numbers for the marketing department',
    schedule: function (parser) {
        // parser is a later.parse object
        return parser.text('every 2 seconds');
    },
    job: function () {
        var numbersCrunched = CrushSomeNumbers();
        //return numbersCrunched;
    }
});

function CrushSomeNumbers() {
    console.log("Cursh");
}

SyncedCron.start();