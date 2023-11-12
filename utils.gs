class Utils {
    constructor() { }
    objSize(obj) {
        var size = 0,
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
    bytesCount(str) {
        return Utilities.newBlob(str).getBytes().length;
    }
    isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
}

function get_updates() {
    var updates = myBot.getUpdates();
    for (var i = 0; i < updates.length; i++) {
        var message_text = type.Update(updates[i]).message.text;
        Logger.log(message_text);
    }
}
