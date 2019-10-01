function initTextAreas() {

    var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("sourceArea"));
}

function beautifyJSON() {
    if (IsValidJSONString(document.getElementById("sourceArea").value)){
        var rawCode = JSON.parse(document.getElementById("sourceArea").value);
        document.getElementById("outputArea").value = JSON.stringify(rawCode, null, 3);
    } else {
        alert("Invalid JSON input!");
    }
}

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}