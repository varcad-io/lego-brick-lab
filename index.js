import * as modeling from "@jscad/modeling";
import * as legoScad from "@lego-scad/LEGO.scad?use";

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
  width,
  length,
  height,
  type,
  brand,
  studType,
  technicHoles = false,
  technicHoleShape = "cross",
  curveType = "convex",
  wingType = "left",
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
  false,
  "cross",
  brand === "duplo",
  wingType,
  Math.max(1, width - 2),
  1,
  type === "wing" || type === "round",
  1,
  0,
  Math.max(1, length - 1),
  curveType,
  0,
  0,
  0,
  0,
  0,
  false,
  0,
  1,
  0.2,
  false,
  false,
  true,
  "",
  0,
  false,
  false,
  1,
  quality === "print" ? 0.2 : 0.8,
  quality === "print" ? 2 : 8,
);

const colorBlock = (hex, geometry) =>
  modeling.colors.colorize(modeling.colors.hexToRgb(hex), geometry);

const placeBlock = (offset, hex, options) =>
  modeling.transforms.translate(offset, colorBlock(hex, createBlock(options)));

const createSampler = (common) => [
  placeBlock([-44, 18, 0], "#d71920", { ...common, width: 2, length: 4, height: 1, type: "brick" }),
  placeBlock([-12, 18, 0], "#f5cd2f", { ...common, width: 2, length: 4, height: 1 / 3, type: "brick" }),
  placeBlock([20, 18, 0], "#f4f4f4", { ...common, width: 2, length: 2, height: 1 / 3, type: "tile" }),
  placeBlock([-44, -18, 0], "#0055bf", { ...common, width: 2, length: 4, height: 1, type: "slope" }),
  placeBlock([-4, -18, 0], "#237841", { ...common, width: 1, length: 6, height: 2, type: "curve" }),
  placeBlock([38, -18, 0], "#ff8a18", { ...common, width: 3, length: 3, height: 1 / 3, type: "wing" }),
];

export function main({ variables = {} } = {}) {
  const viewMode = variables.view_mode || "single";
  const brand = variables.brand || "lego";
  const studType = variables.stud_type || "solid";
  const quality = variables.quality || "draft";
  const common = { brand, studType, quality };

  let geometry;
  if (viewMode === "sampler") {
    geometry = createSampler(common);
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

  if (!toBoolean(variables.show_underside)) return geometry;
  const rotation = Math.PI;
  return Array.isArray(geometry)
    ? geometry.map((part) => modeling.transforms.rotateX(rotation, part))
    : modeling.transforms.rotateX(rotation, geometry);
}
