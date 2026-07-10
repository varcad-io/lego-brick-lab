[gallery:Default]

# LEGO.scad Brick Lab

An interactive VarCAD demonstration of the LEGO.scad parametric brick generator.

Open `Widgets` to switch between a configurable part and a compact sampler. The controls cover brick dimensions, plates and tiles, slopes, curves, wings, round parts, Technic axle holes, LEGO/DUPLO dimensions, color, underside inspection, and render quality.

The project imports `@lego-scad/LEGO.scad?use` from JavaScript; upstream library source is not vendored into this repository.

## Notes

- Draft quality is the default to keep interactive rebuilds responsive.
- Print quality increases curved-surface tessellation.
- Generated parts are intended as compatible approximations. Printer calibration and tolerances determine physical fit.

LEGO, the LEGO logo, the Brick, DUPLO, and MINDSTORMS are trademarks of the LEGO Group. This project is not affiliated with or endorsed by the LEGO Group.
