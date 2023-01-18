import nodeHtmlParser from "node-html-parser";
const {NodeType, parse} = nodeHtmlParser;
import fs from "fs";
import marketingCloudBootstrap from "../marketing-cloud-bootstrap/marketing-cloud-bootstrap.js"
const {Platform} = marketingCloudBootstrap;

const selfClosingTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function processDocument(element) {
    let result = "";
    let isProcessingInstruction = determineProcessingInstruction(element);
    let isRootElement = determineRootElement(element);
    let isElement = determineElement(element);
    let isSelfClosing = determineSelfClosing(element);
    let isServerSideJavascript = determineServerSideJavascript(element);
    if (!isRootElement && (isElement || isProcessingInstruction)) {
        console.log("isProcessingInstruction(" + element.rawTagName + "): " + isProcessingInstruction);
        // if (isServerSideJavascript) {
        //     // TODO: implement this
        // } else {
            result = 'response += `' + "<" + element.localName;
            if (element.rawAttrs) {
                result += " " + element.rawAttrs;
            }
            result += (isSelfClosing ? "" : ">");
        // }
    } else if (isRootElement) {
        result = "";
    } else {
        result += element.rawText;
    } 
    let nodes = element.childNodes;
    if (nodes && nodes.length > 0) {
        for (let i = 0; i < nodes.length; i++) {
            result += processDocument(nodes[i]);
        }
    }
    return result + (isElement && !isServerSideJavascript
        ? (isSelfClosing ? "/>" : "</" + element.localName + ">")
        : "") + '`;'
}

function determineProcessingInstruction(element) {
    return (element && !element.parentNode && element.rawTagName && element.rawTagName.indexOf('<!') >= 0);
}

function determineRootElement(element) {
    return (element && !element.parentNode);
}

function determineElement(element) {
    return (element && element.nodeType === NodeType.ELEMENT_NODE && element.rawTagName);
}

function determineSelfClosing(element) {
    let isElement = determineElement(element);
    return (isElement && selfClosingTags.has(element.rawTagName.toLowerCase()));
}

function determineServerSideJavascript(element) {
    let isElement = determineElement(element);
    let localName = (element.rawTagName ? element.rawTagName.toLowerCase() : "");
    let rawAttrs = (element.rawAttrs ? element.rawAttrs.toLowerCase() : "");
    return (isElement && localName === 'script'
        && (rawAttrs.indexOf('runat="server"') || rawAttrs.indexOf("runat='server'"))
    );
}


fs.readFile('../test/test-html-with-ssjs.html', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    let root = parse(data);
    console.log(root);
    let result = `
        let response = "";
        (function() {
        ` + processDocument(root) + `
            return response;
        })(response);
    `
    console.log(result);
//    console.log(eval(result));
});

