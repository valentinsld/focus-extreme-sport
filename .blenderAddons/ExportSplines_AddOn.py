bl_info = {
    "name": "FOCUS PLUGINS",
    "author": "Valentin S",
    "version": (1, 0),
    "blender": (2, 80, 0),
    "location": "RenderProperties",
    "description": "Exporter les splines",
    "warning": "",
    "doc_url": "",
    "category": "Exporter",
}

# extend Python's functionality to work with JSON files
import json

# extend Python's functionality to work with file paths
from pathlib import Path

# give Python access to Blender's functionality
import bpy


def get_path_to_mesh_data():
    return Path(bpy.path.abspath("//")) / "curves.json"


def save_data(data):
    path_to_file = get_path_to_mesh_data()

    # open the json file for writing and dump the data in text form
    with open(path_to_file, "w") as out_file_obj:
        # convert the dictionary into text
        text = json.dumps(data, indent=4)
        # write the text into the file
        out_file_obj.write(data)

def main():
    print(get_path_to_mesh_data())

    DATA = "{"

    D = bpy.data

    for i in range(len(D.curves)):

        spline = D.curves[i].splines[0]

        DATA += ('%s"%s": [' % (i==0 and ' ' or ', ', D.curves[i].name_full))
        for x in range(len(spline.bezier_points)):
            DATA += '{'
            DATA += ('"x": %s,' % (spline.bezier_points[x].co[0]))
            DATA += ('"y": %s,' % (spline.bezier_points[x].co[1]))
            DATA += ('"z": %s,' % (spline.bezier_points[x].co[2]))
            DATA += ('"xl": %s,' % (spline.bezier_points[x].handle_left[0]))
            DATA += ('"yl": %s,' % (spline.bezier_points[x].handle_left[1]))
            DATA += ('"zl": %s,' % (spline.bezier_points[x].handle_left[2]))
            DATA += ('"xr": %s,' % (spline.bezier_points[x].handle_right[0]))
            DATA += ('"yr": %s,' % (spline.bezier_points[x].handle_right[1]))
            DATA += ('"zr": %s' % (spline.bezier_points[x].handle_right[2]))
            DATA += ("}%s" % ((len(spline.bezier_points)-1==x and ' ' or ',')))

        DATA += ']'

    DATA += '}'
    print(DATA)

    save_data(DATA)

#
# Déclare button
#
class TestExporter(bpy.types.Operator):
    """TEST TOOLTIP"""
    bl_idname = "focus.test"
    bl_label = "Exporter les splines"

    def execute(self, content):
        main()
        return {'FINISHED'}

#
# Declare Layout
#
class LayoutDemoPanel(bpy.types.Panel):
    """Creates a Panel in the scene context of the properties editor"""
    bl_label = "FOCUS PLUGIN"
    bl_idname = "RENDER_PT_layout"
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = "render"

    def draw(self, context):
        layout = self.layout

        scene = context.scene

        # Big render button
        layout.label(text="Exporter les splines :")
        row = layout.row()
        row.scale_y = 2.0
        row.operator("focus.test")

def register():
    bpy.utils.register_class(TestExporter)
    bpy.utils.register_class(LayoutDemoPanel)


def unregister():
    bpy.utils.unregister_class(TestExporter)
    bpy.utils.unregister_class(LayoutDemoPanel)
