/*
En esta versión se incorpora el uso de objetos y clases.
La clase Usuario representa a cada usuario del sistema y tiene la responsabilidad
de guardar sus datos y definir acciones relacionadas con él, como validar la clave,
cambiarla, blanquearla, verificar si es administrador y mostrar sus datos.

El array usuariosRegistrados guarda instancias de Usuario, por lo que cada usuario
se maneja como un objeto con su propio nombre y clave.

El script principal se encarga del flujo del programa: toma los datos ingresados
por el usuario, valida algunos valores, controla el acceso al sistema, y organiza
las dos áreas principales de la aplicación: el menú de administrador y el menú
del cajero para usuarios comunes.

En el menú de administrador se pueden listar usuarios, registrar nuevos usuarios,
blanquear o cambiar claves y eliminar usuarios, salvo el administrador.
En el menú de cajero, el usuario puede consultar saldo, retirar dinero,
depositar dinero y cambiar su propia clave.

****RESUMEN: Clase Usuario maneja el estado y las operaciones del usuario
el script principal maneja el flujo del programa y las validaciones de entrada ******
-----------------------------------------------------------------------------------
Se fuerza un saldo fijo de 100000 pesos argentinos para poder operar con la cuenta.
Se puede ingresar al panel de administrador con el usuario ADMIN y la clave 2990
*/

class Usuario {
  constructor(nombre, clave) {
    this.nombre = nombre;
    this.clave = clave;
  }
//Operaciones que requieren usar o modificar los datos de una instancia especifica de un usuario
//Metodos que requideren instancia de usuario
  validarClave(claveIngresada) {
    return this.clave === claveIngresada;
  }

  cambiarClave(nuevaClave) {
    this.clave = nuevaClave;
    console.log(`Clave actualizada para ${this.nombre}`);
  }

  blanquearClave() {
    this.clave = 1111;
    console.log(`La clave de ${this.nombre} fue blanqueada. Nueva clave: 1111`);
  }


//Metodos generales de la clase que no requieren una instancia de usuario, sino que trabaja sobre la coleccion
//Por ese motivo las declaro como static
  static buscarUsuario(nombre, usuarios) {
    return usuarios.find((usuario) => usuario.nombre === nombre);
  }

  static validarUsuario(nombre, clave, usuarios) {
    const usuario = this.buscarUsuario(nombre, usuarios);

    if (!usuario) {
      return false;
    }

    return usuario.validarClave(clave);
  }

}

// usuarios registrados en el sistema (Incluye el Administrador) - arrays de objetos
let usuariosRegistrados = [
    new Usuario("JUAN", 1234),
    new Usuario("PEDRO", 2345),
    new Usuario("MARIA", 3456),
    new Usuario("ANA", 4567),
    new Usuario("ANDREA", 5678),
    new Usuario("ADMIN", 2990)
];


let saldo = 100000;
let intentos = 0;
let login = false;
let valor = 0;

//*****Funciones del panel de administrador*****

function listarUsuarios() {
    console.log("Usuarios registrados:");
    for (const usuario of usuariosRegistrados) {
         console.log(`${usuario.nombre} - ${usuario.clave}`);
    }
}

function blanquearClave(nombreUsuario) {
    const usuario = Usuario.buscarUsuario(
        nombreUsuario.trim().toUpperCase(),
        usuariosRegistrados
    );

    if (!usuario) {
        console.log("Usuario no encontrado.");
        return;
    }

    usuario.blanquearClave();
}

function cambiarClaveDeUsuario(nombreUsuario, nuevaClave) { //Tambien se usa en el menu Cajero para cambiar la clave del usuario logueado
    if (nombreUsuario === null || nuevaClave === null) {
        console.log("Operación cancelada.");
        return;
    }

    nombreUsuario = nombreUsuario.trim().toUpperCase();
   
    if (nombreUsuario === "" || isNaN(nuevaClave)) {
        console.log("El nombre es obligatorio y la clave debe ser un número.");
        return;
    }

    const usuario = Usuario.buscarUsuario(nombreUsuario, usuariosRegistrados);

    if (!usuario) {
        console.log("Usuario no encontrado.");
        return;
    }

    usuario.cambiarClave(nuevaClave);
    console.log("La clave de " + usuario.nombre + " fue actualizada correctamente.");
}


function eliminarUsuario(nombreUsuario) {
    nombreUsuario = nombreUsuario.trim().toUpperCase();

    if (nombreUsuario === "ADMIN") {
        console.log("El usuario ADMIN no puede ser eliminado.");
        return;
    }

    const usuario = Usuario.buscarUsuario(nombreUsuario, usuariosRegistrados);

    if (!usuario) {
        console.log("Usuario no encontrado.");
        return;
    }

    const posicionUsuario = usuariosRegistrados.indexOf(usuario);
    usuariosRegistrados.splice(posicionUsuario, 1);
    console.log("El usuario " + nombreUsuario + " fue eliminado del sistema.");
}

function registroUsuario(nombre, clave) {
    if (nombre === null || clave === null) {
        console.log("Registro cancelado.");
        return;
    }

    nombre = nombre.trim().toUpperCase();
    clave = parseInt(clave);

    if (nombre.trim() === "" || isNaN(clave)) {
        console.log("El nombre es obligatorio y la clave debe ser un número.");
        return;
    }

    if (Usuario.buscarUsuario(nombre, usuariosRegistrados)) {
        console.log("El usuario ya está registrado.");
        return;
    }

    usuariosRegistrados.push(new Usuario(nombre, clave));
    console.log("Nuevo usuario registrado: " + nombre);
}


