(function () {
    let DB
    const formulario = document.querySelector('#formulario')

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB()
        formulario.addEventListener('submit', validarCliente)
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


    function imprimirAlerta(mensaje, tipo) {
        const alerta = document.querySelector('.alerta')
        if (!alerta) {
            //crear alerta
            const divMensaje = document.createElement('div')
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta')
            if (tipo === 'error') {
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700')
            } else {
                divMensaje.classList.add('big-green-100', 'border-green-400', 'text-green-700')
            }
            divMensaje.textContent = mensaje
            formulario.appendChild(divMensaje)
            setTimeout(() => {
                divMensaje.remove()
            }, 2000)
        }
    }


    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm')
        objectStore.add(cliente)

        transaction.onerror = function () {
            imprimirAlerta('hubo un error', 'error')
        }
        transaction.oncomplete = function () {
            console.log('cliente agregado');
        }
        // console.log(cliente);
    }

})()