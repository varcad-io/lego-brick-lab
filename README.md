[![LEGO.scad Brick Lab geometry preview](https://s3.us-east-1.amazonaws.com/varcad.io/repository-previews/22/81/preview-v8/orbit.webp)](https://varcad.io/varcad-io/lego-brick-lab)

[gallery:Default]

# LEGO.scad Brick Lab

An interactive VarCAD demonstration of the LEGO.scad parametric brick generator.

Open `Widgets` to switch between the multi-part showcase, any upstream part-number example, and a custom configurable part. The controls cover brick dimensions, plates and tiles, slopes, curves, wings, round parts, Technic axle holes, LEGO/DUPLO dimensions, color, underside inspection, and render quality.

The `examples/` directory mirrors all 179 SCAD examples from the upstream LEGO.scad library. The only source adjustment is the `use` path, which points to VarCAD's canonical mounted LEGO.scad library.

`examples/catalog.json` is the interactive, draft-quality representation of those part files. Regenerate it after syncing upstream examples with:

```sh
node scripts/generate-example-catalog.mjs
```

The project imports `/Libraries/LEGO.scad/LEGO.scad?use` from JavaScript; upstream library source is provided through VarCAD's linked-library runtime rather than duplicated in this repository.

## Notes

- Draft quality is the default to keep interactive rebuilds responsive.
- Print quality increases curved-surface tessellation.
- Generated parts are intended as compatible approximations. Printer calibration and tolerances determine physical fit.

LEGO, the LEGO logo, the Brick, DUPLO, and MINDSTORMS are trademarks of the LEGO Group. This project is not affiliated with or endorsed by the LEGO Group.
