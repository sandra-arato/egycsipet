(function(window, document, undefined){

	var closestSelector = function(selector) {
		if (this.classList.contains(selector)) {
			return this;
		}

		this.parentNode.closestSelector = this.closestSelector;
		return this.parentNode.closestSelector(selector);
	}

	var StoryTeller = function StoryTeller() {
		var photos, modal, openCls, hiddenCls, modalKey;
		var that = this;

		this.init = function() {
			photos = Array.from(document.querySelectorAll('.photo'));
			modal = document.getElementById('modal');
			modalKey = '';
			openCls = 'photos--open';
			hiddenCls = 'photo__modal--hidden';

			for (var item of photos) {
				item.addEventListener('click', that.clickHandler);
			}
		}

		this.clickHandler = function(e) {
			e.preventDefault();
			e.target.closestSelector = closestSelector;
			var element = e.target.closestSelector('photo');
			var parent = element.parentNode;
			var tag = element.getAttribute('data-location');

			if (!parent.classList.contains(openCls)) {
				// to open the overlay
				parent.classList.add(openCls);
				document.body.classList.add('overlay');
				modal.classList.remove(hiddenCls);
				element.classList.add('show');
				parent.addEventListener('click', that.closeModal);

				for (var i of photos) {
					i.addEventListener('click', that.highlightPhoto);
				}
			}
			that.updateModal(tag);
		}

		this.closeModal = function(e) {
			var element = e.target;

			if (element.classList.contains(openCls)) {
				element.classList.remove(openCls);
				document.body.classList.remove('overlay');
				element.removeEventListener('click', that.closeModal);
				modal.classList.add(hiddenCls);
				that.resetPhotos(true);
			}
			return false;
		}

		this.updateModal = function(id) {
			var prev = modal.children[0];

			prev.addEventListener('transitionend', function(){
				modal.removeChild(modal.children[0]);

				var clone = document.getElementById(id).cloneNode(true);

				clone.removeAttribute('id');
				clone.classList.remove('visuallyhidden');
				clone.classList.add('hide');
				modal.appendChild(clone);
				// to move it out from the event loop:
				setTimeout(function() {
					clone.classList.remove('hide');
					modalKey = id;
				},50);
			}, false);

			if (modalKey !== id) {
				prev.classList.add('hide');
			}
		};

		this.highlightPhoto = function(e) {
			var photo = e.target.closestSelector('photo');

			if (photo.classList.contains('show')) {
				return false;
			} else {
				that.resetPhotos(false);
				photo.classList.add('show');
			}
		};

		this.resetPhotos = function(rel) {
			var img = Array.from(document.querySelectorAll('.show'));
			for (var i of img) {
				i.classList.remove('show');
				if (rel) {
					i.removeEventListener('click', that.highlightPhoto);
				}
			}
		};
	};

	// this is for the gallery images
	var storyTeller = new StoryTeller();
	storyTeller.init();

})(window, document);
