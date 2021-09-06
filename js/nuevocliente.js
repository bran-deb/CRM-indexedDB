(function () {
    let DB
    const formulario = document.querySelector('#formulario')

    document.addEventListener('DOMContentLoaded', () => {
        formulario.addEventListener('submit', validarCliente)
        conectarDB()
    })

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1)

        abrirConexion.onerror = function () {
            console.log('hubo un error');
        }
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result
        }
    }

    function validarCliente(e) {
        e.preventDefault()
        const nombre = document.querySelector('#nombre').value
        const email = document.querySelector('#email').value
        const telefono = document.querySelector('#telefono').value
        const empresa = document.querySelector('#empresa').value

        // if ((nombre && email && telefono && empresa) === '') {
        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son Obligatorios', 'error')
            return
        }

        //Crear un objeto con la informacion
        const cliente = { nombre, email, telefono, empresa, id: Date.now() }
        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite')
        const objectStore = transaction.objectStore('crm')
        objectStore.add(cliente)

        transaction.onerror = function () {
            imprimirAlerta('hubo un error', 'error')
        }
        transaction.oncomplete = function () {
            imprimirAlerta('Se agrego correctamente')
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

})()