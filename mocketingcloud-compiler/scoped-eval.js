import marketingCloudBootstrap from "../marketing-cloud-bootstrap/marketing-cloud-bootstrap.js";
const {Platform} = marketingCloudBootstrap;

class ScopedEval {
    constructor(scope) {
        this.scope = scope;
    }

    eval(__script) {
        return new Function(...Object.keys(this.scope), `
                return eval(
                    '"user strict";delete this.__script;'
                    + this.__script
                );
            `.replace(/\t/, ''))
        .bind({
            __script
        })
        (...Object.values(this.scope));
    }
}

const context = {
    Platform: Platform
};

const pageScope = new ScopedEval(context);

let response = "";
(function() {
    response +=
        (function(response) {
            function writeHTMLFromFunction(str) {
                Platform.Response.Write(str);
            }
            response += (function(response) {
                writeHTMLFromFunction('This is text written from the "writeHTMLFromFunction()" function.');
            return response;})(response);
        return response;})(response);
return response;})(response);