//*****Funciones de validacion de ingreso de dato*****
function solicitarDato(mensaje) {
    let dato = prompt(mensaje);

    if (dato === null) {
        console.log("Operación cancelada.");
        return null;
    }

    dato = dato.trim();

    if (dato === "") {
        console.log("El dato es obligatorio.");
        return null;
    }

    return dato;
}

//*****Menu de opciones del panel de administrador*****/
function menuAdmin() {
    let opcion = 0;

    while (opcion !== 6) {
        opcion = parseInt(prompt("MENU ADMINISTRADOR\n1 - Listar usuarios\n2 - Nuevo usuario\n3 - Blanquear clave\n4 - Cambiar clave\n5 - Eliminar usuario\n6 - Salir"));

        switch (opcion) {
            case 1:
                listarUsuarios();
                break;
            case 2: {
                let nombreUsuario = solicitarDato("Ingrese el usuario");
                if (nombreUsuario === null) break;

                let claveUsuario = solicitarDato("Ingrese la clave nueva de 4 digitos");
                if (claveUsuario === null) break;

                registroUsuario(nombreUsuario, parseInt(claveUsuario));
                break;
            }

            case 3: {
                let nombreUsuario = solicitarDato("Ingrese el nombre del usuario a blanquear");
                if (nombreUsuario === null) break;

                blanquearClave(nombreUsuario);
                break;
            }

            case 4: {
                let nombreUsuario = solicitarDato("Ingrese el nombre del usuario");
                if (nombreUsuario === null) break;

                let claveNueva = solicitarDato("Ingrese la nueva clave de 4 digitos");
                if (claveNueva === null) break;

                cambiarClaveDeUsuario(nombreUsuario, parseInt(claveNueva));
                break;
            }

            case 5: {
                let nombreUsuario = solicitarDato("Ingrese el nombre del usuario a eliminar");
                if (nombreUsuario === null) break;

                eliminarUsuario(nombreUsuario);
                break;
            }

            case 6:
                console.log("Saliendo del panel de administrador");
                break;

            default:
                console.log("Opción inválida");
                break;
        }
    }
}

//*****Funciones de operacion de cajero automatico*****/

function extraccionDinero(valor) {
    if (valor <= saldo) {
        saldo = saldo - valor;
        console.log("Operacion Confirmada. Su nuevo saldo es: $" + saldo);
    } else {
        console.log("Saldo Insuficiente");
    }
}

function depositoDinero(valor) {
    saldo = saldo + valor;
    console.log("Operacion Confirmada. Su nuevo saldo es: $" + saldo);
}

//****ENTRADA DE DATOS PARA USUARIOS REGISTRADOS EN EL SISTEMA  *****
let nombre = "";

while (intentos < 3 && !login) {
    //let nombreIngresado = prompt("Ingrese su nombre de usuario");

    let nombreIngresado = solicitarDato("Ingrese el nombre del usuario");
    if (nombreIngresado === null) break;
   
    nombre = nombreIngresado.trim().toUpperCase();

    let claveIngresada = solicitarDato("Ingrese su clave de 4 dígitos");

    if (claveIngresada === null) break;
    
    if (Usuario.validarUsuario(nombre, parseInt(claveIngresada.trim()), usuariosRegistrados)) {
        login = true;
        console.log("Acceso concedido. Puede operar con su cuenta.");
    } else {
        intentos++;
        alert("Usuario o clave incorrecta. Intento " + intentos + " de 3.");
    }
}

if (!login && intentos >= 3) {
    console.log("Acceso denegado. Ha superado el número máximo de intentos.");
}

const usuarioActual = Usuario.buscarUsuario(nombre, usuariosRegistrados);

if (login && usuarioActual && usuarioActual.nombre.toUpperCase() === "ADMIN") { 
    console.log("Hola, ADMIN. Bienvenido al panel administrativo");
    menuAdmin();
} else if (login) {
    console.log("Hola, " + nombre + ". Bienvenido al Simulador de Cajero Automatico");

    while (login) {
        let opcion = parseInt(prompt("MENU CAJERO \nIngrese una opcion para operar:\nIngrese 1 - Consulta Saldo \nIngrese 2 - Extraccion \nIngrese 3 - Deposito \nIngrese 4 - Cambiar Clave \nOtro valor para Salir"));

        switch (opcion) {
            case 1:
                console.log("Su saldo es: $" + saldo);
                break;
            case 2: {
                let datoValor = solicitarDato("¿Cuánto dinero desea retirar?");
                if (datoValor === null) break;
                 valor = parseFloat(datoValor);

                    if (isNaN(valor) || valor <= 0) {
                    console.log("Debe ingresar un importe válido mayor que cero.");
                break;
                }

                extraccionDinero(valor);
                break;
            }   
            case 3:{
                let datoValor = solicitarDato("¿Cuánto dinero desea depositar?");
                if (datoValor === null) break;
                valor = parseFloat(datoValor);
                if (isNaN(valor) || valor <= 0) {
                    console.log("Debe ingresar un importe válido mayor que cero.");
                    break;
                }
                depositoDinero(valor);
                break;
            }
            case 4:{
                let claveNueva = solicitarDato("Ingrese su nueva clave de 4 dígitos");
                if (claveNueva === null) break;
                cambiarClaveDeUsuario(nombre, parseInt(claveNueva));
                break;
            }

            default:
                login = false;
                break;
        }

        if (login) {
            login = confirm("¿Desea realizar otra operacion?");
        }
    }

    console.log("Gracias, " + nombre + " por utilizar el Simulador de Cajero Automatico");
}






