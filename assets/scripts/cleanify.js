function initTextAreas() {
    var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("sourceArea"));
}

function setSource(element) {
    var operands = ["to-XML", "to-JSON", "to-YAML"];
    var navLinks = $(".nav-link");
    var ele = element;
    if(navLinks) {
        for (i=0; i<navLinks.length; i++){
            navLinks.removeClass("active");
        }
        ele.classList.add("active");
    }
    var currentOperation = 'to-'+ele.getAttribute("value");
    var opList = operands;
    var operationButtons = $(".operand");
    
    for(i=0; i<opList.length; i++) {
        if(opList[i] === currentOperation){
            opList.splice(i, 1);
        }
    }

    for(i=0; i< operationButtons.length; i++){
        operationButtons[i].setAttribute("value", opList[i]);
        
        operationButtons[i].innerHTML = ele.getAttribute("value") + " " + (opList[i].split("-"))[0] + " " + (opList[i].split("-"))[1];
    }
}

function execute(btnVal){
    var result;
    switch (btnVal.value) {
        case "beautify":
            ele = $(".nav-link.active");
            console.log("ele : " + ele);
            if(ele[0].getAttribute("value") == "JSON") {
                result = beautifyJSON(document.getElementById("sourceArea").value);
            } else if(ele[0].getAttribute("value") == "XML") {
                result = beautifyXML(document.getElementById("sourceArea").value);
            }
        break;
        case "to-XML":
        result = JSONtoXML(document.getElementById("sourceArea").value);
        break;
        case "to-YAML":
        result = JSONtoYAML(document.getElementById("sourceArea").value);
        break;  
    }
    document.getElementById("outputArea").value = result;
}


// JSON Operations
function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function beautifyJSON() {
    if (IsValidJSONString(document.getElementById("sourceArea").value) && document.getElementById("sourceArea").value != ''){
        var rawCode = JSON.parse(document.getElementById("sourceArea").value);
        return JSON.stringify(rawCode, null, 3);
    } else {
        return ("Invalid JSON input!");
    }
}

function JSONtoXML(obj) {
    var xml = '';
    if (IsValidJSONString(obj) && document.getElementById("sourceArea").value != ''){
        obj = JSON.parse(obj);
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
        return xml;
    } else {
        return "Invalid JSON input!";
    }
}

function JSONtoYAML(obj){
    if (IsValidJSONString(obj) && document.getElementById("sourceArea").value != ''){
        obj = JSON.parse(obj);
        var yaml = json2yaml(obj);
        return yaml;
    } else {
        return "Invalid JSON Input!";
    }
}


// XML Operations
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
    // formatted = formatted.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');
    return formatted;
}