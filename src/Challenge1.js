// CHALLENGE: REGULAR VS ARROW FUNCTIONS

/*
  DIFERENCIAS PRINCIPALES:
  1. Contexto de 'this': 
     - Las funciones regulares tienen su propio 'this'.
     - Las arrow functions no tienen su propio 'this', lo heredan del contexto donde fueron creadas (lexical this).
  2. Objeto 'arguments':
     - Las funciones regulares disponen de la variable especial 'arguments'.
     - Las arrow functions no la poseen (se debe usar el operador rest ...args).
  3. Constructores:
     - Las funciones regulares se pueden invocar con 'new' para crear objetos.
     - Las arrow functions NO se pueden usar como constructores (lanzan error).
  4. Sintaxis:
     - Las arrow functions son más concisas y permiten retorno implícito en una sola línea.
*/

// 1. Regular Function
function esParOImparRegular(numero) {
    if (numero % 2 === 0) {
        console.log(`[Regular] El número ${numero} es PAR`);
    } else {
        console.log(`[Regular] El número ${numero} es IMPAR`);
    }
}

// 2. Arrow Function
const esParOImparArrow = (numero) => {
    const resultado = (numero % 2 === 0) ? 'PAR' : 'IMPAR';
    console.log(`[Arrow] El número ${numero} es ${resultado}`);
};

// --- PRUEBAS EN CONSOLA ---
esParOImparRegular(4); // Muestra: [Regular] El número 4 es PAR
esParOImparRegular(7); // Muestra: [Regular] El número 7 es IMPAR

esParOImparArrow(10);  // Muestra: [Arrow] El número 10 es PAR
esParOImparArrow(15);  // Muestra: [Arrow] El número 15 es IMPAR