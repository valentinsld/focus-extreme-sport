/**
 * Source :
 * http://www.kevinsubileau.fr/informatique/boite-a-code/php-html-css/javascript-debounce-throttle-reduire-appels-fonction.html
 *
 * Retourne une fonction qui, tant qu'elle est appelée,
 * n'est exécutée au plus qu'une fois toutes les N millisecondes.
 * Paramètres :
 *  - func : la fonction à contrôler
 *  - wait : le nombre de millisecondes (période N) à attendre avant
 *           de pouvoir exécuter à nouveau la function func()
 *  - leading (optionnel) : Appeler également func() à la première
 *                          invocation (Faux par défaut)
 *  - trailing (optionnel) : Appeler également func() à la dernière
 *                           invocation (Faux par défaut)
 *  - context (optionnel) : le contexte dans lequel appeler func()
 *                          (this par défaut)
 */
function throttle(func, wait, leading, trailing, context) {
	var ctx, args, result;
	var timeout = null;
	var previous = 0;
	var later = function() {
		previous = new Date;
		timeout = null;
		result = func.apply(ctx, args);
	};
	return function() {
		var now = new Date;
		if (!previous && !leading) previous = now;
		var remaining = wait - (now - previous);
		ctx = context || this;
		args = arguments;
		// Si la période d'attente est écoulée
		if (remaining <= 0) {
			// Réinitialiser les compteurs
			clearTimeout(timeout);
			timeout = null;
			// Enregistrer le moment du dernier appel
			previous = now;
			// Appeler la fonction
			result = func.apply(ctx, args);
		} else if (!timeout && trailing) {
			// Sinon on s’endort pendant le temps restant
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
}

export default throttle
