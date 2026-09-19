# Cimentaciones con no linealidad: levantamiento de zapatas (suelo sin tracción)

#: Pregunta que llegó de un usuario: «hay situaciones en que las zapatas incurren en rango no lineal, como cuando las columnas son demasiado excéntricas». Sí: el suelo EMPUJA pero no TIRA. Cuando la carga cae lejos del centro, una parte de la zapata se despega del suelo y el problema deja de ser lineal. Esta hoja lo explica con el libro de Braja M. Das, *Principles of Foundation Engineering*, 9.ª ed. (2019), §6.10–6.12, p. 235–249 (en español: *Fundamentos de ingeniería de cimentaciones*, 7.ª ed., §3.9–3.11, p. 157–171), y lo compara con el cálculo por elementos finitos de Hekatan Struct, SAP2000, SAFE y ETABS.

## 1 · Qué es la excentricidad (Das, ec. 6.50, p. 235)

#: Una columna que baja con una carga vertical Q y un momento M hace lo mismo que la carga Q sola corrida una distancia e del centro de la zapata. Esa distancia es la excentricidad:
e_x = M/Q
#: Mientras más momento, más lejos cae la carga, y más carga toma el borde de ese lado.

## 2 · La presión si el suelo pudiera tirar (Das, ecs. 6.51 y 6.52, p. 236)

#: Si la zapata es rígida y el suelo responde lineal, la presión es un plano: máxima en el borde cargado y mínima en el opuesto (B es el lado en la dirección de e):
q_max = Q/(B*L)*(1 + 6*e/B)
q_min = Q/(B*L)*(1 - 6*e/B)
#: ¿Con qué excentricidad la presión mínima llega a cero? Es cero cuando el paréntesis es cero; multiplicado por B queda (con e_{c} la excentricidad crítica):
Despejar{B - 6*e_c = 0 @ e_c}
#: Ese es el límite del NÚCLEO CENTRAL: con e hasta B/6 toda la base empuja (rectángulo o trapecio de presión). Pasado B/6 la fórmula da presión NEGATIVA, o sea el suelo tendría que TIRAR de la zapata. No lo hace: el borde se levanta, el área de contacto baja y el problema ya no es lineal (Das, p. 236).

## 3 · Pasado B/6: el triángulo (Das, ec. 6.53, p. 236, Tomlinson 1978)

#: Con el borde levantado la presión es un TRIÁNGULO. Dos condiciones lo fijan. Primera, la resultante del suelo tiene que caer bajo la carga: la resultante de un triángulo está a un tercio de su largo, medido desde el borde cargado, y la carga está a B/2 − e de ese borde, así que el largo de contacto es tres veces esa distancia:
a_c = 3*(B/2 - e)
#: Segunda, equilibrio vertical: el volumen del triángulo de presión (medio q_{t} por el largo por el ancho L) tiene que valer Q. Se despeja la presión máxima:
Despejar{Q = q_t*3*(B/2 - e)*L/2 @ q_t}
#: Es la ecuación 6.53 del libro escrita de otra forma: multiplicando arriba y abajo por 2,
q_t = 4*Q/(3*L*(B - 2*e))
#: Al crecer e, el contacto se encoge y q_{t} se dispara; con e = B/2 el contacto es cero: la zapata vuelca.

## 4 · El ejemplo 6.10 de Das (p. 247–248), tal cual el libro

#: Zapata cuadrada de 1.5 × 1.5 m desplantada a 0.7 m en arena (γ = 18 kN/m³, φ' = 30°, c' = 0), con excentricidad en DOS direcciones: e_L = 0.3 m y e_B = 0.15 m.
Bd = 1.5
Ld = 1.5
eLd = 0.3
eBd = 0.15
rL = eLd/Ld
rB = eBd/Bd
#: e_L/L = {rL} es MAYOR que 1/6: la resultante sale del núcleo y un borde se levanta. e_B/B = {rB} es menor que 1/6. Con 1/6 < e_L/L < 0.5 y e_B/B < 1/6 la carga cae en el CASO II de Highter y Anders (1985) (Das, p. 244).
#: En el caso II el área efectiva es un trapecio (ec. 6.75). El libro lee L₁ y L₂ del ábaco de la figura 6.27b: L₁/L ≈ 0.85 y L₂/L ≈ 0.21.
L1d = 0.85*Ld
L2d = 0.21*Ld
Aef = dec(0.5*(L1d + L2d)*Bd, 3)
Lef = L1d
Bef = dec(Aef/Lef, 3)
#: Con el área efectiva, la capacidad última (ec. 6.55 con c' = 0). Los factores los da el propio ejemplo: q = 0.7·18, N_q = 18.4 y N_γ = 22.4 (tabla 6.2), y los de forma y profundidad de la tabla 6.3:
qs = 0.7*18
Nq = 18.4
Ngam = 22.4
Fqs = dec(1 + (Bef/Lef)*tan(30*pi/180), 3)
Fgs = dec(1 - 0.4*(Bef/Lef), 3)
Fqd = dec(1 + 2*tan(30*pi/180)*(1 - sin(30*pi/180))^2*0.7/Bd, 3)
Qu = dec(Aef*(qs*Nq*Fqs*Fqd + 0.5*18*Bef*Ngam*Fgs), 0)
#: Sin redondear nada sale 605 kN. El libro redondea A' a 1.193 m² y B' a 0.936 m antes de seguir; con SUS redondeos:
Qu_libro = dec(1.193*(qs*Nq*1.424*1.135 + 0.5*18*0.936*Ngam*0.706), 0)
#: Q_{u} ≈ 606 kN, el número del libro. La diferencia de 1 kN es solo de redondeo.

