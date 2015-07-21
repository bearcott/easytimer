
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

	//way around scope problems, its a javascript "pointer"
	var main = {
		interval : false,//interval for timer
		curr : false, //starting time
		diff : false //time difference for timer
	}

	//helper function to add a zero.
	function keepZero(num) {
		if (num < 10)
			return "0" + num;
		else
			return num;
	}

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

		this.minute.html(keepZero(date.getMinutes()));
		if (!this.container.hasClass('three')) 
			this.second.html(keepZero(date.getSeconds()));
		else
			this.second.html("");

		return true;
	};
	this.start = function() {
		//logic before processing
		main.curr = new Date();
		if (main.diff)
			main.curr = main.curr.getTime();
		else
			main.curr = main.curr.getTime();
		dis = this;

		//core function to start timer
		main.interval = setInterval(function() {
			var now = new Date();
			var diff = new Date(now.getTime() - main.curr + main.diff);

			//truncate last digit of miliseconds.
			var mili = diff.getMilliseconds();
			mili = Math.trunc(mili/10);

			dis.mili.html(keepZero(mili));
			dis.second.html(keepZero(diff.getSeconds()));
			dis.minute.html(keepZero(diff.getMinutes()));
			dis.hour.html(diff.getHours() - 18);
		}, 35);
		return true;
	};
	this.stop = function() {
		this.container.removeClass('active');
		var now = new Date();
		main.diff = now.getTime() - main.curr + main.diff;
		clearInterval(main.interval);
		return true;
	};
	this.reset = function() {
		this.mili.html("00");
		this.second.html("00");
		this.minute.html("00");
		this.hour.html("0");
		this.container.removeClass('active');
		this.container.removeClass('reverse');
		this.container.find('.reset').hide();
		main.diff = false;
	}
	this.setReverse = function(edit) {
		var mili = edit.find(".mili").val();
		var second = edit.find(".second").val();
		var minute = edit.find(".minute").val();
		var hour = edit.find(".hour").val();
		this.mili.html(mili);
		this.second.html(second);
		this.minute.html(minute);
		this.hour.html(hour);
		main.diff = mili*10 + second*1000 + minute*60000 + hour*3600000;
	}
	this.startReverse = function() {
		//logic before processing
		main.curr = new Date();
		if (main.diff)
			main.curr = main.curr.getTime();
		else
			main.curr = main.curr.getTime();
		dis = this;

		//core function to start timer
		main.interval = setInterval(function() {
			var now = new Date();
			var diff = new Date(main.diff - (now.getTime() - main.curr));

			//truncate last digit of miliseconds.
			var mili = diff.getMilliseconds();
			mili = Math.trunc(mili/10);

			dis.mili.html(keepZero(mili));
			dis.second.html(keepZero(diff.getSeconds()));
			dis.minute.html(keepZero(diff.getMinutes()));
			dis.hour.html(diff.getHours() - 18);

			//stop the timer if it reaches 0.
			if (diff.getTime() <= 0) {
				this.stopReverse();
				this.reset();

				this.container.find('#ping')[0].play(); //play audio
				//times up animation
				this.container.addClass('finished').delay(1000).queue(function(){
				    $(this).removeClass('finished').dequeue();
				});
				
			}
		}.bind(this), 35);
	}
	this.stopReverse = function() {
		this.container.removeClass('active');
		var now = new Date();
		main.diff = main.diff - (now.getTime() - main.curr);
		clearInterval(main.interval);
		return true;
	}
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

	//toggle brightness
	$('#brightness').click(function() {
		if ($('body').hasClass('scenic')) {
			$('#scenic').click();
			return;
		}
		if ($('body').hasClass('light'))
			$('body').removeClass('light')
		else
			$('body').addClass('light');
	});

	//toggle scenic 
	$('#scenic').click(function() {
		if ($('body').hasClass('scenic')) {
			$('body').removeClass('scenic');
			$('#brightness').show();
		} else {
			$('body').removeClass('light').addClass('scenic');
			$('#brightness').hide();
		}
	});

	//clock function
	$('#clock .container').click(function() {
		$this = $(this).parent();
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
	$('#timer .container').click(function(e) {
		if ($(e.target).hasClass('reset'))
			return;
		if ($('#timer').hasClass('active')) {
			$('#timer').removeClass('active')
			if ($('#timer').hasClass('reverse')) {
				timer.stopReverse();
			}else{
				timer.stop();
			}
		} else{
			if ($('#timer').hasClass('reverse')) {
				timer.startReverse();
				$('#timer').addClass('active');
				$('#timer .reset').fadeIn();
			}else{
				timer.start();
				$('#timer').addClass('active');
				$('#timer .reset').fadeIn();
			}
		}
	});

	//reset timer function
	$('#timer .reset').click(function() {
		timer.stop();
		timer.reset();
		$(this).hide();
	});

	//editing timer semantics
	$('#timer input').keydown(function(e) { //make sure that u can only type numbers, arrow keys, backspace
	    var key = e.keyCode ? e.keyCode : e.which;
	    if (isNaN(String.fromCharCode(key)) 
	    	&& (e.keyCode != 8) //backspace
	    	&& (e.keyCode != 37) //left arrow
	    	&& (e.keyCode != 39)) //right arrow
	    	return false;
	});
	$('#timer input').blur(function() { //fills in blank spaces
		if ($(this).val() == "" || $(this).val() == 0)
			if ($(this).hasClass('hour'))
				$(this).val("0");
			else
				$(this).val("00");
		if ($(this).val().length == 1 && !$(this).hasClass('hour'))
			$(this).val("0" + $(this).val());
	});

	//set timer duration by click and hold 
	var timertimeout;
	$('#timer').mousedown(function() {
		timertimeout = setTimeout(function() {
			$('#timer .reset').click();
			$(this).find('.container').hide();
			$(this).find('.edit').show();
			$(this).find('.confirm').show();
		}.bind(this), 400);
	}).bind('mouseup mouseleave', function() {
		clearTimeout(timertimeout);
	});
	//set clock alarm duration by click and hold 
	var clocktimeout;
	$('#clock').mousedown(function() {
		clocktimeout = setTimeout(function() {
			$(this).find('.container').hide();
			$(this).find('.edit').show();
			$(this).find('.confirm').show();
		}.bind(this), 400);
	}).bind('mouseup mouseleave', function() {
		clearTimeout(clocktimeout);
	});

	//confirm the edit timer back to normal timer
	$('#timer .confirm').click(function() {
		$('#timer input').blur();
		$this = $('#timer').addClass('reverse');

		timer.setReverse($('#timer .edit'));

		$this.find('.confirm').hide();
		$this.find('.container').show();
		$this.find('.edit').hide();
	});

	//toggle menu
	$('#togglemenu').mouseenter(function() {
			$('#menu').addClass('active').stop().slideDown(200);
	})
	$('#menu').mouseleave(function() {
		$('#menu').removeClass('active').stop().slideUp(200);
	});

	//menu options selected
	$('#menu ul li.btn').click(function() {
		if ($(this).hasClass('selected'))
			return;
		$('#menu ul li.btn').removeClass('selected');
		$(this).addClass('selected');
		if ($(this).hasClass('clock')) {
			$('.mode').hide();
			$('#clock').show().addClass('visible');
		}else if ($(this).hasClass('timer')) {
			$('.mode').hide();
			$('#timer').show().addClass('visible');
		}
	});

	//toggle font size 
	$('#menu button.size').click(function() {
		var s = $(this).find('span.selected');
		var c = $('section.container');
		$(this).find('span').removeClass('selected');
		if (c.hasClass('big')) {
			c.removeClass('big').addClass('medium');
			$(this).find('span.medium').addClass('selected');
		} else if (c.hasClass('medium')) {
			c.removeClass('medium').addClass('small');
			$(this).find('span.small').addClass('selected');
		} else if (c.hasClass('small')) {
			c.removeClass('small').addClass('big');
			$(this).find('span.big').addClass('selected');
		}
	});
	$('body').keydown(function(e) {
		//alert(e.keyCode);
		if (e.which == 66) // b
			$('#brightness').click();
		// if (e.which == 77) // m
		// 	$('#togglemenu').click();
		if (e.which == 32) { //space bar
			if ($('input').is(':focus'))
				return;
			$(".mode.visible .container").click();
		}
		if (e.which == 84) // t
			$('#menu ul li.btn.timer').click();
		if (e.which == 67) // c
			$('#menu ul li.btn.clock').click();
		if (e.which == 65) // a
			$('#menu ul button.size').click();
		if (e.which == 13) { //enter
			if ($('#timer input').is(':focus'))
				$('#timer .confirm').click();
		}
	});

});