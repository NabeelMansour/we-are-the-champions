import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const appSettings = {
    databaseURL:"https://realtime-database-c9346-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementInDB = ref(database, 'endorsements')


const textFieldEl = document.getElementById('text-field')
const btnEl = document.getElementById('btn')
const endorsementEl = document.getElementById('endorsement-list')
const inputFromEl = document.getElementById('input-from')
const inputToEl = document.getElementById('input-to')

btnEl.addEventListener('click', function() {
    let inputValue = textFieldEl.value
    let inputFromValue = inputFromEl.value
    let inputToValue = inputToEl.value
    push(endorsementInDB, {inputFromValue ,inputValue, inputToValue})
    clearInputFromEl()
})

function clearInputFromEl() {
    inputFromEl.value = ""
    textFieldEl.value = ""
    inputToEl.value = ""
}


onValue(endorsementInDB, function(snapshot) {
    if(snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        
        clearEndorsementListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            // console.log(itemsArray[i])
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
                
            appendItemToEndorsementListEl(currentItem)
        }
    } else {
        endorsementEl.innerHTML = "No endorsement here...yet"
    }
})

function clearEndorsementListEl(){
    endorsementEl.innerHTML = ""
}

function appendItemToEndorsementListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    // console.log(itemValue)
    let newEl = document.createElement("li")
    let inputFromValue = inputFromEl.value
    let inputToValue = inputToEl.value
    
    newEl.innerHTML = `
    <span class="span1">To ${itemValue.inputToValue}</span>
    <span class="span2">${itemValue.inputValue}</span>
    <span class="span3">From ${itemValue.inputFromValue}</span>
    `
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    endorsementEl.append(newEl)
    
}