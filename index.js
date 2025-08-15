import { menuArray } from "./data.js";

const billContent = document.getElementById('bill-content')

document.addEventListener('click', (e) => {
    if (e.target.dataset.addBtn) {
        handleAddBtn(e.target.dataset.addBtn)
    } else if (e.target.dataset.removeBtn) {
        handleRemoveBtn(e.target.dataset.removeBtn)
    } else if (e.target.dataset.removeBillBtn) {
        handleRemoveBillBtn(e.target.dataset.removeBillBtn)
    }
})

function handleAddBtn(btnId) {
    menuArray[btnId].quantity++
    renderMenu()
}

function handleRemoveBtn(btnId) {
    if(menuArray[btnId].quantity > 0) {
        menuArray[btnId].quantity--
        renderMenu()
    }
}

function handleRemoveBillBtn(btnId) {
    menuArray[btnId].quantity = 0
    renderMenu()
}


function getMenuHtml(menuArray) {
    let menuHtml = ``
    menuArray.forEach((item) => {
        const removeBtn = document.getElementById(`remove-btn-${item.id}`)
        let hideClass = ''
        if (item.quantity === 0) {
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
                    <button class="add-btn" data-add-btn="${item.id}"> + </button>
                    <button class="remove-btn ${hideClass}" data-remove-btn="${item.id}" id="remove-btn-${item.id}"> - </button>
                </div>
                <span class="display-quantity ${hideClass}">${item.quantity}</span>
            </div>
        </li>
        `
    })
    return menuHtml
}


function getBillHtml(menuArray) {
    let addedItems = menuArray.filter((item) => {
        return item.quantity != 0
    })

    let hideClass = addedItems.length > 0 ? '' : 'hide'
    
    let billHtml = `<h3 id="bill-title" class="${hideClass}">Your order</h3>`
    if (addedItems) {
        addedItems.forEach((item) => {
            if(item.quantity > 0) {
                billHtml += `
                <li class="bill-list-item">
                    <div>
                        <h3>${item.quantity + "x " + item.name}</h3>
                        <button class='remove-bill-btn' data-remove-bill-btn="${item.id}">remove</button>
                    </div>
                    <p class="price">
                        $${item.price}
                    </p>
                </li>
                `
            }
        })

        return billHtml
    }
}

function renderMenu() {
    document.getElementById('menu-content').innerHTML = getMenuHtml(menuArray)
    billContent.innerHTML = getBillHtml(menuArray)
}

renderMenu()