var steps = [
	['/img/flow/click-users.png', [1, 280], 'Start by choosing the database table you want to view', true],
	['/img/flow/click-header.png', [765, 155], 'Click a column header to start building your query', true],
	['/img/flow/click-count-by.png', [777, 257], "Let's GROUP users BY country", false],
	['/img/flow/click-table-tab.png', [572, 202], 'You can see the results as a chart or a data table', true],
	['/img/flow/click-share.png', [722, 149], "Let's export these results", false],
	['/img/flow/click-google-sheets.png', [773, 266], 'Live-stream the results into Google Sheets', false],
	['/img/flow/google-sheets.png', [54, -14], 'Back to Trevor', true],
];

var step = 0;

function adjusted(length) {
	var originalHeight = 785;
	var currentHeight = $('.screenshot').height();
	var ratio = currentHeight / originalHeight;
	return length * ratio;
}

function getRadius() {
	return adjusted(40);
}

function animateCircle(circleRadius, ms, animateLabel, cb) {
	var radius = getRadius();
	var coordinates = steps[step][1];
	$('.circle')
		.animate({
			top: adjusted(coordinates[1]) - (circleRadius - radius),
			left: adjusted(coordinates[0]) - (circleRadius - radius),
			width: circleRadius * 2,
			height: circleRadius * 2,
			borderTopLeftRadius: circleRadius,
			borderTopRightRadius: circleRadius,
			borderBottomLeftRadius: circleRadius,
			borderBottomRightRadius: circleRadius
	}, {
		complete: cb,
		duration: ms,
		step: function() {
			//jquery.animate sets overflow: hidden during animation, so need to override that (otherwise label disappears)
			$('.circle').css("overflow","visible");
		 }
	});
	var labelText = steps[step][2];
	if(animateLabel) { //when the big circle shrinks, we want the label to swoop in with it
		$('.circle-label')
			.text(labelText)
			.animate({
				top: radius * 1.8 + (circleRadius - radius),
				left: radius * 1.8 + (circleRadius - radius)
			}, {
				duration: ms
			});
	}
}

var containerWidth = $('.demo-container').width();
var isMobile = containerWidth <= 480;

if(isMobile) {
	//to stop vertical overflow
	$('.demo-container').css({
		height: 400
	})
}

function updateCircle() {
	stopPulsate();
	//hide the circle
	$('.circle').hide();

	//calculate end position of zoom
	var coordinates = steps[step][1];
	var left = -1 * adjusted(coordinates[0]) + (containerWidth/2) - getRadius();
	if(left > 0) {
		left = 0;
	}

	//zoom out
	var zoomOut = steps[step][3];
	$('.image-holder').animate((!isMobile || !zoomOut ? {} : { //only zoom out if step requires it
		width: containerWidth,
		left: 0,
		top: 0
	}), 1000, function() {
		//change image
		var image = steps[step][0];
		$('.screenshot').attr('src', image);
		//zoom in
		$('.image-holder').animate((!isMobile ? {} : {
			width: containerWidth*2,
			left: left
		}), 2000, function() {
			$('.circle').show();//show the circle again
			var radius = getRadius();
			animateCircle(adjusted(2000), 0, false, function() {
				animateCircle(radius, 750, true, function() {
					startPulsate();
				})
			})
		});
	});
}

var interval = null;

function startPulsate() {
	interval = setInterval(function() {
		var radius = getRadius();
		animateCircle(radius+adjusted(20), 200, true, function() {
			animateCircle(radius, 200, true)
		})
	}, 1500);
}

function stopPulsate() {
	$('.circle').stop();//stop any running animations
	clearInterval(interval);
}

updateCircle();

$('.circle').click(function() {
	step = (step + 1) % steps.length;
	updateCircle();
})