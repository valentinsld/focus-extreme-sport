bl_info = {
    "name": "FOCUS PLUGINS",
    "author": "Valentin S",
    "version": (1, 2),
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

    DATA = "{"

    i = 0
    for ob in bpy.data.objects.values() :
        if ob.type == 'CURVE' :
            DATA += ('%s"%s": [' % (i==0 and ' ' or ', ', ob.name))
            for spline in ob.data.splines :
                if len(spline.bezier_points) > 0 :
                    for y, bezier_point in enumerate(spline.bezier_points.values()) :
                        handle_left  = ob.matrix_world @ bezier_point.handle_left
                        co           = ob.matrix_world @ bezier_point.co
                        handle_right = ob.matrix_world @ bezier_point.handle_right

                        DATA += '{'
                        DATA += ('"x": %s,' % (co[0]))
                        DATA += ('"y": %s,' % (co[1]))
                        DATA += ('"z": %s,' % (co[2]))
                        DATA += ('"xl": %s,' % (handle_left[0]))
                        DATA += ('"yl": %s,' % (handle_left[1]))
                        DATA += ('"zl": %s,' % (handle_left[2]))
                        DATA += ('"xr": %s,' % (handle_right[0]))
                        DATA += ('"yr": %s,' % (handle_right[1]))
                        DATA += ('"zr": %s,' % (handle_right[2]))
                        DATA += ('"ro": %s,' % (bezier_point.tilt))
                        DATA += ('"sp": %s' % (bezier_point.radius))
                        DATA += ("}%s" % ((len(spline.bezier_points)-1==y and ' ' or ',')))

            DATA += ']'
            i += 1
    DATA += '}'

    # print(DATA)

    save_data(DATA)


#
# Déclare button
#
class Exporter(bpy.types.Operator):
    """TOOLTIP"""
    bl_idname = "focus.exporter"
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
        row.operator("focus.exporter")

def register():
    bpy.utils.register_class(Exporter)
    bpy.utils.register_class(LayoutDemoPanel)


def unregister():
    bpy.utils.unregister_class(Exporter)
    bpy.utils.unregister_class(LayoutDemoPanel)


# Remove for addons blender
# if __name__ == "__main__":
#     register()