### El ábaco sin leerlo a ojo

#: El trapecio del caso II está elegido para que su centroide caiga JUSTO bajo la carga (eso dibuja la figura 6.27a). Con esa condición el ábaco tiene fórmula cerrada (deducción de esta hoja, no del libro): con m la semisuma de L₁ y L₂,
m_c = (Ld/2 - eLd)/(1/2 + 6*rB^2)
L1c = dec(m_c + 6*m_c*rB, 4)
L2c = dec(m_c - 6*m_c*rB, 4)
Ac = dec(0.5*(L1c + L2c)*Bd, 4)
#: Da L₁/L = 0.857 y L₂/L = 0.214 (el libro lee 0.85 y 0.21) y un área efectiva un 1 % mayor que la del ábaco.

## 5 · Lo que Das supone y lo que hace el FEM

#: El área efectiva A' de Das es de CAPACIDAD DE CARGA: una presión última UNIFORME sobre la parte de la zapata cuyo centroide cae bajo la carga. No es el área que de verdad toca el suelo en servicio. Para la presión de contacto, Das (ec. 6.53) y la sección 3 suponen una zapata RÍGIDA con reparto LINEAL.
#: El FEM no supone eso: la zapata es una placa (flexible) sobre resortes que solo trabajan a compresión (el «Gap» de CSI: fuerza = k·d si el resorte se comprime, cero si se estira). Se resuelve, se apagan los resortes que quedaron en tracción y se vuelve a resolver hasta que el contacto no cambia. Mismo ejemplo 6.10, con Q = 606 kN; lo que Das no da se eligió: espesor 0.40 m, columna 0.30 m, f'c 240 kgf/cm², ks = 2000 tonf/m³. Malla 30 × 30, la misma nudo a nudo en los cuatro programas.
#tabla("Programa","q_max [tonf/m²]:3","Contacto [m²]:3","Nudos en contacto:0","vs SAP2000 [%]:4")({"SAP2000 24 (juez)","Hekatan Struct","SAFE 20","ETABS 22","Zapata RÍGIDA","Lineal (el suelo tira)"}; [81.914, 81.915, 81.915, 81.915, 82.211, 76.670]; [1.888, 1.888, 1.888, 1.888, 1.884, 2.250]; [798, 798, 798, 798, 0, 961]; [0, 0.0002, 0.0002, 0.0010, 0.36, -6.4])
#: Los cuatro programas dan lo mismo a 4 cifras y despegan el MISMO borde (798 de 961 nudos tocan). La zapata rígida da 0.36 % más de presión máxima: la placa real se flexa un poco y reparte mejor. Si se deja que el suelo tire (análisis lineal) la presión máxima sale un 6 % MENOR y hay tracción bajo el borde levantado: el lineal queda del lado inseguro.

## 6 · La animación: la presión al crecer e (una dirección)

#: La zapata del ejemplo con Q = 61.8 tonf (606 kN) y la carga moviéndose en una sola dirección, de e = 0 a e = B/3 en pasos de B/60. Hasta e = B/6 la presión es un trapecio que se inclina; en e = B/6 es un triángulo justo; pasado ese punto el borde se despega (presión cero) y el triángulo se acorta y sube. x se mide desde el borde cargado. Pasa el ratón por encima para pausar.
#anim fplot(q = ((1+sign(10-n))/2)*(27.4644*(1+0.1*n) - 27.4644*0.133333*n*x) + ((1-sign(10-n))/2)*(54.9289/(1.5-0.05*n))*((1 - x/(2.25-0.075*n)) + abs(1 - x/(2.25-0.075*n)))/2, [0 1.5]), n = 0:20
#: La presión máxima (en el borde, x = 0) y el largo de contacto en función de e, para la misma zapata:
#fplot(q_max = 27.4644*(1 + 4*x)*(1+sign(0.25-x))/2 + (54.9289/(1.5-2*x))*(1-sign(0.25-x))/2, [0 0.5])
#fplot(contacto = 1.5*(1+sign(0.25-x))/2 + 3*(0.75-x)*(1-sign(0.25-x))/2, [0 0.5])

### El FEM sobre el mismo barrido

#: Barrido con otra zapata (2 × 2 × 0.5 m, P = 60 tonf, malla 60 × 60) en Hekatan y SAP2000, frente a la fórmula de la zapata rígida:
#tabla("e/L","Fórmula q_max [tonf/m²]:3","Hekatan [tonf/m²]:3","SAP2000 [tonf/m²]:3","Contacto fórmula [m]:3","Contacto Hekatan [m]:3")({"0","1/12","1/6","1/4","1/3"}; [15.000, 22.500, 30.000, 40.000, 60.000]; [15.180, 22.464, 30.000, 40.055, 60.072]; [15.180, 22.464, 30.000, 40.052, 60.038]; [2.000, 2.000, 2.000, 1.500, 1.000]; [2.000, 2.000, 2.000, 1.502, 1.002])
#: Hasta e/L = 1/6 el problema es lineal y todo coincide; más allá, el FEM sigue a la fórmula del triángulo con el borde levantado. Hekatan y SAP2000 quedan a menos de 0.06 % (lo que queda es la tolerancia de convergencia de SAP2000, 1e-4).
