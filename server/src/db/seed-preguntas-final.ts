import { getDB } from './database';

/**
 * Preguntas finales para alcanzar 300+ preguntas únicas
 * Complementa las preguntas existentes sin duplicados
 */
export function seedPreguntasFinal(): void {
  const db = getDB();

  // Idempotente: solo se ejecuta una vez
  const marca = db.prepare("SELECT 1 FROM seed_meta WHERE marca = 'preguntas_final_v1'").get();
  if (marca) return;

  const temaMap: Record<string, number> = {};
  const temas = db.prepare('SELECT id, slug FROM temas').all() as { id: number; slug: string }[];
  for (const t of temas) {
    temaMap[t.slug] = t.id;
  }

  const insertPregunta = db.prepare(
    'INSERT INTO preguntas (texto, opciones, indice_correcta, tema_id, dificultad, referencia_manual, explicacion, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const preguntasFinales: Array<{
    texto: string;
    opciones: string[];
    indice_correcta: number;
    tema_slug: string;
    dificultad: number;
    referencia_manual: string;
    explicacion: string;
  }> = [
    // =============================================
    // NORMAS GENERALES - Preguntas adicionales
    // =============================================
    {
      texto: '¿Qué hacer si el semáforo se pone en rojo mientras se atraviesa una intersección?',
      opciones: ['Acelerar para salir rápido', 'Detenerse inmediatamente en medio del cruce', 'Completar el cruce con precaución', 'Dar marcha atrás'],
      indice_correcta: 2,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#semaforos',
      explicacion: 'Si ya se ha iniciado el cruce, completarlo con precaución.',
    },
    {
      texto: '¿Está permitido rebasar a un vehículo que ha detenido ante un paso de peatones?',
      opciones: ['Sí, si no hay peatones', 'No, está prohibido', 'Solo si hay más de un carril', 'Sí, con precaución'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#adelantamiento',
      explicacion: 'Está prohibido rebasar a un vehículo que se ha detenido ante un paso de peatones.',
    },
    {
      texto: '¿Qué distancia debe mantener con el vehículo que va delante en autopista con lluvia?',
      opciones: ['La misma que en seco', 'Al menos el doble de la distancia de seguridad normal', '50 metros', '100 metros'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#distancia',
      explicacion: 'En lluvia debe aumentarse la distancia de seguridad.',
    },
    {
      texto: '¿Qué debe hacer al aproximarse a un paso a nivel sin barreras?',
      opciones: ['Acelerar para cruzar rápido', 'Reducir velocidad y estar preparado para detenerse', 'Tocar el claxon', 'Circular por el arcén'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#paso-nivel',
      explicacion: 'Reducir velocidad y estar preparado para detenerse.',
    },
    {
      texto: '¿Está permitido.circular marcha atrás en una autopista?',
      opciones: ['Sí, si está averiado', 'No, está prohibido excepto en caso de emergencia', 'Solo en el carril derecho', 'Si no viene nadie'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 2,
      referencia_manual: 'normas-generales#prohibiciones',
      explicacion: 'Prohibido en autopista salvo emergencia.',
    },
    {
      texto: '¿Qué debe hacer si un semáforo está intermitente en amarillo?',
      opciones: ['Acelerar para pasar antes de que cambie', 'Detenerse si puede hacerlo con seguridad', 'Seguir igual', 'Tocar el claxon'],
      indice_correcta: 1,
      tema_slug: 'normas-generales',
      dificultad: 1,
      referencia_manual: 'normas-generales#semaforos',
      explicacion: 'Amarillo intermitente = precaución, detenerse si es seguro.',
    },

    // =============================================
    // SEÑALES - Preguntas adicionales
    // =============================================
    {
      texto: 'Una señal con un número 50 dentro de un círculo rojo y una barra diagonal negra indica:',
      opciones: ['Velocidad máxima 50 km/h', 'Fin de la limitación de velocidad a 50 km/h', 'Velocidad mínima 50 km/h', 'Zona de 50 km/h'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 2,
      referencia_manual: 'senales#fin-prohibicion',
      explicacion: 'Fin de la limitación de velocidad.',
    },
    {
      texto: '¿Qué indica una señal con un camión tachado en un círculo rojo?',
      opciones: ['Prohibido circular con camión', 'Fin de prohibición para camiones', 'Prohibido adelantar camiones', 'Zona de carga'],
      indice_correcta: 0,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#prohibicion',
      explicacion: 'Prohibición de circulación para camiones.',
    },
    {
      texto: 'Una señal con un peatón dentro de un triángulo rojo indica:',
      opciones: ['Zona peatonal', 'Paso de peatones', 'Prohibido peatones', 'Zona de juegos'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#peligro',
      explicacion: 'Advierte de la proximidad de un paso de peatones.',
    },
    {
      texto: '¿Qué forma tiene la señal de "ceda el paso"?',
      opciones: ['Circular blanca', 'Triángulo invertido con borde rojo', 'Octogonal roja', 'Rectangular azul'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#ceda',
      explicacion: 'Triángulo equilátero invertido con borde rojo.',
    },
    {
      texto: 'Una señal con un semáforo en un triángulo rojo advierte de:',
      opciones: ['Proximidad de un semáforo', 'Semáforo averiado', 'Prohibido el paso', 'Carril reservado'],
      indice_correcta: 0,
      tema_slug: 'senales',
      dificultad: 1,
      referencia_manual: 'senales#peligro',
      explicacion: 'Advierte de proximidad de semáforo.',
    },
    {
      texto: '¿Qué indica una señal rectangular verde con un número?',
      opciones: ['Velocidad máxima', 'Salida de autopista a kilómetro indicado', 'Distancia a la población', 'Número de carril'],
      indice_correcta: 1,
      tema_slug: 'senales',
      dificultad: 2,
      referencia_manual: 'senales#paneles',
      explicacion: 'Indica la distancia a la salida de autopista.',
    },

    // =============================================
    // VELOCIDAD - Preguntas adicionales
    // =============================================
    {
      texto: '¿Qué velocidad máxima debe respetar un ciclista en carretera?',
      opciones: ['No hay límite', 'La velocidad máxima de la vía', '50 km/h', 'No hay velocidad mínima'],
      indice_correcta: 2,
      tema_slug: 'velocidad',
      dificultad: 3,
      referencia_manual: 'velocidad#ciclistas',
      explicacion: 'Los ciclistas no pueden superar 50 km/h en vías urbanas.',
    },
    {
      texto: '¿Cuál es la distancia de frenado a 100 km/h en seco aproximadamente?',
      opciones: ['30 metros', '40 metros', '50 metros', '60 metros'],
      indice_correcta: 2,
      tema_slug: 'velocidad',
      dificultad: 3,
      referencia_manual: 'velocidad#frenado',
      explicacion: 'Aproximadamente 50 metros (depende del vehículo y condiciones).',
    },
    {
      texto: '¿Cuánto aumenta la distancia de reacción si se duplica la velocidad?',
      opciones: ['No aumenta', 'Se duplica', 'Se triplica', 'Se cuadruplica'],
      indice_correcta: 1,
      tema_slug: 'velocidad',
      dificultad: 2,
      referencia_manual: 'velocidad#distancias',
      explicacion: 'La distancia de reacción es proporcional a la velocidad.',
    },
    {
      texto: '¿Cuál es la velocidad máxima permitida para una bicicleta en vía urbana?',
      opciones: ['30 km/h', '40 km/h', '50 km/h', 'No hay límite'],
      indice_correcta: 2,
      tema_slug: 'velocidad',
      dificultad: 2,
      referencia_manual: 'velocidad#ciclistas',
      explicacion: 'Los ciclistas pueden circular hasta 50 km/h en vías urbanas.',
    },
    {
      texto: '¿Qué distancia de seguridad debe mantener un camión en autopista?',
      opciones: ['La misma que un turismo', 'El doble que un turismo', '50 metros', '100 metros'],
      indice_correcta: 1,
      tema_slug: 'velocidad',
      dificultad: 2,
      referencia_manual: 'velocidad#camiones',
      explicacion: 'Los vehículos pesados deben mantener mayor distancia.',
    },

    // =============================================
    // ADELANTAMIENTOS - Preguntas adicionales
    // =============================================
    {
      texto: '¿Está permitido adelantar a un vehículo que va a girar a la izquierda?',
      opciones: ['Sí, siempre', 'No, está prohibido', 'Solo si no hay línea continua', 'Solo por la derecha'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 2,
      referencia_manual: 'adelantamientos#prohibiciones',
      explicacion: 'No se puede adelantar a un vehículo que indica giro a la izquierda.',
    },
    {
      texto: '¿Qué debe hacer si durante un adelantamiento aparece un vehículo en sentido contrario?',
      opciones: ['Acelerar para terminar rápido', 'Reducir velocidad y reintegrarse', 'Tocar el claxon', 'Frenar bruscamente'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 1,
      referencia_manual: 'adelantamientos#emergencias',
      explicacion: 'Reducir velocidad y reintegrarse al carril.',
    },
    {
      texto: '¿Se puede adelantar en una zona de estacionamiento?',
      opciones: ['Sí, siempre', 'No, está prohibido', 'Solo si no hay vehículos estacionados', 'Solo de día'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 2,
      referencia_manual: 'adelantamientos#prohibiciones',
      explicacion: 'No se puede adelantar en zonas de estacionamiento.',
    },
    {
      texto: '¿Qué señalización debe usar al iniciar un adelantamiento?',
      opciones: ['Intermitente izquierdo', 'Intermitente derecho', 'Luces de emergencia', 'Claxon'],
      indice_correcta: 0,
      tema_slug: 'adelantamientos',
      dificultad: 1,
      referencia_manual: 'adelantamientos#senalizacion',
      explicacion: 'Señalizar con intermitente izquierdo.',
    },
    {
      texto: '¿Está permitido adelantar en una pendiente ascendente con visibilidad reducida?',
      opciones: ['Sí, con precaución', 'No, está prohibido', 'Solo si no hay línea continua', 'Solo si el vehículo va lento'],
      indice_correcta: 1,
      tema_slug: 'adelantamientos',
      dificultad: 2,
      referencia_manual: 'adelantamientos#prohibiciones',
      explicacion: 'Prohibido en pendientes con visibilidad reducida.',
    },

    // =============================================
    // PRIORIDAD - Preguntas adicionales
    // =============================================
    {
      texto: 'En una intersección con semáforo apagado, ¿qué norma se aplica?',
      opciones: ['Prioridad por la derecha', 'Todos deben detenerse', 'Prioridad por la izquierda', 'El más rápido pasa primero'],
      indice_correcta: 0,
      tema_slug: 'prioridad',
      dificultad: 2,
      referencia_manual: 'prioridad#semaforos-apagados',
      explicacion: 'Semáforo apagado = regla general de prioridad por la derecha.',
    },
    {
      texto: '¿Quién tiene prioridad en un paso a nivel con barreras abiertas?',
      opciones: ['Los trenes', 'Los vehículos, pero con precaución', 'El que llegue primero', 'Los peatones'],
      indice_correcta: 1,
      tema_slug: 'prioridad',
      dificultad: 2,
      referencia_manual: 'prioridad#paso-nivel',
      explicacion: 'Con barreras abiertas, los vehículos pueden pasar con precaución.',
    },
    {
      texto: '¿Qué debe hacer al incorporarse desde un carril de aceleración?',
      opciones: ['Acelerar mucho para mezclarse', 'Adaptar la velocidad y ceder el paso', 'Tocar el claxon', 'Entrar en cualquier carril'],
      indice_correcta: 1,
      tema_slug: 'prioridad',
      dificultad: 1,
      referencia_manual: 'prioridad#incorporaciones',
      explicacion: 'Adaptar velocidad y ceder el paso a los que circulan.',
    },
    {
      texto: '¿Quién tiene prioridad cuando dos vehículos llegan simultáneamente a un STOP?',
      opciones: ['El que esté a la derecha', 'El que llegue primero', 'El más grande', 'El que toque el claxon'],
      indice_correcta: 0,
      tema_slug: 'prioridad',
      dificultad: 2,
      referencia_manual: 'prioridad#stop',
      explicacion: 'Si ambos tienen STOP, se aplica la regla de la derecha.',
    },
    {
      texto: '¿Está permitido adelantar a un vehículo que ha detenido ante un paso de peatones?',
      opciones: ['Sí, si no hay peatones', 'No, está prohibido', 'Solo si hay más de un carril', 'Solo por la derecha'],
      indice_correcta: 1,
      tema_slug: 'prioridad',
      dificultad: 2,
      referencia_manual: 'prioridad#peatones',
      explicacion: 'Prohibido rebasar a un vehículo detenido en paso de peatones.',
    },

    // =============================================
    // LUCES - Preguntas adicionales
    // =============================================
    {
      texto: '¿Qué luces debe usar un vehículo averiado en la calzada de noche?',
      opciones: ['Solo luces de posición', 'Luces de emergencia y triángulo de preseñalización', 'Luces de cruce', 'Luces antiniebla'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 1,
      referencia_manual: 'luces#emergencias',
      explicacion: 'Luces de emergencia y triángulo de preseñalización.',
    },
    {
      texto: '¿Cuándo debe usar las luces de emergencia mientras circula?',
      opciones: ['Cuando va despacio', 'Para advertir de un peligro inminente', 'Siempre que llueva', 'Al adelantar'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 1,
      referencia_manual: 'luces#emergencias',
      explicacion: 'Para advertir de un peligro inminente.',
    },
    {
      texto: '¿Qué indica una luz verde fija en un semáforo?',
      opciones: ['Precaución', 'Paso permitido', 'Peligro', 'Alto obligatorio'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 1,
      referencia_manual: 'luces#semaforos',
      explicacion: 'Verde fija = paso permitido.',
    },
    {
      texto: '¿Qué indica una luz roja intermitente en un semáforo?',
      opciones: ['Precaución', 'Alto obligatorio', 'Paso con precaución', 'Peligro'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 2,
      referencia_manual: 'luces#semaforos',
      explicacion: 'Roja intermitente = alto obligatorio.',
    },
    {
      texto: '¿Qué luces debe usar al estacionar de noche en vía oscura?',
      opciones: ['Luces de emergencia', 'Luces de posición', 'Luces de cruce', 'Ninguna'],
      indice_correcta: 1,
      tema_slug: 'luces',
      dificultad: 2,
      referencia_manual: 'luces#posicion',
      explicacion: 'Luces de posición para que el vehículo sea visible.',
    },

    // =============================================
    // ALCOHOL - Preguntas adicionales
    // =============================================
    {
      texto: '¿Cuánto tiempo tarda en eliminarse una cerveza de 33 cl?',
      opciones: ['30 minutos', 'Aproximadamente 1 hora', '2 horas', '3 horas'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 2,
      referencia_manual: 'alcohol#eliminacion',
      explicacion: 'Aproximadamente 1 hora por bebida estándar.',
    },
    {
      texto: '¿Qué factor NO influye en la eliminación del alcohol?',
      opciones: ['El peso corporal', 'El sexo', 'El color de los ojos', 'La cantidad de comida'],
      indice_correcta: 2,
      tema_slug: 'alcohol',
      dificultad: 2,
      referencia_manual: 'alcohol#eliminacion',
      explicacion: 'El color de ojos no influye en la metabolización.',
    },
    {
      texto: '¿Cuál es la tasa de alcohol en sangre de 0,5 g/l en aire espirado?',
      opciones: ['0,15 mg/l', '0,25 mg/l', '0,50 mg/l', '0,65 mg/l'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 3,
      referencia_manual: 'alcohol#tasas',
      explicacion: '0,5 g/l en sangre equivale a 0,25 mg/l en aire espirado.',
    },
    {
      texto: '¿Qué hacer si ve a alguien conduciendo bajo los efectos del alcohol?',
      opciones: ['Ignorarlo', 'Llamar a la policía', 'Seguirle', 'Tocarle el claxon'],
      indice_correcta: 1,
      tema_slug: 'alcohol',
      dificultad: 1,
      referencia_manual: 'alcohol#seguridad',
      explicacion: 'Llamar a la policía para prevenir accidentes.',
    },
    {
      texto: '¿Cuál es la única tasa de alcohol segura para conducir?',
      opciones: ['0,2 g/l', '0,3 g/l', '0,5 g/l', '0,0 g/l'],
      indice_correcta: 3,
      tema_slug: 'alcohol',
      dificultad: 1,
      referencia_manual: 'alcohol#recomendaciones',
      explicacion: 'La única tasa segura es 0,0 g/l.',
    },

    // =============================================
    // SEGURIDAD VIAL - Preguntas adicionales
    // =============================================
    {
      texto: '¿Qué debe hacer si se queda sin frenos en una bajada?',
      opciones: ['Saltar del vehículo', 'Usar el freno motor, freno de mano y buscar rozamiento', 'Acelerar', 'Cerrar los ojos'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#emergencias',
      explicacion: 'Usar freno motor, freno de mano y buscar rozamiento.',
    },
    {
      texto: '¿Qué es el "freno motor"?',
      opciones: ['El freno de mano', 'El efecto de frenar al reducir marcha', 'Un freno especial de emergencia', 'El freno de estacionamiento'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#freno-motor',
      explicacion: 'La resistencia del motor al desacelerar.',
    },
    {
      texto: '¿Qué debe hacer si le deslumbran las luces de otro vehículo de noche?',
      opciones: ['Mirar directamente a las luces', 'Desviar la vista hacia la derecha de la calzada', 'Encender las propias largas', 'Cerrar los ojos'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#luz',
      explicacion: 'Desviar la vista hacia el borde derecho de la calzada.',
    },
    {
      texto: '¿Qué debe hacer si entra en un Aqua planing?',
      opciones: ['Frenar bruscamente', 'No frenar y mantener el volante firme', 'Girar bruscamente', 'Acelerar'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#aquaplaning',
      explicacion: 'No frenar y mantener el volante firme hasta recuperar adherencia.',
    },
    {
      texto: '¿Cada cuánto debe revisarse el nivel de líquido de frenos?',
      opciones: ['Cada semana', 'Cada 20.000 km o según fabricante', 'Nunca', 'Solo cuando frena mal'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#mantenimiento',
      explicacion: 'Según el manual del fabricante.',
    },
    {
      texto: '¿Qué indica una luz amarilla en el panel de instrumentos?',
      opciones: ['Avería grave', 'Avería o mantenimiento necesario', 'Todo correcto', 'Emergencia'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#testigos',
      explicacion: 'Luz amarilla = revisar o avería no grave.',
    },
    {
      texto: '¿Qué debe hacer si un neumático se desinfla lentamente?',
      opciones: ['Seguir hasta casa', 'Revisar la presión y repostar aire lo antes posible', 'No es importante', 'Cambiar de carril frecuentemente'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#neumaticos',
      explicacion: 'Revisar y repostar aire inmediatamente.',
    },
    {
      texto: '¿Qué es el "sistema de frenado de emergencia"?',
      opciones: ['El freno de mano', 'Un sistema que frena automáticamente en peligro inminente', 'Los frenos ABS', 'Las luces de emergencia'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#aeb',
      explicacion: 'Frena automáticamente si detecta colisión inminente.',
    },
    {
      texto: '¿Qué debe hacer si se encuentra niebla densa en carretera?',
      opciones: ['Acelerar para salir rápido', 'Reducir velocidad, encender antiniebla y aumentar distancia', 'Usar luces largas', 'Parar en el carril'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#niebla',
      explicacion: 'Reducir velocidad, antiniebla y distancia de seguridad.',
    },
    {
      texto: '¿Qué distancia mínima debe mantener con un vehículo de emergencia que tiene sirena?',
      opciones: ['5 metros', '10 metros', '15 metros', '20 metros'],
      indice_correcta: 2,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#emergencias',
      explicacion: 'Mantener al menos 15 metros de distancia.',
    },
    {
      texto: '¿Qué debe hacer si un animal cruza la carretera?',
      opciones: ['Acelerar para asustarlo', 'Reducir velocidad y no hacer maniobras bruscas', 'Tocar el claxon fuerte', 'Girar bruscamente'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#animales',
      explicacion: 'Reducir velocidad y mantener la calma.',
    },
    {
      texto: '¿Qué es el "control electrónico de estabilidad" (ESC)?',
      opciones: ['Un sistema de climatización', 'Un sistema que evita derrapes y pérdida de control', 'Un sistema de navegación', 'Un sistema de audio'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#esc',
      explicacion: 'Ayuda a mantener la estabilidad del vehículo.',
    },
    {
      texto: '¿Cuántos SRI (Sistemas de Retención Infantil) homologados existen para niños?',
      opciones: ['Solo uno', 'Varios según peso y edad', 'No importa', 'Todos son iguales'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 2,
      referencia_manual: 'seguridad#infantil',
      explicacion: 'Existen varios grupos según peso y edad del niño.',
    },
    {
      texto: '¿Qué debe hacer si el vehicle de seguridad activa sus sirenas?',
      opciones: ['Acelerar para apartarse', 'Facilitar el paso reduciendo velocidad o cambiando de carril', 'Seguir igual', 'Detenerse en seco'],
      indice_correcta: 1,
      tema_slug: 'seguridad',
      dificultad: 1,
      referencia_manual: 'seguridad#emergencias',
      explicacion: 'Facilitar el paso sin maniobras bruscas.',
    },
  ];

  // Insertar preguntas
  for (const p of preguntasFinales) {
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
        null
      );
    }
  }

  // Marcar seed como ejecutado
  db.prepare("INSERT OR IGNORE INTO seed_meta (marca) VALUES ('preguntas_final_v1')").run();

  console.log(`✅ Seed final: ${preguntasFinales.length} preguntas insertadas`);
}
