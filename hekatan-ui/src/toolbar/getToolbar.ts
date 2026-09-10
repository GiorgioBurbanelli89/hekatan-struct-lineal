import { State } from "vanjs-core";
import { html, render, TemplateResult } from "lit-html";
import { getThemeName, toggleTheme, onThemeChange } from "../theme";

import "./styles.css";

export function getToolbar({
  buttons,
  clickedButton,
  author,
  sourceCode,
}: {
  buttons?: string[];
  clickedButton?: State<string>;
  author?: string;
  sourceCode?: string;
}): HTMLElement {
  // Init
  const element = document.createElement("div");

  function themeLabel() {
    return getThemeName() === "dark" ? "\u2600" : "\u263E"; // sun / moon
  }

  const template = html`
    <div class="buttons-container">
      <button class="btn btn-icon" @click=${onIconClick}>
        ${getAwatifSvg()}
      </button>
      ${buttons?.map(
        (button) =>
          html`<button class="btn btn-text" @click=${onButtonClick}>
            ${button}
          </button>`
      )}
      <button class="btn btn-text btn-theme" @click=${onThemeClick} title="Toggle light/dark theme">
        ${themeLabel()}
      </button>
    </div>

    <div id="dropdown-menu" style="display: none;">
      <a
        href="${sourceCode ? sourceCode : "https://github.com/GiorgioBurbanelli89/awatif-workspace"}"
        class="dropdown-link"
        >Hekatan Struct Lineal — Source Code</a
      >
      ${author
        ? html`<a href="${author}" class="dropdown-link">Contact Author</a>`
        : ""}
      <a href="https://github.com/madil4/awatif/tree/v2.0.0" class="dropdown-link"
        >Based on awatif v2.0.0</a
      >
    </div>
  `;

  // Update
  element.id = "toolbar";

  render(template, element);

  // Keep theme button label in sync
  onThemeChange((name) => {
    const btn = element.querySelector(".btn-theme") as HTMLButtonElement;
    if (btn) btn.textContent = name === "dark" ? "\u2600" : "\u263E";
  });

  // Events
  // On button click set clickedButton value
  function onButtonClick(e: Event) {
    const button = e.target as HTMLButtonElement;
    clickedButton.val = ""; // A hack to trigger vanjs update
    setTimeout(() => (clickedButton.val = button.innerText));
  }

  // onThemeClick toggle dark/light
  function onThemeClick() {
    toggleTheme();
  }

  // onIconClick toggle dropdown menu
  function onIconClick(e: Event) {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  }

  return element;
}

// Utils
function getAwatifSvg(): TemplateResult {
  // El logo vive en la raíz del site, NO en la subcarpeta del ejemplo actual.
  //   dev:       /img/hekatan-logo.png
  //   gh-pages:  /hekatan-struct-lineal/img/hekatan-logo.png
  //
  // Antes usábamos una heurística sobre window.location.pathname pero fallaba
  // cuando la URL incluía "/index.html" explícito (pathname con 2 segmentos →
  // base = `/<page>/` incorrecto → 404).
  //
  // Solución: import.meta.env.BASE_URL de Vite, que se inyecta correctamente
  // en dev ("/") y en builds con DEPLOY_BASE ("/hekatan-struct-lineal/").
  const base = (import.meta as any).env?.BASE_URL ?? "/";
  // El logo lleva el NOMBRE: portico dorado + «Hekatan STRUCT». El icono suelto no
  // dice de que programa es, y a 26 px un cuadrado dorado no se lee como marca.
  return html`<img src="${base}img/hekatan-lockup.png" alt="Hekatan Struct"
    style="height:28px;width:auto;border-radius:6px;display:block;">`;
}
