import { getDB } from './database';

interface SeccionManual {
  tema_slug: string;
  titulo: string;
  contenido: string;
  orden: number;
}

function m(html: string): string {
  return html;
}

const secciones: SeccionManual[] = [
  // ========== NORMAS GENERALES ==========
  {
    tema_slug: 'normas-generales',
    titulo: 'Principios básicos de la circulación',
    orden: 1,
    contenido: m(`<h2>Principios Generales</h2>
<p>La circulación de vehículos y peatones se rige por el principio de <strong>seguridad vial</strong>. Todos los usuarios de la vía deben comportarse de forma que no entorpezcan la circulación ni causen peligro.</p>

<h3>Documentación obligatoria</h3>
<ul>
  <li><strong>Permiso de conducir</strong> en vigor y adecuado al vehículo</li>
  <li><strong>Permiso de circulación</strong> del vehículo</li>
  <li><strong>Ficha técnica</strong> del vehículo</li>
  <li><strong>Seguro obligatorio</strong> en vigor</li>
</ul>

<h3>Normas de comportamiento general</h3>
<ul>
  <li>Conducir con la diligencia y precaución necesarias</li>
  <li>No arrojar objetos a la vía</li>
  <li>No conducir con auriculares ni usando el móvil</li>
  <li>Mantener la distancia de seguridad</li>
</ul>

<h3 id="estacionamiento">Estacionamiento</h3>
<p>Está prohibido estacionar en:</p>
<ul>
  <li>Curvas y cambios de rasante con visibilidad reducida</li>
  <li>Pasos de peatones y cruces</li>
  <li>Zonas señalizadas con línea amarilla continua</li>
  <li>Carriles bus y ciclistas</li>
  <li>Lugares donde se impida la visibilidad de señales</li>
</ul>

<h3 id="cambio-sentido">Cambio de sentido</h3>
<p>Debe realizarse donde la visibilidad sea suficiente y no esté expresamente prohibido. No debe realizarse en curvas, cambios de rasante, pasos a nivel, autopistas ni autovías.</p>

<h3 id="marcas-viales">Marcas viales</h3>
<ul>
  <li><strong>Línea continua</strong>: prohibido adelantar y/o detenerse según su ubicación</li>
  <li><strong>Línea discontinua</strong>: permite adelantar si es seguro</li>
  <li><strong>Línea amarilla continua en borde</strong>: prohibido estacionar</li>
  <li><strong>Línea amarilla discontinua en borde</strong>: prohibido detenerse</li>
</ul>

<h3 id="permiso">Vigencia del permiso</h3>
<ul>
  <li>Conductores noveles: <strong>2 años</strong> de vigencia inicial</li>
  <li>Hasta 65 años: renovación cada <strong>10 años</strong></li>
  <li>A partir de 65 años: renovación cada <strong>5 años</strong></li>
</ul>`)
  },
  {
    tema_slug: 'normas-generales',
    titulo: 'Incorporaciones y cambios de carril',
    orden: 2,
    contenido: m(`<h2>Incorporaciones a la circulación</h2>
<p>Al incorporarse a la circulación desde un estacionamiento, vía privada o carril de aceleración, debe <strong>cederse el paso</strong> a los vehículos que circulan por la vía principal.</p>

<h3>Cambios de carril</h3>
<ul>
  <li>Señalizar con el intermitente con antelación suficiente</li>
  <li>Comprobar que el carril está libre y hay espacio suficiente</li>
  <li>Mirar por los espejos retrovisores</li>
  <li>Realizar el cambio de forma gradual y segura</li>
</ul>

<h3 id="peatones">Peatones</h3>
<ul>
  <li>Tienen prioridad en los pasos de peatones señalizados</li>
  <li>Deben circular por el arcén o acera, nunca por la calzada</li>
  <li>En vías sin acera, deben ir por la izquierda</li>
</ul>`)
  },

  // ========== SEÑALES ==========
  {
    tema_slug: 'senales',
    titulo: 'Clasificación de las señales',
    orden: 1,
    contenido: m(`<h2>Clasificación General</h2>

<h3>Por su forma</h3>
<ul>
  <li><strong>Circular con borde rojo</strong>: prohibición</li>
  <li><strong>Circular azul</strong>: obligación</li>
  <li><strong>Triangular con borde rojo</strong>: peligro o advertencia</li>
  <li><strong>Triangular invertido (punta abajo)</strong>: ceda el paso</li>
  <li><strong>Octogonal</strong>: STOP (única con esta forma)</li>
  <li><strong>Rectangular</strong>: información, indicación o dirección</li>
  <li><strong>Rombo amarillo</strong>: carretera prioritaria</li>
</ul>

<h3>Por su color</h3>
<ul>
  <li><strong>Rojo y blanco</strong>: señales de prohibición y peligro</li>
  <li><strong>Azul</strong>: obligación e indicación</li>
  <li><strong>Verde</strong>: dirección en autopista/autovía</li>
  <li><strong>Amarillo</strong>: advertencia temporal (obras)</li>
  <li><strong>Naranja</strong>: señalización de obras</li>
</ul>`)
  },
  {
    tema_slug: 'senales',
    titulo: 'Señales de peligro (advertencia)',
    orden: 2,
    contenido: m(`<h2>Señales de Peligro</h2>
<p>Forma triangular con borde rojo y fondo blanco. Advierten de un peligro inminente en la vía.</p>

<h3>Principales señales de peligro</h3>
<ul>
  <li><strong>Intersección</strong>: cruce con otra vía</li>
  <li><strong>Curva peligrosa</strong>: hacia la izquierda o derecha</li>
  <li><strong>Estrechamiento</strong>: la vía se reduce</li>
  <li><strong>Paso de peatones</strong>: proximidad de un paso</li>
  <li><strong>Animales en libertad</strong>: ciervos, vacas, caballos según el dibujo</li>
  <li><strong>Obras</strong>: trabajos en la vía</li>
  <li><strong>Semáforo</strong>: proximidad de semáforo</li>
  <li><strong>Paso a nivel</strong>: con barreras o sin ellas</li>
  <li><strong>Proyección de gravilla</strong>: piedras sueltas</li>
  <li><strong>Desprendimiento</strong>: caída de piedras</li>
</ul>`)
  },
  {
    tema_slug: 'senales',
    titulo: 'Señales de reglamentación',
    orden: 3,
    contenido: m(`<h2>Señales de Reglamentación</h2>
<p>Circulares con borde rojo (prohibición) o fondo azul (obligación). Su incumplimiento es sancionable.</p>

<h3>Prohibición de entrada</h3>
<ul>
  <li><strong>Círculo rojo con barra blanca horizontal</strong>: entrada prohibida</li>
  <li><strong>Círculo rojo con número</strong>: velocidad máxima</li>
  <li><strong>Dos coches lado a lado</strong>: prohibido adelantar</li>
  <li><strong>Coche y camión</strong>: prohibido adelantar para camiones</li>
</ul>

<h3>Obligación</h3>
<ul>
  <li><strong>Flecha blanca hacia arriba en azul</strong>: sentido obligatorio (seguir recto)</li>
  <li><strong>Flecha blanca hacia derecha/izquierda</strong>: girar obligatorio</li>
  <li><strong>30 en blanco sobre azul</strong>: velocidad mínima 30 km/h</li>
  <li><strong>Cadenas</strong>: obligatorio uso de cadenas para nieve</li>
</ul>

<h3 id="stop">STOP</h3>
<p>Señal octogonal roja con texto STOP blanco. Obliga a <strong>detenerse completamente</strong> en la línea de detención y ceder el paso a todos los vehículos.</p>

<h3 id="ceda">Ceda el paso</h3>
<p>Triángulo invertido con borde rojo. Obliga a <strong>ceder el paso</strong> a los vehículos que circulan por la vía preferente, pero no exige detenerse si no es necesario.</p>`)
  },

  // ========== VELOCIDAD ==========
  {
    tema_slug: 'velocidad',
    titulo: 'Límites de velocidad generales',
    orden: 1,
    contenido: m(`<h2>Velocidades Máximas por Tipo de Vía</h2>

<table class="w-full border-collapse border border-gray-300">
  <tr class="bg-gray-100">
    <th class="border p-2">Vehículo</th>
    <th class="border p-2">Autopista/Autovía</th>
    <th class="border p-2">Carretera Convencional</th>
    <th class="border p-2">Vía Urbana</th>
  </tr>
  <tr>
    <td class="border p-2">Turismo</td>
    <td class="border p-2">120 km/h</td>
    <td class="border p-2">90 km/h</td>
    <td class="border p-2">50 km/h</td>
  </tr>
  <tr>
    <td class="border p-2">Moto</td>
    <td class="border p-2">120 km/h</td>
    <td class="border p-2">90 km/h</td>
    <td class="border p-2">50 km/h</td>
  </tr>
  <tr>
    <td class="border p-2">Camión &gt; 3.500 kg</td>
    <td class="border p-2">90 km/h</td>
    <td class="border p-2">80 km/h</td>
    <td class="border p-2">50 km/h</td>
  </tr>
  <tr>
    <td class="border p-2">Autobús</td>
    <td class="border p-2">100 km/h</td>
    <td class="border p-2">90 km/h</td>
    <td class="border p-2">50 km/h</td>
  </tr>
</table>

<h3>Vías urbanas (desde 2021)</h3>
<ul>
  <li><strong>Un solo carril por sentido</strong>: 30 km/h</li>
  <li><strong>Un carril por sentido + plataforma única</strong>: 20 km/h</li>
  <li><strong>Dos o más carriles por sentido</strong>: 50 km/h</li>
</ul>

<h3 id="minima">Velocidad mínima</h3>
<ul>
  <li>Autopista/autovía: <strong>60 km/h</strong></li>
  <li>Carretera convencional: <strong>la mitad de la máxima</strong></li>
</ul>`)
  },
  {
    tema_slug: 'velocidad',
    titulo: 'Distancias de seguridad',
    orden: 2,
    contenido: m(`<h2>Distancias de Seguridad</h2>

<h3>Distancia de reacción</h3>
<p>Distancia recorrida desde que se percibe el peligro hasta que se pisa el freno. A 90 km/h son aproximadamente <strong>25 metros</strong> en 1 segundo.</p>

<h3>Distancia de frenado</h3>
<p>Distancia recorrida desde que se frena hasta que el vehículo se detiene. Se <strong>cuadruplica</strong> al duplicar la velocidad.</p>

<h3>Distancia de detención</h3>
<p>Distancia de reacción + distancia de frenado.</p>

<h3>Regla de los 2 segundos</h3>
<p>Mantener al menos 2 segundos de separación con el vehículo delantero. Se duplica en condiciones adversas (4 segundos).</p>

<h3 id="adelantamiento">Velocidad al adelantar</h3>
<p>En carretera convencional se puede superar el límite en <strong>20 km/h</strong> sin exceder 90 km/h durante la maniobra de adelantamiento.</p>`)
  },

  // ========== ADELANTAMIENTOS ==========
  {
    tema_slug: 'adelantamientos',
    titulo: 'Normas de adelantamiento',
    orden: 1,
    contenido: m(`<h2>Adelantamiento</h2>
<p>Maniobra por la que un vehículo sobrepasa a otro que circula en el mismo sentido.</p>

<h3>Requisitos</h3>
<ul>
  <li>Visibilidad suficiente y libre de peligro</li>
  <li>Señalizar con el <strong>intermitente izquierdo</strong></li>
  <li>Disponer de espacio para reintegrarse</li>
  <li>Que el vehículo que va detrás no haya iniciado un adelantamiento</li>
</ul>

<h3>Prohibiciones</h3>
<ul>
  <li>En curvas y cambios de rasante con visibilidad reducida</li>
  <li>En pasos de peatones señalizados</li>
  <li>En pasos a nivel y túneles (si un solo carril por sentido)</li>
  <li>En intersecciones (salvo que se adelante a un ciclista o se circule por vía prioritaria)</li>
  <li>Cuando la señalización lo prohíba (línea continua)</li>
</ul>

<h3>Obligaciones del adelantado</h3>
<ul>
  <li>Mantener la velocidad o reducirla ligeramente</li>
  <li>No aumentar la velocidad durante la maniobra</li>
  <li>Mantenerse a la derecha</li>
</ul>

<h3 id="ciclistas">Adelantamiento a ciclistas</h3>
<ul>
  <li>Distancia lateral mínima: <strong>1,5 metros</strong></li>
  <li>En carretera con más de un carril por sentido, debe cambiarse de carril</li>
  <li>Reducir la velocidad a 20 km/h por debajo de la máxima de la vía</li>
</ul>

<h3 id="reintegro">Reincorporación al carril</h3>
<p>Debe hacerse cuando se vea el vehículo adelantado en el <strong>espejo retrovisor</strong>, señalizando con el intermitente derecho.</p>`)
  },
  {
    tema_slug: 'adelantamientos',
    titulo: 'Adelantamiento por la derecha',
    orden: 2,
    contenido: m(`<h2>Adelantamiento por la Derecha</h2>
<p>Regla general: está <strong>prohibido</strong> adelantar por la derecha.</p>

<h3>Excepciones</h3>
<ul>
  <li>Cuando el vehículo de delante haya indicado su intención de girar a la izquierda</li>
  <li>En vías urbanas con varios carriles cuando el carril izquierdo esté congestionado</li>
  <li>En autopistas/autovías con tráfico denso en todos los carriles</li>
</ul>`)
  },

  // ========== PRIORIDAD ==========
  {
    tema_slug: 'prioridad',
    titulo: 'Reglas de prioridad',
    orden: 1,
    contenido: m(`<h2>Normas de Prioridad de Paso</h2>

<h3>Regla general: prioridad del vehículo por la derecha</h3>
<p>En un cruce sin señalizar, tiene prioridad el vehículo que se aproxima por la <strong>derecha</strong>.</p>

<h3>Excepciones a la regla de la derecha</h3>
<ul>
  <li>Vehículos que circulan por una <strong>vía prioritaria</strong> (señal de rombo amarillo)</li>
  <li>Vehículos que ya han entrado en una <strong>rotonda</strong></li>
  <li>Vehículos de <strong>emergencia</strong> con señales luminosas y acústicas</li>
  <li><strong>Peatones</strong> en pasos de peatones señalizados</li>
  <li>Vehículos que circulan por <strong>raíles</strong> (tranvías)</li>
</ul>

<h3 id="rotondas">Rotondas</h3>
<ul>
  <li>Prioridad para los vehículos que ya circulan dentro</li>
  <li>Se entra por la derecha, señalizando la salida</li>
  <li>No se debe circular por el carril exterior si se va a salir más adelante</li>
</ul>

<h3 id="semaforos">Semáforos</h3>
<ul>
  <li><strong>Verde</strong>: puede pasar</li>
  <li><strong>Amarillo fijo</strong>: detenerse si es posible hacerlo con seguridad</li>
  <li><strong>Rojo</strong>: detenerse obligatoriamente</li>
  <li><strong>Verde para peatón</strong>: detenerse y dejar pasar</li>
</ul>

<h3 id="pendientes">Pendientes estrechas</h3>
<p>Tiene prioridad el vehículo que <strong>sube</strong>, salvo que el que baja pueda apartarse más fácilmente.</p>

<h3 id="emergencias">Vehículos de emergencia</h3>
<p>Tienen prioridad absoluta con señales luminosas (V-1) y acústicas. Debe facilitarse su paso.</p>

<h3 id="paso-nivel">Pasos a nivel</h3>
<p>Los vehículos deben ceder siempre el paso a los trenes.</p>

<h3 id="estrechamientos">Estrechamientos</h3>
<p>Sin señalización, tiene prioridad el que ya haya entrado.</p>

<h3 id="estacionamiento">Salida de estacionamientos</h3>
<p>Debe cederse el paso a los vehículos que circulan por la vía.</p>`)
  },

  // ========== LUCES ==========
  {
    tema_slug: 'luces',
    titulo: 'Tipos de alumbrado y uso',
    orden: 1,
    contenido: m(`<h2>Alumbrado del Vehículo</h2>

<h3>Tipos de luces</h3>
<ul>
  <li><strong>Luces de posición</strong>: indican la presencia y anchura del vehículo. Se usan al estacionar de noche en vías urbanas</li>
  <li><strong>Luces de cruce (cortas)</strong>: iluminan la vía sin deslumbrar. Las más usadas en circulación nocturna y túneles</li>
  <li><strong>Luces de carretera (largas)</strong>: máximo alcance. Se usan en vías insuficientemente iluminadas sin otros vehículos</li>
  <li><strong>Luces antiniebla delanteras</strong>: haz ancho y bajo. Mejoran visibilidad con niebla, lluvia intensa o nieve</li>
  <li><strong>Luces antiniebla traseras</strong>: muy intensas, evitan alcances. Se usan con niebla espesa, lluvia torrencial o nieve</li>
  <li><strong>Luces de emergencia</strong>: intermitentes simultáneos. Advierten de peligro o vehículo inmovilizado</li>
  <li><strong>Luces de marcha atrás</strong>: blancas, se encienden al engranar la marcha atrás</li>
</ul>

<h3 id="cruce">Cuándo usar luces de cruce</h3>
<ul>
  <li>Desde la puesta hasta la salida del sol</li>
  <li>En túneles y pasos inferiores</li>
  <li>Con condiciones meteorológicas adversas (lluvia, niebla, nieve)</li>
  <li>En vías insuficientemente iluminadas</li>
</ul>

<h3 id="tuneles">Túneles</h3>
<p>Siempre deben encenderse las luces de cruce (o carretera si no hay otros vehículos). Incluso de día.</p>

<h3 id="largas">Luces de largo alcance</h3>
<ul>
  <li>Se usan en carreteras sin iluminación suficiente</li>
  <li>Deben cambiarse a <strong>cruce</strong> cuando se aproxime otro vehículo</li>
  <li>No deben usarse en ciudad salvo en vías insuficientemente iluminadas</li>
</ul>

<h3 id="motos">Motocicletas</h3>
<p>Deben circular <strong>siempre</strong> con las luces de cruce encendidas (24 horas).</p>`)
  },

  // ========== ALCOHOL ==========
  {
    tema_slug: 'alcohol',
    titulo: 'Alcohol y conducción',
    orden: 1,
    contenido: m(`<h2>Alcohol y Conducción</h2>

<h3 id="tasas">Tasas máximas permitidas</h3>
<table class="w-full border-collapse border border-gray-300">
  <tr class="bg-gray-100">
    <th class="border p-2">Tipo de conductor</th>
    <th class="border p-2">Sangre (g/l)</th>
    <th class="border p-2">Aire espirado (mg/l)</th>
  </tr>
  <tr>
    <td class="border p-2">General</td>
    <td class="border p-2">0,5</td>
    <td class="border p-2">0,25</td>
  </tr>
  <tr>
    <td class="border p-2">Novel (&lt;2 años)</td>
    <td class="border p-2">0,3</td>
    <td class="border p-2">0,15</td>
  </tr>
  <tr>
    <td class="border p-2">Profesional</td>
    <td class="border p-2">0,3</td>
    <td class="border p-2">0,15</td>
  </tr>
</table>

<h3 id="efectos">Efectos del alcohol</h3>
<ul>
  <li>Aumenta el <strong>tiempo de reacción</strong></li>
  <li>Reduce el <strong>campo visual</strong> (visión túnel)</li>
  <li>Disminuye la <strong>coordinación</strong> y los reflejos</li>
  <li>Provoca <strong>euforia</strong> y falsa sensación de seguridad</li>
  <li>Aumenta la <strong>somnolencia</strong></li>
</ul>

<h3 id="eliminacion">Eliminación del alcohol</h3>
<p>El cuerpo elimina aproximadamente 0,1-0,15 g/l por hora. Dormir, café o duchas frías no aceleran el proceso.</p>

<h3 id="sanciones">Sanciones</h3>
<ul>
  <li>Superar la tasa: multa de <strong>500€</strong> y 6 puntos</li>
  <li>Superar el doble de la tasa: <strong>delito penal</strong>, prisión de 3-6 meses, multa y retirada del carnet 1-4 años</li>
  <li>Negarse al control de alcoholemia: <strong>delito penal</strong> con prisión de 6 meses a 1 año</li>
</ul>

<h3 id="drogas">Drogas</h3>
<p>Conducir bajo los efectos de drogas está <strong>siempre prohibido</strong>. Las drogas más peligrosas para la conducción incluyen cannabis, cocaína, anfetaminas y éxtasis.</p>

<h3 id="medicamentos">Medicamentos</h3>
<p>Muchos medicamentos afectan a la conducción:</p>
<ul>
  <li>Ansiolíticos y tranquilizantes</li>
  <li>Antihistamínicos (alergia)</li>
  <li>Antidepresivos</li>
  <li>Relajantes musculares</li>
  <li>Analgésicos opiáceos</li>
</ul>
<p>Revisar el etiquetado: si aparece un <strong>triángulo rojo</strong> con un coche dentro, afecta a la conducción.</p>`)
  },

  // ========== SEGURIDAD ==========
  {
    tema_slug: 'seguridad',
    titulo: 'Sistemas de seguridad',
    orden: 1,
    contenido: m(`<h2>Sistemas de Seguridad</h2>

<h3 id="cinturon">Cinturón de seguridad</h3>
<ul>
  <li>Obligatorio para <strong>todos los ocupantes</strong> en todas las vías</li>
  <li>Reduce el riesgo de muerte en un <strong>50%</strong> en asientos delanteros</li>
  <li>Debe ir ajustado y sin holguras</li>
  <li>No usar dos cinturones con una misma hebilla</li>
</ul>

<h3 id="airbag">Airbag</h3>
<ul>
  <li>Complementa al cinturón, no lo sustituye</li>
  <li>Obligatorio en el asiento del conductor</li>
  <li>Explota a unos 300 km/h</li>
  <li>Mantener distancia de 25 cm entre el volante y el conductor</li>
</ul>

<h3 id="infantil">Sistemas de retención infantil (SRI)</h3>
<ul>
  <li>Obligatorio para menores de <strong>1,35 m</strong> de altura</li>
  <li>Colocar en asientos traseros siempre que sea posible</li>
  <li>Nunca en sentido contrario a la marcha con airbag activado</li>
</ul>

<h3 id="distancias">Distancias de seguridad</h3>
<ul>
  <li><strong>Distancia de reacción</strong>: 1 segundo = 25 m a 90 km/h</li>
  <li><strong>Distancia de frenado</strong>: proporcional al cuadrado de la velocidad</li>
  <li><strong>Regla de los 2 segundos</strong></li>
</ul>


<h2>Condiciones adversas</h2>

<h3 id="aquaplaning">Aquaplaning</h3>
<ul>
  <li>Pérdida de contacto de los neumáticos con el asfalto por una capa de agua</li>
  <li>Quitar el pie del acelerador, no frenar, sujetar firme el volante</li>
</ul>

<h3>Niebla</h3>
<ul>
  <li>Reducir la velocidad</li>
  <li>Usar luces antiniebla</li>
  <li>Aumentar la distancia de seguridad</li>
</ul>

<h3>Hielo</h3>
<ul>
  <li>No frenar bruscamente</li>
  <li>Usar marchas largas y reducir velocidad suavemente</li>
  <li>Peligro especial en puentes y zonas umbrías</li>
</ul>


<h2>Mantenimiento básico</h2>

<h3 id="neumaticos">Neumáticos</h3>
<ul>
  <li>Presión: revisar cada <strong>15 días</strong></li>
  <li>Profundidad mínima del dibujo: <strong>1,6 mm</strong></li>
  <li>Se recomienda cambiar el neumático a partir de 3 mm de profundidad por seguridad, aunque la ley permita llegar a 1,6 mm</li>
</ul>

<h3 id="testigos">Testigos del panel</h3>
<ul>
  <li><strong>Rojo</strong>: avería grave, detenerse</li>
  <li><strong>Naranja/Amarillo</strong>: avería que requiere revisión</li>
  <li><strong>Verde/Azul</strong>: sistemas activados funcionando</li>
</ul>

<h2 id="emergencias">Emergencias</h2>
<ul>
  <li>Si un neumático pincha: sujetar volante, no frenar brusco, reducir velocidad gradualmente</li>
  <li>Si fallan los frenos: bombear pedal, reducir marchas, freno de mano gradual</li>
  <li>Si se sale de la vía: no volver bruscamente, enderezar suavemente</li>
</ul>`)
  },
];

export function seedManual(): void {
  const db = getDB();

  const count = db.prepare('SELECT COUNT(*) as count FROM contenido_manual').get() as any;
  if (count.count > 0) return;

  const insert = db.prepare(
    'INSERT INTO contenido_manual (tema_slug, titulo, contenido, orden) VALUES (?, ?, ?, ?)'
  );

  for (const s of secciones) {
    insert.run(s.tema_slug, s.titulo, s.contenido, s.orden);
  }
}
