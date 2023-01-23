const nSQL = require("@nano-sql/core").nSQL;
//const SnapDB = require("snap-db");

const dbName = "mocketing-cloud-db";

function insertDE(deName, deColumns, deValues) {
    createDatabase()
        .then(() => createTable(deName, deColumns, deValues))
        .then(() => upsertRows(deName, deColumns, deValues))
        .then(() => queryRows(deName))
        .catch((reject) => sqlException(reject));
}

function createDatabase() {
    console.log("In createDatabase()")
    return nSQL()
        .createDatabase({
            id: dbName,
            mode: "TEMP",
            version: 3
        });
}

function createTable(deName, deColumns, deValues) {
    console.log("In createTable()")
    let model = {};
    for (let i = 0; i < deColumns.length; i++) {
        let value = deValues[i];
        let type = "string";
        if (typeof value === "number") {
            if (Number.isInteger(value)) {
                type = "int";
            } else {
                type = "float";
            }
        } else if (value instanceof Date) {
            type = "date"
        } else if (typeof value === 'boolean') {
            type = "boolean"
        }
        let key = `${deColumns[i]}:${type}`;
        model[key] = {};
    }

    return nSQL()
        .query("create table", {
            name: deName,
            model: model
        })
        .exec()
}

function upsertRows(deName, deColumns, deValues) {
    console.log("In upsertRows()")
    let rows = [];
    let row = {};

    for (let i = 0; i < deColumns.length; i++) {
        row[deColumns[i]] = deValues[i];
    }
    rows.push(row);
    return nSQL(deName)
        .query("upsert", rows)
        .exec()
}

function queryRows(deName) {
    console.log("In queryRows()")
    return nSQL(deName)
        .query("select")
        .exec()
        .then((rows) => console.log(rows));
}

function sqlException(error) {
    console.log("In sqlException()")
    throw error;
}

insertDE(
    "de-with-all-types",
    ["text-col", "number-col", "date-col", "boolean-col", "email-col", "phone-col", "decimal-col", "locale-col"],
    ["Some Text", 500, new Date(), true, "john.doe@nowhere.com.x", "717-555-1212", 1234.56, "en_US"]
);