(function() {

	var	$body = document.body;
	var	$wrapper = document.getElementById('wrapper');
	var	$header = document.getElementById('header');
	var	$nav = $header.querySelector('nav');
	var	$navItems = $nav.querySelectorAll('a[href^="#"]');
	var	$main = document.getElementById('main');
	var	delay = 325;
	var	locked = false;

	// Methods.
	
		/**
		 * Toggle locks.
		 */
		function lock() {
			if (locked)
				return false;

			locked = true;

			window.setTimeout(function() {
				locked = false;
			}, delay);

			return true;
		}

		/**
		 * Unlock.
		 */
		function unlock() {
			locked = false;
		}

		/**
		 * Set locked state.
		 */
		function setLockedState() {
			$wrapper.style.transition = '';
			$wrapper.style.opacity = 1;
			$header.style.transition = '';
			$header.style.opacity = 1;
		}

		/**
		 * Clear locked state.
		 */
		function clearLockedState() {
			window.setTimeout(function() {
				$wrapper.style.transition = '';
				$header.style.transition = '';
			}, delay);
		}

		/**
		 * Hide article.
		 */
		function hideArticle($article) {

			var	$main = $article.parentElement,
				$inner = $article.querySelector('.inner'),
				$img = $article.querySelector('img'),
				$header = $article.querySelector('header'),
				$a = $article.querySelectorAll('.image.main, header .meta, header > *, .content > *');

			// Lock.
				lock();

			// Clear article's locked state.
				$article.classList.remove('active');

			// Hide main content.
				$main.style.opacity = 0;

			// Fade out images.
				if ($img) {
					$img.style.transition = 'opacity ' + (delay * 0.5) + 'ms ease-in-out';
					$img.style.opacity = 0;
				}

			// Fade out and slide up header elements.
				window.setTimeout(function() {
					$a.forEach(function($el, i) {
						window.setTimeout(function() {
							$el.style.transition = 'opacity 250ms ease-in-out, transform 250ms ease-in-out';
							$el.style.opacity = 0;
							$el.style.transform = 'translateY(-1em)';
						}, i * 25);
					});
				}, 25);

			// Wait for things to fade out.
				window.setTimeout(function() {

					// Reset styles.
						$a.forEach(function($el) {
							$el.style.transition = '';
							$el.style.opacity = '';
							$el.style.transform = '';
						});

						if ($img)
							$img.style.transition = '';

					// Clear article's active state.
						$article.classList.remove('active');

					// Unlock.
						unlock();

				}, delay);

		}

		/**
		 * Show article.
		 */
		function showArticle($article) {

			var	$main = $article.parentElement,
				$inner = $article.querySelector('.inner'),
				$img = $article.querySelector('img'),
				$header = $article.querySelector('header'),
				$a = $article.querySelectorAll('.image.main, header .meta, header > *, .content > *, h2.major, .education-item, .experience-item, .skills-section');

			// Lock.
				if (!lock())
					return false;

			// Clear main.
				$main.style.opacity = 1;

			// Set article's active state.
				$article.classList.add('active');

			// Hide all article content elements.
				if ($a.length > 0) {
					$a.forEach(function($el) {
						$el.style.transition = '';
						$el.style.opacity = 0;
						$el.style.transform = 'translateY(-1em)';
					});
				} else {
					// Fallback: hide entire article content
					$article.style.opacity = 0;
					$article.style.transform = 'translateY(-1em)';
				}

			// Show image.
				if ($img) {
					$img.style.transition = '';
					$img.style.opacity = 0;
				}

			// Wait a moment.
				window.setTimeout(function() {

					// Fade in image.
						if ($img) {
							$img.style.transition = 'opacity ' + (delay * 0.75) + 'ms ease-out';
							$img.style.opacity = 1;
						}

					// Fade in and slide down all elements.
						if ($a.length > 0) {
							$a.forEach(function($el, i) {
								window.setTimeout(function() {
									$el.style.transition = 'opacity 500ms ease-out, transform 500ms ease-out';
									$el.style.opacity = 1;
									$el.style.transform = 'translateY(0)';
								}, i * 25);
							});
						} else {
							// Fallback: show entire article
							$article.style.transition = 'opacity 500ms ease-out, transform 500ms ease-out';
							$article.style.opacity = 1;
							$article.style.transform = 'translateY(0)';
						}

					// Unlock after a bit more.
						window.setTimeout(function() {
							unlock();
						}, delay * 2);

				}, 100);

		}

	// Events.

		// Window: Preloader
			window.addEventListener('load', function() {
				window.setTimeout(function() {
					$body.classList.remove('is-preload');
					
					// Handle initial hash if present
					if (window.location.hash) {
						var hash = window.location.hash.substring(1);
						var $article = document.getElementById(hash);
						if ($article) {
							showArticle($article);
						}
					}
				}, 100);
			});

		// Articles.
			$navItems.forEach(function($navItem) {

				$navItem.addEventListener('click', function(event) {

					var	$this = this,
						href = $this.getAttribute('href');

					// External link? Bail.
						if (!href || href.substring(0, 4) == 'http' || href.substring(0, 5) == 'https' || href.substring(0, 7) == 'mailto:')
							return;

					// Must be a hash link.
						if (href.charAt(0) != '#')
							return;

					// Prevent default for hash links.
						event.preventDefault();
						event.stopPropagation();

					// Locked? Bail.
						if (locked)
							return false;

					// Get target article.
						var	hash = href.substring(1);
						var	$article = document.getElementById(hash);

					// No article? Bail.
						if (!$article) {
							console.log('Article not found:', hash);
							return;
						}

					// Hide header.
						$header.style.transition = 'opacity 325ms ease-in-out';
						$header.style.opacity = 0;

					// Wait for it to hide.
						window.setTimeout(function() {

							// Show article.
							showArticle($article);

							// Update URL hash.
							window.location.hash = hash;

							// Scroll to top.
							window.scrollTo(0, 0);

							// Wait a bit.
							window.setTimeout(function() {

								// Unlock header.
								$header.style.transition = '';
								$header.style.opacity = 1;

							}, 325);

						}, 250);

				});

			});

		// Window: Hashchange event.
			window.addEventListener('hashchange', function() {

				var	hash = window.location.hash.substring(1),
					$article = document.getElementById(hash);

				if ($article) {

					// Hide header.
						$header.style.transition = 'opacity 325ms ease-in-out';
						$header.style.opacity = 0;

					// Wait for it to hide.
						window.setTimeout(function() {

							// Reset scroll.
								window.scrollTo(0, 0);

							// Show article.
								showArticle($article);

							// Wait a bit.
								window.setTimeout(function() {

									// Unlock header.
										$header.style.transition = '';
										$header.style.opacity = 1;

								}, 325);

						}, 250);

				}

			});

		// Window: Initial hash.
			if (window.location.hash) {

				window.setTimeout(function() {
					window.dispatchEvent(new Event('hashchange'));
				}, 1);

			}

		// Window: Scroll event.
			var lastScrollTop = 0;
			window.addEventListener('scroll', function() {
				var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
				
				if (scrollTop > lastScrollTop && scrollTop > 100) {
					// Scrolling down
					$header.style.opacity = 0.9;
				} else {
					// Scrolling up
					$header.style.opacity = 1;
				}
				lastScrollTop = scrollTop;
			});

})();
