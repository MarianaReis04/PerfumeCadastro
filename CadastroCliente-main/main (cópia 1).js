'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_perfume')) ?? []
const setLocalStorage = (dbPerfume) => localStorage.setItem("db_perfume", JSON.stringify(dbPerfume))

// CRUD - create read update delete
const deletePerfume = (index) => {
    const dbPerfume = readPerfume()
    dbPerfume.splice(index, 1)
    setLocalStorage(dbPerfume)
}

const updatePerfume = (index, perfume) => {
    const dbPerfume = readPerfume()
    dbPerfume[index] = perfume
    setLocalStorage(dbPerfume)
}

const readPerfume = () => getLocalStorage()

const createPerfume = (perfume) => {
    const dbPerfume = getLocalStorage()
    dbPerfume.push (perfume)
    setLocalStorage(dbPerfume)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const savePerfume = () => {
    debugger
    if (isValidFields()) {
        const perfume = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createPerfume(perfume)
            updateTable()
            closeModal()
        } else {
            updatePerfume(index, perfume)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (perfume, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${perfume.nome}</td>
        <td>${perfume.email}</td>
        <td>${perfume.celular}</td>
        <td>${perfume.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tablePerfume>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tablePerfume>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbPerfume = readClient()
    clearTable()
    dbPerfume.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editPerfume = (index) => {
    const perfume = readPerfume()[index]
    perfume.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editPlperfume(index)
        } else {
            const perfume = readPerfume()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${perfume.nome}`)
            if (response) {
                deletePerfume(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarPerfume')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tablePerfume>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)