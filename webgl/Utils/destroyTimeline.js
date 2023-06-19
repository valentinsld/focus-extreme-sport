// const NOOP = () => {};
const UNRESOLVABLE = {
	then: () => UNRESOLVABLE,
	catch: () => UNRESOLVABLE
};

export default function destroyTimeline(tl) {
	if (!tl) return;
	if (tl.pause) tl.pause();
	tl.animatables.length = 0;
	tl.animations.length = 0;
	tl.children.length = 0;
	tl.finished = UNRESOLVABLE;
}
