let db;

const request = indexedDB.open("budgetDB", 1)

request.onupgradeneeded = function (event){

    db = event.target.result;
    const budgetStore = db.createObjectStore("BudgetStore", {autoIncrement: true})
    // transactionStore.createIndex("transactionStoreIndex", "1")
};

request.onsuccuess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
     }
};

request.onerror = function (event) {
    console.log(event.target.errorCode)
};

function saveRecord (record) {
    const transaction = db.transaction(["BudgetStore"], "readwrite")
    const store = transaction.objectStore("BudgetStore")
    store.add({...record})
}

function checkDatabase () {

    const transaction = db.transactions(["BudgetStore"], "readwrite")
    const store = transaction.objectStore("BudgetStore")
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then(() => {
                    const transaction = db.transactions(["BudgetStore"], "readwrite")
                    const store = transaction.objectStore("BudgetStore")
                    store.clear();

                })
        }
    }
}