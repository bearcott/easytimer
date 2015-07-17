//accurate interval class
function interval(duration, fn){
	this.baseline = undefined

	this.run = function(){
		if(this.baseline === undefined){
			this.baseline = new Date().getTime()
		}
		fn()
		var end = new Date().getTime()
		this.baseline += duration

		var nextTick = duration - (end - this.baseline)
		if(nextTick<0){
			nextTick = 0
		}
		(function(i){
			i.timer = setTimeout(function(){
				i.run(end)
			}, nextTick)
		}(this))
	}

	this.stop = function(){
	clearTimeout(this.timer)
	}
}

//clock class
// mode: 1 - normal, 2 - military, 3 - no seconds
var Clock = function(container) {
	this.container = container;
	this.hour = this.container.find('.hour');
	this.minute = this.container.find('.minute');
	this.second = this.container.find('.second');
	this.mili = this.container.find('.mili');
	this.ampm = this.container.find('.ampm');

	this.container.addClass('one'); //set the mode to 1

	this.interval;

	this.refresh = function() {
		var date = new Date();
		if (!this.container.hasClass('two')) {
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
		}else{
			this.hour.html(date.getHours());
			this.ampm.html("");
		}

		this.minute.html((date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes());
		if (!this.container.hasClass('three')) 
			this.second.html((date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds());
		else
			this.second.html("");
	};
	this.start = function() {
		var curr = new Date();
		dis = this;
		$.syncInterval(function() {
			dis.mili.html(now.getMilliseconds() - curr.getMilliseconds());
		},1000,500);
		// this.interval = setInterval(function() {
		// 	var now = new Date();
		// 	dis.mili.html(now.getMilliseconds() - curr.getMilliseconds());
		// }, 100)
	};
	this.stop = function() {

	};
}


$(function() {
	var clock = new Clock($('#clock'));
	var timer = new Clock($('#timer'));

	//set default mode to clock
	$('.mode').hide();
	$('#clock').show();


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

	//Set Time Type
	$('#clock').click(function() {
		$this = $(this);
		if ($this.hasClass('one')) {
			$this.removeClass('one');
			$this.addClass('two');
		} else if ($this.hasClass('two')) {
			$this.removeClass('two');
			$this.addClass('three');
		} else if ($this.hasClass('three')) {
			$this.removeClass('three');
			$this.addClass('one');
		}

	});

	//timer function
	$('#timer').click(function() {
		timer.start();
	});

	$('#togglemenu').click(function() {
		if ($('#menu').hasClass('active'))
			$('#menu').removeClass('active').stop().slideUp(200);
		else
			$('#menu').addClass('active').stop().slideDown(200);
	});
	$('#menu ul li.btn').click(function() {
		if ($(this).hasClass('selected'))
			return;
		$('#menu ul li.btn').removeClass('selected');
		$(this).addClass('selected');
		if ($(this).hasClass('clock')) {
			$('.mode').stop().fadeOut(200);
			$('#clock').stop().delay(200).fadeIn(200);
		}else if ($(this).hasClass('timer')) {
			$('.mode').stop().fadeOut(200);
			$('#timer').stop().delay(200).fadeIn(200);
		}
	});

	$('body').keypress(function(e) {
		//alert(e.keyCode);
		if (e.which == 98)
			$('#brightness').click();
		if (e.which == 109)
			$('#togglemenu').click();
	});

});