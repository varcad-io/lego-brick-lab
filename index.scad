use <@lego-scad/LEGO.scad>

view_mode = is_undef(view_mode) ? "single" : view_mode;
part_type = is_undef(part_type) ? "brick" : part_type;
brick_width = is_undef(brick_width) ? 2 : brick_width;
brick_length = is_undef(brick_length) ? 4 : brick_length;
height_preset = is_undef(height_preset) ? "brick" : height_preset;
brand = is_undef(brand) ? "lego" : brand;
stud_type = is_undef(stud_type) ? "solid" : stud_type;
brick_color = is_undef(brick_color) ? "#d71920" : brick_color;
technic_holes = is_undef(technic_holes) ? false : technic_holes;
technic_hole_shape = is_undef(technic_hole_shape) ? "cross" : technic_hole_shape;
curve_type = is_undef(curve_type) ? "convex" : curve_type;
wing_type = is_undef(wing_type) ? "left" : wing_type;
show_underside = is_undef(show_underside) ? false : show_underside;
quality = is_undef(quality) ? "draft" : quality;

height_ratio = height_preset == "plate" ? 1/3 : height_preset == "double" ? 2 : 1;
facet_angle = quality == "print" ? 2 : 8;
facet_size = quality == "print" ? 0.2 : 0.8;

module demo_block(
    width=brick_width,
    length=brick_length,
    height=height_ratio,
    type=part_type,
    color_value=brick_color,
    offset=[0, 0, 0]
) {
    translate(offset)
        color(color_value)
            block(
                width,
                length,
                height,
                type,
                brand,
                stud_type,
                "open",
                true,
                1.0,
                false,
                technic_holes,
                technic_hole_shape,
                false,
                "cross",
                brand == "duplo",
                wing_type,
                max(1, width - 2),
                1,
                type == "wing" || type == "round",
                1,
                0,
                max(1, length - 1),
                curve_type,
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
                1.0,
                $fa=facet_angle,
                $fs=facet_size
            );
}

module sampler() {
    demo_block(width=2, length=4, type="brick", color_value="#d71920", offset=[-44, 18, 0]);
    demo_block(width=2, length=4, height=1/3, type="brick", color_value="#f5cd2f", offset=[-12, 18, 0]);
    demo_block(width=2, length=2, height=1/3, type="tile", color_value="#f4f4f4", offset=[20, 18, 0]);
    demo_block(width=2, length=4, type="slope", color_value="#0055bf", offset=[-44, -18, 0]);
    demo_block(width=1, length=6, height=2, type="curve", color_value="#237841", offset=[-4, -18, 0]);
    demo_block(width=3, length=3, height=1/3, type="wing", color_value="#ff8a18", offset=[38, -18, 0]);
}

if (show_underside)
    rotate([180, 0, 0])
        if (view_mode == "sampler") sampler(); else demo_block();
else
    if (view_mode == "sampler") sampler(); else demo_block();
