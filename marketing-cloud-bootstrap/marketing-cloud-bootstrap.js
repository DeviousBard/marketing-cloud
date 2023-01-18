function __Platform() {
    return {
        Request: {
            GetFormField: function (fieldName) {
            }
        },
        Response: {
            Write: function (str) {
                console.log(str);
            }
        },
        DateTime: {
            SystemDateToLocalDate: function (date) {
                if (date instanceof String && date.indexOf("/Date(") === 0) {
                    return new Date(parseInt(date.substring(6)));
                } else {
                    return date;
                }
            },
            LocalDateToSystemDate: function (date) {
                if (date instanceof String && date.indexOf("/Date(") === 0) {
                    return new Date(parseInt(date.substring(6)));
                } else {
                    return date;
                }
            },
            Now: function () {
                return new Date();
            }
        },
        Load: function (codebase, version) {
        },
        Function: {
            InsertDE: function (deName, deColumns, deValues) {
            }
        }
    };
}

export let Platform = new __Platform();
export let Request = Platform.Request;
export let Response = Platform.Response;
export let DateTime = Platform.DateTime;
export let Function = Platform.Function;
export default {Platform};