const cloneMesh = (mesh) => {
	const clone = {
	  animations: mesh.animations,
	  scene: mesh.scene.clone(true),
	}

	const skinnedMeshes = {}

	mesh.scene.traverse((node) => {
	  if (node.isSkinnedMesh) {
		skinnedMeshes[node.name] = node
	  }
	})

	const cloneBones = {}
	const cloneSkinnedMeshes = {}

	clone.scene.traverse((node) => {
	  if (node.isBone) {
		cloneBones[node.name] = node
	  }

	  if (node.isSkinnedMesh) {
		cloneSkinnedMeshes[node.name] = node
	  }
	})

	for (let name in skinnedMeshes) {
	  const skinnedMesh = skinnedMeshes[name]
	  const skeleton = skinnedMesh.skeleton
	  const cloneSkinnedMesh = cloneSkinnedMeshes[name]

	  const orderedCloneBones = []

	  for (let i = 0; i < skeleton.bones.length; ++i) {
		const cloneBone = cloneBones[skeleton.bones[i].name]
		orderedCloneBones.push(cloneBone)
	  }

	  cloneSkinnedMesh.bind(
		new Skeleton(orderedCloneBones, skeleton.boneInverses),
		cloneSkinnedMesh.matrixWorld
	  )
	}

	return clone
  }

  export {cloneMesh};
