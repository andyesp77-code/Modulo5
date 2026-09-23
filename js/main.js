/*
En esta versión se incorpora el uso de objetos y clases.
La clase Usuario representa a cada usuario del sistema y tiene la responsabilidad
de guardar sus datos y definir acciones relacionadas con él, como validar la clave,
cambiarla, blanquearla.

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
//Metodos que requieren instancia de usuario
  cambiarClave(nuevaClave) {
    this.clave = nuevaClave;
    console.log("Clave actualizada para " + this.nombre);
  }

  blanquearClave() {
    this.clave = 1111;
    console.log("La clave de " + this.nombre + " fue blanqueada. Nueva clave: 1111");
  }


//Metodos generales de la clase que no requieren una instancia de usuario, sino que trabaja sobre la coleccion
//Por ese motivo las declaro como static

static buscarUsuario(nombre, usuarios) {
  for (const usuario of usuarios) {
   if (usuario.nombre === nombre) {
    return usuario;
   }
  }
}

static validarUsuario(nombre, clave, usuarios) {
  const usuario = this.buscarUsuario(nombre, usuarios);

  if (!usuario) {
    return false;
    } else {
    return usuario.clave === clave;
  }
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

//*****Funciones del panel de administrador*****

function listarUsuarios() {
    console.log("Usuarios registrados:");
    for (const usuario of usuariosRegistrados) {
    console.log(usuario.nombre + " - " + usuario.clave);
    }
}

function blanquearClave(nombreUsuario) {
    const usuario = Usuario.buscarUsuario(
        nombreUsuario.trim().toUpperCase(),
        usuariosRegistrados
    );

    if (!usuario) {
        console.log("Usuario no encontrado.");
    } else {
    usuario.blanquearClave();
    }

}
//Tambien se usa en el menu Cajero para cambiar la clave del usuario logueado
function cambiarClaveDeUsuario(nombreUsuario, nuevaClave) {

    nombreUsuario = nombreUsuario.trim().toUpperCase();

    if (isNaN(nuevaClave)) {
        console.log("La clave debe ser un número.");
        return false;
    }

    const usuario = Usuario.buscarUsuario(nombreUsuario, usuariosRegistrados);

    if (!usuario) {
        console.log("Usuario no encontrado.");
        return false;
    }

    usuario.cambiarClave(nuevaClave);
    return true;
}

function eliminarUsuario(nombreUsuario) {
    nombreUsuario = nombreUsuario.trim().toUpperCase();

    if (nombreUsuario === "ADMIN") {
    console.log("El usuario ADMIN no puede ser eliminado.");
    } else {
    const usuario = Usuario.buscarUsuario(nombreUsuario, usuariosRegistrados);

    if (!usuario) {
        console.log("Usuario no encontrado.");
    } else {
        // Elimina el usuario  
        const posicionUsuario = usuariosRegistrados.indexOf(usuario);
        usuariosRegistrados.splice(posicionUsuario, 1);
        console.log("El usuario " + nombreUsuario + " fue eliminado del sistema.");
        return true;
        }
    }
}

function registroUsuario(nombre, clave) {

    nombre = nombre.trim().toUpperCase();

    if (isNaN(clave)) {
        console.log("La clave debe ser un número.");
        return false;
    }

    if (Usuario.buscarUsuario(nombre, usuariosRegistrados)) {
        console.log("El usuario ya está registrado.");
        return false;
    }

    usuariosRegistrados.push(new Usuario(nombre, clave));
    console.log("Nuevo usuario registrado: " + nombre);
    return true;
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

//Funciones para simplificar el menu administrador
function solicitarRegistroUsuario() {
    const nombreUsuario = solicitarDato("Ingrese el usuario");

    if (nombreUsuario !== null) {
        const claveUsuario = solicitarDato( "Ingrese la clave nueva de 4 dígitos");
        if (claveUsuario !== null) {
            registroUsuario(nombreUsuario, parseInt(claveUsuario));
        }
    }
}

function solicitarBlanqueoClave() {
    const nombreUsuario = solicitarDato("Ingrese el nombre del usuario a blanquear");

    if (nombreUsuario !== null) {
        blanquearClave(nombreUsuario);
    }
}

function solicitarCambioClave() {
    const nombreUsuario = solicitarDato( "Ingrese el nombre del usuario");

    if (nombreUsuario !== null) {
            const claveNueva = solicitarDato("Ingrese la nueva clave de 4 dígitos");
        if (claveNueva !== null) {
            cambiarClaveDeUsuario(nombreUsuario, parseInt(claveNueva));
        }
    }
}

function solicitarEliminacionUsuario() {
    const nombreUsuario = solicitarDato("Ingrese el nombre del usuario a eliminar");

    if (nombreUsuario !== null) {
        eliminarUsuario(nombreUsuario);
    }
}



//*****Menu de opciones del panel de administrador*****/
function menuAdmin() {
    let opcion = 0;

    while (opcion !== 6) {
        const opcionIngresada = prompt("MENU ADMINISTRADOR\n1 - Listar usuarios\n2 - Nuevo usuario\n3 - Blanquear clave\n4 - Cambiar clave\n5 - Eliminar usuario\n6 - Salir");
            if (opcionIngresada === null) {
            opcion = 6;
            } else {
            opcion = parseInt(opcionIngresada);
            }

            switch (opcion) {
            case 1:
                listarUsuarios();
                break;

            case 2:
                solicitarRegistroUsuario();
                break;

            case 3:
                solicitarBlanqueoClave();
                break;

            case 4:
                solicitarCambioClave();
                break;

            case 5:
                solicitarEliminacionUsuario();
                break;

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

//Funciones para simplificar el menu cajero
function consultarSaldo() {
    console.log("Su saldo es: $" + saldo);
}

function solicitarExtraccion() {
    const datoValor = solicitarDato("¿Cuánto dinero desea retirar?");

    if (datoValor !== null) {
        const valor = parseFloat(datoValor);
        if (isNaN(valor) || valor <= 0) {
            console.log("Debe ingresar un importe válido mayor que cero.");
        } else {
            extraccionDinero(valor);
        }
    }
}

function solicitarDeposito() {
    const datoValor = solicitarDato("¿Cuánto dinero desea depositar?");

    if (datoValor !== null) {
        const valor = parseFloat(datoValor);
        if (isNaN(valor) || valor <= 0) {
            console.log("Debe ingresar un importe válido mayor que cero.");
        } else {
            depositoDinero(valor);
        }
    }
}

function solicitarCambioClaveUsuario(nombreUsuario) {
    const claveNueva = solicitarDato( "Ingrese su nueva clave de 4 dígitos");

    if (claveNueva !== null) {
        cambiarClaveDeUsuario(nombreUsuario, parseInt(claveNueva));
    }
}

function menuCajero(nombreUsuario) {
    let continuarOperando = true;
    while  (continuarOperando) {
        const opcionIngresada = prompt("MENU CAJERO\n" + "Ingrese una opción para operar:\n" + "Ingrese 1 - Consulta Saldo\n" + "Ingrese 2 - Extracción\n" + "Ingrese 3 - Depósito\n" + "Ingrese 4 - Cambiar Clave\n" + "Otro valor para Salir");
        if (opcionIngresada === null) {
            continuarOperando = false;
        } else {
            const opcion = parseInt(opcionIngresada);
         switch (opcion) {
            case 1:
                consultarSaldo();
                break;

            case 2:
                solicitarExtraccion();
                break;

            case 3:
                solicitarDeposito();
                break;

            case 4:
                solicitarCambioClaveUsuario(nombreUsuario);
                break;

            default:
                continuarOperando = false;
                break;
            }
        }

        if (continuarOperando) {
            continuarOperando = confirm(
                "¿Desea realizar otra operación?"
            );
        }
    }
}



//****ENTRADA DE DATOS PARA USUARIOS REGISTRADOS EN EL SISTEMA  *****
let nombre = "";
//intentos de login de un usuario maximo 3
while (intentos < 3 && !login) {

    const nombreIngresado = solicitarDato("Ingrese el nombre del usuario");
    if (nombreIngresado === null) {
        break;
    }
   
    nombre = nombreIngresado.trim().toUpperCase();

    const claveIngresada = solicitarDato("Ingrese su clave de 4 dígitos");

    if (claveIngresada === null) {
        break;
    }
    
    const clave = parseInt(claveIngresada);

    if (Usuario.validarUsuario(nombre,clave,usuariosRegistrados)) {
        login = true;
        console.log("Acceso concedido. Puede operar con su cuenta.");
    } else {
        intentos++;
        alert("Usuario o clave incorrecta. Intento " + intentos + " de 3.");
    }
}

 // si el usuario no logra loguearse en 3 intentos, no puede acceder al sistema
if (!login && intentos >= 3) {
    console.log("Acceso denegado. Ha superado el número máximo de intentos.");
}

// valido si se logueo antes de buscar al usuario y mostrar el menu correspondiente
if (login) {
    const usuarioActual = Usuario.buscarUsuario(nombre,usuariosRegistrados);

    if (usuarioActual && usuarioActual.nombre === "ADMIN") {
        console.log("Hola, ADMIN. Bienvenido al panel administrativo");
        menuAdmin();
    } else {
        console.log("Hola, " + nombre + ". Bienvenido al Simulador de Cajero Automático");
        menuCajero(nombre);
        console.log("Gracias, " + nombre + " por utilizar el Simulador de Cajero Automático");
    }
}




