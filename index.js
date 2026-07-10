import * as modeling from "@jscad/modeling";
import * as legoScad from "/Libraries/LEGO.scad/LEGO.scad?use";
import exampleCatalog from "./examples/catalog.json";

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toInteger = (value, fallback, min = 1, max = 32) =>
  Math.max(min, Math.min(max, Math.round(toNumber(value, fallback))));

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return ["true", "1", "yes", "on"].includes(String(value).toLowerCase());
};

const resolveHeight = (preset) => {
  if (preset === "plate") return 1 / 3;
  if (preset === "double") return 2;
  return 1;
};

const createBlock = ({
  width = 1,
  length = 2,
  height = 1,
  type = "brick",
  brand = "lego",
  studType = "solid",
  technicHoles = false,
  technicHoleShape = "cross",
  verticalAxleHoles = false,
  verticalAxleHoleShape = "cross",
  curveType = "convex",
  curveStudRows = Math.max(1, length - 1),
  wingType = "left",
  wingEndWidth = Math.max(1, width - 2),
  wingBaseLength = 1,
  slopeStudRows = 1,
  slopeStuds = false,
  roundRadius = 0,
  studNotches = type === "wing" || type === "round",
  studMatrixString = "",
  studMatrixColumns = 0,
  quality = "draft",
}) => legoScad.block(
  width,
  length,
  height,
  type,
  brand,
  studType,
  "open",
  true,
  1,
  false,
  technicHoles,
  technicHoleShape,
  verticalAxleHoles,
  verticalAxleHoleShape,
  brand === "duplo",
  wingType,
  wingEndWidth,
  wingBaseLength,
  studNotches,
  slopeStudRows,
  0,
  slopeStuds,
  curveStudRows,
  curveType,
  0,
  0,
  0,
  0,
  0,
  false,
  roundRadius,
  1,
  0.2,
  false,
  false,
  true,
  studMatrixString,
  studMatrixColumns,
  false,
  false,
  1,
  quality === "print" ? 0.2 : 0.8,
  quality === "print" ? 2 : 8,
);

const flattenGeometry = (value) => {
  const geometries = [];
  const visit = (entry) => {
    if (Array.isArray(entry)) {
      entry.forEach(visit);
    } else if (entry && typeof entry === "object") {
      geometries.push(entry);
    }
  };
  visit(value);
  return geometries;
};

const colorBlock = (hex, geometry) => {
  const geometries = flattenGeometry(geometry);
  if (geometries.length === 0) {
    throw new Error("LEGO.scad did not return renderable geometry");
  }
  const colored = modeling.colors.colorize(modeling.colors.hexToRgb(hex), ...geometries);
  return colored.length === 1 ? colored[0] : colored;
};

const placeBlock = (offset, hex, options) =>
  modeling.transforms.translate(offset, colorBlock(hex, createBlock(options)));

const createShowcase = (common) => [
  placeBlock([-60, 35, 0], "#f5cd2f", { ...common, width: 1, length: 8, height: 1 / 3, type: "brick" }),
  placeBlock([-5, 35, 0], "#237841", { ...common, width: 4, length: 4, height: 1, type: "brick", studType: "hollow" }),
  placeBlock([45, 35, 0], "#9ba19d", { ...common, width: 4, length: 6, height: 1, type: "slope", slopeStuds: true }),
  placeBlock([100, 35, 0], "#008f8c", { ...common, width: 6, length: 8, height: 1 / 3, type: "baseplate" }),
  placeBlock([-60, -25, 0], "#d71920", { ...common, width: 2, length: 8, height: 1, type: "brick" }),
  placeBlock([-5, -25, 0], "#f4f4f4", { ...common, width: 4, length: 6, height: 1 / 3, type: "brick" }),
  placeBlock([45, -25, 0], "#0055bf", { ...common, width: 4, length: 6, height: 1, type: "slope", slopeStuds: true }),
  placeBlock([90, -25, 0], "#81007b", { ...common, width: 2, length: 4, height: 1, type: "brick", studType: "open" }),
];

const createExample = (path, quality) => {
  const parameters = exampleCatalog[path] || exampleCatalog["/examples/3001.scad"];
  return createBlock({
    quality,
    ...parameters,
    studType: parameters.stud_type,
    technicHoles: parameters.horizontal_axle_holes,
    technicHoleShape: parameters.horizontal_axle_hole_shape,
    verticalAxleHoles: parameters.vertical_axle_holes,
    verticalAxleHoleShape: parameters.vertical_axle_hole_shape,
    curveType: parameters.curve_type,
    curveStudRows: parameters.curve_stud_rows,
    wingType: parameters.wing_type,
    wingEndWidth: parameters.wing_end_width,
    wingBaseLength: parameters.wing_base_length,
    slopeStudRows: parameters.slope_stud_rows,
    slopeStuds: parameters.slope_studs,
    roundRadius: parameters.round_radius,
    studNotches: parameters.stud_notches,
    studMatrixString: parameters.stud_matrix_string,
    studMatrixColumns: parameters.stud_matrix_columns,
  });
};

export function main({ variables = {} } = {}) {
  const viewMode = variables.view_mode || "showcase";
  const brand = variables.brand || "lego";
  const studType = variables.stud_type || "solid";
  const quality = variables.quality || "draft";
  const common = { brand, studType, quality };

  let geometry;
  if (viewMode === "showcase") {
    geometry = createShowcase({ brand: "lego", studType: "solid", quality });
  } else if (viewMode === "example") {
    geometry = createExample(variables.example_part, quality);
  } else {
    const type = variables.part_type || "brick";
    geometry = colorBlock(
      variables.brick_color || "#d71920",
      createBlock({
        ...common,
        width: toInteger(variables.brick_width, 2, 1, 12),
        length: toInteger(variables.brick_length, 4, 1, 16),
        height: resolveHeight(variables.height_preset),
        type,
        technicHoles: toBoolean(variables.technic_holes),
        technicHoleShape: variables.technic_hole_shape || "cross",
        curveType: variables.curve_type || "convex",
        wingType: variables.wing_type || "left",
      }),
    );
  }

  const rotation = Math.PI;
  const orientGeometry = (value) => Array.isArray(value)
    ? value.map((part) => modeling.transforms.rotateX(rotation, part))
    : modeling.transforms.rotateX(rotation, value);
  return toBoolean(variables.show_underside) ? geometry : orientGeometry(geometry);
}
