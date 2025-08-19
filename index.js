import { menuArray } from "./data.js"
const billContent = document.getElementById('bill-content')
const thanksSection = document.getElementById('thanks-section')
let quantityArr = []
let quantityArrFromLocalStorage = JSON.parse(localStorage.getItem('quantityArr'))
let refresh = false

if (quantityArrFromLocalStorage) {
    quantityArr = quantityArrFromLocalStorage
}

if (quantityArr.length === 0) {
    menuArray.forEach((item) => {
        quantityArr.push({
            id: item.id,
            quantity: 0
        })
    })
}



document.addEventListener('click', (e) => {
    if (e.target.dataset.addBtn) {
        handleAddBtn(e.target.dataset.addBtn)
    } else if (e.target.dataset.removeBtn) {
        handleRemoveBtn(e.target.dataset.removeBtn)
    } else if (e.target.dataset.removeBillBtn) {
        handleRemoveBillBtn(e.target.dataset.removeBillBtn)
    } else if (e.target.id === "close-modal-btn") {
        handleCloseModalBtnClick(e.target.id)
    } else if (e.target.id === 'complete-order-btn') {
        handleCompleteOrderBtn()
    } else if (e.target.id === 'pay-btn') {
        handlePayBtnClick()
    }
})

function handleAddBtn(btnId) {
    getQuantityItem(btnId).quantity++
    console.log(getQuantityItem(btnId).quantity)
    setLocal()
    renderPage()
}

function handleRemoveBtn(btnId) {
    let item = getQuantityItem(btnId)
    if (item.quantity > 0) {
        item.quantity--
        setLocal()
        renderPage()
    }
}

function handleRemoveBillBtn(btnId) {
    getQuantityItem(btnId).quantity = 0
    setLocal()
    renderPage()
}

function handleCompleteOrderBtn() {
    document.getElementById('modal').classList.toggle('hide')
}

function handleCloseModalBtnClick(btnId) {
    document.getElementById(btnId).parentElement.classList.toggle('hide')
}

function handlePayBtnClick() {
    document.getElementById('modal').classList.toggle('hide')
    document.getElementById('bill').classList.toggle('hide')
    quantityArr.forEach(item => item.quantity = 0)
    setLocal()
    renderPage(document.querySelector("input[name=name-input]").value)
}

function getQuantityItem(itemId)
{
    return quantityArr.find(item => item.id == itemId)
}

function setLocal() {
    localStorage.setItem('quantityArr', JSON.stringify(quantityArr))
}


function getThanksHtml(clientName) {
    return `
    <div>
        Thanks, ${clientName}! Your order is on its way!
    </div>
    `
}


function getMenuHtml(menuArray) {
    let menuHtml = ``
    menuArray.forEach((item) => {
        const removeBtn = document.getElementById(`remove-btn-${item.id}`)
        let hideClass = ''
        if (getQuantityItem(item.id).quantity === 0) {
            hideClass = 'hide'
        }

        menuHtml += `
        <li class='menu-item'>
            <div class="item-picture">
                ${item.emoji}
            </div>
            <div class='menu-item-info'>
                <h3>
                    ${item.name}
                </h3>
                <p class='gray-text'>
                    ${item.ingredients.join(', ')}
                </p>
                <p>
                    $${item.price}
                </p>
            </div>
            <div class="add-remove-display">
                <div>
                    <button class="add-btn" data-add-btn="${item.id}"> 
                        &#10133; 
                    </button>
                    <button class="remove-btn ${hideClass}" data-remove-btn="${item.id}" id="remove-btn-${item.id}">
                        &#10134;
                    </button>
                </div>
                <span class="display-quantity ${hideClass}">${getQuantityItem(item.id).quantity}</span>
            </div>
        </li>
        `
    })
    return menuHtml
}


function getBillHtml(menuArray) {
    let addedItems = menuArray.filter((item) => {
        return getQuantityItem(item.id).quantity != 0
    })
    
    let hideClass = addedItems.length > 0 ? '' : 'hide'
    let totalPrice = 0
    let billHtml = `<h3 id="bill-title" class="${hideClass}">Your order</h3>`
    if (addedItems) {
        addedItems.forEach((item) => {
            let quantity = getQuantityItem(item.id).quantity
            if ( quantity > 0) {
                totalPrice += item.price * quantity
                billHtml += `
                <li class="bill-list-item">
                    <div>
                        <h3>${quantity + "x " + item.name}</h3>
                        <button class='remove-bill-btn' data-remove-bill-btn="${item.id}">remove</button>
                    </div>
                    <p class="price">
                        $${item.price * quantity}
                    </p>
                </li>
                `
            }
        })
        
        billHtml += `
        <div class="${hideClass}">
            <div class="bill-result">
                <h3>Total Price:</h3>
                <p class="price">$${totalPrice}</p>
            </div>
            <button class="complete-order-btn" id="complete-order-btn">Complete order</button>
        </div>
        `

        return billHtml
    }
}


function renderPage(clientName = '') {
    document.getElementById('menu-content').innerHTML = getMenuHtml(menuArray)
    billContent.innerHTML = getBillHtml(menuArray)
    if (clientName != '') {
        thanksSection.innerHTML = getThanksHtml(clientName)
        thanksSection.classList.toggle('hide')
        document.addEventListener('click', () => {
            window.location.reload()
        }) 
    }
}

renderPage()