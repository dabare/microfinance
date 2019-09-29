var Client = require('node-rest-client').Client;

var client = new Client();

const url = "http://3.16.29.35:3000/api/"

function callDB(api,table,columns,values,where,set,group,order,callback) {
    let req = client.post(url + api, {
        data: {
            "Table" : table,
            "Columns": columns,
            "Values": values,
            "Set" : set,
            "Where" : where,
            "Group" : group,
            "Order" : order
        },
        headers: { "Content-Type": "application/json" }
    }, callback);
}


module.exports = {
     select(table, where, group, order, callback)
{
    callDB("selection", table, "", "", where, "", group, order, callback)
}
,
 insert(table, columns, values, callback) {
    callDB("insertion", table, columns, values, "", "", "", "", callback)
}
,

 update(table, set, where, callback) {
    callDB("update", table, "", "", where, set, "", "", callback)
}
,

 deletee(table, where, callback) {
    callDB("deletion", table, "", "", where, "", "", "", callback);
}
}
