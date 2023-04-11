export const getVisibleHeightAtZDepth = (depth, camera) => {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

export const getVisibleWidthAtZDepth = (depth, camera) => {
    const height = getVisibleHeightAtZDepth(depth, camera);
    return height * camera.aspect;
}

export const getScreenEdgeX  = (depth, camera) => getVisibleWidthAtZDepth(depth, camera) / 2

export const getScreenEdgeY  = (depth, camera) => getVisibleHeightAtZDepth(depth, camera) / 2

