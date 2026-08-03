/**
 * Convierte un número en letras (español) para importes en pesos.
 */
export function numeroALetras(num: number): string {
  const unidades = (u: number) => {
    switch (u) {
      case 1: return 'un';
      case 2: return 'dos';
      case 3: return 'tres';
      case 4: return 'cuatro';
      case 5: return 'cinco';
      case 6: return 'seis';
      case 7: return 'siete';
      case 8: return 'ocho';
      case 9: return 'nueve';
    }
    return '';
  };

  const decenas = (d: number, u: number) => {
    const dec = Math.floor(d);
    switch (dec) {
      case 1:
        switch (u) {
          case 0: return 'diez';
          case 1: return 'once';
          case 2: return 'doce';
          case 3: return 'trece';
          case 4: return 'catorce';
          case 5: return 'quince';
          default: return 'dieci' + unidades(u);
        }
      case 2:
        if (u === 0) return 'veinte';
        return 'veinti' + unidades(u);
      case 3: return 'treinta' + (u > 0 ? ' y ' + unidades(u) : '');
      case 4: return 'cuarenta' + (u > 0 ? ' y ' + unidades(u) : '');
      case 5: return 'cincuenta' + (u > 0 ? ' y ' + unidades(u) : '');
      case 6: return 'sesenta' + (u > 0 ? ' y ' + unidades(u) : '');
      case 7: return 'setenta' + (u > 0 ? ' y ' + unidades(u) : '');
      case 8: return 'ochenta' + (u > 0 ? ' y ' + unidades(u) : '');
      case 9: return 'noventa' + (u > 0 ? ' y ' + unidades(u) : '');
    }
    return unidades(u);
  };

  const centenas = (c: number, d: number, u: number) => {
    const cent = Math.floor(c);
    switch (cent) {
      case 1:
        if (d === 0 && u === 0) return 'cien';
        return 'ciento ' + decenas(d, u);
      case 2: return 'doscientos ' + decenas(d, u);
      case 3: return 'trescientos ' + decenas(d, u);
      case 4: return 'cuatrocientos ' + decenas(d, u);
      case 5: return 'quinientos ' + decenas(d, u);
      case 6: return 'seiscientos ' + decenas(d, u);
      case 7: return 'setecientos ' + decenas(d, u);
      case 8: return 'ochocientos ' + decenas(d, u);
      case 9: return 'novecientos ' + decenas(d, u);
    }
    return decenas(d, u);
  };

  if (num === 0) return 'cero';

  const centavos = Math.round((num - Math.floor(num)) * 100);
  const entero = Math.floor(num);

  let strEntero = '';
  if (entero === 1) {
    strEntero = 'un';
  } else if (entero > 1) {
    const millones = Math.floor(entero / 1000000);
    const miles = Math.floor((entero % 1000000) / 1000);
    const restos = entero % 1000;

    if (millones > 0) {
      if (millones === 1) {
        strEntero = 'un millón';
      } else {
        strEntero = centenas(Math.floor(millones / 100) % 10, Math.floor(millones / 10) % 10, millones % 10) + ' millones';
      }
    }

    if (miles > 0) {
      if (miles === 1) {
        strEntero += (strEntero ? ' ' : '') + 'mil';
      } else {
        strEntero += (strEntero ? ' ' : '') + centenas(Math.floor(miles / 100) % 10, Math.floor(miles / 10) % 10, miles % 10) + ' mil';
      }
    }

    if (restos > 0) {
      strEntero += (strEntero ? ' ' : '') + centenas(Math.floor(restos / 100) % 10, Math.floor(restos / 10) % 10, restos % 10);
    }
  }

  strEntero = strEntero.trim();
  let sufijo = entero === 1 ? 'peso' : 'pesos';
  
  if (entero % 1000000 === 0 && entero > 0) {
    sufijo = 'de pesos';
  }

  let resultado = strEntero + ' ' + sufijo;
  resultado = resultado.charAt(0).toUpperCase() + resultado.slice(1);

  const strCentavos = centavos.toString().padStart(2, '0') + '/100 M.N.';
  return `${resultado} ${strCentavos}`;
}
