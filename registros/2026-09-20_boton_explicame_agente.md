# 20-sep-2026 — Botón «💬 Explícame» al lado del agente 🤖

Pedido de Jorge: *«en un modelo ya corrido debe estar el botón al lado, por si se
quiere explicación»*.

## ✅ Funcionó

- **El agente IA ya se puede usar.** `hekatan-ui/src/cad/aiAgent.ts` está vivo en
  la rama `sin-binario`: el botón 🤖 se monta en `getCadPanel.ts:1055`, abre la
  ventana con proveedor (Ollama local / Gemini / Groq / OpenRouter) y llama
  herramientas (`obtener_modelo`, `resultados`, `analisis_modal`, `vista`…).
- **Botón nuevo `#hk-agente-explicar`** en `montarBotonExplicar()` (aiAgent.ts):
  - sale **solo si el modelo está corrido** (`deformOutputs.deformations.size`),
    mirado cada 1.2 s. Con lienzo vacío se esconde, en vez de abrir el agente y
    que éste conteste «no hay resultados».
  - se coloca **midiendo la caja del 🤖** y pegándose a su izquierda. Con
    `right: 68px` fijo caía encima de los sliders del panel de parámetros
    (`ks computed`); el panel cambia de ancho y se pliega.
  - al pulsar manda un pedido preparado: que use `obtener_modelo` + `resultados`
    y explique estructura, cargas, apoyos, desplazamiento y equilibrio.
- Medido con puppeteer contra `localhost:4600`:
  - `?t=zapata-aislada-validacion` → botón visible, 0 `pageerror`.
  - `?t=new-blank` → botón oculto.
  - clic → el agente ejecuta `obtener_modelo` (122 nudos) y `resultados`
    (Uz −101.193 mm · Ux −5.57 mm) con Ollama `qwen2.5:7b`.

## ⏳ Falta

- **ΣFz = 0 kN** en la zapata Winkler: `leerResultados()` suma
  `deformOutputs.reactions`, y los muelles no dejan reacción de apoyo ahí. El
  agente dirá «las reacciones no equilibran» sin que sea verdad → hay que sumar
  la reacción del suelo (Σ k·u) cuando el modelo va sobre muelles.
- El «mesero» **sin IA** (guion fijo, sin clave ni internet) sigue pendiente: hoy
  el botón necesita un proveedor configurado.
