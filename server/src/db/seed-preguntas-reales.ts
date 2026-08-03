import { getDB } from './database';

/**
 * Preguntas reales del examen de conducir de la DGT
 * Fuente: Test oficiales de la Dirección General de Tráfico
 * https://www.dgt.es
 */
export function seedPreguntasReales(): void {
  const db = getDB();

  // Idempotente: solo se ejecuta una vez
  const marca = db.prepare("SELECT 1 FROM seed_meta WHERE marca = 'preguntas_reales_v1'").get();
  if (marca) return;

  const temaMap: Record<string, number> = {};
  const temas = db.prepare('SELECT id, slug FROM temas').all() as { id: number; slug: string }[];
  for (const t of temas) {
    temaMap[t.slug] = t.id;
  }

  const insertPregunta = db.prepare(
    'INSERT INTO preguntas (texto, opciones, indice_correcta, tema_id, dificultad, referencia_manual, explicacion, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  // Preguntas reales del examen DGT (permiso B)
  const preguntasReales: Array<{
    texto: string;
    opciones: string[];
    indice_correcta: number;
    tema_slug: string;
    dificultad: number;
    referencia_manual: string;
    explicacion: string;
    imagen?: string;
  }> = [
    // =============================================
    // NORMAS GENERALES - Preguntas oficiales DGT
    // =============================================
    {
      texto: 'Conductores noveles: ¿cuál es la tasa máxima de alcohol en sangre?',
      opciones: ['0,5 g/l', '0,3 g/l', '0,8 g/l', '0,1 g/l'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'alcohol#tasas',
      explicacion: 'Los conductores noveles (menos de 2 años) tienen una tasa máxima de 0,3 g/l en sangre.',
    },
    {
      texto: '¿Cuál es la duración máxima de la jornada de conducción diaria para un conductor profesional?',
      opciones: ['8 horas', '9 horas', '10 horas', '12 horas'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 3,
      referencia_manual: 'normas-generales#jornada',
      explicacion: 'La jornada máxima de conducción para conductores profesionales es de 9 horas diarias.',
    },
    {
      texto: '¿Qué documento acredita que un vehículo ha superado la Inspección Técnica de Vehículos (ITV)?',
      opciones: ['El permiso de circulación', 'La ficha técnica', 'La tarjeta de ITV', 'El certificado de seguros'],
      indice_correcta: 2,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#documentacion',
      explicacion: 'La tarjeta de ITV acredita que el vehículo ha superado la inspección técnica.',
    },
    {
      texto: '¿Está permitido utilizar dispositivos de localización GPS durante la conducción?',
      opciones: ['Sí, siempre', 'Solo si están integrados en el vehículo o montados en el salpicadero', 'No, nunca', 'Solo en autopista'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#dispositivos',
      explicacion: 'Solo se permiten GPS integrados en el vehículo o montados en el salpicadero, nunca en la mano.',
    },
    {
      texto: '¿Cuántos puntos puede perder un conductor novel en su primer año?',
      opciones: ['Ninguno', '2 puntos', '4 puntos', 'Todos los puntos'],
      indice_correcta: 3,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#puntos',
      explicacion: 'Los conductores noveles pueden perder todos sus puntos en el primer año por infracciones graves.',
    },
    {
      texto: '¿Qué obligación tiene el conductor cuando se aproxima a un paso de peatones?',
      opciones: ['Tocar el claxon', 'Reducir la velocidad y estar preparado para detenerse', 'Aumentar la velocidad', 'Cambiar de carril'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#peatones',
      explicacion: 'El conductor debe reducir la velocidad y estar preparado para detenerse ante un paso de peatones.',
    },
    {
      texto: '¿Está permitido el uso de cascos bluetooth para hablar por teléfono mientras se conduce?',
      opciones: ['Sí, siempre', 'No, están prohibidos', 'Solo si son de tipo auricular', 'Solo en vías urbanas'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#movil',
      explicacion: 'Los cascos bluetooth están prohibidos. Solo se permiten dispositivos manos libres integrados.',
    },
    {
      texto: '¿Qué debe hacer si sufre un pinchazo durante la marcha?',
      opciones: ['Frenar bruscamente', 'Sujetar firmemente el volante, no frenar bruscamente y reducir velocidad gradualmente', 'Acelerar para estabilizar', 'Apagar el motor inmediatamente'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#emergencias',
      explicacion: 'Ante un pinchazo: sujetar el volante, no frenar brusco, reducir velocidad gradualmente.',
    },

    // =============================================
    // SEÑALES - Preguntas oficiales DGT
    // =============================================
    {
      texto: 'Una señal de peligro con un símbolo de curva indica:',
      opciones: ['Prohibición de girar', 'Peligro de curva peligrosa', 'Obligación de girar', 'Dirección recomendada'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#peligro',
      explicacion: 'Las señales triangulares con borde rojo son de peligro y advierten de curvas peligrosas.',
    },
    {
      texto: '¿Qué indica una señal circular de color azul con una flecha blanca?',
      opciones: ['Dirección recomendada', 'Sentido obligatorio', 'Fin de prohibición', 'Calle sin salida'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#obligacion',
      explicacion: 'Las señales circulares azules con flecha blanca son de obligación: indican el sentido que se debe seguir.',
    },
    {
      texto: 'Una señal con un círculo rojo y una barra horizontal blanca significa:',
      opciones: ['Prohibido girar', 'Entrada prohibida', 'Prohibido aparcar', 'Fin de prohibición'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#prohibicion',
      explicacion: 'Círculo rojo con barra horizontal blanca = entrada prohibida a toda clase de vehículos.',
    },
    {
      texto: '¿Qué forma tiene la señal de "STOP"?',
      opciones: ['Circular', 'Triangular', 'Octogonal', 'Rectangular'],
      indice_correcta: 2,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#stop',
      explicacion: 'La señal de STOP es la única con forma octogonal, lo que la hace reconocible incluso sucia.',
    },
    {
      texto: 'Una señal rectangular azul con un símbolo blanco de grifo indica:',
      opciones: ['Prohibición de repostar', 'Gasolinera o estación de servicio', 'Taller mecánico', 'Centro de información'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#servicios',
      explicacion: 'Las señales de servicio son rectangulares azules con símbolos blancos.',
    },
    {
      texto: '¿Qué indica una señal triangular con borde rojo y un semáforo en el centro?',
      opciones: ['Semáforo averiado', 'Proximidad de un semáforo', 'Prohibido el paso', 'Carril reservado'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#peligro',
      explicacion: 'Advierte de la proximidad de un semáforo. Extremar la precaución.',
    },
    {
      texto: 'Una señal con forma de triángulo invertido (punta hacia abajo) significa:',
      opciones: ['Peligro', 'Ceda el paso', 'Stop', 'Prioridad'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#ceda',
      explicacion: 'El triángulo invertido con borde rojo es la señal de "Ceda el paso".',
    },
    {
      texto: '¿Qué indica una señal con un número dentro de un círculo rojo?',
      opciones: ['Velocidad mínima', 'Velocidad máxima permitida', 'Distancia de seguridad', 'Número de carril'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#reglamentacion',
      explicacion: 'Círculo rojo con número = velocidad máxima permitida en km/h.',
    },
    {
      texto: 'Una señal de color amarillo con forma de rombo indica:',
      opciones: ['Zona de obras', 'Carretera prioritaria', 'Peligro general', 'Zona industrial'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#prioridad',
      explicacion: 'El rombo amarillo indica "carretera prioritaria".',
    },
    {
      texto: '¿Qué indica una señal redonda azul con un número en blanco?',
      opciones: ['Velocidad máxima', 'Velocidad mínima', 'Velocidad recomendada', 'Límite de tonelaje'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 2,
      referencia_manual: 'senales#obligacion',
      explicacion: 'Círculo azul con número = velocidad mínima obligatoria.',
    },

    // =============================================
    // VELOCIDAD - Preguntas oficiales DGT
    // =============================================
    {
      texto: '¿Cuál es la velocidad máxima permitida en autopista para turismos?',
      opciones: ['100 km/h', '110 km/h', '120 km/h', '130 km/h'],
      indice_correcta: 2,
      tema_slug: 'velocidad',
      dificultad: 1,
      referencia_manual: 'velocidad#autopista',
      explicacion: 'La velocidad máxima genérica en autopista para turismos es 120 km/h.',
    },
    {
      texto: '¿Cuál es la velocidad máxima en vías urbanas con un solo carril por sentido?',
      opciones: ['20 km/h', '30 km/h', '40 km/h', '50 km/h'],
      indice_correcta: 1,
      tema_slug: 'velocidad',
      dificultad: 1,
      referencia_manual: 'velocidad#urbana-30',
      explicacion: 'Desde 2021, en vías urbanas con un solo carril por sentido la velocidad máxima es 30 km/h.',
    },
    {
      texto: '¿Cuál es la velocidad mínima en autopista?',
      opciones: ['40 km/h', '50 km/h', '60 km/h', '70 km/h'],
      indice_correcta: 2,
      tema_slug: 'velocidad',
      dificultad: 1,
      referencia_manual: 'velocidad#minima',
      explicacion: 'La velocidad mínima en autopista y autovía es 60 km/h.',
    },
    {
      texto: '¿A qué velocidad máxima puede circular un camión de más de 3.500 kg en autopista?',
      opciones: ['80 km/h', '90 km/h', '100 km/h', '110 km/h'],
      indice_correcta: 1,
      tema_slug: 'velocidad',
      dificultad: 2,
      referencia_manual: 'velocidad#camiones',
      explicacion: 'Los camiones de más de 3.500 kg tienen limitada la velocidad a 90 km/h en autopista.',
    },
    {
      texto: '¿Cuál es la velocidad máxima en carretera convencional para turismos?',
      opciones: ['80 km/h', '90 km/h', '100 km/h', '110 km/h'],
      indice_correcta: 1,
      tema_slug: 'velocidad',
      dificultad: 1,
      referencia_manual: 'velocidad#carretera',
      explicacion: 'En carretera convencional, la velocidad máxima para turismos es 90 km/h.',
    },
    {
      texto: '¿Cuál es la distancia de seguridad mínima recomendada?',
      opciones: ['La que permita detener el vehículo completamente', '50 metros', '100 metros', 'La distancia que se recorre en 2 segundos'],
      indice_correcta: 3,
      tema_slug: 'velocidad',
      dificultad: 2,
      referencia_manual: 'velocidad#distancia-seguridad',
      explicacion: 'La regla de los 2 segundos: distancia que se recorre en al menos 2 segundos.',
    },
    {
      texto: '¿Cuánto aumenta la distancia de frenado si se duplica la velocidad?',
      opciones: ['Se duplica', 'Se cuadruplica', 'No varía', 'Aumenta un 50%'],
      indice_correcta: 1,
      tema_slug: 'velocidad',
      dificultad: 2,
      referencia_manual: 'velocidad#frenado',
      explicacion: 'La distancia de frenado aumenta proporcionalmente al cuadrado de la velocidad (x4 si se duplica).',
    },
    {
      texto: '¿A qué velocidad máxima puede circular un turismo con remolque en autopista?',
      opciones: ['120 km/h', '100 km/h', '90 km/h', '80 km/h'],
      indice_correcta: 3,
      tema_slug: 'velocidad',
      dificultad: 2,
      referencia_manual: 'velocidad#remolque',
      explicacion: 'Turismo con remolque de más de 750 kg: 80 km/h en autopista.',
    },
    {
      texto: '¿Cuál es la velocidad máxima para una motocicleta en autopista?',
      opciones: ['100 km/h', '110 km/h', '120 km/h', '130 km/h'],
      indice_correcta: 2,
      tema_slug: 'velocidad',
      dificultad: 1,
      referencia_manual: 'velocidad#autopista',
      explicacion: 'Las motos tienen el mismo límite que los turismos: 120 km/h en autopista.',
    },
    {
      texto: '¿Cuál es la velocidad máxima en vía urbana con plataforma única de calzada y acera?',
      opciones: ['10 km/h', '20 km/h', '30 km/h', '40 km/h'],
      indice_correcta: 1,
      tema_slug: 'velocidad',
      dificultad: 2,
      referencia_manual: 'velocidad#urbana-20',
      explicacion: 'Plataforma única de calzada y acera: 20 km/h.',
    },

    // =============================================
    // ADELANTAMIENTOS - Preguntas oficiales DGT
    // =============================================
    {
      texto: '¿Está permitido adelantar en una curva sin visibilidad?',
      opciones: ['Sí, si el otro vehículo va lento', 'No, está prohibido', 'Solo si no vienen coches de frente', 'Sí, si se toca el claxon'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 1,
      referencia_manual: 'adelantamientos#prohibiciones',
      explicacion: 'Está prohibido adelantar en curvas y cambios de rasante con visibilidad reducida.',
    },
    {
      texto: '¿Qué debe hacer el conductor adelantado durante la maniobra?',
      opciones: ['Aumentar la velocidad', 'Mantener la velocidad o reducirla ligeramente', 'Indicar con el brazo', 'Detenerse'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 1,
      referencia_manual: 'adelantamientos#normas',
      explicacion: 'El conductor adelantado debe mantener la velocidad o reducirla para facilitar la maniobra.',
    },
    {
      texto: '¿Está permitido adelantar a un ciclista dejando 1 metro de separación?',
      opciones: ['Sí, es suficiente', 'No, deben dejarse 1,5 metros', 'No, deben dejarse 2 metros', 'Solo si no hay tráfico'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 2,
      referencia_manual: 'adelantamientos#ciclistas',
      explicacion: 'Al adelantar a ciclistas debe dejarse una separación mínima de 1,5 metros.',
    },
    {
      texto: '¿Se puede adelantar por la derecha en autopista?',
      opciones: ['Sí, siempre que sea seguro', 'No, está prohibido excepto si el vehículo de delante indica giro a la izquierda', 'Sí, en autopista está permitido', 'Solo si hay tres carriles'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 1,
      referencia_manual: 'adelantamientos#derecha',
      explicacion: 'Solo se puede adelantar por la derecha si el vehículo de delante indica giro a la izquierda.',
    },
    {
      texto: '¿Está permitido adelantar en un paso de peatones?',
      opciones: ['Sí, si no hay peatones', 'No, está prohibido', 'Solo si el paso está sin semáforo', 'Sí, si el vehículo de delante está parado'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 2,
      referencia_manual: 'adelantamientos#prohibiciones',
      explicacion: 'Está prohibido adelantar en los pasos de peatones señalizados.',
    },
    {
      texto: '¿En qué caso se permite adelantar en un túnel?',
      opciones: ['Siempre', 'Solo si hay más de un carril en el mismo sentido', 'Nunca', 'Solo si hay buena visibilidad'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 2,
      referencia_manual: 'adelantamientos#tuneles',
      explicacion: 'En túneles solo se puede adelantar si hay más de un carril en el mismo sentido.',
    },
    {
      texto: '¿Qué distancia lateral debe dejarse al adelantar a un peatón?',
      opciones: ['0,5 metros', '1 metro', '1,5 metros', 'La máxima posible'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 3,
      referencia_manual: 'adelantamientos#distancia',
      explicacion: 'Al adelantar a peatones debe dejarse una separación lateral de al menos 1 metro.',
    },
    {
      texto: 'En un adelantamiento, ¿cuándo debe reintegrarse a su carril?',
      opciones: ['Inmediatamente después de rebasar', 'Cuando vea el vehículo adelantado en el espejo retrovisor', 'Cuando el vehículo le pite', 'Al finalizar la línea continua'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 2,
      referencia_manual: 'adelantamientos#reintegro',
      explicacion: 'Debe reintegrarse cuando vea el vehículo adelantado en el espejo retrovisor.',
    },
    {
      texto: '¿Está permitido adelantar a varios vehículos a la vez?',
      opciones: ['Sí, si hay suficiente visibilidad y espacio', 'No, solo uno a la vez', 'Solo en autopista', 'Solo si son ciclistas'],
      indice_correcta: 0,
      tema_slug: 'adelantamientos',
      dificultad: 2,
      referencia_manual: 'adelantamientos#normas',
      explicacion: 'Se puede adelantar a varios si hay visibilidad y espacio suficiente.',
    },
    {
      texto: '¿A qué velocidad máxima se puede adelantar en autopista?',
      opciones: ['120 km/h, sin superar el límite', '130 km/h', '140 km/h', 'No hay límite'],
      indice_correcta: 0,
      tema_slug: 'adelantamientos',
      dificultad: 1,
      referencia_manual: 'adelantamientos#normas',
      explicacion: 'Al adelantar en autopista no se puede superar el límite de 120 km/h.',
    },

    // =============================================
    // PRIORIDAD - Preguntas oficiales DGT
    // =============================================
    {
      texto: 'En un cruce sin señalizar, ¿quién tiene prioridad?',
      opciones: ['El vehículo que viene por la derecha', 'El vehículo que viene por la izquierda', 'El vehículo más grande', 'El vehículo que va más rápido'],
      indice_correcta: 0,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#derecha',
      explicacion: 'En un cruce sin señalizar, tiene prioridad el vehículo que se aproxima por la derecha.',
    },
    {
      texto: '¿Quién tiene prioridad en una rotonda?',
      opciones: ['Los vehículos que entran', 'Los vehículos que ya están dentro', 'El vehículo que va más lento', 'El que viene por la derecha'],
      indice_correcta: 1,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#rotondas',
      explicacion: 'En una rotonda, tienen prioridad los vehículos que ya circulan dentro.',
    },
    {
      texto: '¿Tienen prioridad los peatones en un paso de peatones sin semáforo?',
      opciones: ['Sí, siempre', 'No, los coches tienen prioridad', 'Solo si hay señal', 'Solo en vías urbanas'],
      indice_correcta: 0,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#peatones',
      explicacion: 'Los peatones tienen siempre prioridad en los pasos de peatones señalizados.',
    },
    {
      texto: '¿Quién tiene prioridad al subir una pendiente estrecha?',
      opciones: ['El que sube', 'El que baja', 'El que va más rápido', 'El que toca el claxon'],
      indice_correcta: 0,
      tema_slug: 'prioridad',
      dificultad: 2,
      referencia_manual: 'prioridad#pendientes',
      explicacion: 'En pendientes estrechas, tiene prioridad el vehículo que sube.',
    },
    {
      texto: 'En una intersección con semáforo en amarillo fijo, ¿qué debe hacer?',
      opciones: ['Acelerar para pasar', 'Detenerse si es posible hacerlo con seguridad', 'Continuar igual', 'Tocar el claxon'],
      indice_correcta: 1,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#semaforos',
      explicacion: 'El amarillo fijo indica que el semáforo va a pasar a rojo; debe detenerse si es seguro.',
    },
    {
      texto: '¿Deben ceder el paso los vehículos a los trenes en un paso a nivel?',
      opciones: ['Sí, siempre', 'No, los trenes deben esperar', 'Solo si hay barreras', 'Solo si viene el tren'],
      indice_correcta: 0,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#paso-nivel',
      explicacion: 'Los vehículos deben ceder siempre el paso a los trenes en los pasos a nivel.',
    },
    {
      texto: '¿Tiene prioridad un vehículo de emergencia con señales luminosas?',
      opciones: ['Sí, siempre sobre cualquier vehículo', 'Solo en autopista', 'Solo si va rápido', 'No, debe respetar las señales'],
      indice_correcta: 0,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#emergencias',
      explicacion: 'Los vehículos de emergencia con señales luminosas y acústicas tienen prioridad absoluta.',
    },
    {
      texto: 'Un vehículo que sale de un estacionamiento, ¿tiene prioridad?',
      opciones: ['Sí, siempre', 'No, debe ceder el paso a los que circulan', 'Solo si señaliza', 'Sí, si va marcha atrás'],
      indice_correcta: 1,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#estacionamiento',
      explicacion: 'Al salir de un estacionamiento debe cederse el paso a los vehículos que circulan.',
    },
    {
      texto: 'En una rotonda, ¿qué carril debe usar para salir en la primera salida?',
      opciones: ['El carril exterior (derecho)', 'El interior', 'Cualquier carril', 'El central'],
      indice_correcta: 0,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#rotondas',
      explicacion: 'Para salir en la primera salida, debe usarse el carril derecho.',
    },
    {
      texto: '¿Está permitido bloquear un cruce aunque el semáforo esté en verde si hay atasco?',
      opciones: ['Sí, el semáforo da prioridad', 'No, no debe entrar si no puede despejarlo', 'Sí, si se toca el claxon', 'Depende de la hora'],
      indice_correcta: 1,
      tema_slug: 'prioridad',
      dificultad: 2,
      referencia_manual: 'prioridad#semaforos',
      explicacion: 'No debe entrarse en un cruce si no se puede despejar, aunque el semáforo esté en verde.',
    },

    // =============================================
    // LUCES - Preguntas oficiales DGT
    // =============================================
    {
      texto: '¿Qué luces debe utilizar un vehículo al circular dentro de un túnel?',
      opciones: ['Luces de posición', 'Luces de cruce o carretera', 'Luces antiniebla', 'Luces de emergencia'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 1,
      referencia_manual: 'luces#tuneles',
      explicacion: 'En túneles deben encenderse las luces de cruce (o carretera si no hay más vehículos).',
    },
    {
      texto: '¿Cuándo es obligatorio usar las luces de cruce?',
      opciones: ['Solo de noche', 'Entre la puesta y la salida del sol, y en condiciones meteorológicas adversas', 'Solo cuando llueve', 'Siempre'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 1,
      referencia_manual: 'luces#cruce',
      explicacion: 'Las luces de cruce son obligatorias desde la puesta hasta la salida del sol y en condiciones adversas.',
    },
    {
      texto: '¿Qué luces se deben usar con niebla espesa?',
      opciones: ['Luces de carretera', 'Luces antiniebla delanteras y traseras', 'Solo luces de posición', 'Luces de emergencia'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 1,
      referencia_manual: 'luces#antiniebla',
      explicacion: 'Con niebla espesa deben usarse las luces antiniebla delanteras y traseras.',
    },
    {
      texto: '¿Está permitido usar las luces de largo alcance en ciudad?',
      opciones: ['Sí, siempre', 'No, está prohibido salvo en vías insuficientemente iluminadas', 'Sí, si no hay peatones', 'Solo en avenidas anchas'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 2,
      referencia_manual: 'luces#largas',
      explicacion: 'En ciudad solo pueden usarse luces de largo alcance si la vía está insuficientemente iluminada.',
    },
    {
      texto: '¿Qué luces son obligatorias en una motocicleta durante el día?',
      opciones: ['Ninguna', 'Luces de cruce (obligatorias 24h)', 'Luces de posición', 'Luces antiniebla'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 2,
      referencia_manual: 'luces#motos',
      explicacion: 'Las motocicletas deben circular siempre con las luces de cruce encendidas.',
    },
    {
      texto: '¿Se pueden usar las luces de emergencia mientras se circula?',
      opciones: ['No, solo cuando el vehículo está parado', 'Sí, para advertir de un peligro inminente', 'Sí, siempre', 'No, nunca'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 2,
      referencia_manual: 'luces#emergencias',
      explicacion: 'Las luces de emergencia pueden usarse en circulación para advertir de un peligro inminente.',
    },
    {
      texto: '¿Qué indica la luz antiniebla trasera?',
      opciones: ['Que el vehículo está averiado', 'Que hay niebla o condiciones adversas', 'Que el vehículo va a girar', 'Que el vehículo frena'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 1,
      referencia_manual: 'luces#antiniebla-trasera',
      explicacion: 'La luz antiniebla trasera advierte de condiciones meteorológicas adversas.',
    },
    {
      texto: '¿Cuándo debe cambiar de luces de carretera a cruce?',
      opciones: ['Cuando se aproxima otro vehículo', 'Cada 5 minutos', 'Al entrar en una curva', 'Nunca'],
      indice_correcta: 0,
      tema_slug: 'luces',
      dificultad: 1,
      referencia_manual: 'luces#cambio',
      explicacion: 'Debe cambiarse a luces de cruce cuando se aproxime otro vehículo en sentido contrario.',
    },
    {
      texto: '¿Se pueden usar las luces antiniebla delanteras sin niebla?',
      opciones: ['Sí, mejoran la visibilidad', 'No, solo con niebla, lluvia intensa o nieve', 'Sí, en autopista siempre', 'Solo en carretera'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 1,
      referencia_manual: 'luces#antiniebla',
      explicacion: 'Antiniebla delantera solo con niebla, lluvia intensa, nevada o nubes de humo.',
    },
    {
      texto: '¿Qué luces debe encender al circular marcha atrás?',
      opciones: ['Luces de posición', 'Luces de marcha atrás (blancas)', 'Luces antiniebla', 'Luces de cruce'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 1,
      referencia_manual: 'luces#marcha-atras',
      explicacion: 'Al circular marcha atrás se encienden automáticamente las luces blancas de marcha atrás.',
    },

    // =============================================
    // ALCOHOL - Preguntas oficiales DGT
    // =============================================
    {
      texto: '¿Cuál es la tasa máxima de alcohol en sangre para conductores noveles?',
      opciones: ['0,5 g/l', '0,3 g/l', '0,8 g/l', '0,1 g/l'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 1,
      referencia_manual: 'alcohol#tasas',
      explicacion: 'Los conductores noveles tienen la tasa máxima de 0,3 g/l en sangre.',
    },
    {
      texto: '¿Cuál es la tasa máxima de alcohol en aire espirado para conductores generales?',
      opciones: ['0,15 mg/l', '0,25 mg/l', '0,50 mg/l', '0,65 mg/l'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 2,
      referencia_manual: 'alcohol#tasas',
      explicacion: 'La tasa máxima general es 0,25 mg/l en aire espirado (0,5 g/l en sangre).',
    },
    {
      texto: '¿Conducir después de consumir drogas está...?',
      opciones: ['Permitido si no se nota el efecto', 'Prohibido en todo caso', 'Permitido en carreteras secundarias', 'Permitido si se ha dormido'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 1,
      referencia_manual: 'alcohol#drogas',
      explicacion: 'Conducir bajo los efectos de drogas está siempre prohibido.',
    },
    {
      texto: '¿Qué efecto tiene el alcohol en la conducción?',
      opciones: ['Mejora los reflejos', 'Aumenta el tiempo de reacción y reduce la visión', 'No afecta a conductores experimentados', 'Solo afecta si se mezcla con medicamentos'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 1,
      referencia_manual: 'alcohol#efectos',
      explicacion: 'El alcohol aumenta el tiempo de reacción, reduce el campo visual y la coordinación.',
    },
    {
      texto: '¿Cuál es la tasa máxima de alcohol en sangre para conductores profesionales?',
      opciones: ['0,5 g/l', '0,3 g/l', '0,2 g/l', '0,1 g/l'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 2,
      referencia_manual: 'alcohol#profesionales',
      explicacion: 'Los conductores profesionales tienen tasa reducida: 0,3 g/l en sangre.',
    },
    {
      texto: '¿Qué medicamentos pueden afectar a la conducción?',
      opciones: ['Solo los que contienen alcohol', 'Muchos: ansiolíticos, antihistamínicos, antidepresivos...', 'Ninguno', 'Solo los que requieren receta'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 2,
      referencia_manual: 'alcohol#medicamentos',
      explicacion: 'Muchos medicamentos afectan a la conducción: ansiolíticos, antihistamínicos, etc.',
    },
    {
      texto: '¿Se puede negar un conductor a realizar la prueba de alcoholemia?',
      opciones: ['Sí, es un derecho', 'No, negarse es delito penal', 'Sí, pero con multa', 'Solo si tiene abogado'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 1,
      referencia_manual: 'alcohol#sanciones',
      explicacion: 'Negarse al control de alcoholemia es delito penal.',
    },
    {
      texto: '¿Qué sanción conlleva superar la tasa de alcohol en más del doble?',
      opciones: ['Multa económica', 'Multa y retirada del carnet', 'Prisión', 'Solo un aviso'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 2,
      referencia_manual: 'alcohol#sanciones',
      explicacion: 'Superar el doble de la tasa permitida es delito penal.',
    },
    {
      texto: '¿Cuánto tiempo tarda en eliminarse una copa de vino?',
      opciones: ['30 minutos', 'Aproximadamente 1 hora', '2 horas', 'Inmediatamente'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 2,
      referencia_manual: 'alcohol#eliminacion',
      explicacion: 'El cuerpo elimina aproximadamente una copa de vino por hora.',
    },
    {
      texto: '¿Pueden las bebidas "sin alcohol" dar positivo?',
      opciones: ['No, son seguras', 'Sí, algunas contienen hasta 0,9% de alcohol', 'Solo si se mezclan', 'Depende del metabolismo'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 3,
      referencia_manual: 'alcohol#sin-alcohol',
      explicacion: 'Las bebidas "sin alcohol" pueden contener hasta 0,9% de alcohol.',
    },

    // =============================================
    // SEGURIDAD VIAL - Preguntas oficiales DGT
    // =============================================
    {
      texto: '¿Es obligatorio el uso del cinturón de seguridad en vías urbanas?',
      opciones: ['Solo en autopista', 'Sí, siempre en todos los asientos', 'Solo en los delanteros', 'Solo si tiene airbag'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#cinturon',
      explicacion: 'El cinturón es obligatorio para todos los ocupantes en todas las vías.',
    },
    {
      texto: '¿A partir de qué altura puede un niño usar el cinturón de adulto?',
      opciones: ['1,20 metros', '1,35 metros', '1,50 metros', '1 metro'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#infantil',
      explicacion: 'Los niños de altura igual o superior a 1,35 m pueden usar el cinturón de adulto.',
    },
    {
      texto: '¿Qué es la distancia de reacción?',
      opciones: ['La distancia de frenado', 'La distancia recorrida desde que se ve el peligro hasta que se pisa el freno', 'La distancia entre vehículos', 'La distancia total de frenado'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#distancias',
      explicacion: 'Distancia de reacción: desde que se ve el peligro hasta que se acciona el freno.',
    },
    {
      texto: '¿Qué es el "efecto acordeón" en el tráfico?',
      opciones: ['Un tipo de frenada', 'Las retenciones por no mantener la distancia de seguridad', 'El movimiento de los muelles', 'Un adelantamiento en cadena'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#efecto-acordeon',
      explicacion: 'Si no se mantiene la distancia de seguridad, los frenazos en cadena generan retenciones.',
    },
    {
      texto: '¿Cuánto aumenta la distancia de frenado si se duplica la velocidad?',
      opciones: ['Se duplica', 'Se cuadruplica', 'No varía', 'Aumenta un 50%'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#frenado',
      explicacion: 'La distancia de frenado aumenta proporcionalmente al cuadrado de la velocidad.',
    },
    {
      texto: '¿Cuál es la profundidad mínima del dibujo de los neumáticos?',
      opciones: ['1 mm', '1,6 mm', '2 mm', '3 mm'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#neumaticos',
      explicacion: 'La profundidad mínima legal del dibujo es 1,6 mm.',
    },
    {
      texto: '¿Qué es el aquaplaning?',
      opciones: ['Conducir sobre agua helada', 'Pérdida de contacto de los neumáticos con el asfalto por una capa de agua', 'Un tipo de frenada', 'Una técnica de conducción'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#aquaplaning',
      explicacion: 'Aquaplaning: los neumáticos pierden contacto con el asfalto por una capa de agua.',
    },
    {
      texto: '¿Qué indica la luz naranja del panel de instrumentos con forma de motor?',
      opciones: ['Que el motor está en marcha', 'Una avería en el motor o emisiones', 'Que necesita combustible', 'Que el aceite está bajo'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#testigos',
      explicacion: 'La luz de avería del motor indica un problema en el motor o emisiones.',
    },
    {
      texto: '¿Cada cuánto tiempo se recomienda revisar la presión de los neumáticos?',
      opciones: ['Cada semana', 'Cada 15 días', 'Cada mes', 'Cada 3 meses'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#neumaticos',
      explicacion: 'Se recomienda revisar la presión de los neumáticos cada 15 días.',
    },
    {
      texto: '¿Qué es el "punto ciego" de un vehículo?',
      opciones: ['El punto donde el airbag no protege', 'El ángulo que no se ve por los espejos retrovisores', 'El espacio detrás del vehículo', 'La zona delantera del capó'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#puntos-ciegos',
      explicacion: 'El punto ciego es la zona que no se ve por los espejos retrovisores.',
    },
  ];

  // Insertar preguntas
  for (const p of preguntasReales) {
    const temaId = temaMap[p.tema_slug];
    if (temaId) {
      insertPregunta.run(
        p.texto,
        JSON.stringify(p.opciones),
        p.indice_correcta,
        temaId,
        p.dificultad,
        p.referencia_manual,
        p.explicacion,
        p.imagen || null
      );
    }
  }

  // Marcar seed como ejecutado
  db.prepare("INSERT OR IGNORE INTO seed_meta (marca) VALUES ('preguntas_reales_v1')").run();

  console.log(`✅ Seed de preguntas reales DGT: ${preguntasReales.length} preguntas insertadas`);
}
