/**
 * jQuery REPL Remote
 *
 * Provides a REPL console that communicates with a remote server
 *
 * Usage:
 * $('#myelement').replremote({
 *  endpoint: 'http://my.server.com/?q='
 * });
 */

 console.log('poop!');

(function($) {
	if (console == undefined || console.log == undefined) {
		console = {
			log: function() {}
		};
	}

	$.fn.replremote = function(settings) {
		var repl = this;
		var id = this.attr('id'),
			inputId = '__replInput_' + id;

		var defaultEndpoint = 'http://api.hostip.info/get_html.php?ip=';
		var defaultSend = function(command, endpoint) {
			$.ajax({
				url: endpoint + escape(command),
				success: function(data) {
					repl.receive(data);
				},
				error: function(data) {
					repl.error(data);
				}
			});
		};
		var defaultReceive = function(data) {
			repl.show(data);
		};

		settings = $.extend({
			endpoint: defaultEndpoint,
			send: defaultSend,
			receive: defaultReceive
		}, settings || {});

		this.settings = settings;

		// Create & configure input element
		this.after('<input type="text" name="__replInput" id="' + inputId + '" class="repl" />');
		var input = $('#' + inputId);
		input.keypress(function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code == 13) {
				repl.sendCommand();
				e.preventDefault();
			}
		});

		this.sendCommand = function() {
			var c = input.attr('value');
			console.log(repl.settings);
			repl.settings.send(c, repl.settings.endpoint, repl.settings.receive);
			input.attr('value', '');
		};

		this.receive = function(data) {
			this.settings.receive(data);
		};

		this.show = function(lines) {
			console.log('Showing!');
			console.log(lines);
		};

		this.error = function(data) {
			console.log('[replremote] An error occurred!');
		};

		return this;
	};

})(jQuery);

