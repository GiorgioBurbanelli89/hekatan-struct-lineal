import { c as t, __tla as __tla_0 } from "./cliModeler-ZWdfOe8-.js";
let r;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let o, d;
  o = {
    losa_L_hueco: `# losa_L_hueco: malla que genero ETABS 22 (Auto Mesh de fabrica 1.25 m, Shell-Thin)
# losa maciza t = 0.20 m, E = 25e6 kN/m2, nu = 0.2, q = -10 kN/m2, apoyos de ETABS. kN, m
node 1 0 0 0
node 2 10 0 0
node 3 10 5 0
node 4 6 5 0
node 5 6 8 0
node 6 0 8 0
node 7 2 1 0
node 8 5 1 0
node 9 5 4 0
node 10 2 4 0
node 11 5 2 0
node 12 5.574921 1.835733 0
node 13 2.783415 4.533382 0
node 14 3 4 0
node 15 4.928701 4.913685 0
node 16 5.922341 3.93334 0
node 17 5.836699 2.8528 0
node 18 5 3 0
node 19 4 4 0
node 20 3.835976 4.786628 0
node 21 8.75 0 0
node 22 8.923065 0.421143 0
node 23 8.035667 0.392462 0
node 24 7.5 0 0
node 25 7.278277 0.451055 0
node 26 6.25536 0.731863 0
node 27 6.25 0 0
node 28 5 0 0
node 29 4 1 0
node 30 3.75 0 0
node 31 3 1 0
node 32 2.5 0 0
node 33 1.25 0 0
node 34 0.735033 5.975224 0
node 35 0.481061 7.009799 0
node 36 0 6.857143 0
node 37 0 5.714286 0
node 38 1 1.071429 0
node 39 0 1.142857 0
node 40 2 2 0
node 41 0.923641 2.147553 0
node 42 0 2.285714 0
node 43 2 3 0
node 44 0.711872 3.22416 0
node 45 0 3.428571 0
node 46 0.596825 4.015114 0
node 47 0 4.571429 0
node 48 1.368417 4.960374 0
node 49 0.491311 4.815301 0
node 50 8.098056 1.230204 0
node 51 7.33939 1.331441 0
node 52 8.932916 1.339512 0
node 53 10 1.25 0
node 54 10 2.5 0
node 55 8.724035 2.468346 0
node 56 10 3.75 0
node 57 8.893743 3.767808 0
node 58 9 5 0
node 59 8 5 0
node 60 7.872646 3.854458 0
node 61 7 5 0
node 62 6.91113 3.857481 0
node 63 6.888611 2.627597 0
node 64 6.51457 1.631658 0
node 65 7.743339 2.779627 0
node 66 7.515004 2.17366 0
node 67 8.112365 1.957403 0
node 68 3.6 8 0
node 69 2.4 8 0
node 70 2.021903 6.669557 0
node 71 3.511324 6.822684 0
node 72 1.2 8 0
node 73 1.234322 7.226452 0
node 74 2.451381 5.465689 0
node 75 3.66153 5.738022 0
node 76 4.845459 5.89336 0
node 77 6 6 0
node 78 6 7 0
node 79 4.789196 6.929011 0
node 80 4.8 8 0
tri 1 11 8 12 0.20 25e6
areaload 1 -10
shelltype 1 thin
tri 2 13 10 14 0.20 25e6
areaload 2 -10
shelltype 2 thin
shell 3 4 15 9 16 0.20 25e6
areaload 3 -10
shelltype 3 thin
shell 4 11 12 17 18 0.20 25e6
areaload 4 -10
shelltype 4 thin
shell 5 18 17 16 9 0.20 25e6
areaload 5 -10
shelltype 5 thin
shell 6 13 14 19 20 0.20 25e6
areaload 6 -10
shelltype 6 thin
shell 7 19 9 15 20 0.20 25e6
areaload 7 -10
shelltype 7 thin
tri 8 21 2 22 0.20 25e6
areaload 8 -10
shelltype 8 thin
tri 9 21 22 23 0.20 25e6
areaload 9 -10
shelltype 9 thin
tri 10 24 21 23 0.20 25e6
areaload 10 -10
shelltype 10 thin
tri 11 24 23 25 0.20 25e6
areaload 11 -10
shelltype 11 thin
shell 12 24 25 26 27 0.20 25e6
areaload 12 -10
shelltype 12 thin
shell 13 27 26 8 28 0.20 25e6
areaload 13 -10
shelltype 13 thin
shell 14 8 29 30 28 0.20 25e6
areaload 14 -10
shelltype 14 thin
shell 15 29 31 32 30 0.20 25e6
areaload 15 -10
shelltype 15 thin
shell 16 31 7 33 32 0.20 25e6
areaload 16 -10
shelltype 16 thin
shell 17 34 35 36 37 0.20 25e6
areaload 17 -10
shelltype 17 thin
shell 18 38 39 1 33 0.20 25e6
areaload 18 -10
shelltype 18 thin
tri 19 38 33 7 0.20 25e6
areaload 19 -10
shelltype 19 thin
shell 20 7 40 41 38 0.20 25e6
areaload 20 -10
shelltype 20 thin
shell 21 38 41 42 39 0.20 25e6
areaload 21 -10
shelltype 21 thin
shell 22 40 43 44 41 0.20 25e6
areaload 22 -10
shelltype 22 thin
shell 23 41 44 45 42 0.20 25e6
areaload 23 -10
shelltype 23 thin
shell 24 43 10 46 44 0.20 25e6
areaload 24 -10
shelltype 24 thin
tri 25 46 47 45 0.20 25e6
areaload 25 -10
shelltype 25 thin
shell 26 10 48 49 46 0.20 25e6
areaload 26 -10
shelltype 26 thin
tri 27 46 49 47 0.20 25e6
areaload 27 -10
shelltype 27 thin
shell 28 48 34 37 49 0.20 25e6
areaload 28 -10
shelltype 28 thin
tri 29 49 37 47 0.20 25e6
areaload 29 -10
shelltype 29 thin
tri 30 35 6 36 0.20 25e6
areaload 30 -10
shelltype 30 thin
shell 31 25 23 50 51 0.20 25e6
areaload 31 -10
shelltype 31 thin
shell 32 23 22 52 50 0.20 25e6
areaload 32 -10
shelltype 32 thin
shell 33 2 53 52 22 0.20 25e6
areaload 33 -10
shelltype 33 thin
shell 34 53 54 55 52 0.20 25e6
areaload 34 -10
shelltype 34 thin
shell 35 54 56 57 55 0.20 25e6
areaload 35 -10
shelltype 35 thin
shell 36 3 58 57 56 0.20 25e6
areaload 36 -10
shelltype 36 thin
shell 37 58 59 60 57 0.20 25e6
areaload 37 -10
shelltype 37 thin
shell 38 59 61 62 60 0.20 25e6
areaload 38 -10
shelltype 38 thin
shell 39 4 16 62 61 0.20 25e6
areaload 39 -10
shelltype 39 thin
shell 40 16 17 63 62 0.20 25e6
areaload 40 -10
shelltype 40 thin
shell 41 17 12 64 63 0.20 25e6
areaload 41 -10
shelltype 41 thin
shell 42 8 26 64 12 0.20 25e6
areaload 42 -10
shelltype 42 thin
shell 43 26 25 51 64 0.20 25e6
areaload 43 -10
shelltype 43 thin
shell 44 65 55 57 60 0.20 25e6
areaload 44 -10
shelltype 44 thin
shell 45 60 62 63 65 0.20 25e6
areaload 45 -10
shelltype 45 thin
shell 46 66 51 50 67 0.20 25e6
areaload 46 -10
shelltype 46 thin
shell 47 50 52 55 67 0.20 25e6
areaload 47 -10
shelltype 47 thin
shell 48 55 65 66 67 0.20 25e6
areaload 48 -10
shelltype 48 thin
tri 49 66 65 63 0.20 25e6
areaload 49 -10
shelltype 49 thin
shell 50 66 63 64 51 0.20 25e6
areaload 50 -10
shelltype 50 thin
shell 51 68 69 70 71 0.20 25e6
areaload 51 -10
shelltype 51 thin
shell 52 69 72 73 70 0.20 25e6
areaload 52 -10
shelltype 52 thin
shell 53 72 6 35 73 0.20 25e6
areaload 53 -10
shelltype 53 thin
shell 54 35 34 70 73 0.20 25e6
areaload 54 -10
shelltype 54 thin
shell 55 34 48 74 70 0.20 25e6
areaload 55 -10
shelltype 55 thin
shell 56 10 13 74 48 0.20 25e6
areaload 56 -10
shelltype 56 thin
shell 57 13 20 75 74 0.20 25e6
areaload 57 -10
shelltype 57 thin
shell 58 20 15 76 75 0.20 25e6
areaload 58 -10
shelltype 58 thin
shell 59 4 77 76 15 0.20 25e6
areaload 59 -10
shelltype 59 thin
shell 60 77 78 79 76 0.20 25e6
areaload 60 -10
shelltype 60 thin
shell 61 5 80 79 78 0.20 25e6
areaload 61 -10
shelltype 61 thin
shell 62 80 68 71 79 0.20 25e6
areaload 62 -10
shelltype 62 thin
shell 63 75 76 79 71 0.20 25e6
areaload 63 -10
shelltype 63 thin
shell 64 71 70 74 75 0.20 25e6
areaload 64 -10
shelltype 64 thin
tri 65 45 44 46 0.20 25e6
areaload 65 -10
shelltype 65 thin
support 1 ux uy uz
support 2 ux uy uz
support 3 ux uy uz
support 4 ux uy uz
support 5 ux uy uz
support 6 ux uy uz
support 7 ux uy uz
support 8 ux uy uz
support 9 ux uy uz
support 10 ux uy uz
solve
`,
    L_sin_hueco: `# L_sin_hueco: malla que genero ETABS 22 (Auto Mesh de fabrica 1.25 m, Shell-Thin)
# losa maciza t = 0.20 m, E = 25e6 kN/m2, nu = 0.2, q = -10 kN/m2, apoyos de ETABS. kN, m
node 1 0 0 0
node 2 10 0 0
node 3 10 5 0
node 4 6 5 0
node 5 6 8 0
node 6 0 8 0
node 7 10 1.25 0
node 8 8.712682 1.232082 0
node 9 8.75 0 0
node 10 7.440824 1.187107 0
node 11 7.5 0 0
node 12 6.210207 1.142298 0
node 13 6.25 0 0
node 14 4.982119 1.124988 0
node 15 5 0 0
node 16 3.744494 1.126711 0
node 17 3.75 0 0
node 18 2.499613 1.134932 0
node 19 2.5 0 0
node 20 1.250924 1.140708 0
node 21 1.25 0 0
node 22 0 1.142857 0
node 23 8 5 0
node 24 7 5 0
node 25 6.935451 4.331755 0
node 26 7.805813 4.383268 0
node 27 5.959306 4.462436 0
node 28 5.045385 5.47476 0
node 29 4.942223 4.749421 0
node 30 4.0868 6.006276 0
node 31 3.87273 5.099327 0
node 32 3 6.5 0
node 33 2.698622 5.471417 0
node 34 2 7 0
node 35 1.355392 5.901684 0
node 36 1 7.5 0
node 37 0.785131 6.752942 0
node 38 0 6.857143 0
node 39 0 5.714286 0
node 40 0 4.571429 0
node 41 1.297197 4.566743 0
node 42 0 3.428571 0
node 43 1.267496 3.401663 0
node 44 0 2.285714 0
node 45 1.255461 2.273199 0
node 46 2.504999 2.241288 0
node 47 2.520524 3.312836 0
node 48 3.7403 2.199521 0
node 49 3.736123 3.20569 0
node 50 4.949107 2.173535 0
node 51 4.898547 3.123377 0
node 52 6.12321 2.204707 0
node 53 5.984096 3.144538 0
node 54 7.28898 2.337636 0
node 55 6.930083 3.479732 0
node 56 8.620912 2.471942 0
node 57 8.471362 3.816988 0
node 58 10 2.5 0
node 59 10 3.75 0
node 60 9 5 0
node 61 5.942242 3.761383 0
node 62 4.887502 3.950683 0
node 63 3.766249 4.160025 0
node 64 2.570648 4.377755 0
node 65 1.2 8 0
node 66 4.433094 6.948683 0
node 67 3.054102 6.962569 0
node 68 5.159493 6.141148 0
node 69 6 6 0
node 70 6 7 0
node 71 4.8 8 0
node 72 3.6 8 0
node 73 3.6 7.58 0
node 74 2.4 8 0
node 75 2.4 7.58 0
node 76 1.63 7.5 0
shell 1 2 7 8 9 0.20 25e6
areaload 1 -10
shelltype 1 thin
shell 2 9 8 10 11 0.20 25e6
areaload 2 -10
shelltype 2 thin
shell 3 11 10 12 13 0.20 25e6
areaload 3 -10
shelltype 3 thin
shell 4 13 12 14 15 0.20 25e6
areaload 4 -10
shelltype 4 thin
shell 5 15 14 16 17 0.20 25e6
areaload 5 -10
shelltype 5 thin
shell 6 17 16 18 19 0.20 25e6
areaload 6 -10
shelltype 6 thin
shell 7 19 18 20 21 0.20 25e6
areaload 7 -10
shelltype 7 thin
shell 8 21 20 22 1 0.20 25e6
areaload 8 -10
shelltype 8 thin
shell 9 23 24 25 26 0.20 25e6
areaload 9 -10
shelltype 9 thin
shell 10 24 4 27 25 0.20 25e6
areaload 10 -10
shelltype 10 thin
shell 11 4 28 29 27 0.20 25e6
areaload 11 -10
shelltype 11 thin
shell 12 28 30 31 29 0.20 25e6
areaload 12 -10
shelltype 12 thin
shell 13 30 32 33 31 0.20 25e6
areaload 13 -10
shelltype 13 thin
shell 14 32 34 35 33 0.20 25e6
areaload 14 -10
shelltype 14 thin
shell 15 34 36 37 35 0.20 25e6
areaload 15 -10
shelltype 15 thin
shell 16 36 6 38 37 0.20 25e6
areaload 16 -10
shelltype 16 thin
shell 17 38 39 35 37 0.20 25e6
areaload 17 -10
shelltype 17 thin
shell 18 39 40 41 35 0.20 25e6
areaload 18 -10
shelltype 18 thin
shell 19 40 42 43 41 0.20 25e6
areaload 19 -10
shelltype 19 thin
shell 20 44 45 43 42 0.20 25e6
areaload 20 -10
shelltype 20 thin
shell 21 45 46 47 43 0.20 25e6
areaload 21 -10
shelltype 21 thin
shell 22 46 48 49 47 0.20 25e6
areaload 22 -10
shelltype 22 thin
shell 23 48 50 51 49 0.20 25e6
areaload 23 -10
shelltype 23 thin
shell 24 50 52 53 51 0.20 25e6
areaload 24 -10
shelltype 24 thin
shell 25 52 54 55 53 0.20 25e6
areaload 25 -10
shelltype 25 thin
shell 26 54 56 57 55 0.20 25e6
areaload 26 -10
shelltype 26 thin
shell 27 58 59 57 56 0.20 25e6
areaload 27 -10
shelltype 27 thin
shell 28 3 60 57 59 0.20 25e6
areaload 28 -10
shelltype 28 thin
shell 29 60 23 26 57 0.20 25e6
areaload 29 -10
shelltype 29 thin
shell 30 55 57 26 25 0.20 25e6
areaload 30 -10
shelltype 30 thin
tri 31 61 53 55 0.20 25e6
areaload 31 -10
shelltype 31 thin
shell 32 61 55 25 27 0.20 25e6
areaload 32 -10
shelltype 32 thin
shell 33 27 29 62 61 0.20 25e6
areaload 33 -10
shelltype 33 thin
shell 34 29 31 63 62 0.20 25e6
areaload 34 -10
shelltype 34 thin
shell 35 31 33 64 63 0.20 25e6
areaload 35 -10
shelltype 35 thin
shell 36 33 35 41 64 0.20 25e6
areaload 36 -10
shelltype 36 thin
shell 37 61 62 51 53 0.20 25e6
areaload 37 -10
shelltype 37 thin
shell 38 62 63 49 51 0.20 25e6
areaload 38 -10
shelltype 38 thin
shell 39 63 64 47 49 0.20 25e6
areaload 39 -10
shelltype 39 thin
shell 40 64 41 43 47 0.20 25e6
areaload 40 -10
shelltype 40 thin
shell 41 7 58 56 8 0.20 25e6
areaload 41 -10
shelltype 41 thin
shell 42 8 56 54 10 0.20 25e6
areaload 42 -10
shelltype 42 thin
shell 43 10 54 52 12 0.20 25e6
areaload 43 -10
shelltype 43 thin
shell 44 12 52 50 14 0.20 25e6
areaload 44 -10
shelltype 44 thin
shell 45 14 50 48 16 0.20 25e6
areaload 45 -10
shelltype 45 thin
shell 46 16 48 46 18 0.20 25e6
areaload 46 -10
shelltype 46 thin
shell 47 18 46 45 20 0.20 25e6
areaload 47 -10
shelltype 47 thin
shell 48 20 45 44 22 0.20 25e6
areaload 48 -10
shelltype 48 thin
tri 49 6 36 65 0.20 25e6
areaload 49 -10
shelltype 49 thin
shell 50 32 30 66 67 0.20 25e6
areaload 50 -10
shelltype 50 thin
shell 51 30 28 68 66 0.20 25e6
areaload 51 -10
shelltype 51 thin
shell 52 28 4 69 68 0.20 25e6
areaload 52 -10
shelltype 52 thin
tri 53 68 69 70 0.20 25e6
areaload 53 -10
shelltype 53 thin
shell 54 5 71 66 70 0.20 25e6
areaload 54 -10
shelltype 54 thin
shell 55 71 72 73 66 0.20 25e6
areaload 55 -10
shelltype 55 thin
shell 56 72 74 75 73 0.20 25e6
areaload 56 -10
shelltype 56 thin
shell 57 74 65 76 75 0.20 25e6
areaload 57 -10
shelltype 57 thin
tri 58 76 65 36 0.20 25e6
areaload 58 -10
shelltype 58 thin
tri 59 34 32 67 0.20 25e6
areaload 59 -10
shelltype 59 thin
tri 60 67 66 73 0.20 25e6
areaload 60 -10
shelltype 60 thin
tri 61 75 76 67 0.20 25e6
areaload 61 -10
shelltype 61 thin
tri 62 70 66 68 0.20 25e6
areaload 62 -10
shelltype 62 thin
tri 63 36 34 76 0.20 25e6
areaload 63 -10
shelltype 63 thin
tri 64 67 76 34 0.20 25e6
areaload 64 -10
shelltype 64 thin
tri 65 67 73 75 0.20 25e6
areaload 65 -10
shelltype 65 thin
support 1 ux uy uz
support 2 ux uy uz
support 3 ux uy uz
support 4 ux uy uz
support 5 ux uy uz
support 6 ux uy uz
solve
`,
    rect_con_hueco: `# rect_con_hueco: malla que genero ETABS 22 (Auto Mesh de fabrica 1.25 m, Shell-Thin)
# losa maciza t = 0.20 m, E = 25e6 kN/m2, nu = 0.2, q = -10 kN/m2, apoyos de ETABS. kN, m
node 1 0 0 0
node 2 10 0 0
node 3 10 8 0
node 4 0 8 0
node 5 2 1 0
node 6 5 1 0
node 7 5 4 0
node 8 2 4 0
node 9 7.183235 0.332413 0
node 10 8 0.4 0
node 11 7.913501 0.706553 0
node 12 7.108431 0.756854 0
node 13 9 0.2 0
node 14 8.668245 0.589464 0
node 15 9.035004 0.912716 0
node 16 8.238872 1.427939 0
node 17 7.485461 1.936085 0
node 18 7.183991 1.128242 0
node 19 6.651387 2.398721 0
node 20 6.138424 1.00639 0
node 21 5.677118 2.415989 0
node 22 5.89486 3.185809 0
node 23 5 3 0
node 24 5 2 0
node 25 6.142915 0.584701 0
node 26 3 4 0
node 27 2.819872 4.757532 0
node 28 1.957981 4.531713 0
node 29 4 4 0
node 30 3.671376 4.524535 0
node 31 4.204282 4.826438 0
node 32 3.376282 5.433048 0
node 33 2.561391 6.120218 0
node 34 1.956811 5.456226 0
node 35 1.78623 6.679776 0
node 36 1.312814 5.999757 0
node 37 0.930381 7.234753 0
node 38 0.580363 6.742611 0
node 39 0.528724 5.677902 0
node 40 0.965203 5.505088 0
node 41 1.015151 4.748095 0
node 42 1.347872 4.993478 0
node 43 8.75 0 0
node 44 7.5 0 0
node 45 6.25 0 0
node 46 5 0 0
node 47 4 1 0
node 48 3.75 0 0
node 49 3 1 0
node 50 2.5 0 0
node 51 1.25 0 0
node 52 0 6.857143 0
node 53 0 5.714286 0
node 54 1 1.071429 0
node 55 0 1.142857 0
node 56 2 2 0
node 57 0.928765 2.147056 0
node 58 0 2.285714 0
node 59 2 3 0
node 60 0.816416 3.176247 0
node 61 0 3.428571 0
node 62 0.780282 4.041537 0
node 63 0 4.571429 0
node 64 0.448858 4.768837 0
node 65 10 3.428571 0
node 66 10 4.571429 0
node 67 9.085762 4.679477 0
node 68 8.96659 3.619905 0
node 69 10 5.714286 0
node 70 8.922935 5.650302 0
node 71 10 6.857143 0
node 72 8.598503 6.606782 0
node 73 8.75 8 0
node 74 7.5 8 0
node 75 7.317257 6.918619 0
node 76 6.25 8 0
node 77 6.076352 6.889661 0
node 78 5 8 0
node 79 4.837142 7.155261 0
node 80 3.75 8 0
node 81 3.803937 7.149357 0
node 82 2.5 8 0
node 83 2.898449 7.270178 0
node 84 1.25 8 0
node 85 2.249224 7.173822 0
node 86 3.084251 6.747721 0
node 87 3.935308 6.030884 0
node 88 4.806646 5.362744 0
node 89 5.562891 4.598839 0
node 90 6.271528 3.914858 0
node 91 7.095835 3.374805 0
node 92 7.851061 2.635462 0
node 93 8.495162 2.074581 0
node 94 9.187874 1.665145 0
node 95 10 1.142857 0
node 96 10 2.285714 0
node 97 9.208972 2.539473 0
node 98 8.305107 3.164291 0
node 99 8.669747 2.592782 0
node 100 4.530992 6.583849 0
node 101 6.23263 5.108138 0
node 102 5.576075 5.990548 0
node 103 6.720944 5.627155 0
node 104 7.126178 6.124217 0
node 105 6.478761 6.340742 0
node 106 6.258593 5.986148 0
node 107 6.573977 4.480719 0
node 108 6.850934 4.805766 0
node 109 7.726287 3.81006 0
node 110 7.312556 4.398508 0
node 111 6.994122 4.084677 0
node 112 8.015333 5.559802 0
node 113 7.711384 4.87286 0
node 114 7.324649 5.216396 0
node 115 8.210938 4.29025 0
node 116 8.437344 4.843176 0
shell 1 9 10 11 12 0.20 25e6
areaload 1 -10
shelltype 1 thin
shell 2 10 13 14 11 0.20 25e6
areaload 2 -10
shelltype 2 thin
tri 3 13 2 15 0.20 25e6
areaload 3 -10
shelltype 3 thin
shell 4 15 16 11 14 0.20 25e6
areaload 4 -10
shelltype 4 thin
shell 5 16 17 18 11 0.20 25e6
areaload 5 -10
shelltype 5 thin
shell 6 17 19 20 18 0.20 25e6
areaload 6 -10
shelltype 6 thin
tri 7 21 20 19 0.20 25e6
areaload 7 -10
shelltype 7 thin
shell 8 22 7 23 21 0.20 25e6
areaload 8 -10
shelltype 8 thin
tri 9 21 23 24 0.20 25e6
areaload 9 -10
shelltype 9 thin
shell 10 6 25 20 24 0.20 25e6
areaload 10 -10
shelltype 10 thin
shell 11 25 9 12 20 0.20 25e6
areaload 11 -10
shelltype 11 thin
tri 12 12 11 18 0.20 25e6
areaload 12 -10
shelltype 12 thin
tri 13 12 18 20 0.20 25e6
areaload 13 -10
shelltype 13 thin
shell 14 8 26 27 28 0.20 25e6
areaload 14 -10
shelltype 14 thin
shell 15 26 29 30 27 0.20 25e6
areaload 15 -10
shelltype 15 thin
shell 16 29 7 31 30 0.20 25e6
areaload 16 -10
shelltype 16 thin
shell 17 31 32 27 30 0.20 25e6
areaload 17 -10
shelltype 17 thin
shell 18 32 33 34 27 0.20 25e6
areaload 18 -10
shelltype 18 thin
shell 19 33 35 36 34 0.20 25e6
areaload 19 -10
shelltype 19 thin
shell 20 37 38 36 35 0.20 25e6
areaload 20 -10
shelltype 20 thin
shell 21 38 39 40 36 0.20 25e6
areaload 21 -10
shelltype 21 thin
tri 22 40 39 41 0.20 25e6
areaload 22 -10
shelltype 22 thin
shell 23 41 8 28 42 0.20 25e6
areaload 23 -10
shelltype 23 thin
shell 24 42 28 27 34 0.20 25e6
areaload 24 -10
shelltype 24 thin
shell 25 34 36 40 42 0.20 25e6
areaload 25 -10
shelltype 25 thin
tri 26 37 4 38 0.20 25e6
areaload 26 -10
shelltype 26 thin
tri 27 43 2 13 0.20 25e6
areaload 27 -10
shelltype 27 thin
tri 28 43 13 10 0.20 25e6
areaload 28 -10
shelltype 28 thin
tri 29 44 43 10 0.20 25e6
areaload 29 -10
shelltype 29 thin
tri 30 44 10 9 0.20 25e6
areaload 30 -10
shelltype 30 thin
tri 31 9 25 45 0.20 25e6
areaload 31 -10
shelltype 31 thin
shell 32 45 25 6 46 0.20 25e6
areaload 32 -10
shelltype 32 thin
shell 33 6 47 48 46 0.20 25e6
areaload 33 -10
shelltype 33 thin
shell 34 47 49 50 48 0.20 25e6
areaload 34 -10
shelltype 34 thin
shell 35 49 5 51 50 0.20 25e6
areaload 35 -10
shelltype 35 thin
shell 36 39 38 52 53 0.20 25e6
areaload 36 -10
shelltype 36 thin
shell 37 54 55 1 51 0.20 25e6
areaload 37 -10
shelltype 37 thin
tri 38 54 51 5 0.20 25e6
areaload 38 -10
shelltype 38 thin
shell 39 5 56 57 54 0.20 25e6
areaload 39 -10
shelltype 39 thin
shell 40 54 57 58 55 0.20 25e6
areaload 40 -10
shelltype 40 thin
shell 41 56 59 60 57 0.20 25e6
areaload 41 -10
shelltype 41 thin
shell 42 57 60 61 58 0.20 25e6
areaload 42 -10
shelltype 42 thin
shell 43 59 8 62 60 0.20 25e6
areaload 43 -10
shelltype 43 thin
shell 44 60 62 63 61 0.20 25e6
areaload 44 -10
shelltype 44 thin
tri 45 41 64 62 0.20 25e6
areaload 45 -10
shelltype 45 thin
tri 46 62 64 63 0.20 25e6
areaload 46 -10
shelltype 46 thin
shell 47 41 39 53 64 0.20 25e6
areaload 47 -10
shelltype 47 thin
tri 48 64 53 63 0.20 25e6
areaload 48 -10
shelltype 48 thin
tri 49 38 4 52 0.20 25e6
areaload 49 -10
shelltype 49 thin
shell 50 65 66 67 68 0.20 25e6
areaload 50 -10
shelltype 50 thin
shell 51 66 69 70 67 0.20 25e6
areaload 51 -10
shelltype 51 thin
shell 52 69 71 72 70 0.20 25e6
areaload 52 -10
shelltype 52 thin
shell 53 3 73 72 71 0.20 25e6
areaload 53 -10
shelltype 53 thin
shell 54 73 74 75 72 0.20 25e6
areaload 54 -10
shelltype 54 thin
shell 55 74 76 77 75 0.20 25e6
areaload 55 -10
shelltype 55 thin
shell 56 76 78 79 77 0.20 25e6
areaload 56 -10
shelltype 56 thin
shell 57 78 80 81 79 0.20 25e6
areaload 57 -10
shelltype 57 thin
shell 58 80 82 83 81 0.20 25e6
areaload 58 -10
shelltype 58 thin
shell 59 82 84 85 83 0.20 25e6
areaload 59 -10
shelltype 59 thin
shell 60 37 35 85 84 0.20 25e6
areaload 60 -10
shelltype 60 thin
shell 61 35 33 86 85 0.20 25e6
areaload 61 -10
shelltype 61 thin
shell 62 33 32 87 86 0.20 25e6
areaload 62 -10
shelltype 62 thin
shell 63 32 31 88 87 0.20 25e6
areaload 63 -10
shelltype 63 thin
shell 64 31 7 89 88 0.20 25e6
areaload 64 -10
shelltype 64 thin
shell 65 7 22 90 89 0.20 25e6
areaload 65 -10
shelltype 65 thin
shell 66 22 19 91 90 0.20 25e6
areaload 66 -10
shelltype 66 thin
shell 67 19 17 92 91 0.20 25e6
areaload 67 -10
shelltype 67 thin
shell 68 17 16 93 92 0.20 25e6
areaload 68 -10
shelltype 68 thin
shell 69 16 15 94 93 0.20 25e6
areaload 69 -10
shelltype 69 thin
shell 70 2 95 94 15 0.20 25e6
areaload 70 -10
shelltype 70 thin
shell 71 95 96 97 94 0.20 25e6
areaload 71 -10
shelltype 71 thin
shell 72 96 65 68 97 0.20 25e6
areaload 72 -10
shelltype 72 thin
shell 73 98 92 93 99 0.20 25e6
areaload 73 -10
shelltype 73 thin
shell 74 93 94 97 99 0.20 25e6
areaload 74 -10
shelltype 74 thin
shell 75 97 68 98 99 0.20 25e6
areaload 75 -10
shelltype 75 thin
tri 76 83 85 86 0.20 25e6
areaload 76 -10
shelltype 76 thin
tri 77 83 86 81 0.20 25e6
areaload 77 -10
shelltype 77 thin
tri 78 100 79 81 0.20 25e6
areaload 78 -10
shelltype 78 thin
shell 79 100 81 86 87 0.20 25e6
areaload 79 -10
shelltype 79 thin
shell 80 88 89 101 102 0.20 25e6
areaload 80 -10
shelltype 80 thin
shell 81 102 100 87 88 0.20 25e6
areaload 81 -10
shelltype 81 thin
shell 82 103 104 105 106 0.20 25e6
areaload 82 -10
shelltype 82 thin
shell 83 77 102 106 105 0.20 25e6
areaload 83 -10
shelltype 83 thin
tri 84 105 104 75 0.20 25e6
areaload 84 -10
shelltype 84 thin
tri 85 106 102 101 0.20 25e6
areaload 85 -10
shelltype 85 thin
shell 86 77 79 100 102 0.20 25e6
areaload 86 -10
shelltype 86 thin
tri 87 107 108 101 0.20 25e6
areaload 87 -10
shelltype 87 thin
shell 88 107 101 89 90 0.20 25e6
areaload 88 -10
shelltype 88 thin
shell 89 91 92 98 109 0.20 25e6
areaload 89 -10
shelltype 89 thin
shell 90 110 108 107 111 0.20 25e6
areaload 90 -10
shelltype 90 thin
tri 91 111 107 90 0.20 25e6
areaload 91 -10
shelltype 91 thin
shell 92 91 109 110 111 0.20 25e6
areaload 92 -10
shelltype 92 thin
tri 93 112 70 72 0.20 25e6
areaload 93 -10
shelltype 93 thin
shell 94 112 72 75 104 0.20 25e6
areaload 94 -10
shelltype 94 thin
shell 95 108 110 113 114 0.20 25e6
areaload 95 -10
shelltype 95 thin
shell 96 114 103 101 108 0.20 25e6
areaload 96 -10
shelltype 96 thin
tri 97 114 113 112 0.20 25e6
areaload 97 -10
shelltype 97 thin
shell 98 114 112 104 103 0.20 25e6
areaload 98 -10
shelltype 98 thin
shell 99 109 98 68 115 0.20 25e6
areaload 99 -10
shelltype 99 thin
shell 100 115 113 110 109 0.20 25e6
areaload 100 -10
shelltype 100 thin
shell 101 67 70 112 116 0.20 25e6
areaload 101 -10
shelltype 101 thin
shell 102 112 113 115 116 0.20 25e6
areaload 102 -10
shelltype 102 thin
shell 103 115 68 67 116 0.20 25e6
areaload 103 -10
shelltype 103 thin
tri 104 84 4 37 0.20 25e6
areaload 104 -10
shelltype 104 thin
tri 105 15 14 13 0.20 25e6
areaload 105 -10
shelltype 105 thin
tri 106 19 22 21 0.20 25e6
areaload 106 -10
shelltype 106 thin
tri 107 24 20 21 0.20 25e6
areaload 107 -10
shelltype 107 thin
tri 108 41 42 40 0.20 25e6
areaload 108 -10
shelltype 108 thin
tri 109 45 44 9 0.20 25e6
areaload 109 -10
shelltype 109 thin
tri 110 62 8 41 0.20 25e6
areaload 110 -10
shelltype 110 thin
tri 111 75 77 105 0.20 25e6
areaload 111 -10
shelltype 111 thin
tri 112 101 103 106 0.20 25e6
areaload 112 -10
shelltype 112 thin
tri 113 90 91 111 0.20 25e6
areaload 113 -10
shelltype 113 thin
support 1 ux uy uz
support 2 ux uy uz
support 3 ux uy uz
support 4 ux uy uz
support 5 ux uy uz
support 6 ux uy uz
support 7 ux uy uz
support 8 ux uy uz
solve
`,
    losa_T: `# losa_T: malla que genero ETABS 22 (Auto Mesh de fabrica 1.25 m, Shell-Thin)
# losa maciza t = 0.20 m, E = 25e6 kN/m2, nu = 0.2, q = -10 kN/m2, apoyos de ETABS. kN, m
node 1 0 0 0
node 2 4 0 0
node 3 4 6 0
node 4 8 6 0
node 5 8 8 0
node 6 -4 8 0
node 7 -4 6 0
node 8 0 6 0
node 9 4 1.2 0
node 10 3 1.2 0
node 11 3 0 0
node 12 4 2.4 0
node 13 3 2.4 0
node 14 4 3.6 0
node 15 3.000803 3.591322 0
node 16 4 4.8 0
node 17 3.003975 4.733821 0
node 18 3.01289 5.755132 0
node 19 2 1.2 0
node 20 2 0 0
node 21 2 2.4 0
node 22 2.000582 3.584971 0
node 23 2.000478 4.699648 0
node 24 1.999609 5.690868 0
node 25 1 1.2 0
node 26 1 0 0
node 27 1 2.4 0
node 28 0.999433 3.581577 0
node 29 0.996508 4.712038 0
node 30 0.986542 5.738675 0
node 31 0 1.2 0
node 32 0 2.4 0
node 33 0 3.6 0
node 34 0 4.8 0
node 35 0.951461 6.524658 0
node 36 -0.044781 6.553684 0
node 37 1.999199 6.507868 0
node 38 3.046724 6.521732 0
node 39 4.044133 6.555088 0
node 40 5 6 0
node 41 4.852422 6.498012 0
node 42 6 6 0
node 43 5.510546 6.935574 0
node 44 7 6 0
node 45 6.827637 6.983893 0
node 46 6.8 8 0
node 47 5.6 8 0
node 48 4.4 8 0
node 49 4.270966 7.187218 0
node 50 3.2 8 0
node 51 3.12901 7.244162 0
node 52 2 8 0
node 53 1.998902 7.251582 0
node 54 0.8 8 0
node 55 0.868339 7.241563 0
node 56 -0.4 8 0
node 57 -0.272536 7.182889 0
node 58 -1.6 8 0
node 59 -1.510908 6.933407 0
node 60 -2.8 8 0
node 61 -2.827727 6.983352 0
node 62 -3 6 0
node 63 -2 6 0
node 64 -1 6 0
node 65 -0.851897 6.495697 0
node 66 8 7 0
node 67 -4 7 0
shell 1 2 9 10 11 0.20 25e6
areaload 1 -10
shelltype 1 thin
shell 2 9 12 13 10 0.20 25e6
areaload 2 -10
shelltype 2 thin
shell 3 12 14 15 13 0.20 25e6
areaload 3 -10
shelltype 3 thin
shell 4 14 16 17 15 0.20 25e6
areaload 4 -10
shelltype 4 thin
shell 5 16 3 18 17 0.20 25e6
areaload 5 -10
shelltype 5 thin
shell 6 11 10 19 20 0.20 25e6
areaload 6 -10
shelltype 6 thin
shell 7 10 13 21 19 0.20 25e6
areaload 7 -10
shelltype 7 thin
shell 8 13 15 22 21 0.20 25e6
areaload 8 -10
shelltype 8 thin
shell 9 15 17 23 22 0.20 25e6
areaload 9 -10
shelltype 9 thin
shell 10 17 18 24 23 0.20 25e6
areaload 10 -10
shelltype 10 thin
shell 11 20 19 25 26 0.20 25e6
areaload 11 -10
shelltype 11 thin
shell 12 19 21 27 25 0.20 25e6
areaload 12 -10
shelltype 12 thin
shell 13 21 22 28 27 0.20 25e6
areaload 13 -10
shelltype 13 thin
shell 14 22 23 29 28 0.20 25e6
areaload 14 -10
shelltype 14 thin
shell 15 23 24 30 29 0.20 25e6
areaload 15 -10
shelltype 15 thin
shell 16 26 25 31 1 0.20 25e6
areaload 16 -10
shelltype 16 thin
shell 17 25 27 32 31 0.20 25e6
areaload 17 -10
shelltype 17 thin
shell 18 27 28 33 32 0.20 25e6
areaload 18 -10
shelltype 18 thin
shell 19 28 29 34 33 0.20 25e6
areaload 19 -10
shelltype 19 thin
shell 20 29 30 8 34 0.20 25e6
areaload 20 -10
shelltype 20 thin
shell 21 8 30 35 36 0.20 25e6
areaload 21 -10
shelltype 21 thin
shell 22 30 24 37 35 0.20 25e6
areaload 22 -10
shelltype 22 thin
shell 23 24 18 38 37 0.20 25e6
areaload 23 -10
shelltype 23 thin
shell 24 18 3 39 38 0.20 25e6
areaload 24 -10
shelltype 24 thin
shell 25 3 40 41 39 0.20 25e6
areaload 25 -10
shelltype 25 thin
shell 26 40 42 43 41 0.20 25e6
areaload 26 -10
shelltype 26 thin
shell 27 44 45 43 42 0.20 25e6
areaload 27 -10
shelltype 27 thin
shell 28 46 47 43 45 0.20 25e6
areaload 28 -10
shelltype 28 thin
shell 29 47 48 49 43 0.20 25e6
areaload 29 -10
shelltype 29 thin
shell 30 48 50 51 49 0.20 25e6
areaload 30 -10
shelltype 30 thin
shell 31 50 52 53 51 0.20 25e6
areaload 31 -10
shelltype 31 thin
shell 32 52 54 55 53 0.20 25e6
areaload 32 -10
shelltype 32 thin
shell 33 54 56 57 55 0.20 25e6
areaload 33 -10
shelltype 33 thin
shell 34 56 58 59 57 0.20 25e6
areaload 34 -10
shelltype 34 thin
shell 35 60 61 59 58 0.20 25e6
areaload 35 -10
shelltype 35 thin
shell 36 62 63 59 61 0.20 25e6
areaload 36 -10
shelltype 36 thin
shell 37 63 64 65 59 0.20 25e6
areaload 37 -10
shelltype 37 thin
shell 38 64 8 36 65 0.20 25e6
areaload 38 -10
shelltype 38 thin
tri 39 41 43 49 0.20 25e6
areaload 39 -10
shelltype 39 thin
shell 40 49 51 38 39 0.20 25e6
areaload 40 -10
shelltype 40 thin
shell 41 51 53 37 38 0.20 25e6
areaload 41 -10
shelltype 41 thin
shell 42 36 35 55 57 0.20 25e6
areaload 42 -10
shelltype 42 thin
tri 43 65 36 57 0.20 25e6
areaload 43 -10
shelltype 43 thin
shell 44 35 37 53 55 0.20 25e6
areaload 44 -10
shelltype 44 thin
shell 45 45 44 4 66 0.20 25e6
areaload 45 -10
shelltype 45 thin
shell 46 45 66 5 46 0.20 25e6
areaload 46 -10
shelltype 46 thin
shell 47 61 60 6 67 0.20 25e6
areaload 47 -10
shelltype 47 thin
shell 48 61 67 7 62 0.20 25e6
areaload 48 -10
shelltype 48 thin
tri 49 49 39 41 0.20 25e6
areaload 49 -10
shelltype 49 thin
tri 50 57 59 65 0.20 25e6
areaload 50 -10
shelltype 50 thin
support 1 ux uy uz
support 2 ux uy uz
support 3 ux uy uz
support 4 ux uy uz
support 5 ux uy uz
support 6 ux uy uz
support 7 ux uy uz
support 8 ux uy uz
solve
`,
    losa_ductos: `# losa_ductos: malla que genero ETABS 22 (Auto Mesh de fabrica 1.25 m, Shell-Thin)
# losa maciza t = 0.20 m, E = 25e6 kN/m2, nu = 0.2, q = -10 kN/m2, apoyos de ETABS. kN, m
node 1 0 0 0
node 2 10 0 0
node 3 10 8 0
node 4 0 8 0
node 5 2 2 0
node 6 2.6 2 0
node 7 2.6 2.6 0
node 8 2 2.6 0
node 9 7 3 0
node 10 7.4 3 0
node 11 7.4 3.8 0
node 12 7 3.8 0
node 13 5.4619 6.1913 0
node 14 5.1913 6.4619 0
node 15 4.8087 6.4619 0
node 16 4.5381 6.1913 0
node 17 4.5381 5.8087 0
node 18 4.8087 5.5381 0
node 19 5.1913 5.5381 0
node 20 5.4619 5.8087 0
node 21 4.925356 1.363697 0
node 22 5.980658 1.136278 0
node 23 6.004544 1.664537 0
node 24 5.179466 2.041217 0
node 25 7.016588 0.97492 0
node 26 6.932997 1.81201 0
node 27 8.073428 0.617431 0
node 28 8.078082 1.201319 0
node 29 8.942857 0.285714 0
node 30 8.783502 0.784436 0
node 31 9.328962 0.883837 0
node 32 8.532608 1.632412 0
node 33 7.6589 2.421544 0
node 34 6.703098 2.365206 0
node 35 6.023251 2.912343 0
node 36 6.209703 2.282694 0
node 37 5.019164 2.79076 0
node 38 3.890312 2.71051 0
node 39 3.852723 2.082278 0
node 40 3.765172 1.568306 0
node 41 2.517555 3.386824 0
node 42 2.203948 3.341924 0
node 43 3.246033 3.669567 0
node 44 3.890802 4.731366 0
node 45 3.207345 5.324305 0
node 46 2.73327 4.2282 0
node 47 3.787699 6.254928 0
node 48 2.793115 6.755791 0
node 49 2.490768 5.845615 0
node 50 1.857735 7.048998 0
node 51 1.589802 6.15342 0
node 52 0.965807 6.878387 0
node 53 0.93468 7.62706 0
node 54 0.443772 6.915094 0
node 55 0.814368 5.905831 0
node 56 1.228369 4.843924 0
node 57 1.811327 5.028672 0
node 58 1.6 3.68 0
node 59 2.083014 4.056402 0
node 60 2.345122 5.034162 0
node 61 8.75 0 0
node 62 0 6.857143 0
node 63 0 5.714286 0
node 64 0 3.428571 0
node 65 0 2.285714 0
node 66 0.4 2.285714 0
node 67 0.58321 3.017048 0
node 68 0 1.142857 0
node 69 0.65625 0.6 0
node 70 1.25 0 0
node 71 2.5 0 0
node 72 2.367802 1.031239 0
node 73 3.75 0 0
node 74 3.694808 0.821687 0
node 75 5 0 0
node 76 4.917478 0.682157 0
node 77 6.25 0 0
node 78 6.065389 0.541702 0
node 79 7.113421 0.348372 0
node 80 8.268239 0.034446 0
node 81 7.5 0 0
node 82 2.04093 1.595409 0
node 83 1.719467 2.188108 0
node 84 1.754988 1.754988 0
node 85 0.855346 3.762127 0
node 86 1.411675 2.788859 0
node 87 0.683246 4.749945 0
node 88 0 4.571429 0
node 89 1.077494 2.591779 0
node 90 10 6.857143 0
node 91 9.386637 6.653332 0
node 92 8.155725 3.266335 0
node 93 8.059316 3.829226 0
node 94 8.426784 2.677449 0
node 95 9.066695 2.046053 0
node 96 10 1.142857 0
node 97 10 2.285714 0
node 98 9.304865 2.734113 0
node 99 10 3.428571 0
node 100 9.327841 3.608337 0
node 101 10 4.571429 0
node 102 9.273544 4.684288 0
node 103 10 5.714286 0
node 104 9.412765 5.551773 0
node 105 8.628357 5.707645 0
node 106 8.984223 5.091262 0
node 107 8.05 4.85 0
node 108 8.620268 4.404759 0
node 109 8.731837 3.566842 0
node 110 8.821162 2.992802 0
node 111 7.339383 4.390726 0
node 112 7.0543 4.335289 0
node 113 8.08591 6.172062 0
node 114 7.592287 5.085937 0
node 115 8.854975 6.795711 0
node 116 9.06532 7.62706 0
node 117 8.125176 7.107004 0
node 118 7.241575 6.760973 0
node 119 7.203078 5.860563 0
node 120 6.181923 6.224565 0
node 121 6.583906 5.544815 0
node 122 6.053361 5.162728 0
node 123 6.4422 4.424467 0
node 124 6.89363 4.916885 0
node 125 5.962601 3.56311 0
node 126 5.046455 3.480735 0
node 127 5.814776 4.05176 0
node 128 5.681597 4.823249 0
node 129 5.094348 4.210491 0
node 130 4.57616 4.817421 0
node 131 3.89565 4.06905 0
node 132 4.369809 3.878603 0
node 133 3.247825 3.334525 0
node 134 4.1386 3.351093 0
node 135 3.84696 6.76952 0
node 136 2.812947 7.290587 0
node 137 2.033106 7.507991 0
node 138 5.48087 6.61571 0
node 139 6.15304 6.76952 0
node 140 7.225206 7.305703 0
node 141 7.972161 7.526272 0
node 142 1.25 8 0
node 143 8.75 8 0
node 144 7.5 8 0
node 145 2.5 8 0
node 146 3.75 8 0
node 147 6.25 8 0
node 148 5.288234 7.11474 0
node 149 4.90435 7.23095 0
node 150 5.672818 7.471065 0
node 151 5 8 0
shell 1 21 22 23 24 0.20 25e6
areaload 1 -10
shelltype 1 thin
shell 2 22 25 26 23 0.20 25e6
areaload 2 -10
shelltype 2 thin
shell 3 25 27 28 26 0.20 25e6
areaload 3 -10
shelltype 3 thin
shell 4 27 29 30 28 0.20 25e6
areaload 4 -10
shelltype 4 thin
shell 5 29 2 31 30 0.20 25e6
areaload 5 -10
shelltype 5 thin
shell 6 31 32 28 30 0.20 25e6
areaload 6 -10
shelltype 6 thin
shell 7 32 33 26 28 0.20 25e6
areaload 7 -10
shelltype 7 thin
shell 8 33 9 34 26 0.20 25e6
areaload 8 -10
shelltype 8 thin
shell 9 9 35 36 34 0.20 25e6
areaload 9 -10
shelltype 9 thin
shell 10 35 37 24 36 0.20 25e6
areaload 10 -10
shelltype 10 thin
shell 11 37 38 39 24 0.20 25e6
areaload 11 -10
shelltype 11 thin
shell 12 7 6 39 38 0.20 25e6
areaload 12 -10
shelltype 12 thin
tri 13 6 40 39 0.20 25e6
areaload 13 -10
shelltype 13 thin
shell 14 40 21 24 39 0.20 25e6
areaload 14 -10
shelltype 14 thin
tri 15 23 26 36 0.20 25e6
areaload 15 -10
shelltype 15 thin
tri 16 36 26 34 0.20 25e6
areaload 16 -10
shelltype 16 thin
shell 17 8 7 41 42 0.20 25e6
areaload 17 -10
shelltype 17 thin
tri 18 41 7 43 0.20 25e6
areaload 18 -10
shelltype 18 thin
shell 19 43 44 45 46 0.20 25e6
areaload 19 -10
shelltype 19 thin
shell 20 17 47 45 44 0.20 25e6
areaload 20 -10
shelltype 20 thin
shell 21 47 48 49 45 0.20 25e6
areaload 21 -10
shelltype 21 thin
shell 22 48 50 51 49 0.20 25e6
areaload 22 -10
shelltype 22 thin
tri 23 52 51 50 0.20 25e6
areaload 23 -10
shelltype 23 thin
shell 24 53 4 54 52 0.20 25e6
areaload 24 -10
shelltype 24 thin
shell 25 54 55 51 52 0.20 25e6
areaload 25 -10
shelltype 25 thin
shell 26 55 56 57 51 0.20 25e6
areaload 26 -10
shelltype 26 thin
shell 27 56 58 59 57 0.20 25e6
areaload 27 -10
shelltype 27 thin
tri 28 42 59 58 0.20 25e6
areaload 28 -10
shelltype 28 thin
shell 29 57 59 46 60 0.20 25e6
areaload 29 -10
shelltype 29 thin
tri 30 60 46 45 0.20 25e6
areaload 30 -10
shelltype 30 thin
shell 31 49 51 57 60 0.20 25e6
areaload 31 -10
shelltype 31 thin
shell 32 59 42 41 46 0.20 25e6
areaload 32 -10
shelltype 32 thin
tri 33 61 2 29 0.20 25e6
areaload 33 -10
shelltype 33 thin
shell 34 55 54 62 63 0.20 25e6
areaload 34 -10
shelltype 34 thin
shell 35 64 65 66 67 0.20 25e6
areaload 35 -10
shelltype 35 thin
shell 36 65 68 69 66 0.20 25e6
areaload 36 -10
shelltype 36 thin
tri 37 69 68 1 0.20 25e6
areaload 37 -10
shelltype 37 thin
shell 38 70 71 72 69 0.20 25e6
areaload 38 -10
shelltype 38 thin
shell 39 71 73 74 72 0.20 25e6
areaload 39 -10
shelltype 39 thin
shell 40 73 75 76 74 0.20 25e6
areaload 40 -10
shelltype 40 thin
shell 41 75 77 78 76 0.20 25e6
areaload 41 -10
shelltype 41 thin
tri 42 79 78 77 0.20 25e6
areaload 42 -10
shelltype 42 thin
tri 43 80 79 81 0.20 25e6
areaload 43 -10
shelltype 43 thin
shell 44 61 29 27 80 0.20 25e6
areaload 44 -10
shelltype 44 thin
shell 45 27 25 79 80 0.20 25e6
areaload 45 -10
shelltype 45 thin
shell 46 25 22 78 79 0.20 25e6
areaload 46 -10
shelltype 46 thin
shell 47 22 21 76 78 0.20 25e6
areaload 47 -10
shelltype 47 thin
shell 48 21 40 74 76 0.20 25e6
areaload 48 -10
shelltype 48 thin
shell 49 40 6 72 74 0.20 25e6
areaload 49 -10
shelltype 49 thin
tri 50 82 72 6 0.20 25e6
areaload 50 -10
shelltype 50 thin
shell 51 5 83 84 82 0.20 25e6
areaload 51 -10
shelltype 51 thin
tri 52 83 5 8 0.20 25e6
areaload 52 -10
shelltype 52 thin
shell 53 8 58 85 86 0.20 25e6
areaload 53 -10
shelltype 53 thin
shell 54 58 56 87 85 0.20 25e6
areaload 54 -10
shelltype 54 thin
shell 55 55 63 87 56 0.20 25e6
areaload 55 -10
shelltype 55 thin
tri 56 87 63 88 0.20 25e6
areaload 56 -10
shelltype 56 thin
shell 57 88 64 67 85 0.20 25e6
areaload 57 -10
shelltype 57 thin
tri 58 83 86 89 0.20 25e6
areaload 58 -10
shelltype 58 thin
shell 59 86 85 67 89 0.20 25e6
areaload 59 -10
shelltype 59 thin
shell 60 66 69 84 89 0.20 25e6
areaload 60 -10
shelltype 60 thin
tri 61 82 84 69 0.20 25e6
areaload 61 -10
shelltype 61 thin
tri 62 89 67 66 0.20 25e6
areaload 62 -10
shelltype 62 thin
tri 63 54 4 62 0.20 25e6
areaload 63 -10
shelltype 63 thin
tri 64 90 3 91 0.20 25e6
areaload 64 -10
shelltype 64 thin
tri 65 10 9 33 0.20 25e6
areaload 65 -10
shelltype 65 thin
shell 66 11 10 92 93 0.20 25e6
areaload 66 -10
shelltype 66 thin
shell 67 10 33 94 92 0.20 25e6
areaload 67 -10
shelltype 67 thin
shell 68 33 32 95 94 0.20 25e6
areaload 68 -10
shelltype 68 thin
shell 69 31 96 95 32 0.20 25e6
areaload 69 -10
shelltype 69 thin
shell 70 96 97 98 95 0.20 25e6
areaload 70 -10
shelltype 70 thin
shell 71 97 99 100 98 0.20 25e6
areaload 71 -10
shelltype 71 thin
shell 72 99 101 102 100 0.20 25e6
areaload 72 -10
shelltype 72 thin
shell 73 101 103 104 102 0.20 25e6
areaload 73 -10
shelltype 73 thin
shell 74 90 91 104 103 0.20 25e6
areaload 74 -10
shelltype 74 thin
shell 75 91 105 106 104 0.20 25e6
areaload 75 -10
shelltype 75 thin
shell 76 105 107 108 106 0.20 25e6
areaload 76 -10
shelltype 76 thin
shell 77 107 11 93 108 0.20 25e6
areaload 77 -10
shelltype 77 thin
tri 78 106 108 102 0.20 25e6
areaload 78 -10
shelltype 78 thin
tri 79 106 102 104 0.20 25e6
areaload 79 -10
shelltype 79 thin
shell 80 109 92 94 110 0.20 25e6
areaload 80 -10
shelltype 80 thin
shell 81 94 95 98 110 0.20 25e6
areaload 81 -10
shelltype 81 thin
shell 82 98 100 109 110 0.20 25e6
areaload 82 -10
shelltype 82 thin
shell 83 109 100 102 108 0.20 25e6
areaload 83 -10
shelltype 83 thin
shell 84 108 93 92 109 0.20 25e6
areaload 84 -10
shelltype 84 thin
tri 85 31 2 96 0.20 25e6
areaload 85 -10
shelltype 85 thin
shell 86 12 11 111 112 0.20 25e6
areaload 86 -10
shelltype 86 thin
tri 87 111 11 107 0.20 25e6
areaload 87 -10
shelltype 87 thin
shell 88 107 105 113 114 0.20 25e6
areaload 88 -10
shelltype 88 thin
shell 89 105 91 115 113 0.20 25e6
areaload 89 -10
shelltype 89 thin
shell 90 91 3 116 115 0.20 25e6
areaload 90 -10
shelltype 90 thin
tri 91 115 116 117 0.20 25e6
areaload 91 -10
shelltype 91 thin
shell 92 117 118 119 113 0.20 25e6
areaload 92 -10
shelltype 92 thin
shell 93 118 120 121 119 0.20 25e6
areaload 93 -10
shelltype 93 thin
shell 94 20 122 121 120 0.20 25e6
areaload 94 -10
shelltype 94 thin
shell 95 122 123 124 121 0.20 25e6
areaload 95 -10
shelltype 95 thin
tri 96 112 124 123 0.20 25e6
areaload 96 -10
shelltype 96 thin
shell 97 124 112 111 114 0.20 25e6
areaload 97 -10
shelltype 97 thin
shell 98 114 113 119 124 0.20 25e6
areaload 98 -10
shelltype 98 thin
tri 99 124 119 121 0.20 25e6
areaload 99 -10
shelltype 99 thin
shell 100 37 35 125 126 0.20 25e6
areaload 100 -10
shelltype 100 thin
shell 101 9 12 125 35 0.20 25e6
areaload 101 -10
shelltype 101 thin
shell 102 12 123 127 125 0.20 25e6
areaload 102 -10
shelltype 102 thin
shell 103 123 128 129 127 0.20 25e6
areaload 103 -10
shelltype 103 thin
shell 104 19 130 129 128 0.20 25e6
areaload 104 -10
shelltype 104 thin
shell 105 130 131 132 129 0.20 25e6
areaload 105 -10
shelltype 105 thin
shell 106 131 133 134 132 0.20 25e6
areaload 106 -10
shelltype 106 thin
shell 107 7 38 134 133 0.20 25e6
areaload 107 -10
shelltype 107 thin
shell 108 38 37 126 134 0.20 25e6
areaload 108 -10
shelltype 108 thin
shell 109 126 125 127 129 0.20 25e6
areaload 109 -10
shelltype 109 thin
shell 110 129 132 134 126 0.20 25e6
areaload 110 -10
shelltype 110 thin
shell 111 15 135 47 16 0.20 25e6
areaload 111 -10
shelltype 111 thin
tri 112 47 17 16 0.20 25e6
areaload 112 -10
shelltype 112 thin
shell 113 135 136 48 47 0.20 25e6
areaload 113 -10
shelltype 113 thin
shell 114 48 136 137 50 0.20 25e6
areaload 114 -10
shelltype 114 thin
tri 115 137 53 50 0.20 25e6
areaload 115 -10
shelltype 115 thin
tri 116 43 7 133 0.20 25e6
areaload 116 -10
shelltype 116 thin
tri 117 43 133 131 0.20 25e6
areaload 117 -10
shelltype 117 thin
tri 118 44 43 131 0.20 25e6
areaload 118 -10
shelltype 118 thin
tri 119 44 131 130 0.20 25e6
areaload 119 -10
shelltype 119 thin
tri 120 19 18 130 0.20 25e6
areaload 120 -10
shelltype 120 thin
shell 121 17 44 130 18 0.20 25e6
areaload 121 -10
shelltype 121 thin
shell 122 122 20 19 128 0.20 25e6
areaload 122 -10
shelltype 122 thin
tri 123 122 128 123 0.20 25e6
areaload 123 -10
shelltype 123 thin
tri 124 138 13 120 0.20 25e6
areaload 124 -10
shelltype 124 thin
tri 125 13 20 120 0.20 25e6
areaload 125 -10
shelltype 125 thin
shell 126 139 120 118 140 0.20 25e6
areaload 126 -10
shelltype 126 thin
shell 127 140 118 117 141 0.20 25e6
areaload 127 -10
shelltype 127 thin
tri 128 117 116 141 0.20 25e6
areaload 128 -10
shelltype 128 thin
tri 129 142 4 53 0.20 25e6
areaload 129 -10
shelltype 129 thin
tri 130 116 3 143 0.20 25e6
areaload 130 -10
shelltype 130 thin
shell 131 116 143 144 141 0.20 25e6
areaload 131 -10
shelltype 131 thin
shell 132 53 137 145 142 0.20 25e6
areaload 132 -10
shelltype 132 thin
tri 133 140 141 144 0.20 25e6
areaload 133 -10
shelltype 133 thin
tri 134 145 137 136 0.20 25e6
areaload 134 -10
shelltype 134 thin
tri 135 136 135 146 0.20 25e6
areaload 135 -10
shelltype 135 thin
shell 136 144 147 139 140 0.20 25e6
areaload 136 -10
shelltype 136 thin
tri 137 14 148 149 0.20 25e6
areaload 137 -10
shelltype 137 thin
shell 138 148 138 139 150 0.20 25e6
areaload 138 -10
shelltype 138 thin
tri 139 150 139 147 0.20 25e6
areaload 139 -10
shelltype 139 thin
tri 140 150 147 151 0.20 25e6
areaload 140 -10
shelltype 140 thin
shell 141 151 149 148 150 0.20 25e6
areaload 141 -10
shelltype 141 thin
tri 142 138 14 13 0.20 25e6
areaload 142 -10
shelltype 142 thin
shell 143 149 151 146 135 0.20 25e6
areaload 143 -10
shelltype 143 thin
tri 144 149 135 15 0.20 25e6
areaload 144 -10
shelltype 144 thin
tri 145 36 24 23 0.20 25e6
areaload 145 -10
shelltype 145 thin
tri 146 43 46 41 0.20 25e6
areaload 146 -10
shelltype 146 thin
tri 147 50 53 52 0.20 25e6
areaload 147 -10
shelltype 147 thin
tri 148 58 8 42 0.20 25e6
areaload 148 -10
shelltype 148 thin
tri 149 45 49 60 0.20 25e6
areaload 149 -10
shelltype 149 thin
tri 150 1 70 69 0.20 25e6
areaload 150 -10
shelltype 150 thin
tri 151 77 81 79 0.20 25e6
areaload 151 -10
shelltype 151 thin
tri 152 81 61 80 0.20 25e6
areaload 152 -10
shelltype 152 thin
tri 153 6 5 82 0.20 25e6
areaload 153 -10
shelltype 153 thin
tri 154 8 86 83 0.20 25e6
areaload 154 -10
shelltype 154 thin
tri 155 88 85 87 0.20 25e6
areaload 155 -10
shelltype 155 thin
tri 156 89 84 83 0.20 25e6
areaload 156 -10
shelltype 156 thin
tri 157 69 72 82 0.20 25e6
areaload 157 -10
shelltype 157 thin
tri 158 107 114 111 0.20 25e6
areaload 158 -10
shelltype 158 thin
tri 159 117 113 115 0.20 25e6
areaload 159 -10
shelltype 159 thin
tri 160 123 12 112 0.20 25e6
areaload 160 -10
shelltype 160 thin
tri 161 146 145 136 0.20 25e6
areaload 161 -10
shelltype 161 thin
tri 162 14 138 148 0.20 25e6
areaload 162 -10
shelltype 162 thin
tri 163 138 120 139 0.20 25e6
areaload 163 -10
shelltype 163 thin
tri 164 14 149 15 0.20 25e6
areaload 164 -10
shelltype 164 thin
support 1 ux uy uz
support 2 ux uy uz
support 3 ux uy uz
support 4 ux uy uz
support 5 ux uy uz
support 6 ux uy uz
support 7 ux uy uz
support 8 ux uy uz
support 9 ux uy uz
support 10 ux uy uz
support 11 ux uy uz
support 12 ux uy uz
support 13 ux uy uz
support 14 ux uy uz
support 15 ux uy uz
support 16 ux uy uz
support 17 ux uy uz
support 18 ux uy uz
support 19 ux uy uz
support 20 ux uy uz
solve
`,
    pentagono: `# pentagono: malla que genero ETABS 22 (Auto Mesh de fabrica 1.25 m, Shell-Thin)
# losa maciza t = 0.20 m, E = 25e6 kN/m2, nu = 0.2, q = -10 kN/m2, apoyos de ETABS. kN, m
node 1 0 0 0
node 2 9 0 0
node 3 11 4 0
node 4 6 9 0
node 5 -1 6 0
node 6 7.59132 3.48708 0
node 7 7.202198 4.523364 0
node 8 6.403329 4.27298 0
node 9 6.675121 3.246802 0
node 10 6.843243 5.563897 0
node 11 6.065532 5.305936 0
node 12 6.524437 6.668349 0
node 13 5.711852 6.347862 0
node 14 6.375 7.875 0
node 15 5.347036 7.43015 0
node 16 5 8.571429 0
node 17 4 8.142857 0
node 18 4.298071 6.907644 0
node 19 3 7.714286 0
node 20 3.265261 6.759941 0
node 21 2 7.285714 0
node 22 2.391611 6.324532 0
node 23 1 6.857143 0
node 24 1.58027 5.426834 0
node 25 0 6.428571 0
node 26 0.320088 5.135359 0
node 27 -0.8 4.8 0
node 28 -0.6 3.6 0
node 29 0.528722 3.894286 0
node 30 -0.4 2.4 0
node 31 0.9617 2.592952 0
node 32 -0.2 1.2 0
node 33 0.996828 1.230427 0
node 34 1.125 0 0
node 35 2.25 0 0
node 36 2.110775 1.153705 0
node 37 3.375 0 0
node 38 3.254064 1.135298 0
node 39 4.5 0 0
node 40 4.434387 1.101283 0
node 41 5.625 0 0
node 42 5.482629 0.955671 0
node 43 6.75 0 0
node 44 6.470455 1.001919 0
node 45 7.875 0 0
node 46 7.466333 1.107113 0
node 47 8.369862 1.297662 0
node 48 8.009756 2.429981 0
node 49 7.074683 2.190006 0
node 50 1.977774 2.310189 0
node 51 1.784305 3.197708 0
node 52 3.11624 2.350195 0
node 53 4.492898 2.378403 0
node 54 2.778194 3.628383 0
node 55 3.958867 3.640358 0
node 56 4.914148 3.89094 0
node 57 5.560797 3.109379 0
node 58 5.539519 4.076729 0
node 59 6.120734 2.012489 0
node 60 5.365421 1.782188 0
node 61 2.103354 4.558129 0
node 62 1.499163 4.269239 0
node 63 2.802942 5.746583 0
node 64 2.326441 5.359733 0
node 65 2.63945 4.882921 0
node 66 3.16957 5.181462 0
node 67 3.651017 4.685307 0
node 68 3.022887 4.39887 0
node 69 4.886932 5.971966 0
node 70 3.619893 5.380113 0
node 71 3.418714 6.019992 0
node 72 4.256905 5.585221 0
node 73 3.99123 6.170953 0
node 74 4.525468 4.798772 0
node 75 5.254363 5.038351 0
node 76 6.833333 8.166667 0
node 77 7.83784 4.795732 0
node 78 7.51875 5.75625 0
node 79 8.269817 3.843881 0
node 80 8.934045 2.797869 0
node 81 8.934636 1.698511 0
node 82 9.5 1 0
node 83 10 2 0
node 84 10.5 3 0
node 85 9.423569 4.037408 0
node 86 10.166667 4.833333 0
node 87 9.333333 5.666667 0
node 88 8.821161 5.247606 0
node 89 8.5 6.5 0
node 90 8.208333 6.208333 0
node 91 7.666667 7.333333 0
node 92 7.030208 7.576042 0
node 93 7.14375 6.88125 0
node 94 7.863542 5.982292 0
node 95 8.302812 5.084251 0
node 96 8.665399 4.321847 0
shell 1 6 7 8 9 0.20 25e6
areaload 1 -10
shelltype 1 thin
shell 2 7 10 11 8 0.20 25e6
areaload 2 -10
shelltype 2 thin
shell 3 10 12 13 11 0.20 25e6
areaload 3 -10
shelltype 3 thin
shell 4 12 14 15 13 0.20 25e6
areaload 4 -10
shelltype 4 thin
shell 5 4 16 15 14 0.20 25e6
areaload 5 -10
shelltype 5 thin
shell 6 16 17 18 15 0.20 25e6
areaload 6 -10
shelltype 6 thin
shell 7 17 19 20 18 0.20 25e6
areaload 7 -10
shelltype 7 thin
shell 8 19 21 22 20 0.20 25e6
areaload 8 -10
shelltype 8 thin
shell 9 21 23 24 22 0.20 25e6
areaload 9 -10
shelltype 9 thin
shell 10 23 25 26 24 0.20 25e6
areaload 10 -10
shelltype 10 thin
shell 11 5 27 26 25 0.20 25e6
areaload 11 -10
shelltype 11 thin
shell 12 27 28 29 26 0.20 25e6
areaload 12 -10
shelltype 12 thin
shell 13 28 30 31 29 0.20 25e6
areaload 13 -10
shelltype 13 thin
shell 14 30 32 33 31 0.20 25e6
areaload 14 -10
shelltype 14 thin
shell 15 1 34 33 32 0.20 25e6
areaload 15 -10
shelltype 15 thin
shell 16 34 35 36 33 0.20 25e6
areaload 16 -10
shelltype 16 thin
shell 17 35 37 38 36 0.20 25e6
areaload 17 -10
shelltype 17 thin
shell 18 37 39 40 38 0.20 25e6
areaload 18 -10
shelltype 18 thin
shell 19 39 41 42 40 0.20 25e6
areaload 19 -10
shelltype 19 thin
shell 20 41 43 44 42 0.20 25e6
areaload 20 -10
shelltype 20 thin
shell 21 43 45 46 44 0.20 25e6
areaload 21 -10
shelltype 21 thin
shell 22 2 47 46 45 0.20 25e6
areaload 22 -10
shelltype 22 thin
shell 23 47 48 49 46 0.20 25e6
areaload 23 -10
shelltype 23 thin
shell 24 48 6 9 49 0.20 25e6
areaload 24 -10
shelltype 24 thin
tri 25 50 51 31 0.20 25e6
areaload 25 -10
shelltype 25 thin
shell 26 50 31 33 36 0.20 25e6
areaload 26 -10
shelltype 26 thin
shell 27 36 38 52 50 0.20 25e6
areaload 27 -10
shelltype 27 thin
shell 28 38 40 53 52 0.20 25e6
areaload 28 -10
shelltype 28 thin
shell 29 50 52 54 51 0.20 25e6
areaload 29 -10
shelltype 29 thin
shell 30 52 53 55 54 0.20 25e6
areaload 30 -10
shelltype 30 thin
shell 31 56 55 53 57 0.20 25e6
areaload 31 -10
shelltype 31 thin
tri 32 58 56 57 0.20 25e6
areaload 32 -10
shelltype 32 thin
shell 33 58 57 9 8 0.20 25e6
areaload 33 -10
shelltype 33 thin
shell 34 59 44 46 49 0.20 25e6
areaload 34 -10
shelltype 34 thin
shell 35 49 9 57 59 0.20 25e6
areaload 35 -10
shelltype 35 thin
shell 36 42 44 59 60 0.20 25e6
areaload 36 -10
shelltype 36 thin
shell 37 59 57 53 60 0.20 25e6
areaload 37 -10
shelltype 37 thin
shell 38 53 40 42 60 0.20 25e6
areaload 38 -10
shelltype 38 thin
shell 39 51 54 61 62 0.20 25e6
areaload 39 -10
shelltype 39 thin
shell 40 62 29 31 51 0.20 25e6
areaload 40 -10
shelltype 40 thin
tri 41 62 61 24 0.20 25e6
areaload 41 -10
shelltype 41 thin
shell 42 62 24 26 29 0.20 25e6
areaload 42 -10
shelltype 42 thin
shell 43 63 22 24 64 0.20 25e6
areaload 43 -10
shelltype 43 thin
shell 44 24 61 65 64 0.20 25e6
areaload 44 -10
shelltype 44 thin
shell 45 65 66 63 64 0.20 25e6
areaload 45 -10
shelltype 45 thin
shell 46 67 66 65 68 0.20 25e6
areaload 46 -10
shelltype 46 thin
shell 47 65 61 54 68 0.20 25e6
areaload 47 -10
shelltype 47 thin
shell 48 54 55 67 68 0.20 25e6
areaload 48 -10
shelltype 48 thin
shell 49 69 13 15 18 0.20 25e6
areaload 49 -10
shelltype 49 thin
shell 50 63 66 70 71 0.20 25e6
areaload 50 -10
shelltype 50 thin
shell 51 71 20 22 63 0.20 25e6
areaload 51 -10
shelltype 51 thin
shell 52 72 69 18 73 0.20 25e6
areaload 52 -10
shelltype 52 thin
shell 53 18 20 71 73 0.20 25e6
areaload 53 -10
shelltype 53 thin
shell 54 71 70 72 73 0.20 25e6
areaload 54 -10
shelltype 54 thin
shell 55 67 55 56 74 0.20 25e6
areaload 55 -10
shelltype 55 thin
tri 56 70 66 67 0.20 25e6
areaload 56 -10
shelltype 56 thin
shell 57 70 67 74 72 0.20 25e6
areaload 57 -10
shelltype 57 thin
shell 58 56 58 75 74 0.20 25e6
areaload 58 -10
shelltype 58 thin
shell 59 58 8 11 75 0.20 25e6
areaload 59 -10
shelltype 59 thin
shell 60 74 75 69 72 0.20 25e6
areaload 60 -10
shelltype 60 thin
shell 61 75 11 13 69 0.20 25e6
areaload 61 -10
shelltype 61 thin
tri 62 4 14 76 0.20 25e6
areaload 62 -10
shelltype 62 thin
shell 63 10 7 77 78 0.20 25e6
areaload 63 -10
shelltype 63 thin
shell 64 7 6 79 77 0.20 25e6
areaload 64 -10
shelltype 64 thin
shell 65 6 48 80 79 0.20 25e6
areaload 65 -10
shelltype 65 thin
shell 66 48 47 81 80 0.20 25e6
areaload 66 -10
shelltype 66 thin
shell 67 47 2 82 81 0.20 25e6
areaload 67 -10
shelltype 67 thin
tri 68 81 82 83 0.20 25e6
areaload 68 -10
shelltype 68 thin
shell 69 83 84 85 80 0.20 25e6
areaload 69 -10
shelltype 69 thin
shell 70 3 86 85 84 0.20 25e6
areaload 70 -10
shelltype 70 thin
shell 71 86 87 88 85 0.20 25e6
areaload 71 -10
shelltype 71 thin
shell 72 87 89 90 88 0.20 25e6
areaload 72 -10
shelltype 72 thin
tri 73 91 92 90 0.20 25e6
areaload 73 -10
shelltype 73 thin
tri 74 92 91 76 0.20 25e6
areaload 74 -10
shelltype 74 thin
shell 75 14 12 93 92 0.20 25e6
areaload 75 -10
shelltype 75 thin
shell 76 12 10 78 93 0.20 25e6
areaload 76 -10
shelltype 76 thin
tri 77 90 92 93 0.20 25e6
areaload 77 -10
shelltype 77 thin
tri 78 93 78 94 0.20 25e6
areaload 78 -10
shelltype 78 thin
shell 79 95 77 79 96 0.20 25e6
areaload 79 -10
shelltype 79 thin
shell 80 79 80 85 96 0.20 25e6
areaload 80 -10
shelltype 80 thin
shell 81 85 88 95 96 0.20 25e6
areaload 81 -10
shelltype 81 thin
shell 82 94 78 77 95 0.20 25e6
areaload 82 -10
shelltype 82 thin
shell 83 95 88 90 94 0.20 25e6
areaload 83 -10
shelltype 83 thin
tri 84 83 80 81 0.20 25e6
areaload 84 -10
shelltype 84 thin
tri 85 90 89 91 0.20 25e6
areaload 85 -10
shelltype 85 thin
tri 86 76 14 92 0.20 25e6
areaload 86 -10
shelltype 86 thin
tri 87 93 94 90 0.20 25e6
areaload 87 -10
shelltype 87 thin
support 1 ux uy uz
support 2 ux uy uz
support 3 ux uy uz
support 4 ux uy uz
support 5 ux uy uz
solve
`,
    trapecio_hueco_girado: `# trapecio_hueco_girado: malla que genero ETABS 22 (Auto Mesh de fabrica 1.25 m, Shell-Thin)
# losa maciza t = 0.20 m, E = 25e6 kN/m2, nu = 0.2, q = -10 kN/m2, apoyos de ETABS. kN, m
node 1 0 0 0
node 2 12 0 0
node 3 10 7 0
node 4 1 8 0
node 5 6 2.8 0
node 6 7.2 4 0
node 7 6 5.2 0
node 8 4.8 4 0
node 9 7 2.333333 0
node 10 7.2 2.9 0
node 11 6.6 3.4 0
node 12 11.666667 1.166667 0
node 13 11 1.225 0
node 14 11 0.466667 0
node 15 9.3 6.25 0
node 16 9.725 5.5625 0
node 17 10.333333 5.833333 0
node 18 7.934088 1.934087 0
node 19 8.15 2.48125 0
node 20 11.333333 2.333333 0
node 21 10.68125 2.309375 0
node 22 8.487892 5.408348 0
node 23 9.09375 4.896875 0
node 24 8.883108 1.511713 0
node 25 9.071604 2.080917 0
node 26 11 3.5 0
node 27 10.3829 3.39879 0
node 28 7.815585 4.698662 0
node 29 8.409818 4.214 0
node 30 10 0.933333 0
node 31 10.05 1.64375 0
node 32 10.666667 4.666667 0
node 33 10.04375 4.478125 0
node 34 7.83125 3.565625 0
node 35 8.385938 3.085156 0
node 36 10.048438 2.352344 0
node 37 9.490625 4.25 0
node 38 9.202211 2.687059 0
node 39 9.806207 3.307738 0
node 40 8.897312 3.694744 0
node 41 9.30191 3.229847 0
node 42 6.625 7.375 0
node 43 5.5 7.5 0
node 44 5.485856 6.870901 0
node 45 6.408956 6.800483 0
node 46 4.375 7.625 0
node 47 4.451403 6.713033 0
node 48 3.25 7.75 0
node 49 3.289669 6.778248 0
node 50 2.125 7.875 0
node 51 2.131493 6.608958 0
node 52 0.857143 6.857143 0
node 53 0.714286 5.714286 0
node 54 1.744908 5.527767 0
node 55 0.571429 4.571429 0
node 56 1.650887 4.417685 0
node 57 0.428571 3.428571 0
node 58 1.253517 3.361801 0
node 59 0.285714 2.285714 0
node 60 1.10962 2.362722 0
node 61 0.142857 1.142857 0
node 62 1.001188 1.208927 0
node 63 2.171821 1.833677 0
node 64 1.960198 2.658128 0
node 65 3.107067 2.48484 0
node 66 2.740732 3.18199 0
node 67 4.000712 3.138935 0
node 68 3.513427 3.704866 0
node 69 4.212518 4.307065 0
node 70 5.4 4.6 0
node 71 4.790918 4.829858 0
node 72 5.232231 5.371077 0
node 73 6.457265 5.579699 0
node 74 5.725953 5.854745 0
node 75 6.6 4.6 0
node 76 7.151256 5.165721 0
node 77 7.722221 5.777709 0
node 78 8.313634 6.450991 0
node 79 8.875 7.125 0
node 80 7.75 7.25 0
node 81 7.351024 6.645942 0
node 82 2.424846 3.918851 0
node 83 1.87952 3.312927 0
node 84 5.037971 6.152805 0
node 85 5.563826 6.442827 0
node 86 6.15756 6.295088 0
node 87 6.922018 6.074609 0
node 88 4.397256 5.583837 0
node 89 4.060294 6.112193 0
node 90 3.336263 6.034996 0
node 91 3.350692 5.242356 0
node 92 2.795579 4.531603 0
node 93 2.513026 5.387331 0
node 94 2.31983 4.778873 0
node 95 2.66026 6.010429 0
node 96 3.118853 4.212112 0
node 97 4.309912 5.035608 0
node 98 3.747994 4.699285 0
node 99 5.4 3.4 0
node 100 4.616977 2.383814 0
node 101 5.607946 1.936752 0
node 102 3.596395 1.837623 0
node 103 2.720154 1.05891 0
node 104 1.640447 0.755946 0
node 105 1.2 0 0
node 106 2.4 0 0
node 107 3.6 0 0
node 108 3.820289 0.88701 0
node 109 4.8 0 0
node 110 5.00546 1.04735 0
node 111 6 0 0
node 112 6.286421 0.791765 0
node 113 7.2 0 0
node 114 7.319849 0.605607 0
node 115 8.4 0 0
node 116 8.301884 0.522778 0
node 117 9.6 0 0
node 118 9.38194 0.575704 0
node 119 10.395968 0.346125 0
node 120 10.8 0 0
node 121 8.51672 1.102275 0
node 122 7.688811 1.415372 0
node 123 6.814202 1.517311 0
node 124 7.482152 1.112022 0
node 125 8.100252 0.912358 0
node 126 4.528413 1.624298 0
node 127 3.981699 1.449644 0
shell 1 9 10 11 5 0.20 25e6
areaload 1 -10
shelltype 1 thin
shell 2 12 13 14 2 0.20 25e6
areaload 2 -10
shelltype 2 thin
shell 3 15 16 17 3 0.20 25e6
areaload 3 -10
shelltype 3 thin
shell 4 9 18 19 10 0.20 25e6
areaload 4 -10
shelltype 4 thin
shell 5 12 20 21 13 0.20 25e6
areaload 5 -10
shelltype 5 thin
shell 6 15 22 23 16 0.20 25e6
areaload 6 -10
shelltype 6 thin
shell 7 18 24 25 19 0.20 25e6
areaload 7 -10
shelltype 7 thin
shell 8 20 26 27 21 0.20 25e6
areaload 8 -10
shelltype 8 thin
shell 9 22 28 29 23 0.20 25e6
areaload 9 -10
shelltype 9 thin
shell 10 24 30 31 25 0.20 25e6
areaload 10 -10
shelltype 10 thin
shell 11 26 32 33 27 0.20 25e6
areaload 11 -10
shelltype 11 thin
shell 12 28 6 34 29 0.20 25e6
areaload 12 -10
shelltype 12 thin
shell 13 30 14 13 31 0.20 25e6
areaload 13 -10
shelltype 13 thin
shell 14 32 17 16 33 0.20 25e6
areaload 14 -10
shelltype 14 thin
shell 15 6 11 10 34 0.20 25e6
areaload 15 -10
shelltype 15 thin
shell 16 19 35 34 10 0.20 25e6
areaload 16 -10
shelltype 16 thin
shell 17 21 36 31 13 0.20 25e6
areaload 17 -10
shelltype 17 thin
shell 18 23 37 33 16 0.20 25e6
areaload 18 -10
shelltype 18 thin
shell 19 19 25 38 35 0.20 25e6
areaload 19 -10
shelltype 19 thin
shell 20 21 27 39 36 0.20 25e6
areaload 20 -10
shelltype 20 thin
shell 21 23 29 40 37 0.20 25e6
areaload 21 -10
shelltype 21 thin
shell 22 25 31 36 38 0.20 25e6
areaload 22 -10
shelltype 22 thin
shell 23 27 33 37 39 0.20 25e6
areaload 23 -10
shelltype 23 thin
shell 24 29 34 35 40 0.20 25e6
areaload 24 -10
shelltype 24 thin
shell 25 35 38 41 40 0.20 25e6
areaload 25 -10
shelltype 25 thin
shell 26 36 39 41 38 0.20 25e6
areaload 26 -10
shelltype 26 thin
shell 27 37 40 41 39 0.20 25e6
areaload 27 -10
shelltype 27 thin
shell 28 42 43 44 45 0.20 25e6
areaload 28 -10
shelltype 28 thin
shell 29 43 46 47 44 0.20 25e6
areaload 29 -10
shelltype 29 thin
shell 30 46 48 49 47 0.20 25e6
areaload 30 -10
shelltype 30 thin
shell 31 48 50 51 49 0.20 25e6
areaload 31 -10
shelltype 31 thin
shell 32 4 52 51 50 0.20 25e6
areaload 32 -10
shelltype 32 thin
shell 33 52 53 54 51 0.20 25e6
areaload 33 -10
shelltype 33 thin
shell 34 53 55 56 54 0.20 25e6
areaload 34 -10
shelltype 34 thin
shell 35 55 57 58 56 0.20 25e6
areaload 35 -10
shelltype 35 thin
shell 36 57 59 60 58 0.20 25e6
areaload 36 -10
shelltype 36 thin
shell 37 61 62 60 59 0.20 25e6
areaload 37 -10
shelltype 37 thin
shell 38 62 63 64 60 0.20 25e6
areaload 38 -10
shelltype 38 thin
shell 39 63 65 66 64 0.20 25e6
areaload 39 -10
shelltype 39 thin
shell 40 65 67 68 66 0.20 25e6
areaload 40 -10
shelltype 40 thin
shell 41 67 8 69 68 0.20 25e6
areaload 41 -10
shelltype 41 thin
shell 42 8 70 71 69 0.20 25e6
areaload 42 -10
shelltype 42 thin
shell 43 70 7 72 71 0.20 25e6
areaload 43 -10
shelltype 43 thin
shell 44 7 73 74 72 0.20 25e6
areaload 44 -10
shelltype 44 thin
shell 45 7 75 76 73 0.20 25e6
areaload 45 -10
shelltype 45 thin
shell 46 6 28 76 75 0.20 25e6
areaload 46 -10
shelltype 46 thin
shell 47 28 22 77 76 0.20 25e6
areaload 47 -10
shelltype 47 thin
shell 48 22 15 78 77 0.20 25e6
areaload 48 -10
shelltype 48 thin
shell 49 3 79 78 15 0.20 25e6
areaload 49 -10
shelltype 49 thin
shell 50 79 80 81 78 0.20 25e6
areaload 50 -10
shelltype 50 thin
shell 51 80 42 45 81 0.20 25e6
areaload 51 -10
shelltype 51 thin
shell 52 82 56 58 83 0.20 25e6
areaload 52 -10
shelltype 52 thin
shell 53 58 60 64 83 0.20 25e6
areaload 53 -10
shelltype 53 thin
shell 54 64 66 82 83 0.20 25e6
areaload 54 -10
shelltype 54 thin
shell 55 44 47 84 85 0.20 25e6
areaload 55 -10
shelltype 55 thin
shell 56 84 74 86 85 0.20 25e6
areaload 56 -10
shelltype 56 thin
shell 57 45 44 85 86 0.20 25e6
areaload 57 -10
shelltype 57 thin
shell 58 74 73 87 86 0.20 25e6
areaload 58 -10
shelltype 58 thin
shell 59 73 76 77 87 0.20 25e6
areaload 59 -10
shelltype 59 thin
shell 60 86 87 81 45 0.20 25e6
areaload 60 -10
shelltype 60 thin
shell 61 87 77 78 81 0.20 25e6
areaload 61 -10
shelltype 61 thin
shell 62 88 84 47 89 0.20 25e6
areaload 62 -10
shelltype 62 thin
shell 63 47 49 90 89 0.20 25e6
areaload 63 -10
shelltype 63 thin
shell 64 90 91 88 89 0.20 25e6
areaload 64 -10
shelltype 64 thin
shell 65 92 91 93 94 0.20 25e6
areaload 65 -10
shelltype 65 thin
shell 66 93 54 56 94 0.20 25e6
areaload 66 -10
shelltype 66 thin
shell 67 56 82 92 94 0.20 25e6
areaload 67 -10
shelltype 67 thin
shell 68 90 49 51 95 0.20 25e6
areaload 68 -10
shelltype 68 thin
shell 69 51 54 93 95 0.20 25e6
areaload 69 -10
shelltype 69 thin
shell 70 93 91 90 95 0.20 25e6
areaload 70 -10
shelltype 70 thin
tri 71 96 92 82 0.20 25e6
areaload 71 -10
shelltype 71 thin
shell 72 96 82 66 68 0.20 25e6
areaload 72 -10
shelltype 72 thin
shell 73 72 74 84 88 0.20 25e6
areaload 73 -10
shelltype 73 thin
shell 74 88 97 71 72 0.20 25e6
areaload 74 -10
shelltype 74 thin
shell 75 88 91 98 97 0.20 25e6
areaload 75 -10
shelltype 75 thin
shell 76 91 92 96 98 0.20 25e6
areaload 76 -10
shelltype 76 thin
shell 77 97 98 69 71 0.20 25e6
areaload 77 -10
shelltype 77 thin
shell 78 98 96 68 69 0.20 25e6
areaload 78 -10
shelltype 78 thin
tri 79 61 1 62 0.20 25e6
areaload 79 -10
shelltype 79 thin
shell 80 5 99 100 101 0.20 25e6
areaload 80 -10
shelltype 80 thin
shell 81 8 67 100 99 0.20 25e6
areaload 81 -10
shelltype 81 thin
shell 82 67 65 102 100 0.20 25e6
areaload 82 -10
shelltype 82 thin
shell 83 65 63 103 102 0.20 25e6
areaload 83 -10
shelltype 83 thin
shell 84 63 62 104 103 0.20 25e6
areaload 84 -10
shelltype 84 thin
shell 85 62 1 105 104 0.20 25e6
areaload 85 -10
shelltype 85 thin
shell 86 105 106 103 104 0.20 25e6
areaload 86 -10
shelltype 86 thin
shell 87 106 107 108 103 0.20 25e6
areaload 87 -10
shelltype 87 thin
shell 88 107 109 110 108 0.20 25e6
areaload 88 -10
shelltype 88 thin
shell 89 109 111 112 110 0.20 25e6
areaload 89 -10
shelltype 89 thin
shell 90 111 113 114 112 0.20 25e6
areaload 90 -10
shelltype 90 thin
shell 91 113 115 116 114 0.20 25e6
areaload 91 -10
shelltype 91 thin
shell 92 115 117 118 116 0.20 25e6
areaload 92 -10
shelltype 92 thin
tri 93 119 118 117 0.20 25e6
areaload 93 -10
shelltype 93 thin
tri 94 14 119 120 0.20 25e6
areaload 94 -10
shelltype 94 thin
tri 95 119 14 30 0.20 25e6
areaload 95 -10
shelltype 95 thin
shell 96 30 24 121 118 0.20 25e6
areaload 96 -10
shelltype 96 thin
shell 97 24 18 122 121 0.20 25e6
areaload 97 -10
shelltype 97 thin
shell 98 18 9 123 122 0.20 25e6
areaload 98 -10
shelltype 98 thin
shell 99 9 5 101 123 0.20 25e6
areaload 99 -10
shelltype 99 thin
shell 100 124 114 116 125 0.20 25e6
areaload 100 -10
shelltype 100 thin
shell 101 116 118 121 125 0.20 25e6
areaload 101 -10
shelltype 101 thin
shell 102 121 122 124 125 0.20 25e6
areaload 102 -10
shelltype 102 thin
tri 103 124 122 123 0.20 25e6
areaload 103 -10
shelltype 103 thin
shell 104 124 123 112 114 0.20 25e6
areaload 104 -10
shelltype 104 thin
shell 105 101 100 126 110 0.20 25e6
areaload 105 -10
shelltype 105 thin
shell 106 110 112 123 101 0.20 25e6
areaload 106 -10
shelltype 106 thin
shell 107 126 100 102 127 0.20 25e6
areaload 107 -10
shelltype 107 thin
shell 108 102 103 108 127 0.20 25e6
areaload 108 -10
shelltype 108 thin
shell 109 108 110 126 127 0.20 25e6
areaload 109 -10
shelltype 109 thin
tri 110 117 120 119 0.20 25e6
areaload 110 -10
shelltype 110 thin
tri 111 120 2 14 0.20 25e6
areaload 111 -10
shelltype 111 thin
tri 112 30 118 119 0.20 25e6
areaload 112 -10
shelltype 112 thin
support 1 ux uy uz
support 2 ux uy uz
support 3 ux uy uz
support 4 ux uy uz
support 5 ux uy uz
support 6 ux uy uz
support 7 ux uy uz
support 8 ux uy uz
solve
`
  };
  d = [
    "losa_L_hueco",
    "L_sin_hueco",
    "rect_con_hueco",
    "losa_T",
    "losa_ductos",
    "pentagono",
    "trapecio_hueco_girado"
  ];
  r = {
    id: "validacion-losas-csi",
    name: "Losas irregulares (malla ETABS) vs ETABS \xB7 SAP2000 \xB7 OpenSees",
    category: "2\uFE0F\u20E3 Shells \xB7 \u2705 Validaci\xF3n CSI",
    defaultShellResult: "displacementZ",
    availableShellResults: [
      "none",
      "displacementZ",
      "bendingXX",
      "bendingYY",
      "bendingXY"
    ],
    params: {
      caso: {
        default: 4,
        label: "Losa",
        options: {
          "L con hueco": 0,
          L: 1,
          "Rect\xE1ngulo con hueco": 2,
          T: 3,
          "Con 3 ductos (uno circular)": 4,
          "Pent\xE1gono (lados oblicuos)": 5,
          "Trapecio con hueco girado": 6
        }
      }
    },
    build(e, l, a) {
      const n = window, h = n.__hekatanCliScript;
      n.__hekatanCliScript = o[d[Math.round(e.caso ?? 4)] ?? "losa_ductos"];
      try {
        t.build(e, l, a);
      } finally {
        n.__hekatanCliScript = h;
      }
    }
  };
});
export {
  __tla,
  r as v
};
