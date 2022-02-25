let db;

db = indexedDB.open("transactions", 1)

request.onupgradeneeded = function (event){
    db.createObjectStore("TransactionStore", {autoIncrement: true})
    db.createIndex("transactionStoreIndex", "1")
};

request.onsuccuess = function (event) {
    db = event.target.result;
}

