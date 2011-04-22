/**
 * jQuery REPL Remote
 *
 * Provides a pseudo REPL console that communicates with a remote server
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
			inputId = '__replInput_' + id,
			lineCount = 0;

		repl.settings = $.extend({
			endpoint: 'http://api.hostip.info/get_html.php?ip=',
			send: function(command, endpoint) {
				$.ajax({
					url: endpoint + escape(command),
					success: function(data) {
						repl.receive(data);
					},
					error: function(data) {
						repl.error(data);
					}
				});
			},
			receive: function(data) {
				repl.show(data);
			},
			input: null,
			autoscroll: true,
			autoscrollDuration: 300,
		}, settings || {});

		// Configure input element
		if (repl.settings.input) {
			if (repl.settings.input.attr('id')) {
				inputId = repl.settings.input.attr('id');
			} else {
				repl.settings.input.attr('id', inputId);
			}
		} else {
			this.after('<input type="text" name="__replInput" id="' + inputId + '" class="repl" />');
			repl.settings.input = $('#' + inputId);
			repl.settings.input.width(repl.width());
			//repl.settings.input.css('width', repl.css('width'));
		}

		// Handle keyboard input
		repl.settings.input.keypress(function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code == 13) {
				// Enter/return
				repl.sendCommand();
				e.preventDefault();
			}
		});

		this.sendCommand = function() {
			var c = repl.settings.input.attr('value');
			repl.settings.send(c, repl.settings.endpoint, repl.settings.receive);
			repl.settings.input.attr('value', '');
			repl.append('<span class="replinput">&gt;&gt; ' + c+ '</span><br />');
		};

		this.receive = function(data) {
			repl.settings.receive(data);
		};

		this.show = function(str) {
			var lines = str.split("\n");
			var lastId;

			var scrolledToBottom = repl[0].scrollHeight - repl.scrollTop() <= repl.outerHeight() + 20;

			for (var x in lines) {
				var s = lines[x].replace(/^\s+|\s+$/g, '');
				if (!s) continue;
				lastId = repl.showLine(lines[x]);
			}
			if (repl.settings.autoscroll && scrolledToBottom) {
				repl.animate({
					scrollTop: repl.get(0).scrollHeight
				}, repl.settings.autoscrollDuration);
				console.log(repl.settings);
			} else {
			}
		};

		this.showLine = function(line) {
			var lineId = '__repl_' + id + '_line_' + lineCount;
			repl.append('<span id="' + lineId + '" class="reploutput">' + line + '</span><br />');
			lineCount++;
			return lineId;
		};

		this.error = function(data) {
			console.log('[replremote] An error occurred!');
		};

		return this;
	};

})(jQuery);

