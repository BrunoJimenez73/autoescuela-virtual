import { getDB } from './database';

/**
 * Preguntas oficiales publicadas por la DGT en la revista
 * "Tráfico y Seguridad Vial" (tests de abril 2025, junio 2025 y diciembre 2025).
 * Preguntas reales con su respuesta correcta oficial.
 */
export function seedPreguntasOficiales(): void {
  const db = getDB();

  const marca = db.prepare("SELECT 1 FROM seed_meta WHERE marca = 'preguntas_oficiales_v1'").get();
  if (marca) return;

  const temaMap: Record<string, number> = {};
  const temas = db.prepare('SELECT id, slug FROM temas').all() as { id: number; slug: string }[];
  for (const t of temas) {
    temaMap[t.slug] = t.id;
  }

  const selectExistente = db.prepare('SELECT 1 FROM preguntas WHERE texto = ?');

  const insertPregunta = db.prepare(
    'INSERT INTO preguntas (texto, opciones, indice_correcta, tema_id, dificultad, referencia_manual, explicacion, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  interface PreguntaOficial {
    texto: string;
    opciones: string[];
    indice_correcta: number;
    tema_slug: string;
    dificultad: number;
    referencia_manual: string;
    explicacion: string;
  }

  const preguntas: PreguntaOficial[] = [
    // =====================
    // TEST DICIEMBRE 2025
    // =====================
    {
      texto: 'A un turismo, ¿le está permitido circular si tiene roto el espejo retrovisor exterior izquierdo?',
      opciones: ['Sí, porque el retrovisor exterior izquierdo no es obligatorio', 'Solo si el vehículo tiene espejo retrovisor interior', 'No, cuando el conductor no pueda ver la circulación por detrás del vehículo'],
      indice_correcta: 2,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#retrovisores',
      explicacion: 'El turismo debe permitir al conductor ver la circulación por detrás. Si el retrovisor está roto y no se ve, no se debe circular.',
    },
    {
      texto: '¿Qué es un microsueño?',
      opciones: ['Un periodo de unos segundos durante el cual el conductor sueña mientras conduce', 'Un periodo de unos segundos durante el cual el conductor queda ligeramente dormido sin darse cuenta', 'Un periodo corto de descanso que el conductor realiza cuando siente fatiga'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#fatiga',
      explicacion: 'El microsueño es un episodio de unos segundos en el que el conductor se queda dormido sin apenas darse cuenta.',
    },
    {
      texto: 'En una retención en la que están los vehículos detenidos, ¿está permitido usar el teléfono móvil?',
      opciones: ['No, excepto en vías urbanas', 'Únicamente con un dispositivo de manos libres y sin usar auriculares', 'Sí, porque el vehículo no está en movimiento'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#movil',
      explicacion: 'Aunque el vehículo esté detenido en una retención, solo puede usarse el teléfono con un sistema de manos libres y sin auriculares.',
    },
    {
      texto: 'Una luz verde en forma de flecha apuntando hacia abajo en un semáforo de carril...',
      opciones: ['obliga a no abandonar el carril sobre el que está colocada', 'exime de la obligación de detenerse ante una luz roja circular', 'no exime de tener que cumplir las normas generales sobre prioridad de paso'],
      indice_correcta: 2,
      tema_slug: 'prioridad',
      dificultad: 2,
      referencia_manual: 'prioridad#semaforos',
      explicacion: 'La flecha verde hacia abajo autoriza a circular por el carril, pero no exime de cumplir las normas de prioridad.',
    },
    {
      texto: 'Entre la puesta y la salida del sol, ¿puede encender la luz de largo alcance en caso de niebla?',
      opciones: ['Sí, procurando no deslumbrar a otros usuarios de la vía', 'Solo en carreteras con un carril para cada sentido', 'No, está prohibido'],
      indice_correcta: 0,
      tema_slug: 'luces',
      dificultad: 2,
      referencia_manual: 'luces#niebla',
      explicacion: 'En caso de niebla puede usarse la luz de largo alcance fuera de poblado, sin deslumbrar a otros usuarios.',
    },
    {
      texto: 'En un paso para peatones, si no funciona el semáforo, ¿es obligatorio ceder el paso a los peatones que intenten cruzar?',
      opciones: ['Sí, porque los peatones tienen prioridad de paso', 'No, porque los vehículos tienen prioridad de paso', 'Solo si quien intenta cruzar es una fila de escolares'],
      indice_correcta: 0,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#peatones',
      explicacion: 'Los peatones tienen prioridad en los pasos de peatones, incluso si el semáforo no funciona.',
    },
    {
      texto: 'Un turismo con el distintivo ambiental clasificado como ECO, ¿está autorizado a circular por el carril VAO si su único ocupante es el conductor?',
      opciones: ['Sí, siempre que lleve el distintivo adhesivo en el parabrisas', 'No, salvo que por los paneles de mensaje variable se autorice su acceso', 'Sí, aunque no lleve el distintivo adhesivo'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#vado',
      explicacion: 'El carril VAO exige un número mínimo de ocupantes. Con un único ocupante no puede usarse, salvo autorización expresa.',
    },
    {
      texto: 'En las proximidades de vías de uso exclusivo de ciclos, ¿qué precauciones se deben tomar?',
      opciones: ['Hacer señales acústicas para indicar nuestra presencia', 'Moderar la velocidad y, si fuera preciso, detener el vehículo', 'Mantener la velocidad y estar atento a la señalización vertical'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#ciclistas',
      explicacion: 'Cerca de vías para ciclos hay que moderar la velocidad y detenerse si es preciso, pues los ciclistas son vulnerables.',
    },
    {
      texto: '¿Está permitido circular con un turismo por una vía en cuyo acceso está situada la señal de vía reservada para ciclos?',
      opciones: ['No, porque es una vía reservada para todos los vehículos de dos ruedas', 'No, porque es una vía reservada para ciclos', 'Sí, porque es una vía permitida para todos los vehículos, excepto ciclos'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#vias-reservadas',
      explicacion: 'La señal R-407 indica vía reservada para ciclos; está prohibida la entrada a cualquier otro vehículo.',
    },
    {
      texto: '¿Está permitido estacionar en doble fila?',
      opciones: ['Sí, siempre que el conductor no abandone el vehículo', 'No, en ningún caso', 'Solo cuando la duración del estacionamiento sea inferior a dos minutos'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#estacionamiento',
      explicacion: 'El estacionamiento en doble fila está totalmente prohibido; solo se permite la parada breve mientras el conductor permanezca.',
    },
    {
      texto: 'En una vía fuera de poblado en la que no exista zona peatonal ni arcén practicable, ¿está permitido que un peatón circule por la calzada?',
      opciones: ['Sí, siempre que tome las debidas precauciones', 'Solo si arrastra un vehículo de reducidas dimensiones', 'No'],
      indice_correcta: 0,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#peatones',
      explicacion: 'Si no hay arcén practicable ni zona peatonal, los peatones pueden circular por la calzada tomando precauciones.',
    },
    {
      texto: '¿Cuál es uno de los problemas que, por el deterioro de sus aptitudes psicofísicas, encuentran muchas personas mayores como peatones en las vías públicas?',
      opciones: ['Tienen mayor capacidad de orientación', 'No aprecian bien la velocidad a la que se acercan los vehículos', 'Los bordillos de las aceras están al mismo nivel que la calzada'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#peatones',
      explicacion: 'Las personas mayores suelen tener más dificultades para apreciar la velocidad y distancia de los vehículos que se aproximan.',
    },
    {
      texto: 'Acaba de comprar un turismo nuevo; ¿cuándo debe presentarlo a la primera inspección técnica reglamentaria?',
      opciones: ['A los cuatro años, a contar desde la fecha de compra', 'A los dos años, a contar desde la fecha de matriculación', 'A los cuatro años, a contar desde la fecha de matriculación'],
      indice_correcta: 2,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#itv',
      explicacion: 'Los turismos nuevos deben pasar su primera ITV a los cuatro años desde la fecha de matriculación.',
    },
    {
      texto: 'Si quiere abandonar una autovía, ¿en qué momento debe entrar en el carril de deceleración?',
      opciones: ['Lo antes posible', 'Es indiferente, en cualquier momento mientras la línea sea discontinua', 'Lo más tarde posible'],
      indice_correcta: 0,
      tema_slug: 'velocidad',
      dificultad: 1,
      referencia_manual: 'velocidad#autovia',
      explicacion: 'Hay que entrar en el carril de deceleración lo antes posible para reducir la velocidad sin estorbar.',
    },
    {
      texto: '¿Qué debe hacer si un vehículo de la policía de tráfico se sitúa detrás de usted y enciende un dispositivo con una luz roja destelleante hacia delante?',
      opciones: ['Detenerse donde sea más seguro', 'Continuar la marcha hasta el próximo control', 'Detenerse inmediatamente donde se encuentre'],
      indice_correcta: 0,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#policia',
      explicacion: 'Ante la señal de la policía, debe detenerse en el lugar más seguro posible, sin frenadas bruscas.',
    },
    // =====================
    // TEST JUNIO 2025
    // =====================
    {
      texto: 'De día es obligatorio encender el alumbrado correspondiente cuando se circule...',
      opciones: ['por un puente móvil', 'por un carril reservado a vehículos de alta ocupación (VAO)', 'por pasos inferiores o tramos de vía afectados por la señal Túnel'],
      indice_correcta: 2,
      tema_slug: 'luces',
      dificultad: 1,
      referencia_manual: 'luces#tuneles',
      explicacion: 'De día hay que encender el alumbrado al circular por túneles o tramos señalizados como túnel.',
    },
    {
      texto: 'Entre los siguientes tipos de señales, ¿cuál es el orden de prioridad?',
      opciones: ['Señales verticales, agentes y semáforos', 'Agentes, semáforos y señales verticales', 'Semáforos, agentes y señales verticales'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 2,
      referencia_manual: 'senales#prioridad',
      explicacion: 'Tienen prioridad los agentes; después los semáforos; y por último las señales verticales y horizontales.',
    },
    {
      texto: 'En general, bajo los efectos de la cocaína el conductor...',
      opciones: ['es inseguro e infravalora sus capacidades al volante', 'se concentra mejor, por lo que sus decisiones son más seguras', 'es competitivo e impulsivo'],
      indice_correcta: 2,
      tema_slug: 'alcohol',
      dificultad: 2,
      referencia_manual: 'alcohol#drogas',
      explicacion: 'La cocaína vuelve al conductor más competitivo e impulsivo, con una falsa sensación de seguridad.',
    },
    {
      texto: 'Las embarazadas, ¿están obligadas a utilizar el cinturón de seguridad?',
      opciones: ['Sí, como norma general', 'No, porque es peligroso para el feto', 'Solo si no les dificulta los movimientos para conducir'],
      indice_correcta: 0,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#cinturon',
      explicacion: 'Las embarazadas deben usar el cinturón de seguridad, colocando la banda abdominal bajo el abdomen.',
    },
    {
      texto: 'El calor afecta negativamente a las capacidades para conducir. Un conductor bajo sus efectos normalmente...',
      opciones: ['tarda más en reaccionar y es menos agresivo', 'tarda más en reaccionar y es más agresivo', 'tarda menos en reaccionar y es más agresivo'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#calor',
      explicacion: 'El calor aumenta el tiempo de reacción y favorece un comportamiento más agresivo e irritabilidad.',
    },
    {
      texto: 'Cuando la luz de marcha atrás esté averiada, ¿cómo debe indicar que va a dar marcha atrás?',
      opciones: ['Moviendo el brazo de arriba abajo', 'Con el brazo extendido y la palma de la mano hacia atrás', 'Advirtiéndolo con el claxon'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 2,
      referencia_manual: 'luces#marcha-atras',
      explicacion: 'Si la luz de marcha atrás no funciona, la maniobra se indica con el brazo extendido y la palma hacia atrás.',
    },
    {
      texto: 'En una vía interurbana con un carril por sentido, ¿dónde se colocará un ciclomotor para girar a la izquierda, si no existe carril específico?',
      opciones: ['En el eje de la calzada, sin invadir el carril de sentido contrario', 'En la parte central del carril por el que circule', 'A la derecha, fuera de la calzada siempre que sea posible'],
      indice_correcta: 2,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#giros',
      explicacion: 'Los ciclomotores deben girar a la izquierda colocándose a la derecha, fuera de la calzada si es posible.',
    },
    {
      texto: 'Para intentar evitar la aparición de la somnolencia durante la conducción es aconsejable dormir...',
      opciones: ['entre 5 y 7 horas diarias', 'menos horas de las necesarias para mantener el nivel de alerta', 'las horas suficientes para estar descansado, entre 7 y 9 horas'],
      indice_correcta: 2,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#fatiga',
      explicacion: 'Dormir entre 7 y 9 horas diarias es lo recomendable para mantener la atención durante la conducción.',
    },
    {
      texto: '¿Cómo debe comportarse el conductor de un turismo, sobre todo en vías urbanas, para evitar un accidente con una motocicleta o un ciclomotor?',
      opciones: ['Circular en paralelo y lo más cerca posible de los vehículos de dos ruedas', 'Mirar por los retrovisores con frecuencia', 'Reducir o incluso eliminar la distancia de seguridad'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#motos',
      explicacion: 'Mirar con frecuencia los retrovisores y comprobar los ángulos muertos es esencial para evitar accidentes con motos.',
    },
    {
      texto: 'En un carril habilitado en sentido contrario al habitual por trabajos en la calzada, ¿qué vehículos tienen permitido utilizarlo?',
      opciones: ['Todos los que estén autorizados a circular por la vía', 'Solo turismos y motocicletas', 'Automóviles que no superen los 3.500 kg de M.M.A. y motocicletas'],
      indice_correcta: 0,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#obras',
      explicacion: 'El carril habilitado en sentido contrario puede ser utilizado por todos los vehículos autorizados a circular por esa vía.',
    },
    {
      texto: 'En los adelantamientos a ciclistas en vías con un carril para cada sentido, ¿está permitido ocupar el carril de sentido contrario?',
      opciones: ['Sí, siempre que el adelantamiento se pueda realizar con seguridad', 'No', 'Solo si ambos sentidos están separados por línea blanca discontinua'],
      indice_correcta: 0,
      tema_slug: 'adelantamientos',
      dificultad: 1,
      referencia_manual: 'adelantamientos#ciclistas',
      explicacion: 'Para adelantar a un ciclista con seguridad puede invadirse el carril contrario, dejando al menos 1,5 metros de separación.',
    },
    {
      texto: 'Los conductores, ¿están obligados a realizar las pruebas de alcoholemia cuando sean requeridos por la policía de tráfico?',
      opciones: ['No; pueden negarse y seguir circulando', 'Solo están obligados en caso de accidente de tráfico', 'Sí; negarse a realizarla es un delito incluido en el Código Penal'],
      indice_correcta: 2,
      tema_slug: 'alcohol',
      dificultad: 1,
      referencia_manual: 'alcohol#tasas',
      explicacion: 'Negarse a realizar la prueba de alcoholemia es un delito recogido en el Código Penal.',
    },
    {
      texto: '¿Es conveniente utilizar un aceite lubricante con un índice de viscosidad tan bajo que, al calentarse el motor, se vuelva excesivamente líquido?',
      opciones: ['No, porque el aceite no llega a engrasar bien las piezas del motor', 'Sí; cuanto más líquido, mejor engrasa y arrastra los residuos', 'Solo si el motor se calienta en exceso'],
      indice_correcta: 0,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#mantenimiento',
      explicacion: 'Un aceite demasiado líquido en caliente no lubrica correctamente y puede dañar el motor.',
    },
    // =====================
    // TEST ABRIL 2025
    // =====================
    {
      texto: '¿Está permitido circular con un vehículo cuyas placas de matrícula presentan obstáculos que impiden o dificultan su lectura e identificación?',
      opciones: ['No; el conductor debe verificar que las placas se pueden leer correctamente', 'Sí, siempre que la placa delantera se pueda leer correctamente', 'Sí, siempre que el vehículo solo circule por vías urbanas'],
      indice_correcta: 0,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#matricula',
      explicacion: 'Las placas de matrícula deben estar siempre en perfecto estado y ser legibles para identificar el vehículo.',
    },
    {
      texto: 'Respecto al uso del cinturón de seguridad, como norma general, el ocupante de un turismo distinto del conductor está obligado a...',
      opciones: ['llevarlo puesto y sin abrochar', 'llevarlo puesto y abrochado solo en vías interurbanas', 'llevarlo puesto y correctamente abrochado'],
      indice_correcta: 2,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#cinturon',
      explicacion: 'Todos los ocupantes deben llevar el cinturón abrochado y correctamente ajustado, en cualquier tipo de vía.',
    },
    {
      texto: 'En vías interurbanas con tres carriles para el mismo sentido, ¿le está permitido circular por el carril izquierdo a un turismo con remolque?',
      opciones: ['Sí, cuando la longitud del conjunto no supere los 7 metros', 'Sí, pero solo para adelantar a otros vehículos', 'No, en ningún caso'],
      indice_correcta: 0,
      tema_slug: 'velocidad',
      dificultad: 2,
      referencia_manual: 'velocidad#carriles',
      explicacion: 'Los conjuntos de vehículos de más de 7 metros no pueden usar el carril izquierdo; si no supera los 7 metros, sí.',
    },
    {
      texto: 'Cuando se adelante a vehículos de tracción animal, fuera de poblado, la separación lateral...',
      opciones: ['no debe ser inferior a 1,5 metros', 'debe ser inferior a 1,5 metros, en todos los casos', 'debe ser siempre proporcional a la anchura y características de la vía'],
      indice_correcta: 0,
      tema_slug: 'adelantamientos',
      dificultad: 1,
      referencia_manual: 'adelantamientos#traccion-animal',
      explicacion: 'Al adelantar vehículos de tracción animal fuera de poblado, la separación lateral mínima es de 1,5 metros.',
    },
    {
      texto: '¿Qué alumbrado deberá dejar encendido, como norma general, el conductor de un vehículo inmovilizado entre la puesta y la salida del sol en el arcén de una travesía insuficientemente iluminada?',
      opciones: ['Ninguno', 'Las luces de emergencia', 'Las luces de posición'],
      indice_correcta: 2,
      tema_slug: 'luces',
      dificultad: 2,
      referencia_manual: 'luces#parada',
      explicacion: 'Un vehículo inmovilizado en el arcén de una travesía insuficientemente iluminada debe dejar las luces de posición encendidas.',
    },
    {
      texto: 'Esta señal de peligro con un coche deslizándose advierte de...',
      opciones: ['la proximidad de un escalón lateral o desnivel', 'la proximidad de pavimento deslizante por hielo o nieve', 'la proximidad de una zona de la calzada cuyo pavimento puede resultar muy deslizante'],
      indice_correcta: 2,
      tema_slug: 'senales',
      dificultad: 2,
      referencia_manual: 'senales#peligro',
      explicacion: 'La señal P-1e advierte de pavimento deslizante: una zona donde el firme puede estar muy resbaladizo.',
    },
    {
      texto: '¿Qué alteración provoca con mayor frecuencia el consumo de alcohol en el comportamiento del conductor?',
      opciones: ['Respuestas impulsivas y agresivas ante los demás conductores', 'Disminución del tiempo de reacción', 'Mayor facilidad para percibir los semáforos'],
      indice_correcta: 0,
      tema_slug: 'alcohol',
      dificultad: 1,
      referencia_manual: 'alcohol#efectos',
      explicacion: 'El alcohol provoca respuestas impulsivas y agresivas, además de aumentar el tiempo de reacción.',
    },
    {
      texto: '¿Qué indica la señal V-4 colocada en la parte posterior de un vehículo?',
      opciones: ['Que transporta mercancías peligrosas', 'Que es un vehículo especial realizando trabajos en la vía', 'Que es un vehículo lento y no puede superar los 40 km/h'],
      indice_correcta: 2,
      tema_slug: 'senales',
      dificultad: 2,
      referencia_manual: 'senales#vehiculos',
      explicacion: 'La señal V-4 identifica vehículos lentos que no pueden superar los 40 km/h, como tractores o ciclomotores de obras.',
    },
    {
      texto: 'Si ha dormido mal o no ha dormido lo suficiente debe tener en cuenta que...',
      opciones: ['conducir por una autovía durante horas impide la aparición del sueño', 'no se encuentra en perfectas condiciones para conducir', 'una taza de café elimina la fatiga y le ayuda a concentrarse'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#fatiga',
      explicacion: 'La falta de sueño reduce las capacidades del conductor; la mejor medida es descansar antes de conducir.',
    },
    {
      texto: '¿Con qué dos factores suelen relacionarse muchos de los accidentes más graves que sufren los jóvenes conductores?',
      opciones: ['El consumo de alcohol y drogas y una actitud prudente', 'La falta de experiencia al volante y el consumo de alcohol y drogas', 'La velocidad excesiva y una adecuada percepción del riesgo'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#jovenes',
      explicacion: 'La inexperiencia junto con el consumo de alcohol y drogas son factores clave en los accidentes graves de jóvenes.',
    },
    {
      texto: '¿Cuál de las siguientes circunstancias hace que aumente el consumo de combustible?',
      opciones: ['Circular con las ventanillas del vehículo subidas', 'Circular con el vehículo muy cargado', 'Circular con unos neumáticos que carezcan de dibujo'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#conduccion-eficiente',
      explicacion: 'El exceso de carga aumenta el consumo de combustible. Los neumáticos sin dibujo y las ventanillas abiertas también lo aumentan.',
    },
    {
      texto: '¿Cuál de las siguientes razones puede explicar que el vehículo sea el factor de riesgo que aparece en menor grado como causa principal de los accidentes de tráfico?',
      opciones: ['Las importantes mejoras técnicas introducidas en su diseño y construcción', 'Que la edad media de los vehículos es cada vez mayor', 'Que en los últimos 20 años los kilómetros recorridos han disminuido'],
      indice_correcta: 0,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#factor-vehiculo',
      explicacion: 'Las mejoras técnicas de los vehículos (ABS, ESP, airbags) reducen su peso como causa de accidentes.',
    },
    {
      texto: 'Para mantener la seguridad, ¿qué elementos se deben revisar periódicamente y con mayor frecuencia que el resto de componentes del vehículo?',
      opciones: ['Los neumáticos, el sistema de frenado y los amortiguadores', 'Las luces, la batería y las llantas', 'El filtro del aire, la dirección y los retrovisores'],
      indice_correcta: 0,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#mantenimiento',
      explicacion: 'Neumáticos, frenos y amortiguadores son los elementos que más influyen en la seguridad y requieren revisión frecuente.',
    },
    {
      texto: 'Una luz roja intermitente o dos luces rojas alternativamente intermitentes de un semáforo...',
      opciones: ['permiten el paso con precaución', 'prohíben temporalmente el paso', 'obligan a moderar la velocidad antes de pasar'],
      indice_correcta: 1,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#semaforos',
      explicacion: 'La luz roja intermitente prohíbe el paso temporalmente, como en pasos a nivel o a la espera de nueva señalización.',
    },
    {
      texto: 'En general, un conductor que sufre un trastorno depresivo...',
      opciones: ['recoge mejor la información relevante', 'es más fácil que se distraiga y que sufra somnolencia', 'se concentra con mayor facilidad'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#aptitud',
      explicacion: 'Los trastornos como la depresión favorecen la distracción y la somnolencia, reduciendo la seguridad al volante.',
    },
    {
      texto: 'En una vía de doble sentido, ¿qué vehículos deben guardar una separación mínima de 50 metros con el vehículo de delante cuando no pretendan adelantar?',
      opciones: ['Todos los camiones, con independencia de su M.M.A.', 'Los conjuntos de vehículos de más de 10 metros de longitud', 'Los turismos'],
      indice_correcta: 1,
      tema_slug: 'velocidad',
      dificultad: 2,
      referencia_manual: 'velocidad#distancia-seguridad',
      explicacion: 'Los conjuntos de vehículos de más de 10 metros deben mantener 50 metros de separación con el vehículo que les precede.',
    },
    {
      texto: '¿Existe riesgo de accidente si un conductor utiliza un dispositivo de manos libres para hablar por teléfono mientras conduce?',
      opciones: ['No; el dispositivo está pensado para que no exista ningún riesgo', 'Solo si la conversación dura más de cinco minutos', 'Sí, hay cierto riesgo porque disminuye la atención'],
      indice_correcta: 2,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#movil',
      explicacion: 'Aunque sea manos libres, la conversación disminuye la atención y supone un riesgo de distracción.',
    },
    {
      texto: '¿Qué factor de riesgo ocasiona un mayor número de accidentes de tráfico?',
      opciones: ['El factor humano', 'El factor vía y su entorno', 'El factor vehículo'],
      indice_correcta: 0,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#factor-humano',
      explicacion: 'El factor humano es el que interviene en la mayor parte de los accidentes de tráfico.',
    },
    {
      texto: 'Como norma general, ¿cómo se denomina el tramo de carretera que discurre por poblado?',
      opciones: ['Carretera convencional', 'Travesía', 'Autovía'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#travesia',
      explicacion: 'El tramo de carretera que discurre por poblado se denomina travesía.',
    },
    {
      texto: 'Si una intersección con prioridad de paso está saturada y es previsible que se quede detenido sin terminar de atravesarla, impidiendo la circulación transversal, ¿qué debe hacer?',
      opciones: ['Entrar en la intersección, porque tiene prioridad de paso', 'Tocar el claxon con insistencia', 'No entrar en la intersección'],
      indice_correcta: 2,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#intersecciones',
      explicacion: 'No debe entrar en la intersección si previsiblemente va a quedar detenido en medio, bloqueando la circulación.',
    },
    {
      texto: 'La distancia de frenado está determinada por...',
      opciones: ['un único factor, la velocidad a la que se circula', 'varios factores, como la velocidad, el estado de la vía o el del vehículo', 'un único factor, el estado del vehículo'],
      indice_correcta: 1,
      tema_slug: 'velocidad',
      dificultad: 1,
      referencia_manual: 'velocidad#distancia-seguridad',
      explicacion: 'La distancia de frenado depende de la velocidad, el estado del firme, los frenos, los neumáticos y la carga.',
    },
    {
      texto: '¿Qué puede verse afectado si cambia el carenado de una motocicleta?',
      opciones: ['La estética, exclusivamente', 'La aerodinámica y el consumo', 'La visibilidad del vehículo'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#motos',
      explicacion: 'Modificar el carenado altera la aerodinámica y el consumo de la motocicleta.',
    },
  ];

  let insertadas = 0;
  for (const p of preguntas) {
    const temaId = temaMap[p.tema_slug];
    if (!temaId) continue;
    if (selectExistente.get(p.texto)) continue;
    insertPregunta.run(p.texto, JSON.stringify(p.opciones), p.indice_correcta, temaId, p.dificultad, p.referencia_manual, p.explicacion, null);
    insertadas++;
  }

  db.prepare("INSERT INTO seed_meta (marca) VALUES ('preguntas_oficiales_v1')").run();
  console.log(`Seed oficial: ${insertadas} preguntas DGT insertadas`);
}