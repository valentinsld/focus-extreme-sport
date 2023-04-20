/**
 * Source :
 * http://www.kevinsubileau.fr/informatique/boite-a-code/php-html-css/javascript-debounce-throttle-reduire-appels-fonction.html
 *
 * Retourne une fonction qui, tant qu'elle continue à être invoquée,
 * ne sera pas exécutée. La fonction ne sera exécutée que lorsque
 * l'on cessera de l'appeler pendant plus de N millisecondes.
 * Si le paramètre `immediate` vaut vrai, alors la fonction
 * sera exécutée au premier appel au lieu du dernier.
 * Paramètres :
 *  - func : la fonction à `debouncer`
 *  - wait : le nombre de millisecondes (N) à attendre avant
 *           d'appeler func()
 *  - immediate (optionnel) : Appeler func() à la première invocation
 *                            au lieu de la dernière (Faux par défaut)
 *  - context (optionnel) : le contexte dans lequel appeler func()
 *                          (this par défaut)
 */
function debounce(func, wait, immediate, context) {
	var result;
	var timeout = null;
	return function() {
		var ctx = context || this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) result = func.apply(ctx, args);
		};
		var callNow = immediate && !timeout;
		// Tant que la fonction est appelée, on reset le timeout.
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) result = func.apply(ctx, args);
		return result;
	};
}

export default debounce
