;(function ( $, window, document ) {

  var defaults = {
    classNameOpen: 'is-active',
    classNameBackdrop: 'modal__backdrop',
    dataAttributeCloseButton: 'data-modal-close',
    dataAttributeOpenButton: 'data-modal-open'
  };

  /**
   * Create the plugin constructor
   * @param element
   * @param options
   * @constructor
   */
  function Plugin(element, options) {
    this._element = element;
    this._defaults = $.fn.modal.defaults;

    this.options = $.extend( {}, this._defaults, options );
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {

    /**
     * Initialize plugin
     */
    init: function () {
      this.buildCache();
      this.initBackDrop();
      this.bindEvents();
    },

    /**
     * Remove plugin instance completely
     */
    destroy: function () {
      this.unbindEvents();
      this.$element.removeData();
    },

    /**
     * Cache DOM nodes for performance
     */
    buildCache: function () {
      this.$element = $(this._element);
      this.$closeButtons = this.$element.find('*[' + defaults.dataAttributeCloseButton + ']');
      this.$openButtons = $('[' + defaults.dataAttributeOpenButton + ']');
    },

    /**
     * Bind events that trigger methods
     */
    bindEvents: function () {
      var plugin = this;
      this.trigger();
      this.$backdrop.on('mousedown', function () {
        plugin.hide();
      });
      this.$closeButtons.on('click', function () {
        plugin.hide();
      });
    },

    /**
     * Unbind events that trigger methods
     */
    unbindEvents: function () {
      this.$openButtons.off('click');
      this.$backdrop.off('mousedown');
      this.$closeButtons.off('click');
    },

    /**
     * Initialize trigger to open modal
     */
    trigger: function () {
      var id = this._element.id,
        plugin = this;

      this.$openButtons.each( function () {
        var target = $(this).attr(defaults.dataAttributeOpenButton);
        if (target !== id) {
          return;
        }
        $(this).on('click', function () {
          plugin.show();
        });
      });
    },

    /**
     * Opens the modal window
     */
    show: function () {
      this._element.style.display = 'block';
      this._element.removeAttribute('aria-hidden');
      this._element.setAttribute('aria-modal', true);
      this._element.setAttribute('role', 'dialog');
      this.$backdrop.addClass('show');
      document.body.classList.add(defaults.classNameOpen);
      this.callback();
    },

    /**
     * Close the modal window
     */
    hide: function () {
      this._element.style.display = 'none';
      this._element.setAttribute('aria-hidden', true);
      this._element.removeAttribute('aria-modal');
      this._element.removeAttribute('role');
      this.$backdrop.removeClass('show');
      document.body.classList.remove(defaults.classNameOpen);
      this.callback();
    },

    callback: function () {
      // Cache onComplete option
      var onComplete = this.options.onComplete;

      if (typeof onComplete === 'function') {
        onComplete.call(this._element);
      }
    },

    initBackDrop: function () {
      if (!$(defaults.classNameBackdrop).length) {
        this.$backdrop = $('<div>', {'class': defaults.classNameBackdrop});
        this.$element.prepend(this.$backdrop);
      }
    }
  });

  $.fn.modal = function (options) {
    this.each( function () {
      if (!$.data(this, 'plugin_modal')) {
        $.data(this, 'plugin_modal', new Plugin (this, options));
      }
    });

    return this;
  };

  $.fn.modal.defaults = {
    property: 'value',
    onComplete: null
  };

})(jQuery, window, document);

/**
 * Init modal window by CSS Class
 */
$('.modal').modal();
