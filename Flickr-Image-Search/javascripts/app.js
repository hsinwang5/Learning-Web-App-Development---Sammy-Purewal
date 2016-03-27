"use strict";
var isTimeoutRunning;

function main () {
	var url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=";
	var end = "&format=json&jsoncallback=?";
	var input = document.querySelectorAll("body input");
	var button = document.querySelectorAll("body button");

	button[0].addEventListener("click", function (event) {
		window.clearTimeout(isTimeoutRunning);
		$.getJSON((url + input[0].value + end), function (flickrResponse){
			scrollImages(0, flickrResponse, input[1].value);
		});
	});	

	input[0].addEventListener("keydown", function (event) {
		if (event.which === 13) {
			window.clearTimeout(isTimeoutRunning);
			$.getJSON((url + input.value + end), function (flickrResponse){
			scrollImages(0, flickrResponse, input[1].value);
		});
		}
	})

	button[1].addEventListener("click", function () {
		window.clearTimeout(isTimeoutRunning);
	});

	//Draggable Image using custom Javascript code
		var dragImg = document.querySelector(".images img");
		var body = document.querySelector("html");
		var dragging = false;
	
	dragImg.addEventListener("mousedown", function (event) {
		event.stopPropagation();
		window.clearTimeout(isTimeoutRunning);
		console.log("mousedown detected " + dragImg.clientHeight);
		dragImg.setAttribute("id", "drag");
		dragging = true;
		document.addEventListener("mouseup", function documentMouseUp () {
			console.log("mouseup detected");
			dragging = false;
			//reset position if not in clipboard
			dragImg.removeAttribute("id");
			dragImg.style.top = "";
			dragImg.style.left = "";
			document.removeEventListener("mouseup", documentMouseUp);
		});

	});
	document.addEventListener("mousemove", function (event) {
		if (dragging) {
			dragImg.style.top = (event.clientY - dragImg.clientHeight/2) + "px";
			dragImg.style.left = (event.clientX - dragImg.clientWidth/2) + "px";
		}
	})

	//Clipboard behavior
	var clipboard = document.querySelector(".clipboard");
	clipboard.addEventListener("mouseenter", function () {
		if (dragging) {
			console.log("mouse entered clipboard!");
			clipboard.style.backgroundColor = "#BBCB00";
		}
	});
	clipboard.addEventListener("mouseleave", function () {
		if (dragging) {
			clipboard.style.backgroundColor = "";
		}
	});
	clipboard.addEventListener("mouseup", function () {
		if (dragging) {
			clipboard.style.backgroundColor = "";
			var src = dragImg.getAttribute("src");
			var newImg = document.createElement("img");
			newImg.setAttribute("src", src);
			clipboard.appendChild(newImg);
			if (clipboard.offsetHeight < clipboard.scrollHeight) {
				alert("Sorry, too many images!");
				newImg.remove();
			} else {
				dragImg.setAttribute("src", "");
			}
		}
	});
}

function scrollImages (cycle, obj, time) {
	var imgsrc = document.querySelector("body img");
	imgsrc.setAttribute("src", obj.items[cycle].media.m);	
	isTimeoutRunning = setTimeout(function() {
		console.log(isTimeoutRunning);
		cycle += 1;
		if (cycle === obj.items.length) {
			console.log("end reached");
			cycle = 0;
			return;
		}
		scrollImages(cycle, obj, time);
	}, (time*1000))
};

/*

function allowDrop (ev) {
	ev.preventDefault ();
}

function onDragImage (ev) {
	ev.dataTransfer.setData("text", ev.target.currentSrc);
}

function onDrop (ev) {
	ev.preventDefault ();
	var data = ev.dataTransfer.getData("text");
	var clipboard = document.querySelector(".clipboard");
	var img = document.createElement("img");
	var eraseImg = document.querySelector("#drag");
	img.setAttribute("src", data);
	img.setAttribute("draggable", "false");
	clipboard.appendChild(img);
	if (clipboard.offsetHeight < clipboard.scrollHeight) {
		alert("Too many Images!");
		img.remove();
	} else {
		eraseImg.setAttribute("src", "");
	}
}

function logger () {
		setTimeout(function () {
		console.log(dragging);
		logger();
		}, 1000);
	}
	logger();

*/

//---------------------------------------------------------------------------------------------------------------

$(document).ready(main);

