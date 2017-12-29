Template.header.onCreated(function() {
    var googleFont = {rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"};
    var dropzoneJS = {type: "text/javascript", src: "../../../../public/assets/scripts/dropzone.js"}
    DocHead.addLink(googleFont);
    DocHead.loadScript(dropzoneJS);
})