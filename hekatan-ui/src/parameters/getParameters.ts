import { FolderApi, Pane } from "tweakpane";
import { State } from "vanjs-core";

import "./styles.css";

export type Parameters = {
  [key: string]: {
    value: State<number>;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    folder?: string;
  };
};

export function getParameters(parameters: Parameters): HTMLDivElement {
  // Init
  const parametersElm = document.createElement("div");
  const pane = new Pane({ title: "Parameters", container: parametersElm });
  const tweakParameters = convertToTweakparameters(parameters);
  const folders = new Map<string, FolderApi>();
  // Map de bindings expuestos al exterior para permitir hide/show dinámico
  // (ej. ocultar sliders L_v_i cuando i > nVanos en pórticos paramétricos).
  // Acceso: (parametersElm as any).__bindings.get("L_v4")?.hidden = true;
  const bindingsMap = new Map<string, any>();

  // Update
  parametersElm.setAttribute("id", "parameters");

  folders.set("root", pane);

  Object.entries(parameters).forEach(([key, parameter]) => {
    parameter.folder &&
      !folders.get(parameter.folder) &&
      folders.set(
        parameter.folder,
        pane.addFolder({ title: parameter.folder })
      );

    const binding = folders.get(parameter.folder ?? "root")?.addBinding(tweakParameters, key, {
      min: parameter.min || 0,
      max: parameter.max || 50,
      step: parameter.step || 0.5,
      label: parameter.label || key,
    });
    if (binding) bindingsMap.set(key, binding);
  });

  // Events: on parameters change update the state
  pane.on("change", (e) => {
    // @ts-ignore
    parameters[e.target.key].value.val = e.value;
  });

  // Exponer bindings y pane via propiedades del DOM para hide/show dinámico
  (parametersElm as any).__bindings = bindingsMap;
  (parametersElm as any).__pane = pane;

  return parametersElm;
}

// Utils
const convertToTweakparameters = (
  parameters: Parameters
): Record<string, unknown> =>
  Object.entries(parameters).reduce(
    (tweakparameters: Record<string, number>, [key, parameter]) => {
      tweakparameters[key] = parameter.value.val;
      return tweakparameters;
    },
    {}
  );
