const firebaseConfig = {
    apiKey: "AIzaSyCSdeuf-8kERcIeP5vKAXqmkmiTLG9uI2w",
    authDomain: "nubesproducto.firebaseapp.com",
    databaseURL: "https://nubesproducto-default-rtdb.firebaseio.com",
    projectId: "nubesproducto",
    storageBucket: "nubesproducto.appspot.com",
    messagingSenderId: "547010921953",
    appId: "1:547010921953:web:2b228b43aec7294ca87ea0",
    measurementId: "G-S7CX5QKT2S"
}
const openModal = document.getElementById('abrirModal')
const modal = document.getElementById('modal')
const updatemodal = document.getElementById('modal-update')
const updateForm = document.getElementById('updateForm')
const closeUpdateModal = document.getElementById('closeUpdateModal')
const closeModal = document.getElementById('closeRegisterModal')
const registerForm = document.getElementById('registerForm')
const productoTabla = document.getElementById('products-table')
firebase.initializeApp(firebaseConfig)
const productoRef = firebase.database().ref('products')
let uid = ''
let array = [] 

const showRegisterModal = () => {
    modal.classList.toggle('is-active')
}


openModal.addEventListener('click', showRegisterModal)
closeModal.addEventListener('click', showRegisterModal)

const deleteProducto = (uid) => {
    firebase.database().ref(`products/${uid}`).remove()
}

const showUpdateModal = () => {
    updatemodal.classList.toggle('is-active')
}

closeUpdateModal.addEventListener('click', showUpdateModal)

const CloseModal = ()=>{
    updatemodal.classList.remove('is-active')
}


window.addEventListener('DOMContentLoaded', async (e) => {
    await productoRef.on('value', (products) => {
        productsTable.innerHTML = ''
        array = []
        products.forEach((producto) => {
            let productoData = producto.val()
            array.push(productoData);
            productsTable.innerHTML += `<tr>
                <th>${array.length}</th>
                <td>${productoData.Producto}</td>
                <td>${productoData.Marca}</td>
                <td>${productoData.Modelo}</td>
                <td>${productoData.Año}</td>
                <td>${productoData.Stock}</td>
                <td>${productoData.PrecioV}</td>
                <td>${productoData.PrecioC}</td>
                <td>
                    <button class="button is-warning" data-id="${productoData.Uid}">Editar
                    </button>
                    <button class="button is-danger" data-id="${productoData.Uid}">Eliminar
                    </button>
                </td>
            </tr>`

            const updateButtons = document.querySelectorAll('.is-warning')
            updateButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    showUpdateModal()
                    firebase.database().ref(`products/${e.target.dataset.id}`).once('value').then((producto) => {
                        const data = producto.val()
                        updateForm['producto'].value = data.Producto
                        updateForm['marca'].value = data.Marca
                        updateForm['modelo'].value = data.Modelo
                        updateForm['año'].value = data.Año
                        updateForm['stock'].value = data.Stock
                        updateForm['preciov'].value = data.PrecioV
                        updateForm['precioc'].value = data.PrecioC
                    })
                    uid = ""
                    uid = e.target.dataset.id
                    updateForm.addEventListener('submit', (e) => {
                        e.preventDefault()
                        const producto = updateForm['producto'].value
                        const marca = updateForm['marca'].value
                        const modelo = updateForm['modelo'].value
                        const año = updateForm['año'].value
                        const stock = updateForm['stock'].value
                        const preciov = updateForm['preciov'].value
                        const precioc = updateForm['precioc'].value

                        firebase.database().ref(`products/${uid}`).update({
                            Producto: producto,
                            Marca: marca,
                            Modelo: modelo,
                            Año: año,
                            Stock: stock,
                            PrecioV: preciov,
                            PrecioC: precioc,
                        })
                        CloseModal()
                        
                    })
                })
            })

            const deleteButtons = document.querySelectorAll('.is-danger')
            deleteButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    deleteProducto(e.target.dataset.id)
                })
            })
        })

    })
})


registerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const producto = registerForm['producto'].value
    const marca = registerForm['marca'].value
    const modelo = registerForm['modelo'].value
    const año = registerForm['año'].value
    const stock = registerForm['stock'].value
    const preciov = registerForm['preciov'].value
    const precioc = registerForm['precioc'].value
    const registrerProduct = productoRef.push()
    registrerProduct.set({
        Uid: registrerProduct.path.pieces_[1],
        Producto: producto,
        Marca: marca,
        Modelo: modelo,
        Año: año,
        Stock: stock,
        PrecioV: preciov,
        PrecioC: precioc,
    })
    showRegisterModal()

})