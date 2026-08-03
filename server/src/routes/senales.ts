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
    {
      id: 'stop', codigo: 'R-1',
      nombre: 'STOP', categoria: 'Reglamentación',
      descripcion: 'Señal octogonal de color rojo con borde blanco y la inscripción STOP.',
      significado: 'Obligación de detenerse antes de la línea de detención. Señal utilizada en pasos a nivel sin barreras, salida de vía prioritaria y fin de autopista.',
      imagen: '/senales/stop.svg'
    },
    {
      id: 'ceda-paso', codigo: 'R-2',
      nombre: 'Ceda el paso', categoria: 'Reglamentación',
      descripcion: 'Triángulo equilátero invertido con borde rojo y centro blanco, con la inscripción "CEDA EL PASO".',
      significado: 'Obligación de ceder el paso a los vehículos que circulan por la vía preferente, deteniéndose si es necesario.',
      imagen: '/senales/r1.svg'
    },
    {
      id: 'carretera-prioritaria', codigo: 'R-3',
      nombre: 'Carretera prioritaria', categoria: 'Prioridad',
      descripcion: 'Rombo de color amarillo con borde blanco.',
      significado: 'Indica que la vía por la que se circula es prioritaria. Los vehículos que se aproximen por otras vías deben ceder el paso.',
      imagen: '/senales/r3.svg'
    },
    {
      id: 'curva-peligrosa', codigo: 'P-1',
      nombre: 'Curva peligrosa hacia la derecha', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de curva en negro.',
      significado: 'Advierte de una curva peligrosa hacia la derecha. Extremar la precaución, reducir la velocidad.',
      imagen: '/senales/p1.svg'
    },
    {
      id: 'curva-peligrosa-izquierda', codigo: 'P-1a',
      nombre: 'Curva peligrosa hacia la izquierda', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de curva hacia la izquierda en negro.',
      significado: 'Advierte de una curva peligrosa hacia la izquierda. Extremar la precaución, reducir la velocidad.',
      imagen: '/senales/p1a.svg'
    },
    {
      id: 'stop-adelante', codigo: 'P-1b',
      nombre: 'STOP (pre-señalización)', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco, que contiene una señal de STOP en miniatura.',
      significado: 'Advierte de la proximidad de una señal de STOP más adelante. Prepararse para detenerse.',
      imagen: '/senales/p1b.svg'
    },
    {
      id: 'interseccion-prioridad', codigo: 'P-2',
      nombre: 'Intersección con prioridad', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y una cruz negra en el centro.',
      significado: 'Advierte de una intersección donde el conductor tiene prioridad sobre los vehículos que se incorporan desde otras vías.',
      imagen: '/senales/p2.svg'
    },
    {
      id: 'semaforo', codigo: 'P-3',
      nombre: 'Semáforo', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un semáforo en negro.',
      significado: 'Advierte de la proximidad de un semáforo. Extremar la precaución y prepararse para detenerse.',
      imagen: '/senales/p3.svg'
    },
    {
      id: 'prioridad-derecha', codigo: 'P-4',
      nombre: 'Intersección con prioridad derecha', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y una cruz delgada en negro.',
      significado: 'Advierte de una intersección donde se aplica la regla general de prioridad de paso por la derecha.',
      imagen: '/senales/p4.svg'
    },
    {
      id: 'curvas-derecha', codigo: 'P-5',
      nombre: 'Curvas peligrosas (primera a la derecha)', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de curvas en negro.',
      significado: 'Advierte de una serie de curvas peligrosas, siendo la primera hacia la derecha.',
      imagen: '/senales/curvas-derecha.svg'
    },
    {
      id: 'bajada-pendiente', codigo: 'P-8',
      nombre: 'Bajada con fuerte pendiente', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco, flecha inclinada hacia abajo y un porcentaje.',
      significado: 'Advierte de un tramo de vía con fuerte pendiente descendente. Utilizar el freno motor y reducir la velocidad.',
      imagen: '/senales/bajada-pendiente.svg'
    },
    {
      id: 'subida-pendiente', codigo: 'P-9',
      nombre: 'Subida con fuerte pendiente', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco, flecha inclinada hacia arriba y un porcentaje.',
      significado: 'Advierte de un tramo de vía con fuerte pendiente ascendente. Adecuar la marcha y prepararse para cambios de velocidad.',
      imagen: '/senales/p9.svg'
    },
    {
      id: 'estrechamiento', codigo: 'P-10',
      nombre: 'Estrechamiento de calzada', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y dos líneas verticales que se estrechan.',
      significado: 'Advierte de un estrechamiento de la calzada por ambos lados. Extremar la precaución y reducir la velocidad.',
      imagen: '/senales/p10.svg'
    },
    {
      id: 'estrechamiento-derecha', codigo: 'P-10a',
      nombre: 'Estrechamiento de calzada por la derecha', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y dos líneas que se estrechan por el lado derecho.',
      significado: 'Advierte de un estrechamiento de la calzada por el lado derecho.',
      imagen: '/senales/estrechamiento-derecha.svg'
    },
    {
      id: 'estrechamiento-izquierda', codigo: 'P-11',
      nombre: 'Estrechamiento de calzada por la izquierda', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y dos líneas que se estrechan por el lado izquierdo.',
      significado: 'Advierte de un estrechamiento de la calzada por el lado izquierdo.',
      imagen: '/senales/estrechamiento-izquierda.svg'
    },
    {
      id: 'pavimento-deslizante', codigo: 'P-13',
      nombre: 'Pavimento deslizante', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de pavimento mojado o deslizante.',
      significado: 'Advierte de que el pavimento puede resultar especialmente deslizante por lluvia, barro o aceite. Reducir la velocidad y aumentar la distancia de seguridad.',
      imagen: '/senales/p13.svg'
    },
    {
      id: 'gravilla', codigo: 'P-14',
      nombre: 'Proyección de gravilla', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de gravilla en negro.',
      significado: 'Advierte de la posible proyección de gravilla por la circulación de vehículos. Reducir la velocidad y aumentar la distancia de seguridad.',
      imagen: '/senales/p14.svg'
    },
    {
      id: 'desprendimiento', codigo: 'P-15',
      nombre: 'Desprendimiento', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y piedras cayendo en negro.',
      significado: 'Advierte de un tramo con riesgo de desprendimiento de piedras o materiales de la ladera.',
      imagen: '/senales/p20a.svg'
    },
    {
      id: 'puente-movil', codigo: 'P-16',
      nombre: 'Puente móvil', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un puente levadizo en negro.',
      significado: 'Advierte de la proximidad de un puente móvil o levadizo.',
      imagen: '/senales/p16.svg'
    },
    {
      id: 'paso-peatones', codigo: 'P-20',
      nombre: 'Paso de peatones', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y la silueta de un peatón cruzando en negro.',
      significado: 'Advierte de la proximidad de un paso de peatones señalizado.',
      imagen: '/senales/p20.svg'
    },
    {
      id: 'ciclistas', codigo: 'P-21',
      nombre: 'Ciclistas', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y la silueta de un ciclista en negro.',
      significado: 'Advierte de la proximidad de un paso para ciclistas o de un tramo donde los ciclistas tienen prioridad.',
      imagen: '/senales/p21.svg'
    },
    {
      id: 'ninos', codigo: 'P-23',
      nombre: 'Niños', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y la silueta de dos niños corriendo en negro.',
      significado: 'Advierte de la proximidad de un lugar frecuentado por niños, como escuelas, parques o zonas residenciales.',
      imagen: '/senales/p23.svg'
    },
    {
      id: 'animales-libres', codigo: 'P-24',
      nombre: 'Animales en libertad', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y la silueta de un animal en negro.',
      significado: 'Advierte de la posible presencia de animales en libertad en la vía. Extremar la precaución, especialmente en zonas de pastoreo o montaña.',
      imagen: '/senales/p24.svg'
    },
    {
      id: 'senal-obra', codigo: 'P-50',
      nombre: 'Obras', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un obrero trabajando en negro.',
      significado: 'Advierte de la proximidad de obras o trabajos en la vía. Reducir la velocidad y prestar atención a la señalización temporal.',
      imagen: '/senales/p50.svg'
    },
    {
      id: 'viento-transversal', codigo: 'P-30',
      nombre: 'Viento transversal', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de viento en negro.',
      significado: 'Advierte de un tramo con fuertes rachas de viento transversal. Reducir la velocidad y sujetar firmemente el volante.',
      imagen: '/senales/p29.svg'
    },
    {
      id: 'hielo-nieve', codigo: 'P-28',
      nombre: 'Hielo o nieve', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un copo de nieve en negro.',
      significado: 'Advierte de la posibilidad de encontrar hielo o nieve en la calzada. Extremar la precaución, reducir la velocidad y evitar frenazos bruscos.',
      imagen: '/senales/p28.svg'
    },
    {
      id: 'prohibido-paso', codigo: 'R-100',
      nombre: 'Circulación prohibida', categoria: 'Prohibición',
      descripcion: 'Señal circular de fondo rojo con una franja horizontal blanca en el centro.',
      significado: 'Prohibición de acceso a toda clase de vehículos en ambos sentidos. Prohíbe la circulación en la vía señalizada.',
      imagen: '/senales/r100.svg'
    },
    {
      id: 'senal-prohibido-camiones', codigo: 'R-106',
      nombre: 'Prohibición camiones', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un camión en negro.',
      significado: 'Prohibición de circulación de camiones con masa máxima autorizada superior a la indicada en la señal.',
      imagen: '/senales/r106.svg'
    },
    {
      id: 'velocidad-maxima', codigo: 'R-301',
      nombre: 'Velocidad máxima', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un número en negro que indica los km/h máximos.',
      significado: 'Prohibición de superar la velocidad máxima indicada en km/h. Rige desde la señal hasta que se indique lo contrario.',
      imagen: '/senales/r301.svg'
    },
    {
      id: 'prohibido-adelantar', codigo: 'R-302',
      nombre: 'Prohibido adelantar', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y dos coches en negro y rojo.',
      significado: 'Prohibición de adelantar a cualquier vehículo que circule por la calzada, salvo motocicletas de dos ruedas.',
      imagen: '/senales/r305.svg'
    },
    {
      id: 'prohibido-estacionar', codigo: 'R-308',
      nombre: 'Prohibido estacionar', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo, una letra E mayúscula tachada por una diagonal roja.',
      significado: 'Prohíbe el estacionamiento en el tramo de vía señalizado. No afecta a la parada o detención.',
      imagen: '/senales/r308.svg'
    },
    {
      id: 'prohibido-detener', codigo: 'R-307',
      nombre: 'Prohibido detenerse', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y dos barras cruzadas en diagonal de color rojo.',
      significado: 'Prohíbe detenerse y estacionar en el tramo de vía señalizado.',
      imagen: '/senales/r307.svg'
    },
    {
      id: 'prohibido-motos', codigo: 'R-102',
      nombre: 'Entrada prohibida a motocicletas', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y la silueta de una motocicleta en negro.',
      significado: 'Prohíbe el acceso a motocicletas de dos o tres ruedas.',
      imagen: '/senales/r104.svg'
    },
    {
      id: 'prohibido-bicicletas', codigo: 'R-104',
      nombre: 'Entrada prohibida a bicicletas', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y la silueta de una bicicleta en negro.',
      significado: 'Prohíbe el acceso a bicicletas y ciclomotores de dos ruedas.',
      imagen: '/senales/r114.svg'
    },
    {
      id: 'prohibido-peatones', codigo: 'R-107',
      nombre: 'Entrada prohibida a peatones', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y la silueta de un peatón en negro.',
      significado: 'Prohíbe el acceso a peatones.',
      imagen: '/senales/r116.svg'
    },
    {
      id: 'prohibido-girar-derecha', codigo: 'R-119',
      nombre: 'Prohibido girar a la derecha', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y una flecha negra curvada hacia la derecha tachada.',
      significado: 'Prohíbe cambiar de dirección hacia la derecha en la próxima intersección.',
      imagen: '/senales/r302.svg'
    },
    {
      id: 'prohibido-girar-izquierda', codigo: 'R-120',
      nombre: 'Prohibido girar a la izquierda', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y una flecha negra curvada hacia la izquierda tachada.',
      significado: 'Prohíbe cambiar de dirección hacia la izquierda en la próxima intersección.',
      imagen: '/senales/r303.svg'
    },
    {
      id: 'limitacion-altura', codigo: 'R-115',
      nombre: 'Limitación de altura', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un número que indica la altura máxima en metros.',
      significado: 'Prohíbe la circulación de vehículos con altura superior a la indicada.',
      imagen: '/senales/r205.svg'
    },
    {
      id: 'limitacion-anchura', codigo: 'R-116',
      nombre: 'Limitación de anchura', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un número que indica la anchura máxima en metros.',
      significado: 'Prohíbe la circulación de vehículos con anchura superior a la indicada.',
      imagen: '/senales/r204.svg'
    },
    {
      id: 'limitacion-masa', codigo: 'R-114',
      nombre: 'Limitación de masa', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un número que indica la masa máxima en toneladas.',
      significado: 'Prohíbe la circulación de vehículos con masa superior a la indicada.',
      imagen: '/senales/r201.svg'
    },
    {
      id: 'limitacion-longitud', codigo: 'R-117',
      nombre: 'Limitación de longitud', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un número que indica la longitud máxima en metros.',
      significado: 'Prohíbe la circulación de vehículos o conjuntos de vehículos con longitud superior a la indicada.',
      imagen: '/senales/r203.svg'
    },
    {
      id: 'prohibido-senal-acustica', codigo: 'R-200',
      nombre: 'Prohibido señales acústicas', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y una bocina tachada en negro.',
      significado: 'Prohíbe el uso del claxon o señales acústicas, salvo en caso de peligro inminente.',
      imagen: '/senales/r310.svg'
    },
    {
      id: 'direccion-obligatoria', codigo: 'R-400',
      nombre: 'Dirección obligatoria', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha blanca indicando la dirección.',
      significado: 'Obligación de seguir la dirección indicada por la flecha. Puede indicar una o varias direcciones.',
      imagen: '/senales/r400a.svg'
    },
    {
      id: 'velocidad-minima', codigo: 'R-412',
      nombre: 'Velocidad mínima', categoria: 'Obligación',
      descripcion: 'Señal circular azul con un número blanco indicando la velocidad en km/h.',
      significado: 'Obligación de circular al menos a la velocidad indicada, sin superar la velocidad máxima genérica.',
      imagen: '/senales/r411.svg'
    },
    {
      id: 'circulacion-giratoria', codigo: 'R-413',
      nombre: 'Circulación giratoria obligatoria', categoria: 'Obligación',
      descripcion: 'Señal circular azul con tres flechas blancas formando un círculo en el sentido de las agujas del reloj.',
      significado: 'Obliga a circular en el sentido indicado por las flechas. Indica una glorieta o sentido giratorio obligatorio.',
      imagen: '/senales/r402.svg'
    },
    {
      id: 'pasar-izquierda', codigo: 'R-401',
      nombre: 'Pasar por la izquierda', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha blanca oblicua hacia la izquierda.',
      significado: 'Obligación de pasar por el lado izquierdo del obstáculo o de la isleta.',
      imagen: '/senales/r401a.svg'
    },
    {
      id: 'pasar-derecha', codigo: 'R-402',
      nombre: 'Pasar por la derecha', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha blanca oblicua hacia la derecha.',
      significado: 'Obligación de pasar por el lado derecho del obstáculo o de la isleta.',
      imagen: '/senales/r401b.svg'
    },
    {
      id: 'interseccion-giratoria', codigo: 'R-403',
      nombre: 'Intersección de sentido giratorio', categoria: 'Obligación',
      descripcion: 'Señal circular azul con tres flechas blancas formando un círculo.',
      significado: 'Obliga a circular en el sentido indicado por las flechas alrededor de una plaza o glorieta.',
      imagen: '/senales/r402.svg'
    },
    {
      id: 'calzada-sentido-unico', codigo: 'R-404',
      nombre: 'Calzada de sentido único', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha blanca vertical hacia arriba.',
      significado: 'Obligación de circular en el sentido indicado por la flecha. Vía de sentido único.',
      imagen: '/senales/r404.svg'
    },
    {
      id: 'autopista', codigo: 'S-1',
      nombre: 'Autopista', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con el símbolo de un puente y dos carriles en blanco.',
      significado: 'Indica el inicio de una autopista. Aplican las normas específicas de circulación por autopista.',
      imagen: '/senales/s1.svg'
    },
    {
      id: 'autovia', codigo: 'S-2',
      nombre: 'Autovía', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con el símbolo de un puente y dos carriles en blanco, similar a autopista.',
      significado: 'Indica el inicio de una autovía. Aplican las normas específicas de circulación por autovía.',
      imagen: '/senales/s1a.svg'
    },
    {
      id: 'tunel', codigo: 'S-5',
      nombre: 'Túnel', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con el símbolo de un túnel en blanco.',
      significado: 'Indica la proximidad o el inicio de un túnel. Extremar la precaución, encender las luces de cruce.',
      imagen: '/senales/s5.svg'
    },
    {
      id: 'calle-sin-salida', codigo: 'S-13',
      nombre: 'Calle sin salida', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con un rectángulo blanco en su interior y una barra roja transversal.',
      significado: 'Indica que la vía a la que se aproxima no tiene salida.',
      imagen: '/senales/s15a.svg'
    },
    {
      id: 'calle-residencial', codigo: 'S-29',
      nombre: 'Calle residencial', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con una casa, un niño y un balón blancos.',
      significado: 'Indica una zona de circulación residencial donde los peatones tienen prioridad y la velocidad máxima es de 20 km/h.',
      imagen: '/senales/s28.svg'
    },
    {
      id: 'zona-peatonal', codigo: 'S-30',
      nombre: 'Zona peatonal', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con un peatón y un niño blancos.',
      significado: 'Indica una zona peatonal de circulación prohibida para vehículos.',
      imagen: '/senales/s30a.svg'
    },
    {
      id: 'carril-bici', codigo: 'S-32',
      nombre: 'Carril bici', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con una bicicleta blanca.',
      significado: 'Indica un carril reservado para bicicletas.',
      imagen: '/senales/s35.svg'
    },
    {
      id: 'gasolinera', codigo: 'S-11',
      nombre: 'Gasolinera', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con un símbolo blanco de un surtidor de combustible.',
      significado: 'Indica la proximidad de una estación de servicio o gasolinera.',
      imagen: '/senales/s105.svg'
    },
    {
      id: 'aparcamiento', codigo: 'S-25',
      nombre: 'Aparcamiento', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una letra P mayúscula blanca.',
      significado: 'Indica la ubicación de un aparcamiento público.',
      imagen: '/senales/s17.svg'
    },
    {
      id: 'hospital', codigo: 'S-7',
      nombre: 'Hospital', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una H mayúscula blanca y una cruz blanca.',
      significado: 'Indica la proximidad de un hospital o centro sanitario.',
      imagen: '/senales/s23.svg'
    },
    {
      id: 'taller', codigo: 'S-9',
      nombre: 'Taller de reparación', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una llave inglesa blanca.',
      significado: 'Indica la proximidad de un taller de reparación de vehículos.',
      imagen: '/senales/s103.svg'
    },
    {
      id: 'telefono-socorro', codigo: 'S-10',
      nombre: 'Teléfono de socorro', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con un teléfono blanco.',
      significado: 'Indica la ubicación de un teléfono de emergencia o socorro.',
      imagen: '/senales/s104.svg'
    },
    {
      id: 'camping', codigo: 'S-15',
      nombre: 'Camping', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con un símbolo de tienda de campaña blanca.',
      significado: 'Indica la ubicación de un camping o zona de acampada.',
      imagen: '/senales/s107.svg'
    },
    {
      id: 'area-descanso', codigo: 'S-14',
      nombre: 'Área de descanso', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con un banco y un árbol blancos.',
      significado: 'Indica la ubicación de un área de descanso o recreo.',
      imagen: '/senales/s123.svg'
    },
    {
      id: 'taxi', codigo: 'S-24',
      nombre: 'Taxi', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con la palabra TAXI en blanco.',
      significado: 'Indica la ubicación de una parada de taxis.',
      imagen: '/senales/s18.svg'
    },
    {
      id: 'fin-prioridad', codigo: 'R-4',
      nombre: 'Fin de prioridad', categoria: 'Prioridad',
      descripcion: 'Señal circular blanca con borde rojo y una franja negra horizontal. Sobre ella, una franja vertical negra.',
      significado: 'Indica el fin del tramo con prioridad. A partir de aquí se aplica la regla general de prioridad de paso.',
      imagen: '/senales/r4.svg'
    },
    {
      id: 'prioridad-sentido-contrario', codigo: 'R-5',
      nombre: 'Prioridad en sentido contrario', categoria: 'Prioridad',
      descripcion: 'Señal cuadrada blanca con borde azul, flecha roja gruesa hacia la derecha y flecha negra delgada hacia la izquierda.',
      significado: 'Indica que en el próximo tramo estrecho los vehículos que circulan en sentido contrario tienen prioridad.',
      imagen: '/senales/r5.svg'
    },
    {
      id: 'prioridad-sentido-directo', codigo: 'R-6',
      nombre: 'Prioridad respecto al sentido contrario', categoria: 'Prioridad',
      descripcion: 'Señal cuadrada blanca con borde azul, flecha negra gruesa hacia la derecha y flecha roja delgada hacia la izquierda.',
      significado: 'Indica que en el próximo tramo estrecho tenemos prioridad respecto a los vehículos en sentido contrario.',
      imagen: '/senales/r6.svg'
    },
    {
      id: 'interseccion-glorieta', codigo: 'P-4',
      nombre: 'Intersección con glorieta', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y tres flechas curvas negras formando un círculo.',
      significado: 'Advierte de una intersección donde la circulación se realiza de forma giratoria (glorieta).',
      imagen: '/senales/p1e.svg'
    },
    {
      id: 'puente-movil-alt', codigo: 'P-5',
      nombre: 'Puente móvil', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un puente levadizo en negro.',
      significado: 'Advierte de la proximidad de un puente móvil o levadizo que puede interrumpir la circulación.',
      imagen: '/senales/p5.svg'
    },
    {
      id: 'cruce-tranvia', codigo: 'P-6',
      nombre: 'Cruce de tranvía', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y una línea con un tranvía en negro.',
      significado: 'Advierte de un tramo donde la vía es cruzada por una línea de tranvía.',
      imagen: '/senales/p6.svg'
    },
    {
      id: 'paso-nivel-barreras', codigo: 'P-7',
      nombre: 'Paso a nivel con barreras', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y una valla o barrera en negro.',
      significado: 'Advierte de la proximidad de un paso a nivel provisto de barreras o semibarreras.',
      imagen: '/senales/p7.svg'
    },
    {
      id: 'paso-nivel-sin-barreras', codigo: 'P-8',
      nombre: 'Paso a nivel sin barreras', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y una locomotora en negro.',
      significado: 'Advierte de la proximidad de un paso a nivel sin barreras.',
      imagen: '/senales/p8.svg'
    },
    {
      id: 'proximidad-paso-nivel-dcha-1', codigo: 'P-9a',
      nombre: 'Proximidad de paso a nivel (derecha, 1/3)', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y tres barras rojas inclinadas descendentes hacia la derecha.',
      significado: 'Indica la proximidad de un paso a nivel a 240 metros (primera de tres señales).',
      imagen: '/senales/p9a.svg'
    },
    {
      id: 'proximidad-paso-nivel-dcha-2', codigo: 'P-9b',
      nombre: 'Proximidad de paso a nivel (derecha, 2/3)', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y dos barras rojas inclinadas descendentes hacia la derecha.',
      significado: 'Indica la proximidad de un paso a nivel a 160 metros (segunda de tres señales).',
      imagen: '/senales/p9b.svg'
    },
    {
      id: 'proximidad-paso-nivel-dcha-3', codigo: 'P-9c',
      nombre: 'Proximidad de paso a nivel (derecha, 3/3)', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y una barra roja inclinada descendente hacia la derecha.',
      significado: 'Indica la proximidad de un paso a nivel a 80 metros (tercera de tres señales).',
      imagen: '/senales/p9c.svg'
    },
    {
      id: 'proximidad-paso-nivel-izda-1', codigo: 'P-10a',
      nombre: 'Proximidad de paso a nivel (izquierda, 1/3)', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y tres barras rojas inclinadas descendentes hacia la izquierda.',
      significado: 'Indica la proximidad de un paso a nivel a 240 metros por la izquierda (primera de tres).',
      imagen: '/senales/p10a.svg'
    },
    {
      id: 'proximidad-paso-nivel-izda-2', codigo: 'P-10b',
      nombre: 'Proximidad de paso a nivel (izquierda, 2/3)', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y dos barras rojas inclinadas descendentes hacia la izquierda.',
      significado: 'Indica la proximidad de un paso a nivel a 160 metros por la izquierda (segunda de tres).',
      imagen: '/senales/p10b.svg'
    },
    {
      id: 'proximidad-paso-nivel-izda-3', codigo: 'P-10c',
      nombre: 'Proximidad de paso a nivel (izquierda, 3/3)', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y una barra roja inclinada descendente hacia la izquierda.',
      significado: 'Indica la proximidad de un paso a nivel a 80 metros por la izquierda (tercera de tres).',
      imagen: '/senales/p10c.svg'
    },
    {
      id: 'situacion-paso-nivel', codigo: 'P-11',
      nombre: 'Situación de un paso a nivel sin barreras', categoria: 'Peligro',
      descripcion: 'Señal con forma de cruz de San Andrés, blanca con borde rojo. Puede llevar barras indicando distancia.',
      significado: 'Señaliza el lugar exacto del paso a nivel sin barreras. Debe colocarse antes del cruce.',
      imagen: '/senales/p11.svg'
    },
    {
      id: 'situacion-paso-nivel-multiple', codigo: 'P-11a',
      nombre: 'Situación de paso a nivel de más de una vía', categoria: 'Peligro',
      descripcion: 'Señal con forma de cruz de San Andrés con dos barras rojas en los laterales.',
      significado: 'Indica un paso a nivel sin barreras que cruza más de una vía férrea.',
      imagen: '/senales/p11a.svg'
    },
    {
      id: 'aeropuerto', codigo: 'P-12',
      nombre: 'Aeropuerto', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un avión en negro.',
      significado: 'Advierte de la proximidad de un aeropuerto donde pueden producirse movimientos aéreos a baja altura.',
      imagen: '/senales/p12a.svg'
    },
    {
      id: 'perfil-irregular', codigo: 'P-15',
      nombre: 'Perfil irregular', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y una ondulación en negro.',
      significado: 'Advierte de un tramo de calzada con el perfil irregular (baches, ondulaciones).',
      imagen: '/senales/p15.svg'
    },
    {
      id: 'resalto', codigo: 'P-15a',
      nombre: 'Resalto', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un resalto en negro.',
      significado: 'Advierte de la proximidad de un resalto en la calzada (policía acostado).',
      imagen: '/senales/p15a.svg'
    },
    {
      id: 'baden', codigo: 'P-15b',
      nombre: 'Badén', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un badén en negro.',
      significado: 'Advierte de la proximidad de un badén o depresión en la calzada.',
      imagen: '/senales/p15b.svg'
    },
    {
      id: 'peatones-menores', codigo: 'P-21',
      nombre: 'Peatones menores (ancianos, niños, discapacitados)', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y siluetas de personas mayores o niños en negro.',
      significado: 'Advierte de un lugar frecuentado por peatones vulnerables como ancianos, niños o discapacitados.',
      imagen: '/senales/p21b.svg'
    },
    {
      id: 'animales-domesticos', codigo: 'P-23',
      nombre: 'Animales domésticos', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y la silueta de una vaca o animal doméstico en negro.',
      significado: 'Advierte de la posible presencia de animales domésticos en la vía.',
      imagen: '/senales/p25.svg'
    },
    {
      id: 'circulacion-doble-sentido', codigo: 'P-25',
      nombre: 'Circulación en dos sentidos', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y dos flechas verticales opuestas en negro.',
      significado: 'Advierte de que la calzada pasa a tener circulación en ambos sentidos.',
      imagen: '/senales/p25.svg'
    },
    {
      id: 'muelle', codigo: 'P-27',
      nombre: 'Muelle o embarcadero', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un peligro de caída al agua en negro.',
      significado: 'Advierte de la proximidad de un muelle o embarcadero. Peligro de caída al agua.',
      imagen: '/senales/p27.svg'
    },
    {
      id: 'escalon-lateral', codigo: 'P-30',
      nombre: 'Escalón lateral', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un escalón en negro.',
      significado: 'Advierte de un escalón lateral en la calzada por obras o desnivel.',
      imagen: '/senales/p30.svg'
    },
    {
      id: 'congestion', codigo: 'P-31',
      nombre: 'Congestión', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y tres vehículos alineados en negro.',
      significado: 'Advierte de la probabilidad de encontrar un tramo con circulación congestionada o retenciones.',
      imagen: '/senales/p31.svg'
    },
    {
      id: 'obstruccion-calzada', codigo: 'P-32',
      nombre: 'Obstrucción en la calzada', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un objeto en la calzada en negro.',
      significado: 'Advierte de la posible presencia de objetos u obstáculos en la calzada.',
      imagen: '/senales/p32.svg'
    },
    {
      id: 'pavimento-hielo-nieve', codigo: 'P-34',
      nombre: 'Pavimento deslizante por hielo o nieve', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y un copo de nieve sobre calzada en negro.',
      significado: 'Advierte de que el pavimento puede estar especialmente deslizante por hielo o nieve.',
      imagen: '/senales/p28.svg'
    },
    {
      id: 'incorporacion-derecha', codigo: 'P-1c',
      nombre: 'Intersección con incorporación por la derecha', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y una flecha curvada que se incorpora desde la derecha.',
      significado: 'Advierte de una intersección con un carril de incorporación desde la derecha.',
      imagen: '/senales/p1c.svg'
    },
    {
      id: 'incorporacion-izquierda', codigo: 'P-1d',
      nombre: 'Intersección con incorporación por la izquierda', categoria: 'Peligro',
      descripcion: 'Señal triangular con borde rojo, fondo blanco y una flecha curvada que se incorpora desde la izquierda.',
      significado: 'Advierte de una intersección con un carril de incorporación desde la izquierda.',
      imagen: '/senales/p1d.svg'
    },
    {
      id: 'entrada-prohibida', codigo: 'R-101',
      nombre: 'Entrada prohibida', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y una barra horizontal roja.',
      significado: 'Prohíbe la entrada a toda clase de vehículos. Se coloca en el lugar donde comienza la prohibición.',
      imagen: '/senales/r101.svg'
    },
    {
      id: 'prohibido-vehiculos-motor', codigo: 'R-102',
      nombre: 'Entrada prohibida a vehículos de motor', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y la silueta de un coche en negro.',
      significado: 'Prohíbe la entrada a vehículos de motor, excepto motocicletas de dos ruedas.',
      imagen: '/senales/r102.svg'
    },
    {
      id: 'prohibido-vehiculos-exc-motos', codigo: 'R-103',
      nombre: 'Entrada prohibida a vehículos de motor excepto motos', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un coche y una moto, con la moto no tachada.',
      significado: 'Prohíbe la entrada a vehículos de motor, excepto a motocicletas de dos ruedas sin sidecar.',
      imagen: '/senales/r103.svg'
    },
    {
      id: 'prohibido-ciclomotores', codigo: 'R-105',
      nombre: 'Entrada prohibida a ciclomotores', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y la silueta de un ciclomotor en negro.',
      significado: 'Prohíbe el acceso a ciclomotores de dos o tres ruedas.',
      imagen: '/senales/r105.svg'
    },
    {
      id: 'prohibido-mercancias', codigo: 'R-107',
      nombre: 'Entrada prohibida a vehículos de mercancías', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un camión con masa indicada en negro.',
      significado: 'Prohíbe la entrada a vehículos de mercancías con masa máxima autorizada superior a la indicada.',
      imagen: '/senales/r107.svg'
    },
    {
      id: 'prohibido-mercancias-peligrosas', codigo: 'R-108',
      nombre: 'Entrada prohibida a mercancías peligrosas', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un símbolo de peligro en negro.',
      significado: 'Prohíbe la entrada a vehículos que transporten mercancías peligrosas.',
      imagen: '/senales/r108.svg'
    },
    {
      id: 'prohibido-explosivos', codigo: 'R-109',
      nombre: 'Entrada prohibida a explosivos o inflamables', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un símbolo de explosión en negro.',
      significado: 'Prohíbe la entrada a vehículos que transporten materias explosivas o inflamables.',
      imagen: '/senales/r109.svg'
    },
    {
      id: 'prohibido-contaminantes-agua', codigo: 'R-110',
      nombre: 'Entrada prohibida a productos contaminantes del agua', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y una onda de agua tachada en negro.',
      significado: 'Prohíbe la entrada a vehículos que transporten productos contaminantes del agua.',
      imagen: '/senales/r110.svg'
    },
    {
      id: 'prohibido-agricolas', codigo: 'R-111',
      nombre: 'Entrada prohibida a vehículos agrícolas', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y la silueta de un tractor en negro.',
      significado: 'Prohíbe la entrada a vehículos agrícolas o de maquinaria agrícola.',
      imagen: '/senales/r111.svg'
    },
    {
      id: 'prohibido-remolque', codigo: 'R-112',
      nombre: 'Entrada prohibida a vehículos con remolque', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un coche con remolque en negro.',
      significado: 'Prohíbe la entrada a vehículos que arrastren un remolque de cualquier tipo.',
      imagen: '/senales/r112.svg'
    },
    {
      id: 'prohibido-traccion-animal', codigo: 'R-113',
      nombre: 'Entrada prohibida a vehículos de tracción animal', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un carro de tracción animal en negro.',
      significado: 'Prohíbe la entrada a vehículos de tracción animal.',
      imagen: '/senales/r113.svg'
    },
    {
      id: 'prohibido-carros-mano', codigo: 'R-115',
      nombre: 'Entrada prohibida a carros de mano', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un carro de mano en negro.',
      significado: 'Prohíbe la entrada a carros de mano o vehículos de arrastre manual.',
      imagen: '/senales/r115.svg'
    },
    {
      id: 'prohibido-animales-montura', codigo: 'R-117',
      nombre: 'Entrada prohibida a animales de montura', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un jinete a caballo en negro.',
      significado: 'Prohíbe la entrada a animales de montura o cabalgaduras.',
      imagen: '/senales/r117.svg'
    },
    {
      id: 'prohibido-vmp', codigo: 'R-118',
      nombre: 'Entrada prohibida a vehículos de movilidad personal', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y la silueta de un patinete eléctrico en negro.',
      significado: 'Prohíbe la entrada a vehículos de movilidad personal (VMP) como patinetes eléctricos.',
      imagen: '/senales/r118.svg'
    },
    {
      id: 'prohibido-vmp-ciclos', codigo: 'R-119',
      nombre: 'Entrada prohibida a VMP y ciclos', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo con un patinete y una bicicleta tachados.',
      significado: 'Prohíbe la entrada a vehículos de movilidad personal y a ciclos.',
      imagen: '/senales/r119.svg'
    },
    {
      id: 'prohibido-distintivo-ambiental', codigo: 'R-120',
      nombre: 'Entrada prohibida por distintivo ambiental', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un círculo verde con etiqueta ambiental.',
      significado: 'Prohíbe la entrada a vehículos que no cuenten con el distintivo ambiental indicado.',
      imagen: '/senales/r120.svg'
    },
    {
      id: 'prohibido-pasar-sin-detener', codigo: 'R-200',
      nombre: 'Prohibición de pasar sin detenerse', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y las letras STOP en rojo.',
      significado: 'Obligación de detenerse antes de la línea de detención. Similar a la señal STOP.',
      imagen: '/senales/stop.svg'
    },
    {
      id: 'limitacion-masa-eje', codigo: 'R-202',
      nombre: 'Limitación de masa por eje', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un eje con rueda y masa indicada en negro.',
      significado: 'Prohíbe la circulación de vehículos cuya masa por eje supere la indicada.',
      imagen: '/senales/r202.svg'
    },
    {
      id: 'separacion-minima', codigo: 'R-300',
      nombre: 'Separación mínima', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y un coche y otro con distancia en negro.',
      significado: 'Obligación de mantener una distancia mínima de seguridad entre vehículos.',
      imagen: '/senales/r300.svg'
    },
    {
      id: 'prohibido-adelantar-camiones', codigo: 'R-306',
      nombre: 'Prohibición de adelantar para camiones', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde rojo y dos camiones en negro y rojo.',
      significado: 'Prohíbe a camiones de más de 3.500 kg adelantar. No afecta a turismos ni motos.',
      imagen: '/senales/r306.svg'
    },
    {
      id: 'zona-estacionamiento-limitado', codigo: 'R-309',
      nombre: 'Zona de estacionamiento limitado', categoria: 'Prohibición',
      descripcion: 'Señal circular azul con una S blanca y borde rojo con icono de disco.',
      significado: 'Indica zona de estacionamiento regulado con limitación horaria (zona azul o verde).',
      imagen: '/senales/r309.svg'
    },
    {
      id: 'sentido-obligatorio-recto', codigo: 'R-400a',
      nombre: 'Sentido obligatorio (recto)', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha blanca hacia arriba.',
      significado: 'Obligación de seguir recto en la próxima intersección.',
      imagen: '/senales/r400a.svg'
    },
    {
      id: 'sentido-obligatorio-derecha', codigo: 'R-400b',
      nombre: 'Sentido obligatorio (derecha)', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha blanca curvada hacia la derecha.',
      significado: 'Obligación de girar a la derecha en la próxima intersección.',
      imagen: '/senales/r400b.svg'
    },
    {
      id: 'sentido-obligatorio-izquierda', codigo: 'R-400c',
      nombre: 'Sentido obligatorio (izquierda)', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha blanca curvada hacia la izquierda.',
      significado: 'Obligación de girar a la izquierda en la próxima intersección.',
      imagen: '/senales/r400c.svg'
    },
    {
      id: 'sentido-obligatorio-recto-derecha', codigo: 'R-400d',
      nombre: 'Sentido obligatorio (recto o derecha)', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha hacia arriba y otra curvada hacia la derecha.',
      significado: 'Obligación de seguir recto o girar a la derecha.',
      imagen: '/senales/r400d.svg'
    },
    {
      id: 'sentido-obligatorio-recto-izquierda', codigo: 'R-400e',
      nombre: 'Sentido obligatorio (recto o izquierda)', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha hacia arriba y otra curvada hacia la izquierda.',
      significado: 'Obligación de seguir recto o girar a la izquierda.',
      imagen: '/senales/r400e.svg'
    },
    {
      id: 'paso-obligatorio-izquierda', codigo: 'R-401a',
      nombre: 'Paso obligatorio (izquierda)', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha blanca oblicua hacia la izquierda.',
      significado: 'Obligación de pasar por el lado izquierdo de un obstáculo en la calzada.',
      imagen: '/senales/r401a.svg'
    },
    {
      id: 'paso-obligatorio-derecha', codigo: 'R-401b',
      nombre: 'Paso obligatorio (derecha)', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha blanca oblicua hacia la derecha.',
      significado: 'Obligación de pasar por el lado derecho de un obstáculo en la calzada.',
      imagen: '/senales/r401b.svg'
    },
    {
      id: 'paso-obligatorio-ambos', codigo: 'R-401c',
      nombre: 'Paso obligatorio (ambos lados)', categoria: 'Obligación',
      descripcion: 'Señal circular azul con dos flechas blancas oblicuas divergentes.',
      significado: 'Indica que se puede pasar por cualquier lado de un obstáculo.',
      imagen: '/senales/r401c.svg'
    },
    {
      id: 'rotonda-obligatoria', codigo: 'R-402',
      nombre: 'Rotonda', categoria: 'Obligación',
      descripcion: 'Señal circular azul con tres flechas blancas curvas formando un círculo.',
      significado: 'Obliga a circular en el sentido indicado alrededor de una glorieta.',
      imagen: '/senales/r402.svg'
    },
    {
      id: 'direcciones-permitidas-1', codigo: 'R-403a',
      nombre: 'Únicas direcciones permitidas (derecha)', categoria: 'Obligación',
      descripcion: 'Señal circular azul con una flecha blanca curvada hacia la derecha.',
      significado: 'Indica las únicas direcciones permitidas en la intersección.',
      imagen: '/senales/r403a.svg'
    },
    {
      id: 'direcciones-permitidas-2', codigo: 'R-403b',
      nombre: 'Únicas direcciones permitidas (derecha y recto)', categoria: 'Obligación',
      descripcion: 'Señal circular azul con dos flechas blancas: recto y derecha.',
      significado: 'Únicas direcciones permitidas: seguir recto y girar a la derecha.',
      imagen: '/senales/r403b.svg'
    },
    {
      id: 'direcciones-permitidas-3', codigo: 'R-403c',
      nombre: 'Únicas direcciones permitidas (izquierda y recto)', categoria: 'Obligación',
      descripcion: 'Señal circular azul con dos flechas blancas: recto e izquierda.',
      significado: 'Únicas direcciones permitidas: seguir recto y girar a la izquierda.',
      imagen: '/senales/r403c.svg'
    },
    {
      id: 'calzada-obligatoria-motos', codigo: 'R-405',
      nombre: 'Calzada obligatoria para motocicletas', categoria: 'Obligación',
      descripcion: 'Señal circular azul con la silueta blanca de una motocicleta.',
      significado: 'Obliga a los conductores de motocicletas a circular por la calzada indicada.',
      imagen: '/senales/r405.svg'
    },
    {
      id: 'calzada-obligatoria-camiones', codigo: 'R-406',
      nombre: 'Calzada obligatoria para camiones', categoria: 'Obligación',
      descripcion: 'Señal circular azul con la silueta blanca de un camión.',
      significado: 'Obliga a los conductores de camiones a circular por la calzada indicada.',
      imagen: '/senales/r406.svg'
    },
    {
      id: 'via-obligatoria-ciclos', codigo: 'R-407a',
      nombre: 'Vía obligatoria para ciclos', categoria: 'Obligación',
      descripcion: 'Señal circular azul con la silueta blanca de una bicicleta.',
      significado: 'Obliga a los conductores de bicicletas a circular por la vía indicada.',
      imagen: '/senales/r407a.svg'
    },
    {
      id: 'cadenas-nieve-obligatorio', codigo: 'R-412',
      nombre: 'Cadenas para nieve obligatorias', categoria: 'Obligación',
      descripcion: 'Señal circular azul con un neumático blanco con cadenas en negro.',
      significado: 'Obligación de usar cadenas o neumáticos especiales para circular con hielo o nieve.',
      imagen: '/senales/r412.svg'
    },
    {
      id: 'alumbrado-corto-obligatorio', codigo: 'R-413',
      nombre: 'Alumbrado de corto alcance obligatorio', categoria: 'Obligación',
      descripcion: 'Señal circular azul con un faro blanco proyectando luz hacia abajo.',
      significado: 'Obligación de encender el alumbrado de corto alcance en el tramo señalizado.',
      imagen: '/senales/r413.svg'
    },
    {
      id: 'fin-prohibiciones', codigo: 'R-500',
      nombre: 'Fin de prohibiciones', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde negro y una franja negra diagonal descendente.',
      significado: 'Indica el fin de todas las prohibiciones de carácter temporal establecidas.',
      imagen: '/senales/r500.svg'
    },
    {
      id: 'fin-velocidad-maxima', codigo: 'R-501',
      nombre: 'Fin de limitación de velocidad', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde negro y franja negra diagonal, sin número.',
      significado: 'Fin de la limitación de velocidad. Rige la velocidad genérica de la vía.',
      imagen: '/senales/r501.svg'
    },
    {
      id: 'fin-adelantamiento', codigo: 'R-502',
      nombre: 'Fin de prohibición de adelantamiento', categoria: 'Prohibición',
      descripcion: 'Señal circular blanca con borde negro y franja negra diagonal.',
      significado: 'Fin de la prohibición de adelantar. A partir de aquí se permite adelantar.',
      imagen: '/senales/r502.svg'
    },
    {
      id: 'fin-autopista', codigo: 'S-2',
      nombre: 'Fin de autopista', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con el símbolo de autopista tachado por barra roja diagonal.',
      significado: 'Indica el final de la autopista. Se aplican normas de vía convencional.',
      imagen: '/senales/s2.svg'
    },
    {
      id: 'fin-autovia', codigo: 'S-2a',
      nombre: 'Fin de autovía', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con el símbolo de autovía tachado por barra roja diagonal.',
      significado: 'Indica el final de la autovía. Se aplican normas de vía convencional.',
      imagen: '/senales/s2a.svg'
    },
    {
      id: 'via-reservada-automoviles', codigo: 'S-3',
      nombre: 'Vía reservada para automóviles', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con un automóvil blanco visto de frente.',
      significado: 'Vía reservada exclusivamente para la circulación de automóviles.',
      imagen: '/senales/s3.svg'
    },
    {
      id: 'fin-via-reservada', codigo: 'S-4',
      nombre: 'Fin de vía reservada para automóviles', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con el símbolo de automóvil tachado en rojo.',
      significado: 'Final de la vía reservada para automóviles.',
      imagen: '/senales/s4.svg'
    },
    {
      id: 'velocidad-aconsejada', codigo: 'S-7',
      nombre: 'Velocidad máxima aconsejada', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con un número blanco sin borde rojo.',
      significado: 'Velocidad máxima orientativa recomendada (no obligatoria).',
      imagen: '/senales/s7.svg'
    },
    {
      id: 'fin-velocidad-aconsejada', codigo: 'S-8',
      nombre: 'Fin de velocidad máxima aconsejada', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con el número de velocidad tachado en gris.',
      significado: 'Fin del tramo de velocidad máxima aconsejada.',
      imagen: '/senales/s8.svg'
    },
    {
      id: 'calzada-carril-unico', codigo: 'S-11',
      nombre: 'Calzada de un carril sentido único', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con una flecha blanca vertical.',
      significado: 'Un solo carril en sentido único de circulación.',
      imagen: '/senales/s11.svg'
    },
    {
      id: 'calzada-dos-carriles', codigo: 'S-11a',
      nombre: 'Calzada de dos carriles sentido único', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con dos flechas blancas verticales.',
      significado: 'Dos carriles en el mismo sentido de circulación.',
      imagen: '/senales/s11a.svg'
    },
    {
      id: 'calzada-tres-carriles', codigo: 'S-11b',
      nombre: 'Calzada de tres carriles sentido único', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con tres flechas blancas verticales.',
      significado: 'Tres carriles en el mismo sentido de circulación.',
      imagen: '/senales/s11b.svg'
    },
    {
      id: 'tramo-sentido-unico', codigo: 'S-12',
      nombre: 'Tramo de calzada sentido único', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con una flecha blanca vertical y línea horizontal.',
      significado: 'El tramo de calzada que se inicia es de sentido único.',
      imagen: '/senales/s12.svg'
    },
    {
      id: 'paso-superior-peatones', codigo: 'S-14a',
      nombre: 'Paso superior para peatones', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con peatón subiendo escaleras en blanco.',
      significado: 'Ubicación de un paso elevado o pasarela para peatones.',
      imagen: '/senales/s14a.svg'
    },
    {
      id: 'paso-inferior-peatones', codigo: 'S-14b',
      nombre: 'Paso inferior para peatones', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con peatón bajando escaleras en blanco.',
      significado: 'Ubicación de un paso subterráneo para peatones.',
      imagen: '/senales/s14b.svg'
    },
    {
      id: 'frenado-emergencia', codigo: 'S-16',
      nombre: 'Zona de frenado de emergencia', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con un coche frenando sobre superficie inclinada.',
      significado: 'Zona de frenado de emergencia para vehículos con fallo en los frenos.',
      imagen: '/senales/s16.svg'
    },
    {
      id: 'estacionamiento-s17', codigo: 'S-17',
      nombre: 'Estacionamiento', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con una letra P mayúscula blanca.',
      significado: 'Ubicación de un estacionamiento público autorizado.',
      imagen: '/senales/s17.svg'
    },
    {
      id: 'parada-autobuses', codigo: 'S-19',
      nombre: 'Parada de autobuses', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con un autobús blanco.',
      significado: 'Ubicación de una parada de autobuses o transporte colectivo.',
      imagen: '/senales/s19.svg'
    },
    {
      id: 'parada-tranvia', codigo: 'S-20',
      nombre: 'Parada de tranvía', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con un tranvía blanco.',
      significado: 'Ubicación de una parada de tranvía.',
      imagen: '/senales/s20.svg'
    },
    {
      id: 'fin-alumbrado-corto', codigo: 'S-24',
      nombre: 'Fin de alumbrado de corto alcance', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con el faro de cruce tachado en rojo.',
      significado: 'Fin de la obligación de llevar el alumbrado de corto alcance encendido.',
      imagen: '/senales/s24.svg'
    },
    {
      id: 'cambio-sentido-distinto-nivel', codigo: 'S-25',
      nombre: 'Cambio de sentido a distinto nivel', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con una flecha en U sobre un puente en blanco.',
      significado: 'Proximidad de un cambio de sentido a distinto nivel (paso superior o inferior).',
      imagen: '/senales/s25.svg'
    },
    {
      id: 'zona-juego-infantil', codigo: 'S-28',
      nombre: 'Zona de estancia y juegos infantiles', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con un columpio o tobogán blanco.',
      significado: 'Zona de juegos infantiles donde los peatones tienen prioridad.',
      imagen: '/senales/s28.svg'
    },
    {
      id: 'fin-zona-juego', codigo: 'S-29',
      nombre: 'Fin de zona de estancia y juegos', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con el símbolo de juego tachado en rojo.',
      significado: 'Final de la zona de estancia y juegos infantiles.',
      imagen: '/senales/s29.svg'
    },
    {
      id: 'telepeaje', codigo: 'S-32',
      nombre: 'Telepeaje', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con símbolo de ondas o dispositivo VIA-T.',
      significado: 'Carril exclusivo para vehículos con dispositivo de telepeaje.',
      imagen: '/senales/s32.svg'
    },
    {
      id: 'senda-ciclopeatonal', codigo: 'S-33',
      nombre: 'Senda ciclopeatonal', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con peatón y bicicleta separados por línea blanca.',
      significado: 'Senda compartida para peatones y ciclistas.',
      imagen: '/senales/s33.svg'
    },
    {
      id: 'apartadero', codigo: 'S-34',
      nombre: 'Apartadero', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con un vehículo en hueco lateral.',
      significado: 'Ubicación de un apartadero donde detenerse fuera de la calzada.',
      imagen: '/senales/s34.svg'
    },
    {
      id: 'apartadero-tunel', codigo: 'S-34a',
      nombre: 'Apartadero en túnel', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con vehículo en hueco lateral dentro de un túnel.',
      significado: 'Ubicación de un apartadero dentro de un túnel.',
      imagen: '/senales/s34a.svg'
    },
    {
      id: 'via-ciclos', codigo: 'S-35',
      nombre: 'Vía reservada para ciclos', categoria: 'Indicación',
      descripcion: 'Señal rectangular azul con una bicicleta blanca.',
      significado: 'Vía reservada para bicicletas y ciclomotores de dos ruedas.',
      imagen: '/senales/s35.svg'
    },
    {
      id: 'puesto-socorro', codigo: 'S-100',
      nombre: 'Puesto de socorro', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una cruz blanca.',
      significado: 'Ubicación de un puesto de socorro o primeros auxilios.',
      imagen: '/senales/s100.svg'
    },
    {
      id: 'base-ambulancia', codigo: 'S-101',
      nombre: 'Base de ambulancia', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una ambulancia blanca.',
      significado: 'Ubicación de una base de ambulancia o servicio sanitario de emergencia.',
      imagen: '/senales/s101.svg'
    },
    {
      id: 'itv', codigo: 'S-102',
      nombre: 'Inspección Técnica de Vehículos', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con las letras ITV en blanco.',
      significado: 'Ubicación de una estación de ITV.',
      imagen: '/senales/s102.svg'
    },
    {
      id: 'taller-servicio', codigo: 'S-103',
      nombre: 'Taller de reparación', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una llave inglesa blanca.',
      significado: 'Ubicación de un taller de reparación de vehículos.',
      imagen: '/senales/s103.svg'
    },
    {
      id: 'telefono-emergencia', codigo: 'S-104',
      nombre: 'Teléfono de emergencia', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con un teléfono blanco.',
      significado: 'Ubicación de un teléfono de emergencia o SOS.',
      imagen: '/senales/s104.svg'
    },
    {
      id: 'surtidor-carburante', codigo: 'S-105',
      nombre: 'Surtidor de carburante', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con un surtidor de combustible blanco.',
      significado: 'Ubicación de una estación de servicio.',
      imagen: '/senales/s105.svg'
    },
    {
      id: 'taller-y-surtidor', codigo: 'S-106',
      nombre: 'Taller y surtidor de carburante', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con llave y surtidor blancos.',
      significado: 'Taller con servicio de venta de carburante.',
      imagen: '/senales/s106.svg'
    },
    {
      id: 'campamento', codigo: 'S-107',
      nombre: 'Campamento', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una tienda de campaña blanca.',
      significado: 'Ubicación de un campamento o zona de acampada.',
      imagen: '/senales/s107.svg'
    },
    {
      id: 'agua-potable', codigo: 'S-108',
      nombre: 'Agua potable', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con un grifo o vaso de agua blanco.',
      significado: 'Ubicación de una fuente de agua potable.',
      imagen: '/senales/s108.svg'
    },
    {
      id: 'lugar-pintoresco', codigo: 'S-109',
      nombre: 'Lugar pintoresco', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con un paisaje o mirador blanco.',
      significado: 'Ubicación de un mirador o punto de interés paisajístico.',
      imagen: '/senales/s109.svg'
    },
    {
      id: 'hotel', codigo: 'S-110',
      nombre: 'Hotel o alojamiento', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una cama o edificio blanco.',
      significado: 'Ubicación de un hotel, hostal o alojamiento.',
      imagen: '/senales/s110.svg'
    },
    {
      id: 'restauracion', codigo: 'S-111',
      nombre: 'Restauración', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con tenedor y cuchillo blancos.',
      significado: 'Ubicación de un restaurante o establecimiento de comidas.',
      imagen: '/senales/s111.svg'
    },
    {
      id: 'cafeteria', codigo: 'S-112',
      nombre: 'Cafetería', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una taza blanca.',
      significado: 'Ubicación de una cafetería o bar.',
      imagen: '/senales/s112.svg'
    },
    {
      id: 'terreno-remolques-vivienda', codigo: 'S-113',
      nombre: 'Terreno para remolques-vivienda', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una caravana blanca.',
      significado: 'Terreno habilitado para estacionamiento de caravanas o remolques-vivienda.',
      imagen: '/senales/s113.svg'
    },
    {
      id: 'merendero', codigo: 'S-114',
      nombre: 'Merendero', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con mesa y banco blancos.',
      significado: 'Ubicación de un merendero o área de picnic.',
      imagen: '/senales/s114.svg'
    },
    {
      id: 'excursiones-pie', codigo: 'S-115',
      nombre: 'Excursiones a pie', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con un peatón andando blanco.',
      significado: 'Inicio de una ruta para excursiones a pie.',
      imagen: '/senales/s115.svg'
    },
    {
      id: 'camping-caravanas', codigo: 'S-116',
      nombre: 'Camping y caravanas', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con tienda y caravana blancas.',
      significado: 'Camping con zona para caravanas.',
      imagen: '/senales/s116.svg'
    },
    {
      id: 'albergue-juventud', codigo: 'S-117',
      nombre: 'Albergue de juventud', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una mochila o figura juvenil blanca.',
      significado: 'Ubicación de un albergue juvenil.',
      imagen: '/senales/s117.svg'
    },
    {
      id: 'informacion-turistica', codigo: 'S-118',
      nombre: 'Información turística', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una letra i blanca.',
      significado: 'Oficina de información turística.',
      imagen: '/senales/s118.svg'
    },
    {
      id: 'parque-natural', codigo: 'S-120',
      nombre: 'Parque natural', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con árbol y montaña blancos.',
      significado: 'Ubicación de un parque natural o espacio protegido.',
      imagen: '/senales/s120.svg'
    },
    {
      id: 'monumento', codigo: 'S-121',
      nombre: 'Monumento', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con una columna o estatua blanca.',
      significado: 'Ubicación de un monumento o edificio de interés.',
      imagen: '/senales/s121.svg'
    },
    {
      id: 'otros-servicios', codigo: 'S-122',
      nombre: 'Otros servicios', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con un signo de interrogación blanco.',
      significado: 'Otros servicios no especificados en señales anteriores.',
      imagen: '/senales/s122.svg'
    },
    {
      id: 'area-descanso-s123', codigo: 'S-123',
      nombre: 'Área de descanso', categoria: 'Servicio',
      descripcion: 'Señal rectangular azul con banco y árbol blancos.',
      significado: 'Ubicación de un área de descanso en la carretera.',
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
