
const TUNNEL = "Plabutsch";
const indexText = 4;
const indexSymbol = 1;

string.prototype.contains = (text, term) => text.indexOf(term) !== -1;
const announcementFilter = (n) => contains(n, TUNNEL);

function reveralTunnelState() {
    var qra = $(".col" + indexText).toArray();
    var result = qra.find(announcementFilter);
    if(result) {
        var symbol = result.previousSibling.previousSibling.previousSibling.innerHTML.toString();
        var passable = symbol.contains('gesperrt');
        if(!passable) {
            $("#result").val("text", result);
        } else {
            alert('nothing 2');
        }
    } else {
        alert('nothing');
    }
}
