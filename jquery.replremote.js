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
			receive: defaultReceive,
			input: null
		}, settings || {});

		this.settings = settings;

		// Configure input element
		if (settings.input) {
			if (settings.input.attr('id')) {
				inputId = settings.input.attr('id');
			} else {
				settings.input.attr('id', inputId);
			}
		} else {
			this.after('<input type="text" name="__replInput" id="' + inputId + '" class="repl" />');
			settings.input = $('#' + inputId);
			settings.input.css('width', repl.css('width'));

		}
		settings.input.keypress(function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code == 13) {
				repl.sendCommand();
				e.preventDefault();
			}
		});

		this.sendCommand = function() {
			var c = settings.input.attr('value');
			repl.settings.send(c, repl.settings.endpoint, repl.settings.receive);
			repl.showInput(c);
			repl.settings.input.attr('value', '');
		};

		this.receive = function(data) {
			repl.settings.receive(data);
		};

		this.show = function(str) {
			var lines = str.split("\n");
			for (var x in lines) {
				var s = lines[x].replace(/^\s+|\s+$/g, '');
				if (!s) continue;
				repl.showLine(lines[x]);
			}
		};

		this.showLine = function(line) {
			repl.append('<span class="reploutput">' + line + '</span><br />');
		};

		this.showInput = function(line) {
			repl.append('<span class="replinput">' + line + '</span><br />');
		}

		this.error = function(data) {
			console.log('[replremote] An error occurred!');
		};

		return this;
	};

})(jQuery);

