
//clock class
// mode: 1 - normal, 2 - military, 3 - no seconds
var Clock = function(container) {
	this.wrapper = container;
	this.container = container.find('.container');
	this.hour = this.container.find('.hour');
	this.minute = this.container.find('.minute');
	this.second = this.container.find('.second');
	this.mili = this.container.find('.mili');
	this.ampm = this.container.find('.ampm');

	//way around scope problems, its a javascript "pointer"
	var main = {
		interval : false,//interval for timer
		curr : false, //starting time
		diff : false, //time difference for timer
		alarm : false, //time for alarm
		circle : false, //cursor circle
		circleInterval : false // interval for circle
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
		//ring alarm
		var alarm = new Date(main.alarm);
		if (date.getHours() == alarm.getHours() 
			&& date.getMinutes() == alarm.getMinutes()
			&& date.getSeconds() == alarm.getSeconds()) {
			this.wrapper.find('.time').click();
			this.cancelAlarm();
			this.finished();
		}

		if (!this.wrapper.hasClass('two')) {
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
		if (!this.wrapper.hasClass('three')) 
			this.second.html(keepZero(date.getSeconds()));
		else
			this.second.html("");

		return true;
	};
	this.setAlarmEdit = function() {
		//set edit to current time
		var date = new Date();
		var $this = this.wrapper.find('.edit');
		if (date.getHours() > 12) {
			$this.find('.hour').val(date.getHours() - 12);
			$this.find('.ampm').html("pm");
		} else {
			if (date.getHours() == 0)
				$this.find('.hour').val(12);
			else
				$this.find('.hour').val(date.getHours());
			$this.find('.ampm').html("am");
		}

		$this.find('.minute').val(keepZero(date.getMinutes()));
	};
	this.setAlarm = function() {
		var date = new Date();
		edit = this.wrapper.find('.edit');
		var ampm = edit.find(".ampm").html();
		var second = edit.find(".second").val();
		var minute = edit.find(".minute").val();
		var hour = edit.find(".hour").val();

		
		if (date.getHours() > 12) {
			$this.find('.hour').val(date.getHours() - 12);
			$this.find('.ampm').html("pm");
		} else {
			if (date.getHours() == 0)
				$this.find('.hour').val(12);
			else
				$this.find('.hour').val(date.getHours());
			$this.find('.ampm').html("am");
		}
		//determine whether am/pm
		var a;
		if (ampm == 'pm')
			a = 43200000;
		else
			a = 0;
		//set time
		main.alarm = minute*60000 + (hour-18)*3600000 + a;
		var alarm = new Date(main.alarm);
		//temporary formatting
		var m, ap;
		h = alarm.getHours();
		if (alarm.getHours() > 12) {
			h -= 12;
			ap = 'pm';
		}else {
			if (alarm.getHours() == 0) {
				h = 12;
				ap = 'pm'
			}else{
				ap = 'am';
			}
		}
		this.wrapper.find('.time span').html(h + ":" + keepZero(alarm.getMinutes()) + ap);
	}
	this.cancelAlarm = function() {
		main.alarm = false;
	}
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
		}, 35); //this is amount of miliseconds between each tick. Cannot be too low or lag. Sacrifice accuracy :P
		return true;
	};
	this.stop = function() {
		this.wrapper.removeClass('active');
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
		this.wrapper.removeClass('active');
		this.wrapper.removeClass('reverse');
		this.wrapper.find('.reset').hide();
		main.diff = false;
	}




	this.setReverse = function() {
		edit = this.wrapper.find('.edit');
		var mili = edit.find(".mili").val();
		var second = edit.find(".second").val();
		var minute = edit.find(".minute").val();
		var hour = edit.find(".hour").val();

		if (mili == 0 && second == 0 && minute == 0 && hour == 0)
			return

		this.mili.html(mili);
		this.second.html(second);
		this.minute.html(minute);
		this.hour.html(hour);
		main.diff = mili*10 + second*1000 + minute*60000 + hour*3600000;

		this.wrapper.addClass('reverse');
	};
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

				this.finished();
				
			}
		}.bind(this), 35);
	}
	this.stopReverse = function() {
		this.wrapper.removeClass('active');
		var now = new Date();
		main.diff = main.diff - (now.getTime() - main.curr);
		clearInterval(main.interval);
		return true;
	}

	this.createCircle = function(e) {
		main.circle = $('<div/>').attr('id','cursorCircle').css('top',e.pageY).css('left',e.pageX);
		$('body').append($(main.circle));
	}
	this.expandCircle = function() {
		var i = 50;
		main.circleInterval = setInterval(function() {
			$(main.circle).css({
				'margin-top' : -i/2,
				'margin-left' : -i/2,
				width : i,
				height : i
			});
			i++
		}, 5);
	}
	this.removeCircle = function() {
		$(main.circle).remove();
		clearInterval(main.circleInterval);
	}

	this.finished = function() {
		$('#ping')[0].play(); //play audio
		$('#ping')[0].currentTime=0;
		var f = $('#favicon').clone();
		var i = $('<link/>').addClass('#favicon2').attr('rel','shortcut icon').attr('href','favicon-invert.ico');

	    $('#favicon').remove();
	    $('head').append(i.clone());

		//times up animation
		this.wrapper
		.addClass('finished').delay(400).queue(function(){
		    $(this).removeClass('finished').dequeue();
		    $('#favicon2').remove();
		    $('head').append(f.clone());
		}).delay(400).queue(function(){
			$('#ping')[0].play(); //play audio agin!
			$('#ping')[0].currentTime=0;
		    $(this).addClass('finished').dequeue();
		    $('#favicon').remove();
	    	$('head').append(i.clone());
		}).delay(1000).queue(function(){
		    $(this).removeClass('finished').dequeue();
		    $('#favicon2').remove();
		    $('head').append(f.clone());
		});
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
	}, 200);
	clock.refresh();

	//set brightness by time of day
	var tod = (new Date()).getHours();
	if (tod > 8 && tod < 20)
		$('body').addClass('light');


	//EVENTS*************************

	//toggle brightness
	$('#brightness').click(function() {
		if ($('body').hasClass('scenic')) {
			$('#scenic').click();
			return;
		}
		if ($('body').hasClass('light')) {
			$('body').removeClass('light')
			localStorage.setItem('brightness','dark');
		}else{
			$('body').addClass('light');
			localStorage.setItem('brightness','light');
		}
	});



	//toggle scenic 
	$('#scenic').click(function() {
		if ($('body').hasClass('scenic')) {
			$('body').removeClass('scenic');
			$('#brightness').show();
			$('body').css('background-image','')
			localStorage.removeItem('scenic')
		} else {
			if ($('input.backgroundurl').val() != "")
				$('body').css('background-image','url(' + $('input.backgroundurl').val() + ')')
			$('body').removeClass('light').addClass('scenic');
			$('#brightness').hide();
			localStorage.setItem('scenic','true')
		}
	});

	//cancel alarm
	$('#clock .time').click(function() {
		$(this).hide();
		clock.cancelAlarm();
	})

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

	//editing timer/clock semantics
	$('#timer input, #clock input').keydown(function(e) { //make sure that u can only type numbers, arrow keys, backspace
	    var key = e.keyCode ? e.keyCode : e.which;
	    if (isNaN(String.fromCharCode(key)) 
	    	&& (e.keyCode != 8) //backspace
	    	&& (e.keyCode != 37) //left arrow
	    	&& (e.keyCode != 39)) //right arrow
	    	return false;
	});
	$('#timer input, #clock input').blur(function() { //fills in blank spaces
		if ($(this).hasClass('hour'))
			if ($(this).val() > 12)
				$(this).val(12);
		if ($(this).val() == "" || $(this).val() == 0)
			if ($(this).hasClass('hour'))
				$(this).val("0");
			else
				$(this).val("00");
		if ($(this).val().length == 1 && !$(this).hasClass('hour'))
			$(this).val("0" + $(this).val());
	});

	//set timer duration by click and hold
	var holdduration = 400;
	var timertimeout;
	$('#timer .container').mousedown(function(e) {
		timer.createCircle(e);
		timer.expandCircle();
		timertimeout = setTimeout(function() {
			$('#timer .reset').click();
			$('#timer').find('.container').hide();
			$('#timer').find('.edit').show();
			$('#timer').find('.confirm').show();
			timer.removeCircle();
		}.bind(this), holdduration);
	}).bind('mouseup mouseleave', function() {
		clearTimeout(timertimeout);
		timer.removeCircle();
	});
	//set clock alarm duration by click and hold 
	var clocktimeout;
	$('#clock .container').mousedown(function(e) {
		clock.createCircle(e);
		clock.expandCircle();
		clocktimeout = setTimeout(function() {
			clock.setAlarmEdit();
			$('#clock').find('.container').hide();
			$('#clock').find('.time').hide();
			$('#clock').find('.edit').show();
			$('#clock').find('.confirm').show();
			clock.removeCircle();
		}.bind(this), holdduration);
	}).bind('mouseup mouseleave', function() {
		clearTimeout(clocktimeout);
		clock.removeCircle();
	});

	//let ampm switch between am and pm
	$('#clock .btn.ampm').click(function(){
		if ($(this).html() == 'am')
			$(this).html('pm')
		else if ($(this).html() == 'pm')
			$(this).html('am')
	});

	//confirm the edit timer back to normal timer
	$('#timer .confirm').click(function() {
		$('#timer input').blur();
		$this = $('#timer');

		timer.setReverse();

		$this.find('.confirm').hide();
		$this.find('.container').show();
		$this.find('.edit').hide();
	});

	//confirm the edit clock back to normal clock
	$('#clock .confirm').click(function() {
		$('#clock input').blur();
		$this = $('#clock');

		clock.setAlarm();

		$this.find('.time').show();
		$this.find('.confirm').hide();
		$this.find('.container').show();
		$this.find('.edit').hide();
	});

	//toggle menu
	$('#togglemenu, #togglemenu:after').mouseenter(function() {
		if ($('#menu').hasClass('active'))
			return;
		$('#menu').addClass('active').stop().css('left','-100%').show().animate({'left':'0'},200);
	})
	$('section.menu').mouseleave(function() {
		setTimeout(function() {
			$('#menu').removeClass('active').stop().css('left','0').animate({'left':'-100%'},200,function() { $(this).hide() });
		},100);
	});

	//menu options selected
	$('#menu ul li.btn').click(function() {
		if ($(this).hasClass('selected'))
			return;
		$('#menu ul li.btn').removeClass('selected');
		$(this).addClass('selected');
		if ($(this).hasClass('clock')) {
			$('.mode').hide().removeClass('visible');
			$('#clock').show().addClass('visible');
			localStorage.setItem('mode','clock');
		}else if ($(this).hasClass('timer')) {
			$('.mode').hide().removeClass('visible');
			$('#timer').show().addClass('visible');
			localStorage.setItem('mode','timer');
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
			localStorage.setItem('size','medium');
		} else if (c.hasClass('medium')) {
			c.removeClass('medium').addClass('small');
			$(this).find('span.small').addClass('selected');
			localStorage.setItem('size','small');
		} else if (c.hasClass('small')) {
			c.removeClass('small').addClass('big');
			$(this).find('span.big').addClass('selected');
			localStorage.setItem('size','big');
		}
	});

	$('input.message').keyup(function() {
		$('#message').html($(this).val());
		localStorage.setItem('message',$(this).val())
	});
	$('input.backgroundurl').keyup(function(e) {
		var v = $(this).val();
		if (v == "") {
			$('body').css('background-image','')
			localStorage.removeItem('bg');
		}
		//loading image
		var img = new Image();
		img.src = v;
		img.onerror = function() {console.log("failed to load that image..")}
		img.onload = function() {
			if (!$('body').hasClass('scenic'))
				$('#scenic').click();
			$('body').css('background-image','url(' + v + ')');
			localStorage.setItem('bg',v);
		};
	});

	$('body').keydown(function(e) {

		if ($(e.target).hasClass('special'))
			return
		//alert(e.keyCode);
		if (e.which == 66) // b
			$('#brightness').click();
		// if (e.which == 77) // m
		// 	$('#togglemenu').click();
		if (e.which == 32) { //space bar
			if ($('.edit').is(':visible'))
				return;
			$(".mode.visible .container").click();
		}
		if (e.which == 84) // t
			$('#menu ul li.btn.timer').click();
		if (e.which == 67) // c
			$('#menu ul li.btn.clock').click();
		if (e.which == 65) // a
			$('#menu ul button.size').click();
		if (e.which == 27) // esc
			$('.mode.visible .reset').click();
		if (e.which == 13) { //enter
			if ($('.edit').is(':visible'))
				$('.mode.visible .confirm').click();
		}
	});



	//restore from last session
	if (localStorage.getItem('brightness') !== null) { //brightness
		if (localStorage.getItem('brightness') == 'light') {
			$('body').addClass('light')
		} else if (localStorage.getItem('brightness') == 'dark') {
			$('body').removeClass('light')
		}
	}

	if (localStorage.getItem('bg') !== null) { //if stored background
		$('input.backgroundurl').val(localStorage.getItem('bg'));
	}

	if (localStorage.getItem('scenic') !== null) { //if scenic
		if (!$('body').hasClass('.scenic'))
			$('#scenic').click();
		$('input.backgroundurl').keyup()
	}

	if (localStorage.getItem('message') !== null) { //if message
		$('input.message').val(localStorage.getItem('message')).keyup();
	}

	if (localStorage.getItem('mode') !== null) { //mode
		if (localStorage.getItem('mode') == 'timer') {
			$('#menu ul li.btn.timer').click();
		} else if (localStorage.getItem('mode') == 'clock') {
			$('#menu ul li.btn.clockS').click();
		}
	}

	if (localStorage.getItem('size') !== null) { //size
		var s = localStorage.getItem('size');
		var c = $('section.container');
		$('#menu button.size').find('span').removeClass('selected');
		$('#menu button.size').removeClass('big').removeClass('medium').removeClass('small');
		if (s == 'big') {
			c.addClass('big');
			$('#menu button.size').find('span.big').addClass('selected');
		} else if (s == 'medium') {
			c.addClass('medium');
			$('#menu button.size').find('span.medium').addClass('selected');
		} else if (s == 'small') {
			c.addClass('small');
			$('#menu button.size').find('span.small').addClass('selected');
		}
	}

});