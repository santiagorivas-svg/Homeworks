// TAREA: MÉTODOS Y FUNCIONES DE ARREGLOS EN JS

const numeros = [1, 2, 3, 4, 5];
const numeros2 = [6, 7, 8, 9, 10];
const frutas = ['Manzana', 'Pera', 'Uva'];

// 1. push() - Agrega uno o más elementos al final del arreglo
numeros.push(6);
console.log('push:', numeros); // [1, 2, 3, 4, 5, 6]

// 2. pop() - Elimina y retorna el último elemento
const ultimo = numeros.pop();
console.log('pop:', ultimo, numeros); // 6, [1, 2, 3, 4, 5]

// 3. unshift() - Agrega elementos al inicio
numeros.unshift(0);
console.log('unshift:', numeros); // [0, 1, 2, 3, 4, 5]

// 4. shift() - Elimina y retorna el primer elemento
const primero = numeros.shift();
console.log('shift:', primero, numeros); // 0, [1, 2, 3, 4, 5]

// 5. concat() - Une dos o más arreglos sin modificar los originales
const combinados = numeros.concat(numeros2);
console.log('concat:', combinados);

// 6. at() - Retorna el elemento en el índice indicado (soporta negativos)
console.log('at(-1):', numeros.at(-1)); // 5

// 7. includes() - Verifica si un elemento existe en el arreglo
console.log('includes(3):', numeros.includes(3)); // true

// 8. indexOf() - Retorna el primer índice donde se encuentra un elemento
console.log('indexOf(4):', numeros.indexOf(4)); // 3

// 9. lastIndexOf() - Retorna el último índice donde se encuentra un elemento
const duplicados = [1, 2, 3, 2, 1];
console.log('lastIndexOf(2):', duplicados.lastIndexOf(2)); // 3

// 10. join() - Une todos los elementos en un string con un separador
console.log('join:', frutas.join(', ')); // "Manzana, Pera, Uva"

// 11. slice() - Retorna una copia superficial de una porción del arreglo
const subArreglo = numeros.slice(1, 4);
console.log('slice(1, 4):', subArreglo); // [2, 3, 4]

// 12. splice() - Cambia el contenido eliminando o reemplazando elementos existentes
const copiaFrutas = [...frutas];
copiaFrutas.splice(1, 1, 'Mango'); // Elimina 1 en pos 1 e inserta 'Mango'
console.log('splice:', copiaFrutas);

// 13. reverse() - Invierte el orden de los elementos in-place
const invertidos = [1, 2, 3].reverse();
console.log('reverse:', invertidos); // [3, 2, 1]

// 14. sort() - Ordena los elementos de un arreglo
const desordenados = [5, 1, 8, 3];
desordenados.sort((a, b) => a - b);
console.log('sort:', desordenados); // [1, 3, 5, 8]

// 15. forEach() - Ejecuta una función por cada elemento
console.log('forEach:');
numeros.forEach((num) => console.log(` - Elemento: ${num}`));

// 16. map() - Crea un nuevo arreglo transformando cada elemento
const dobles = numeros.map((num) => num * 2);
console.log('map (dobles):', dobles);

// 17. filter() - Crea un nuevo arreglo con los elementos que cumplen la condición
const pares = numeros.filter((num) => num % 2 === 0);
console.log('filter (pares):', pares);

// 18. find() - Retorna el primer elemento que cumple la condición
const encontrado = numeros.find((num) => num > 3);
console.log('find (>3):', encontrado); // 4

// 19. findIndex() - Retorna el índice del primer elemento que cumple la condición
const indiceEncontrado = numeros.findIndex((num) => num > 3);
console.log('findIndex (>3):', indiceEncontrado); // 3

// 20. findLast() - Retorna el último elemento que cumple la condición
const ultimoEncontrado = numeros.findLast((num) => num < 4);
console.log('findLast (<4):', ultimoEncontrado); // 3

// 21. findLastIndex() - Retorna el índice del último elemento que cumple la condición
const ultimoIndice = numeros.findLastIndex((num) => num < 4);
console.log('findLastIndex (<4):', ultimoIndice); // 2

// 22. every() - Comprueba si todos los elementos cumplen la condición
const todosMenoresA10 = numeros.every((num) => num < 10);
console.log('every (<10):', todosMenoresA10); // true

// 23. some() - Comprueba si al menos un elemento cumple la condición
const algunoMayorA4 = numeros.some((num) => num > 4);
console.log('some (>4):', algunoMayorA4); // true

// 24. reduce() - Reduce el arreglo a un solo valor mediante un acumulador
const sumaTotal = numeros.reduce((acum, actual) => acum + actual, 0);
console.log('reduce (suma):', sumaTotal); // 15

// 25. reduceRight() - Igual que reduce pero de derecha a izquierda
const palabras = ['a', 'b', 'c'];
const concatenado = palabras.reduceRight((acum, actual) => acum + actual, '');
console.log('reduceRight:', concatenado); // "cba"

// 26. fill() - Cambia todos los elementos por un valor estático
const llenado = [1, 2, 3, 4].fill(0, 1, 3);
console.log('fill:', llenado); // [1, 0, 0, 4]

// 27. flat() - Aplana arreglos anidados hasta la profundidad especificada
const anidado = [1, [2, [3, 4]]];
console.log('flat:', anidado.flat(2)); // [1, 2, 3, 4]

// 28. flatMap() - Mapea y aplana el resultado en un nuevo arreglo
const frases = ['Hola mundo', 'JS arrays'];
const palabrasClave = frases.flatMap((f) => f.split(' '));
console.log('flatMap:', palabrasClave); // ['Hola', 'mundo', 'JS', 'arrays']

// 29. copyWithin() - Copia una parte del arreglo a otra posición del mismo
const copiaInterna = [1, 2, 3, 4, 5].copyWithin(0, 3, 5);
console.log('copyWithin:', copiaInterna); // [4, 5, 3, 4, 5]

// 30. entries(), keys(), values() - Iteradores
console.log('keys:', [...numeros.keys()]);
console.log('values:', [...numeros.values()]);

// 31. toString() y toLocaleString() - Representación en texto
console.log('toString:', numeros.toString());