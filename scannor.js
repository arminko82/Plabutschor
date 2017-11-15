const TUNNEL = "Plabutsch";
const indexText = 4;
const indexSymbol = 1;

String.prototype.contains = (text, term) => text.indexOf(term) !== -1;
const announcementFilter = (n) => contains(n, TUNNEL);

function isTunnelClosed() {
    var qra = $(".col" + indexText).toArray();
    var result = qra.find(announcementFilter);
    if(result) {
        var symbol = result.previousSibling.previousSibling.previousSibling.innerHTML.toString();
        var passable = symbol.contains('gesperrt');
        if(!passable) {
            $("#result").val("text", result);
        } else {
            console.log('nothing 2');
        }
    } else {
        console.log('nothing');
    }
}

if(typeof module !== 'undefined') {
	module.exports = isTunnelClosed;
}
