import { Router, Request, Response } from 'express';

const router = Router();

interface Senal {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  significado: string;
  imagen: string;
}

function generarSenales(): Senal[] {
  return [
    // ============================
    // SEÑALES DE PELIGRO (P)
    // ============================
    {
      id: 'curva-peligrosa-derecha', codigo: 'P-1',
      nombre: 'Curva peligrosa hacia la derecha', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con símbolo de curva hacia la derecha.',
      significado: 'Advierte de una curva peligrosa hacia la derecha. Reducir la velocidad.',
      imagen: '/senales/p1.svg'
    },
    {
      id: 'curva-peligrosa-izquierda', codigo: 'P-1a',
      nombre: 'Curva peligrosa hacia la izquierda', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con símbolo de curva hacia la izquierda.',
      significado: 'Advierte de una curva peligrosa hacia la izquierda. Reducir la velocidad.',
      imagen: '/senales/p1a.svg'
    },
    {
      id: 'doble-curva-derecha', codigo: 'P-1b',
      nombre: 'Doble curva, primera a la derecha', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con doble curva, primera a la derecha.',
      significado: 'Advierte de dos curvas consecutivas, siendo la primera hacia la derecha.',
      imagen: '/senales/p1b.svg'
    },
    {
      id: 'incorporacion-derecha', codigo: 'P-1c',
      nombre: 'Intersección con incorporación por la derecha', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con flecha de incorporación por la derecha.',
      significado: 'Advierte de una intersección con incorporación por la derecha.',
      imagen: '/senales/p1c.svg'
    },
    {
      id: 'incorporacion-izquierda', codigo: 'P-1d',
      nombre: 'Intersección con incorporación por la izquierda', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con flecha de incorporación por la izquierda.',
      significado: 'Advierte de una intersección con incorporación por la izquierda.',
      imagen: '/senales/p1d.svg'
    },
    {
      id: 'interseccion-glorieta', codigo: 'P-1e',
      nombre: 'Intersección con glorieta', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con flechas de glorieta.',
      significado: 'Advierte de una intersección con circulación giratoria (glorieta).',
      imagen: '/senales/p1e.svg'
    },
    {
      id: 'interseccion-prioridad', codigo: 'P-2',
      nombre: 'Intersección con prioridad', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con una cruz negra.',
      significado: 'Advierte de una intersección donde el conductor tiene prioridad.',
      imagen: '/senales/p2.svg'
    },
    {
      id: 'semaforo', codigo: 'P-3',
      nombre: 'Semáforo', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un semáforo.',
      significado: 'Advierte de la proximidad de un semáforo. Prepararse para detenerse.',
      imagen: '/senales/p3.svg'
    },
    {
      id: 'prioridad-derecha', codigo: 'P-4',
      nombre: 'Cruce con prioridad por la derecha', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con una cruz delgada.',
      significado: 'Advierte de un cruce donde rige la prioridad por la derecha.',
      imagen: '/senales/p4.svg'
    },
    {
      id: 'puente-movil', codigo: 'P-5',
      nombre: 'Puente móvil', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un puente levadizo.',
      significado: 'Advierte de la proximidad de un puente móvil o levadizo.',
      imagen: '/senales/p5.svg'
    },
    {
      id: 'cruce-tranvia', codigo: 'P-6',
      nombre: 'Cruce de tranvía', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con una línea de tranvía.',
      significado: 'Advierte de un cruce con línea de tranvía.',
      imagen: '/senales/p6.svg'
    },
    {
      id: 'paso-nivel-barreras', codigo: 'P-7',
      nombre: 'Paso a nivel con barreras', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con una barrera.',
      significado: 'Advierte de un paso a nivel con barreras o semibarreras.',
      imagen: '/senales/p7.svg'
    },
    {
      id: 'paso-nivel-sin-barreras', codigo: 'P-8',
      nombre: 'Paso a nivel sin barreras', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con una locomotora.',
      significado: 'Advierte de un paso a nivel sin barreras. Extremar la precaución.',
      imagen: '/senales/p8.svg'
    },
    {
      id: 'bajada-pendiente', codigo: 'P-9',
      nombre: 'Bajada de fuerte pendiente', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con flecha descendente y porcentaje.',
      significado: 'Advierte de una bajada de fuerte pendiente. Usar freno motor.',
      imagen: '/senales/bajada-pendiente.svg'
    },
    {
      id: 'proximidad-paso-nivel-dcha-1', codigo: 'P-9a',
      nombre: 'Proximidad de paso a nivel (derecha, 240m)', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con tres barras rojas inclinadas.',
      significado: 'Paso a nivel sin barreras a 240 metros por la derecha.',
      imagen: '/senales/p9a.svg'
    },
    {
      id: 'proximidad-paso-nivel-dcha-2', codigo: 'P-9b',
      nombre: 'Proximidad de paso a nivel (derecha, 160m)', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con dos barras rojas inclinadas.',
      significado: 'Paso a nivel sin barreras a 160 metros por la derecha.',
      imagen: '/senales/p9b.svg'
    },
    {
      id: 'proximidad-paso-nivel-dcha-3', codigo: 'P-9c',
      nombre: 'Proximidad de paso a nivel (derecha, 80m)', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con una barra roja inclinada.',
      significado: 'Paso a nivel sin barreras a 80 metros por la derecha.',
      imagen: '/senales/p9c.svg'
    },
    {
      id: 'subida-pendiente', codigo: 'P-10',
      nombre: 'Subida de fuerte pendiente', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con flecha ascendente y porcentaje.',
      significado: 'Advierte de una subida de fuerte pendiente. Adecuar la marcha.',
      imagen: '/senales/p9.svg'
    },
    {
      id: 'estrechamiento', codigo: 'P-11',
      nombre: 'Estrechamiento de calzada', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con calzada que se estrecha.',
      significado: 'Advierte de un estrechamiento de la calzada por ambos lados.',
      imagen: '/senales/p10.svg'
    },
    {
      id: 'estrechamiento-derecha', codigo: 'P-11a',
      nombre: 'Estrechamiento por la derecha', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con estrechamiento por la derecha.',
      significado: 'Advierte de un estrechamiento de calzada por la derecha.',
      imagen: '/senales/estrechamiento-derecha.svg'
    },
    {
      id: 'estrechamiento-izquierda', codigo: 'P-11b',
      nombre: 'Estrechamiento por la izquierda', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con estrechamiento por la izquierda.',
      significado: 'Advierte de un estrechamiento de calzada por la izquierda.',
      imagen: '/senales/estrechamiento-izquierda.svg'
    },
    {
      id: 'proximidad-paso-nivel-izda-1', codigo: 'P-12a',
      nombre: 'Proximidad de paso a nivel (izquierda, 240m)', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con tres barras rojas inclinadas a la izquierda.',
      significado: 'Paso a nivel sin barreras a 240 metros por la izquierda.',
      imagen: '/senales/p10a.svg'
    },
    {
      id: 'proximidad-paso-nivel-izda-2', codigo: 'P-12b',
      nombre: 'Proximidad de paso a nivel (izquierda, 160m)', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con dos barras rojas inclinadas a la izquierda.',
      significado: 'Paso a nivel sin barreras a 160 metros por la izquierda.',
      imagen: '/senales/p10b.svg'
    },
    {
      id: 'proximidad-paso-nivel-izda-3', codigo: 'P-12c',
      nombre: 'Proximidad de paso a nivel (izquierda, 80m)', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con una barra roja inclinada a la izquierda.',
      significado: 'Paso a nivel sin barreras a 80 metros por la izquierda.',
      imagen: '/senales/p10c.svg'
    },
    {
      id: 'situacion-paso-nivel', codigo: 'P-13',
      nombre: 'Situación de paso a nivel sin barreras', categoria: 'Peligro',
      descripcion: 'Cruz de San Andrés blanca con borde rojo.',
      significado: 'Señaliza el lugar exacto del paso a nivel sin barreras.',
      imagen: '/senales/p11.svg'
    },
    {
      id: 'situacion-paso-nivel-multiple', codigo: 'P-13a',
      nombre: 'Paso a nivel de más de una vía', categoria: 'Peligro',
      descripcion: 'Cruz de San Andrés con dos barras rojas laterales.',
      significado: 'Paso a nivel sin barreras que cruza más de una vía férrea.',
      imagen: '/senales/p11a.svg'
    },
    {
      id: 'aeropuerto', codigo: 'P-14',
      nombre: 'Aeropuerto', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un avión.',
      significado: 'Advierte de la proximidad de un aeropuerto.',
      imagen: '/senales/p12a.svg'
    },
    {
      id: 'pavimento-deslizante', codigo: 'P-15',
      nombre: 'Pavimento deslizante', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con coche sobre pavimento mojado.',
      significado: 'Advierte de pavimento deslizante. Reducir velocidad y aumentar distancia.',
      imagen: '/senales/p13.svg'
    },
    {
      id: 'gravilla', codigo: 'P-16',
      nombre: 'Proyección de gravilla', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con gravilla proyectándose.',
      significado: 'Advierte de posible proyección de gravilla. Reducir velocidad.',
      imagen: '/senales/p14.svg'
    },
    {
      id: 'obras', codigo: 'P-17',
      nombre: 'Obras', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un obrero.',
      significado: 'Advierte de obras en la vía. Reducir velocidad.',
      imagen: '/senales/p50.svg'
    },
    {
      id: 'perfil-irregular', codigo: 'P-18',
      nombre: 'Perfil irregular', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con ondulación.',
      significado: 'Advierte de calzada con perfil irregular (baches, ondulaciones).',
      imagen: '/senales/p15.svg'
    },
    {
      id: 'resalto', codigo: 'P-18a',
      nombre: 'Resalto', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un resalto.',
      significado: 'Advierte de un resalto en la calzada.',
      imagen: '/senales/p15a.svg'
    },
    {
      id: 'baden', codigo: 'P-18b',
      nombre: 'Badén', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un badén.',
      significado: 'Advierte de un badén o depresión en la calzada.',
      imagen: '/senales/p15b.svg'
    },
    {
      id: 'puente-movil-alt', codigo: 'P-19',
      nombre: 'Puente móvil (preseñalización)', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un puente levadizo.',
      significado: 'Preseñalización de un puente móvil.',
      imagen: '/senales/p16.svg'
    },
    {
      id: 'paso-peatones', codigo: 'P-20',
      nombre: 'Paso de peatones', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con peatón cruzando.',
      significado: 'Advierte de la proximidad de un paso de peatones.',
      imagen: '/senales/p20.svg'
    },
    {
      id: 'ciclistas', codigo: 'P-21',
      nombre: 'Ciclistas', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un ciclista.',
      significado: 'Advierte de la proximidad de un paso para ciclistas.',
      imagen: '/senales/p21.svg'
    },
    {
      id: 'peatones-menores', codigo: 'P-21b',
      nombre: 'Niños, ancianos o discapacitados', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con siluetas de personas.',
      significado: 'Advierte de zona frecuentada por niños, ancianos o discapacitados.',
      imagen: '/senales/p21b.svg'
    },
    {
      id: 'ninos', codigo: 'P-22',
      nombre: 'Niños', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con dos niños corriendo.',
      significado: 'Advierte de la proximidad de un colegio o parque.',
      imagen: '/senales/p23.svg'
    },
    {
      id: 'animales-domesticos', codigo: 'P-23',
      nombre: 'Animales domésticos', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un animal doméstico.',
      significado: 'Advierte de posible presencia de animales domésticos en la vía.',
      imagen: '/senales/p25.svg'
    },
    {
      id: 'animales-salvajes', codigo: 'P-24',
      nombre: 'Animales en libertad', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un animal salvaje.',
      significado: 'Advierte de posible presencia de animales salvajes en la vía.',
      imagen: '/senales/p24.svg'
    },
    {
      id: 'circulacion-doble-sentido', codigo: 'P-25',
      nombre: 'Circulación en dos sentidos', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con dos flechas opuestas.',
      significado: 'Advierte de circulación en ambos sentidos.',
      imagen: '/senales/p25.svg'
    },
    {
      id: 'muelle', codigo: 'P-26',
      nombre: 'Muelle o embarcadero', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con peligro de caída al agua.',
      significado: 'Advierte de la proximidad de un muelle o embarcadero.',
      imagen: '/senales/p27.svg'
    },
    {
      id: 'hielo-nieve', codigo: 'P-27',
      nombre: 'Hielo o nieve', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un copo de nieve.',
      significado: 'Advierte de posibilidad de hielo o nieve en la calzada.',
      imagen: '/senales/p28.svg'
    },
    {
      id: 'viento-transversal', codigo: 'P-28',
      nombre: 'Viento transversal', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un símbolo de viento.',
      significado: 'Advierte de fuertes rachas de viento transversal.',
      imagen: '/senales/p29.svg'
    },
    {
      id: 'escalon-lateral', codigo: 'P-29',
      nombre: 'Escalón lateral', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un escalón.',
      significado: 'Advierte de un escalón lateral en la calzada.',
      imagen: '/senales/p30.svg'
    },
    {
      id: 'congestion', codigo: 'P-30',
      nombre: 'Congestión', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con varios vehículos.',
      significado: 'Advierte de probabilidad de congestión o retenciones.',
      imagen: '/senales/p31.svg'
    },
    {
      id: 'obstruccion-calzada', codigo: 'P-31',
      nombre: 'Obstrucción en la calzada', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con un obstáculo.',
      significado: 'Advierte de posible presencia de objetos en la calzada.',
      imagen: '/senales/p32.svg'
    },
    {
      id: 'curvas-peligrosas-derecha', codigo: 'P-32',
      nombre: 'Curvas peligrosas (primera a la derecha)', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con varias curvas.',
      significado: 'Advierte de una serie de curvas, siendo la primera a la derecha.',
      imagen: '/senales/curvas-derecha.svg'
    },
    {
      id: 'curva-peligrosa-izquierda-alt', codigo: 'P-33',
      nombre: 'Curva peligrosa hacia la izquierda (alt)', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con curva hacia la izquierda.',
      significado: 'Advierte de una curva peligrosa hacia la izquierda.',
      imagen: '/senales/curva-peligrosa-izquierda.svg'
    },
    {
      id: 'curva-peligrosa-derecha-alt', codigo: 'P-34',
      nombre: 'Curva peligrosa hacia la derecha (alt)', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con curva hacia la derecha.',
      significado: 'Advierte de una curva peligrosa hacia la derecha.',
      imagen: '/senales/curva-peligrosa.svg'
    },
    {
      id: 'pavimento-hielo', codigo: 'P-35',
      nombre: 'Pavimento deslizante por hielo', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con copo de nieve sobre calzada.',
      significado: 'Advierte de pavimento deslizante por hielo o nieve.',
      imagen: '/senales/p28.svg'
    },
    {
      id: 'stop-pre', codigo: 'P-36',
      nombre: 'STOP (preseñalización)', categoria: 'Peligro',
      descripcion: 'Triángulo con borde rojo y fondo blanco con señal STOP en miniatura.',
      significado: 'Advierte de la proximidad de un STOP.',
      imagen: '/senales/p1b.svg'
    },
    // ============================
    // SEÑALES DE PROHIBICIÓN (R-1xx a R-3xx)
    // ============================
    {
      id: 'circulacion-prohibida', codigo: 'R-100',
      nombre: 'Circulación prohibida', categoria: 'Prohibición',
      descripcion: 'Círculo rojo con barra horizontal blanca.',
      significado: 'Prohibición de circulación en ambos sentidos.',
      imagen: '/senales/r100.svg'
    },
    {
      id: 'entrada-prohibida', codigo: 'R-101',
      nombre: 'Entrada prohibida', categoria: 'Prohibición',
      descripcion: 'Círculo rojo con barra horizontal blanca.',
      significado: 'Prohíbe la entrada a toda clase de vehículos.',
      imagen: '/senales/r101.svg'
    },
    {
      id: 'prohibido-motos', codigo: 'R-102',
      nombre: 'Entrada prohibida a motocicletas', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y silueta de motocicleta.',
      significado: 'Prohíbe el acceso a motocicletas.',
      imagen: '/senales/r102.svg'
    },
    {
      id: 'prohibido-motos-exc', codigo: 'R-103',
      nombre: 'Entrada prohibida a motocicletas (excepto dos ruedas)', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo con motocicleta excepto dos ruedas.',
      significado: 'Prohíbe entrada a motos excepto de dos ruedas sin sidecar.',
      imagen: '/senales/r103.svg'
    },
    {
      id: 'prohibido-ciclomotores', codigo: 'R-105',
      nombre: 'Entrada prohibida a ciclomotores', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y silueta de ciclomotor.',
      significado: 'Prohíbe el acceso a ciclomotores.',
      imagen: '/senales/r105.svg'
    },
    {
      id: 'prohibido-camiones', codigo: 'R-106',
      nombre: 'Entrada prohibida a camiones', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y silueta de camión.',
      significado: 'Prohíbe la entrada a camiones.',
      imagen: '/senales/r106.svg'
    },
    {
      id: 'prohibido-mercancias', codigo: 'R-107',
      nombre: 'Entrada prohibida a mercancías', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y camión con masa.',
      significado: 'Prohíbe entrada a vehículos de mercancías con MMA superior a la indicada.',
      imagen: '/senales/r107.svg'
    },
    {
      id: 'prohibido-mercancias-peligrosas', codigo: 'R-108',
      nombre: 'Entrada prohibida a mercancías peligrosas', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y símbolo de peligro.',
      significado: 'Prohíbe entrada a vehículos con mercancías peligrosas.',
      imagen: '/senales/r108.svg'
    },
    {
      id: 'prohibido-explosivos', codigo: 'R-109',
      nombre: 'Entrada prohibida a explosivos', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y símbolo de explosión.',
      significado: 'Prohíbe entrada a vehículos con materias explosivas.',
      imagen: '/senales/r109.svg'
    },
    {
      id: 'prohibido-contaminantes', codigo: 'R-110',
      nombre: 'Entrada prohibida a contaminantes del agua', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y onda de agua.',
      significado: 'Prohíbe entrada a vehículos con productos contaminantes del agua.',
      imagen: '/senales/r110.svg'
    },
    {
      id: 'prohibido-agricolas', codigo: 'R-111',
      nombre: 'Entrada prohibida a vehículos agrícolas', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y silueta de tractor.',
      significado: 'Prohíbe entrada a vehículos agrícolas.',
      imagen: '/senales/r111.svg'
    },
    {
      id: 'prohibido-remolque', codigo: 'R-112',
      nombre: 'Entrada prohibida a vehículos con remolque', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y coche con remolque.',
      significado: 'Prohíbe entrada a vehículos con remolque.',
      imagen: '/senales/r112.svg'
    },
    {
      id: 'prohibido-traccion-animal', codigo: 'R-113',
      nombre: 'Entrada prohibida a tracción animal', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y carro de tracción animal.',
      significado: 'Prohíbe entrada a vehículos de tracción animal.',
      imagen: '/senales/r113.svg'
    },
    {
      id: 'prohibido-bicicletas', codigo: 'R-114',
      nombre: 'Entrada prohibida a bicicletas', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y silueta de bicicleta.',
      significado: 'Prohíbe el acceso a bicicletas y ciclomotores.',
      imagen: '/senales/r114.svg'
    },
    {
      id: 'prohibido-carros-mano', codigo: 'R-115',
      nombre: 'Entrada prohibida a carros de mano', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y carro de mano.',
      significado: 'Prohíbe entrada a carros de mano.',
      imagen: '/senales/r115.svg'
    },
    {
      id: 'prohibido-peatones', codigo: 'R-116',
      nombre: 'Entrada prohibida a peatones', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y silueta de peatón.',
      significado: 'Prohíbe el acceso a peatones.',
      imagen: '/senales/r116.svg'
    },
    {
      id: 'prohibido-animales-montura', codigo: 'R-117',
      nombre: 'Entrada prohibida a animales de montura', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y jinete a caballo.',
      significado: 'Prohíbe entrada a animales de montura.',
      imagen: '/senales/r117.svg'
    },
    {
      id: 'prohibido-vmp', codigo: 'R-118',
      nombre: 'Entrada prohibida a VMP', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y silueta de patinete.',
      significado: 'Prohíbe entrada a vehículos de movilidad personal.',
      imagen: '/senales/r118.svg'
    },
    {
      id: 'prohibido-vmp-ciclos', codigo: 'R-119',
      nombre: 'Entrada prohibida a VMP y ciclos', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo con patinete y bicicleta.',
      significado: 'Prohíbe entrada a VMP y ciclos.',
      imagen: '/senales/r119.svg'
    },
    {
      id: 'prohibido-distintivo-ambiental', codigo: 'R-120',
      nombre: 'Entrada prohibida por distintivo ambiental', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y etiqueta ambiental.',
      significado: 'Prohíbe entrada sin el distintivo ambiental indicado.',
      imagen: '/senales/r120.svg'
    },
    {
      id: 'stop', codigo: 'R-200',
      nombre: 'STOP', categoria: 'Prohibición',
      descripcion: 'Octógono rojo con borde blanco y la inscripción STOP.',
      significado: 'Obligación de detenerse antes de la línea de detención.',
      imagen: '/senales/stop.svg'
    },
    {
      id: 'ceda-paso', codigo: 'R-201',
      nombre: 'Ceda el paso', categoria: 'Prohibición',
      descripcion: 'Triángulo invertido con borde rojo y centro blanco.',
      significado: 'Obligación de ceder el paso a los vehículos de la vía preferente.',
      imagen: '/senales/r1.svg'
    },
    {
      id: 'limitacion-masa', codigo: 'R-202',
      nombre: 'Limitación de masa', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y masa en toneladas.',
      significado: 'Prohíbe circulación de vehículos con masa superior a la indicada.',
      imagen: '/senales/r201.svg'
    },
    {
      id: 'limitacion-masa-eje', codigo: 'R-203',
      nombre: 'Limitación de masa por eje', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo con eje y masa.',
      significado: 'Prohíbe circulación si la masa por eje supera la indicada.',
      imagen: '/senales/r202.svg'
    },
    {
      id: 'limitacion-longitud', codigo: 'R-204',
      nombre: 'Limitación de longitud', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y longitud en metros.',
      significado: 'Prohíbe circulación de vehículos con longitud superior a la indicada.',
      imagen: '/senales/r203.svg'
    },
    {
      id: 'limitacion-anchura', codigo: 'R-205',
      nombre: 'Limitación de anchura', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y anchura en metros.',
      significado: 'Prohíbe circulación de vehículos con anchura superior a la indicada.',
      imagen: '/senales/r204.svg'
    },
    {
      id: 'limitacion-altura', codigo: 'R-206',
      nombre: 'Limitación de altura', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y altura en metros.',
      significado: 'Prohíbe circulación de vehículos con altura superior a la indicada.',
      imagen: '/senales/r205.svg'
    },
    {
      id: 'prohibido-senal-acustica', codigo: 'R-300',
      nombre: 'Prohibido señales acústicas', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y bocina tachada.',
      significado: 'Prohíbe el uso del claxon salvo peligro inminente.',
      imagen: '/senales/r310.svg'
    },
    {
      id: 'separacion-minima', codigo: 'R-301',
      nombre: 'Separación mínima', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y distancia entre vehículos.',
      significado: 'Obligación de mantener una distancia mínima de seguridad.',
      imagen: '/senales/r300.svg'
    },
    {
      id: 'velocidad-maxima', codigo: 'R-302',
      nombre: 'Velocidad máxima', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y número de km/h.',
      significado: 'Prohíbe superar la velocidad máxima indicada.',
      imagen: '/senales/r301.svg'
    },
    {
      id: 'prohibido-girar-derecha', codigo: 'R-303',
      nombre: 'Prohibido girar a la derecha', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y flecha derecha tachada.',
      significado: 'Prohíbe girar a la derecha.',
      imagen: '/senales/r302.svg'
    },
    {
      id: 'prohibido-girar-izquierda', codigo: 'R-304',
      nombre: 'Prohibido girar a la izquierda', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo y flecha izquierda tachada.',
      significado: 'Prohíbe girar a la izquierda.',
      imagen: '/senales/r303.svg'
    },
    {
      id: 'prohibido-adelantar', codigo: 'R-305',
      nombre: 'Prohibido adelantar', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo con dos coches (negro y rojo).',
      significado: 'Prohíbe adelantar a cualquier vehículo.',
      imagen: '/senales/r305.svg'
    },
    {
      id: 'prohibido-adelantar-camiones', codigo: 'R-306',
      nombre: 'Prohibido adelantar a camiones', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde rojo con dos camiones.',
      significado: 'Prohíbe a camiones de más de 3.500 kg adelantar.',
      imagen: '/senales/r306.svg'
    },
    {
      id: 'prohibido-detener', codigo: 'R-307',
      nombre: 'Prohibido detenerse', categoria: 'Prohibición',
      descripcion: 'Círculo azul con borde rojo y diagonal roja.',
      significado: 'Prohíbe detenerse y estacionar.',
      imagen: '/senales/r307.svg'
    },
    {
      id: 'prohibido-estacionar', codigo: 'R-308',
      nombre: 'Prohibido estacionar', categoria: 'Prohibición',
      descripcion: 'Círculo azul con borde rojo, letra E y diagonal roja.',
      significado: 'Prohíbe el estacionamiento. No afecta a la parada.',
      imagen: '/senales/r308.svg'
    },
    {
      id: 'zona-estacionamiento-limitado', codigo: 'R-309',
      nombre: 'Zona de estacionamiento regulado', categoria: 'Prohibición',
      descripcion: 'Círculo azul con borde rojo y disco de estacionamiento.',
      significado: 'Zona de estacionamiento regulado con limitación horaria (zona azul/verde).',
      imagen: '/senales/r309.svg'
    },
    // ============================
    // SEÑALES DE OBLIGACIÓN (R-4xx)
    // ============================
    {
      id: 'sentido-obligatorio-recto', codigo: 'R-400',
      nombre: 'Sentido obligatorio (recto)', categoria: 'Obligación',
      descripcion: 'Círculo azul con flecha blanca hacia arriba.',
      significado: 'Obligación de seguir recto.',
      imagen: '/senales/r400a.svg'
    },
    {
      id: 'sentido-obligatorio-derecha', codigo: 'R-401',
      nombre: 'Sentido obligatorio (derecha)', categoria: 'Obligación',
      descripcion: 'Círculo azul con flecha blanca hacia la derecha.',
      significado: 'Obligación de girar a la derecha.',
      imagen: '/senales/r400b.svg'
    },
    {
      id: 'sentido-obligatorio-izquierda', codigo: 'R-402',
      nombre: 'Sentido obligatorio (izquierda)', categoria: 'Obligación',
      descripcion: 'Círculo azul con flecha blanca hacia la izquierda.',
      significado: 'Obligación de girar a la izquierda.',
      imagen: '/senales/r400c.svg'
    },
    {
      id: 'sentido-obligatorio-recto-derecha', codigo: 'R-403',
      nombre: 'Sentido obligatorio (recto y derecha)', categoria: 'Obligación',
      descripcion: 'Círculo azul con flechas recto y derecha.',
      significado: 'Obligación de seguir recto o girar a la derecha.',
      imagen: '/senales/r400d.svg'
    },
    {
      id: 'sentido-obligatorio-recto-izquierda', codigo: 'R-404',
      nombre: 'Sentido obligatorio (recto e izquierda)', categoria: 'Obligación',
      descripcion: 'Círculo azul con flechas recto e izquierda.',
      significado: 'Obligación de seguir recto o girar a la izquierda.',
      imagen: '/senales/r400e.svg'
    },
    {
      id: 'paso-obligatorio-izquierda', codigo: 'R-405',
      nombre: 'Paso obligatorio por la izquierda', categoria: 'Obligación',
      descripcion: 'Círculo azul con flecha oblicua izquierda.',
      significado: 'Obligación de pasar por la izquierda del obstáculo.',
      imagen: '/senales/r401a.svg'
    },
    {
      id: 'paso-obligatorio-derecha', codigo: 'R-406',
      nombre: 'Paso obligatorio por la derecha', categoria: 'Obligación',
      descripcion: 'Círculo azul con flecha oblicua derecha.',
      significado: 'Obligación de pasar por la derecha del obstáculo.',
      imagen: '/senales/r401b.svg'
    },
    {
      id: 'paso-obligatorio-ambos', codigo: 'R-407',
      nombre: 'Paso obligatorio por ambos lados', categoria: 'Obligación',
      descripcion: 'Círculo azul con dos flechas oblicuas divergentes.',
      significado: 'Se puede pasar por cualquier lado del obstáculo.',
      imagen: '/senales/r401c.svg'
    },
    {
      id: 'rotonda-obligatoria', codigo: 'R-408',
      nombre: 'Glorieta obligatoria', categoria: 'Obligación',
      descripcion: 'Círculo azul con tres flechas blancas en círculo.',
      significado: 'Obligación de circular en sentido giratorio.',
      imagen: '/senales/r402.svg'
    },
    {
      id: 'direcciones-permitidas-1', codigo: 'R-409',
      nombre: 'Direcciones permitidas (derecha)', categoria: 'Obligación',
      descripcion: 'Círculo azul con flecha derecha.',
      significado: 'Única dirección permitida: girar a la derecha.',
      imagen: '/senales/r403a.svg'
    },
    {
      id: 'direcciones-permitidas-2', codigo: 'R-410',
      nombre: 'Direcciones permitidas (derecha y recto)', categoria: 'Obligación',
      descripcion: 'Círculo azul con flechas derecha y recto.',
      significado: 'Direcciones permitidas: derecha y recto.',
      imagen: '/senales/r403b.svg'
    },
    {
      id: 'direcciones-permitidas-3', codigo: 'R-411',
      nombre: 'Direcciones permitidas (izquierda y recto)', categoria: 'Obligación',
      descripcion: 'Círculo azul con flechas izquierda y recto.',
      significado: 'Direcciones permitidas: izquierda y recto.',
      imagen: '/senales/r403c.svg'
    },
    {
      id: 'calzada-obligatoria-motos', codigo: 'R-412',
      nombre: 'Calzada obligatoria para motocicletas', categoria: 'Obligación',
      descripcion: 'Círculo azul con silueta de motocicleta.',
      significado: 'Obliga a motocicletas a circular por esa calzada.',
      imagen: '/senales/r405.svg'
    },
    {
      id: 'calzada-obligatoria-camiones', codigo: 'R-413',
      nombre: 'Calzada obligatoria para camiones', categoria: 'Obligación',
      descripcion: 'Círculo azul con silueta de camión.',
      significado: 'Obliga a camiones a circular por esa calzada.',
      imagen: '/senales/r406.svg'
    },
    {
      id: 'via-obligatoria-ciclos', codigo: 'R-414',
      nombre: 'Vía obligatoria para ciclos', categoria: 'Obligación',
      descripcion: 'Círculo azul con silueta de bicicleta.',
      significado: 'Obliga a ciclistas a circular por esa vía.',
      imagen: '/senales/r407a.svg'
    },
    {
      id: 'calzada-sentido-unico', codigo: 'R-415',
      nombre: 'Calzada de sentido único', categoria: 'Obligación',
      descripcion: 'Círculo azul con flecha vertical arriba.',
      significado: 'Vía de sentido único.',
      imagen: '/senales/r404.svg'
    },
    {
      id: 'velocidad-minima', codigo: 'R-416',
      nombre: 'Velocidad mínima', categoria: 'Obligación',
      descripcion: 'Círculo azul con número blanco.',
      significado: 'Obligación de circular a la velocidad mínima indicada.',
      imagen: '/senales/r411.svg'
    },
    {
      id: 'cadenas-nieve', codigo: 'R-417',
      nombre: 'Cadenas para nieve obligatorias', categoria: 'Obligación',
      descripcion: 'Círculo azul con neumático y cadenas.',
      significado: 'Obligación de usar cadenas o neumáticos especiales.',
      imagen: '/senales/r412.svg'
    },
    {
      id: 'alumbrado-corto', codigo: 'R-418',
      nombre: 'Alumbrado de corto alcance obligatorio', categoria: 'Obligación',
      descripcion: 'Círculo azul con faro proyectando luz.',
      significado: 'Obligación de encender el alumbrado de corto alcance.',
      imagen: '/senales/r413.svg'
    },
    // ============================
    // FIN DE PROHIBICIONES (R-5xx)
    // ============================
    {
      id: 'fin-prohibiciones', codigo: 'R-500',
      nombre: 'Fin de prohibiciones', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con borde negro y diagonal negra.',
      significado: 'Fin de todas las prohibiciones de carácter temporal.',
      imagen: '/senales/r500.svg'
    },
    {
      id: 'fin-velocidad-maxima', codigo: 'R-501',
      nombre: 'Fin de velocidad máxima', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con diagonal y número tachado.',
      significado: 'Fin de la limitación de velocidad máxima.',
      imagen: '/senales/r501.svg'
    },
    {
      id: 'fin-adelantamiento', codigo: 'R-502',
      nombre: 'Fin de prohibición de adelantamiento', categoria: 'Prohibición',
      descripcion: 'Círculo blanco con diagonal y coches tachados.',
      significado: 'Fin de la prohibición de adelantar.',
      imagen: '/senales/r502.svg'
    },
    // ============================
    // SEÑALES DE PRIORIDAD
    // ============================
    {
      id: 'carretera-prioritaria', codigo: 'P-37',
      nombre: 'Carretera prioritaria', categoria: 'Prioridad',
      descripcion: 'Rombo amarillo con borde blanco.',
      significado: 'Indica vía prioritaria. Los demás deben ceder el paso.',
      imagen: '/senales/r3.svg'
    },
    {
      id: 'fin-prioridad', codigo: 'P-38',
      nombre: 'Fin de prioridad', categoria: 'Prioridad',
      descripcion: 'Círculo blanco con borde rojo y franja negra.',
      significado: 'Fin del tramo con prioridad.',
      imagen: '/senales/r4.svg'
    },
    {
      id: 'prioridad-sentido-contrario', codigo: 'P-39',
      nombre: 'Prioridad respecto al sentido contrario', categoria: 'Prioridad',
      descripcion: 'Cuadrado blanco con borde azul, flecha roja y negra.',
      significado: 'Tenemos prioridad en el próximo tramo estrecho.',
      imagen: '/senales/r5.svg'
    },
    {
      id: 'ceda-paso-sentido-contrario', codigo: 'P-40',
      nombre: 'Ceda el paso al sentido contrario', categoria: 'Prioridad',
      descripcion: 'Cuadrado blanco con borde azul, flecha negra y roja.',
      significado: 'Debemos ceder el paso a vehículos del sentido contrario.',
      imagen: '/senales/r6.svg'
    },
    // ============================
    // SEÑALES DE INDICACIÓN (S)
    // ============================
    {
      id: 'autopista', codigo: 'S-1',
      nombre: 'Autopista', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con símbolo de autopista.',
      significado: 'Inicio de autopista. Normas específicas de circulación.',
      imagen: '/senales/s1.svg'
    },
    {
      id: 'autovia', codigo: 'S-1a',
      nombre: 'Autovía', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con símbolo de autovía.',
      significado: 'Inicio de autovía. Normas específicas de circulación.',
      imagen: '/senales/s1a.svg'
    },
    {
      id: 'fin-autopista', codigo: 'S-2',
      nombre: 'Fin de autopista', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con autopista tachada en rojo.',
      significado: 'Fin de la autopista. Vía convencional.',
      imagen: '/senales/s2.svg'
    },
    {
      id: 'fin-autovia', codigo: 'S-2a',
      nombre: 'Fin de autovía', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con autovía tachada en rojo.',
      significado: 'Fin de la autovía. Vía convencional.',
      imagen: '/senales/s2a.svg'
    },
    {
      id: 'via-reservada-automoviles', codigo: 'S-3',
      nombre: 'Vía reservada para automóviles', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con automóvil blanco.',
      significado: 'Vía reservada exclusivamente para automóviles.',
      imagen: '/senales/s3.svg'
    },
    {
      id: 'fin-via-reservada', codigo: 'S-4',
      nombre: 'Fin de vía reservada', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con automóvil tachado.',
      significado: 'Fin de la vía reservada para automóviles.',
      imagen: '/senales/s4.svg'
    },
    {
      id: 'tunel', codigo: 'S-5',
      nombre: 'Túnel', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con símbolo de túnel.',
      significado: 'Proximidad de un túnel. Encender luces de cruce.',
      imagen: '/senales/s5.svg'
    },
    {
      id: 'velocidad-aconsejada', codigo: 'S-6',
      nombre: 'Velocidad máxima aconsejada', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con número blanco.',
      significado: 'Velocidad máxima orientativa (no obligatoria).',
      imagen: '/senales/s7.svg'
    },
    {
      id: 'fin-velocidad-aconsejada', codigo: 'S-7',
      nombre: 'Fin de velocidad aconsejada', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con número tachado.',
      significado: 'Fin del tramo de velocidad aconsejada.',
      imagen: '/senales/s8.svg'
    },
    {
      id: 'calzada-carril-unico', codigo: 'S-8',
      nombre: 'Calzada de un carril', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con una flecha vertical.',
      significado: 'Un solo carril en sentido único.',
      imagen: '/senales/s11.svg'
    },
    {
      id: 'calzada-dos-carriles', codigo: 'S-8a',
      nombre: 'Calzada de dos carriles', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con dos flechas verticales.',
      significado: 'Dos carriles en el mismo sentido.',
      imagen: '/senales/s11a.svg'
    },
    {
      id: 'calzada-tres-carriles', codigo: 'S-8b',
      nombre: 'Calzada de tres carriles', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con tres flechas verticales.',
      significado: 'Tres carriles en el mismo sentido.',
      imagen: '/senales/s11b.svg'
    },
    {
      id: 'tramo-sentido-unico', codigo: 'S-9',
      nombre: 'Tramo de sentido único', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con flecha vertical y línea.',
      significado: 'El tramo es de sentido único.',
      imagen: '/senales/s12.svg'
    },
    {
      id: 'calle-sin-salida', codigo: 'S-10',
      nombre: 'Calle sin salida', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con calle tachada en rojo.',
      significado: 'Indica que la vía no tiene salida.',
      imagen: '/senales/s15a.svg'
    },
    {
      id: 'paso-superior-peatones', codigo: 'S-11',
      nombre: 'Paso superior para peatones', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con peatón subiendo escaleras.',
      significado: 'Ubicación de paso elevado para peatones.',
      imagen: '/senales/s14a.svg'
    },
    {
      id: 'paso-inferior-peatones', codigo: 'S-12',
      nombre: 'Paso inferior para peatones', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con peatón bajando escaleras.',
      significado: 'Ubicación de paso subterráneo para peatones.',
      imagen: '/senales/s14b.svg'
    },
    {
      id: 'frenado-emergencia', codigo: 'S-13',
      nombre: 'Zona de frenado de emergencia', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con coche frenando en pendiente.',
      significado: 'Zona de frenado de emergencia para fallo de frenos.',
      imagen: '/senales/s16.svg'
    },
    {
      id: 'estacionamiento', codigo: 'S-14',
      nombre: 'Estacionamiento', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con letra P blanca.',
      significado: 'Ubicación de un estacionamiento público.',
      imagen: '/senales/s17.svg'
    },
    {
      id: 'taxi', codigo: 'S-15',
      nombre: 'Taxi', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con la palabra TAXI.',
      significado: 'Ubicación de una parada de taxis.',
      imagen: '/senales/s18.svg'
    },
    {
      id: 'parada-autobuses', codigo: 'S-16',
      nombre: 'Parada de autobuses', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con un autobús.',
      significado: 'Ubicación de una parada de autobuses.',
      imagen: '/senales/s19.svg'
    },
    {
      id: 'parada-tranvia', codigo: 'S-17',
      nombre: 'Parada de tranvía', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con un tranvía.',
      significado: 'Ubicación de una parada de tranvía.',
      imagen: '/senales/s20.svg'
    },
    {
      id: 'hospital', codigo: 'S-18',
      nombre: 'Hospital', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con cruz blanca.',
      significado: 'Proximidad de un hospital.',
      imagen: '/senales/s23.svg'
    },
    {
      id: 'fin-alumbrado-corto', codigo: 'S-19',
      nombre: 'Fin de alumbrado de corto', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con faro tachado.',
      significado: 'Fin de la obligación de alumbrado de corto.',
      imagen: '/senales/s24.svg'
    },
    {
      id: 'cambio-sentido-distinto-nivel', codigo: 'S-20',
      nombre: 'Cambio de sentido a distinto nivel', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con flecha en U sobre puente.',
      significado: 'Cambio de sentido a distinto nivel.',
      imagen: '/senales/s25.svg'
    },
    {
      id: 'zona-juego-infantil', codigo: 'S-21',
      nombre: 'Zona de juegos infantiles', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con columpio o tobogán.',
      significado: 'Zona de juegos infantiles. Peatones con prioridad.',
      imagen: '/senales/s28.svg'
    },
    {
      id: 'fin-zona-juego', codigo: 'S-22',
      nombre: 'Fin de zona de juegos', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con juego tachado.',
      significado: 'Fin de la zona de juegos infantiles.',
      imagen: '/senales/s29.svg'
    },
    {
      id: 'zona-peatonal', codigo: 'S-23',
      nombre: 'Zona peatonal', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con peatón y niño.',
      significado: 'Zona peatonal. Prohibida la circulación de vehículos.',
      imagen: '/senales/s30a.svg'
    },
    {
      id: 'telepeaje', codigo: 'S-24',
      nombre: 'Telepeaje', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con símbolo de ondas VIA-T.',
      significado: 'Carril exclusivo para vehículos con telepeaje.',
      imagen: '/senales/s32.svg'
    },
    {
      id: 'carril-bici', codigo: 'S-25',
      nombre: 'Carril bici', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con bicicleta.',
      significado: 'Carril reservado para bicicletas.',
      imagen: '/senales/s35.svg'
    },
    {
      id: 'senda-ciclopeatonal', codigo: 'S-26',
      nombre: 'Senda ciclopeatonal', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con peatón y bicicleta.',
      significado: 'Senda compartida para peatones y ciclistas.',
      imagen: '/senales/s33.svg'
    },
    {
      id: 'apartadero', codigo: 'S-27',
      nombre: 'Apartadero', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con vehículo en hueco.',
      significado: 'Ubicación de apartadero fuera de la calzada.',
      imagen: '/senales/s34.svg'
    },
    {
      id: 'apartadero-tunel', codigo: 'S-28',
      nombre: 'Apartadero en túnel', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con vehículo en hueco de túnel.',
      significado: 'Ubicación de apartadero dentro de un túnel.',
      imagen: '/senales/s34a.svg'
    },
    {
      id: 'via-ciclos', codigo: 'S-29',
      nombre: 'Vía reservada para ciclos', categoria: 'Indicación',
      descripcion: 'Rectángulo azul con bicicleta.',
      significado: 'Vía reservada para bicicletas.',
      imagen: '/senales/s35.svg'
    },
    // ============================
    // SEÑALES DE SERVICIO (S-1xx)
    // ============================
    {
      id: 'puesto-socorro', codigo: 'S-100',
      nombre: 'Puesto de socorro', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con cruz blanca.',
      significado: 'Ubicación de puesto de socorro.',
      imagen: '/senales/s100.svg'
    },
    {
      id: 'base-ambulancia', codigo: 'S-101',
      nombre: 'Base de ambulancia', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con ambulancia blanca.',
      significado: 'Ubicación de base de ambulancia.',
      imagen: '/senales/s101.svg'
    },
    {
      id: 'itv', codigo: 'S-102',
      nombre: 'ITV', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con letras ITV.',
      significado: 'Ubicación de estación de ITV.',
      imagen: '/senales/s102.svg'
    },
    {
      id: 'taller', codigo: 'S-103',
      nombre: 'Taller de reparación', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con llave inglesa.',
      significado: 'Ubicación de taller de reparación.',
      imagen: '/senales/s103.svg'
    },
    {
      id: 'telefono-emergencia', codigo: 'S-104',
      nombre: 'Teléfono de emergencia', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con teléfono.',
      significado: 'Ubicación de teléfono de emergencia.',
      imagen: '/senales/s104.svg'
    },
    {
      id: 'gasolinera', codigo: 'S-105',
      nombre: 'Surtidor de carburante', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con surtidor.',
      significado: 'Ubicación de gasolinera.',
      imagen: '/senales/s105.svg'
    },
    {
      id: 'taller-gasolinera', codigo: 'S-106',
      nombre: 'Taller y gasolinera', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con llave y surtidor.',
      significado: 'Taller con venta de carburante.',
      imagen: '/senales/s106.svg'
    },
    {
      id: 'camping', codigo: 'S-107',
      nombre: 'Camping', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con tienda de campaña.',
      significado: 'Ubicación de camping.',
      imagen: '/senales/s107.svg'
    },
    {
      id: 'agua-potable', codigo: 'S-108',
      nombre: 'Agua potable', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con grifo.',
      significado: 'Fuente de agua potable.',
      imagen: '/senales/s108.svg'
    },
    {
      id: 'lugar-pintoresco', codigo: 'S-109',
      nombre: 'Lugar pintoresco', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con paisaje.',
      significado: 'Mirador o punto de interés paisajístico.',
      imagen: '/senales/s109.svg'
    },
    {
      id: 'hotel', codigo: 'S-110',
      nombre: 'Hotel', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con cama.',
      significado: 'Ubicación de hotel o alojamiento.',
      imagen: '/senales/s110.svg'
    },
    {
      id: 'restauracion', codigo: 'S-111',
      nombre: 'Restauración', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con tenedor y cuchillo.',
      significado: 'Restaurante o establecimiento de comidas.',
      imagen: '/senales/s111.svg'
    },
    {
      id: 'cafeteria', codigo: 'S-112',
      nombre: 'Cafetería', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con taza.',
      significado: 'Ubicación de cafetería.',
      imagen: '/senales/s112.svg'
    },
    {
      id: 'caravanas', codigo: 'S-113',
      nombre: 'Terreno para remolques-vivienda', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con caravana.',
      significado: 'Terreno para estacionamiento de caravanas.',
      imagen: '/senales/s113.svg'
    },
    {
      id: 'merendero', codigo: 'S-114',
      nombre: 'Merendero', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con mesa y banco.',
      significado: 'Área de picnic o merendero.',
      imagen: '/senales/s114.svg'
    },
    {
      id: 'excursiones-pie', codigo: 'S-115',
      nombre: 'Excursiones a pie', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con peatón andando.',
      significado: 'Inicio de ruta para excursiones a pie.',
      imagen: '/senales/s115.svg'
    },
    {
      id: 'camping-caravanas', codigo: 'S-116',
      nombre: 'Camping y caravanas', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con tienda y caravana.',
      significado: 'Camping con zona para caravanas.',
      imagen: '/senales/s116.svg'
    },
    {
      id: 'albergue', codigo: 'S-117',
      nombre: 'Albergue de juventud', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con mochila.',
      significado: 'Ubicación de albergue juvenil.',
      imagen: '/senales/s117.svg'
    },
    {
      id: 'info-turistica', codigo: 'S-118',
      nombre: 'Información turística', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con letra i.',
      significado: 'Oficina de información turística.',
      imagen: '/senales/s118.svg'
    },
    {
      id: 'parque-natural', codigo: 'S-120',
      nombre: 'Parque natural', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con árbol y montaña.',
      significado: 'Ubicación de parque natural.',
      imagen: '/senales/s120.svg'
    },
    {
      id: 'monumento', codigo: 'S-121',
      nombre: 'Monumento', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con columna.',
      significado: 'Monumento o edificio de interés.',
      imagen: '/senales/s121.svg'
    },
    {
      id: 'otros-servicios', codigo: 'S-122',
      nombre: 'Otros servicios', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con signo de interrogación.',
      significado: 'Otros servicios no especificados.',
      imagen: '/senales/s122.svg'
    },
    {
      id: 'area-descanso', codigo: 'S-123',
      nombre: 'Área de descanso', categoria: 'Servicio',
      descripcion: 'Rectángulo azul con banco y árbol.',
      significado: 'Área de descanso en carretera.',
      imagen: '/senales/s123.svg'
    },
  ];
}

let cache: Senal[] | null = null;

router.get('/', (req: Request, res: Response) => {
  const senales = cache || generarSenales();
  cache = senales;

  const categoria = req.query.categoria as string | undefined;
  let resultado = senales;

  if (categoria) {
    resultado = senales.filter(s => s.categoria === categoria);
  }

  res.json({ datos: resultado, error: null });
});

router.get('/:id', (req: Request, res: Response) => {
  const senal = (cache || generarSenales()).find(s => s.id === req.params.id);
  if (!senal) {
    res.status(404).json({ datos: null, error: 'Señal no encontrada' });
    return;
  }
  res.json({ datos: senal, error: null });
});

export default router;
