"""Plantilla Manim para explicar un elemento de Hekatan Struct (Q4 de placa/shell).

Render:  manim -pql escena_elemento_q4.py ElementoQ4      (rapido, 480p)
         manim -pqh escena_elemento_q4.py ElementoQ4      (1080p)

Para otra explicacion: copia esta clase, cambia TITULO / PASOS y las ecuaciones.
Solo Text con simbolos Unicode (κ ∂ ∫): NO usa MathTex ni LaTeX, asi corre en cualquier PC.
"""
from manim import *

TITULO = "Shell-Thin (DKE, Batoz 1982): 4 nodos, 3 GDL de placa por nodo"
PASOS = [
    ("1. Nodos y GDL", "w, θx, θy por nodo"),
    ("2. Curvaturas", "κ = {∂βx/∂x, ∂βy/∂y,\n       ∂βx/∂y + ∂βy/∂x}"),
    ("3. Rigidez", "K = ∫ (B transpuesta) · Db · B dA"),
    ("4. Momentos", "M = Db · κ"),
]


class ElementoQ4(Scene):
    def construct(self):
        titulo = Text(TITULO, font_size=26).to_edge(UP)
        self.play(Write(titulo))

        # Elemento Q4 (nodos antihorarios 1-2-3-4)
        pts = [LEFT * 2 + DOWN * 1, RIGHT * 1 + DOWN * 1, RIGHT * 1 + UP * 1.2, LEFT * 2 + UP * 1.2]
        cuad = Polygon(*pts, color=BLUE, fill_opacity=0.15)
        nodos = VGroup(*[Dot(p, color=YELLOW) for p in pts])
        etiquetas = VGroup(*[Text(str(i + 1), font_size=22).next_to(p, 0.5 * (p - cuad.get_center()), buff=0.15)
                             for i, p in enumerate(pts)])
        self.play(Create(cuad), FadeIn(nodos), FadeIn(etiquetas))

        # GDL en el nodo 1
        flecha_w = Arrow(pts[0], pts[0] + UP * 0.9, buff=0, color=GREEN)
        lw = Text("w", font_size=22, color=GREEN).next_to(flecha_w, UP, buff=0.05)
        self.play(GrowArrow(flecha_w), FadeIn(lw))

        # Pasos con ecuaciones a la derecha
        y = 1.6
        for nombre, tex in PASOS:
            t = Text(nombre, font_size=22, color=ORANGE)
            e = Text(tex, font_size=24)
            bloque = VGroup(t, e).arrange(DOWN, aligned_edge=LEFT, buff=0.12)
            bloque.move_to(np.array([1.8, y, 0]), aligned_edge=LEFT)
            self.play(FadeIn(t, shift=RIGHT * 0.2), Write(e))
            self.wait(0.6)
            y -= 1.1
        self.wait(1.5)
