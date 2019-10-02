function initTextAreas() {
    var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("sourceArea"));
}

function execute(btnVal){
    switch (btnVal.value) {
        case "beautify":
            beautifyJSON();
            break;
        case "toXML":
          JSONtoXML(JSON.parse(document.getElementById("sourceArea").value));
          break;
      }
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

function JSONtoXML(obj) {
    var xml = '';
    if (IsValidJSONString(document.getElementById("sourceArea").value)){
        for (var prop in obj) {
            if (obj[prop] instanceof Array) {
                for (var array in obj[prop]) {
                    xml += '<' + prop + '>';
                    xml += JSONtoXML(new Object(obj[prop][array]));
                    xml += '</' + prop + '>';
                }
            } else {
                xml += '<' + prop + '>';
                typeof obj[prop] == 'object' ? xml += JSONtoXML(new Object(obj[prop])) : xml += obj[prop];
                xml += '</' + prop + '>';
            }
        }
        var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
        xml = beautifyXML(xml);
        document.getElementById("outputArea").value = xml;
        return xml
    } else {
        alert("Invalid JSON input!");
    }
}

function beautifyXML(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}