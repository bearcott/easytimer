
//clock class
var Clock = function(container) {
	this.container = container;
	this.hour = this.container.find('.hour');
	this.minute = this.container.find('.minute');
	this.second = this.container.find('.second');
	this.ampm = this.container.find('.ampm');
	this.refresh = function() {
		var date = new Date();
		if (date.getHours() > 12) {
			this.hour.html(date.getHours() - 12);
			this.ampm.html("pm");
		} else {
			if (date.getHours() == 0)
				this.hour.html(12);
			else
				this.hour.html(date.getHours());
			this.ampm.html("am");
		}

		this.minute.html((date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes());
		this.second.html((date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds());
	}
}


$(function() {
	var clock = new Clock($('.clock'));

	//tick tock
	var tick = setInterval(function() {
		clock.refresh();
	}, 100);

	//set brightness by time of day
	var tod = (new Date()).getHours();
	if (tod > 8 && tod < 20)
		$('body').addClass('light');

	//switch brightness
	$('#brightness').click(function() {
		if ($('body').hasClass('light'))
			$('body').removeClass('light')
		else
			$('body').addClass('light');
	})

});