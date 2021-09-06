(function () {
    let DB
    let idCliente
    const nombreInput = document.querySelector('#nombre')
    const correoInput = document.querySelector('#email')
    const telefonoInput = document.querySelector('#telefono')
    const empresaInput = document.querySelector('#empresa')

    const formulario = document.querySelector('#formulario')

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB()
        //actualiza el registro
        formulario.addEventListener('submit', actulizarCliente)
        // verifica el id de url
        const parametroURL = new URLSearchParams(window.location.search)//listamos solo los parametros(id)
        idCliente = parametroURL.get('id')

        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente)
            }, 1000);
        }
    })

    function actulizarCliente(e) {
        e.preventDefault()
        if ((nombreInput.value && correoInput.value && telefonoInput.value && empresaInput.value) === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error')
            return
        }
        //actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: correoInput.value,
            telefono: telefonoInput.value,
            empresa: empresa.value,
            id: Number(idCliente)//transformamos el string a number
        }
        const transaction = DB.transaction(['crm'], 'readwrite')
        const objectStore = transaction.objectStore('crm')

        objectStore.put(clienteActualizado)

        transaction.oncomplete = function () {
            imprimirAlerta('Edidato correctamente')
            setTimeout(() => {
                window.location.href = 'index.html'
            }, 1000);
        }
        transaction.onerror = function () {
            imprimirAlerta('Hubo un error', 'error')
        }
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readwrite')
        const objectStore = transaction.objectStore('crm')//sirve para interactuar con la DB

        // el cursor recorre el indexedDB
        const cliente = objectStore.openCursor()
        cliente.onsuccess = function (e) {
            const cursor = e.target.result

            if (cursor) {
                if (cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value)
                }
                cursor.continue()
            }
        }
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente
        nombreInput.value = nombre
        correoInput.value = email
        telefonoInput.value = telefono
        empresaInput.value = empresa
    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1)

        abrirConexion.onerror = function () {
            console.log('hubo un error');
        }
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result
        }

    }
})()