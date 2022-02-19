class Key {
	constructor(keys) {
		this.keys = keys;
	}
	down() {
		wCanvas.dispatchEvent(new KeyboardEvent('keydown', { keyCode: this.keys[0], bubbles: true, cancelable: true }));
	}
	up() {
		wCanvas.dispatchEvent(new KeyboardEvent('keyup', { keyCode: this.keys[0], bubbles: true, cancelable: true }));
	}
	reset() {
		wCanvas.focus();
		this.up();
	}
}

const wCanvas = document.getElementById('walk-canvas');
let haveGamepadEvent = 'GamepadEvent' in window,
	gamepadControllers = {},
	vibrationPresets = {
		weak: {
			duration: 150,
			strongMagnitude: 0,
			weakMagnitude: 0.07
		},
		normal: {
			duration: 300,
			strongMagnitude: 0,
			weakMagnitude: 0.14
		},
		strong: {
			duration: 600,
			strongMagnitude: 1,
			weakMagnitude: 1
		}
	},
	button_L = false,
	button_R = false,
	button_ZL = false,
	button_ZR = false;

if (typeof viewer == 'undefined') { var viewer = WALK.getViewer(); }


function connectHandler(e) {
	console.log('connected : ' + e.gamepad.id);
	addGamepad(e.gamepad);
}
function addGamepad(gamepad) {
	gamepadControllers[gamepad.index] = gamepad;
	window.requestAnimationFrame(updateStatus);
}

function disconnectHandler(e) {
	console.log('disconnected : ' + e.gamepad.id);
	removeGamepad(e.gamepad);
}

function removeGamepad(gamepad) {
	delete gamepadControllers[gamepad.index];
}

function updateStatus() {
	scanGamepads();

	for (j in gamepadControllers) {
		let controller = gamepadControllers[j];
		if (gamepadReady == true) {
			for (let i = 0; i < controller.buttons.length; i++) {
				let button = controller.buttons[i];
				let pressed = button == 1.0;
				let touched = false;
				if (typeof (button) == 'object') {
					pressed = button.pressed;
					if ('touched' in button) {
						touched = button.touched;
					}
					value = button.value;
				}
				switch (i) {
					case 4: button_L = (pressed || touched) ? true : false; break;
					case 5: button_R = (pressed || touched) ? true : false; break;
					case 6: button_ZL = (pressed || touched) ? true : false; break;
					case 7: button_ZR = (pressed || touched) ? true : false; break;
					case 0: (pressed || touched) ? new Key([81]).down() : new Key([81]).up(); break;
					case 1: (pressed || touched) ? new Key([221]).down() : new Key([221]).up(); break;
					case 2: (pressed || touched) ? new Key([219]).down() : new Key([219]).up(); break;
					case 3: (pressed || touched) ? new Key([69]).down() : new Key([69]).up(); break;
					case 12: (pressed || touched) ? new Key([87]).down() : new Key([87]).up(); break;
					case 13: (pressed || touched) ? new Key([83]).down() : new Key([83]).up(); break;
					case 14: (pressed || touched) ? new Key([65]).down() : new Key([65]).up(); break;
					case 15: (pressed || touched) ? new Key([68]).down() : new Key([68]).up(); break;
					case 17: (pressed || touched) ? new Key([80]).down() : new Key([80]).up(); break;
					case 8: (pressed || touched) ? viewer.menuVisible = false : ''; break;
					case 9: (pressed || touched) ? viewer.menuVisible = true : ''; break;
					case 16: (pressed || touched) ? document.location.reload() : ''; break;
				}
				if (!button_L && !button_ZL) {
					WALK.CAMERA_FULL_ACCELERATION_TIME = 0.75;
				} else if (button_L) {
					WALK.CAMERA_FULL_ACCELERATION_TIME = 5;
				} else if (button_ZL) {
					WALK.CAMERA_FULL_ACCELERATION_TIME = 0.01;
				}
				if (!button_R && !button_ZR) {
					WALK.CAMERA_ARROWS_TURN_SPEED = 0.5236;
				} else if (button_R) {
					WALK.CAMERA_ARROWS_TURN_SPEED = 0.1745;
				} else if (button_ZR) {
					WALK.CAMERA_ARROWS_TURN_SPEED = 1.5708;
				}
			}
			for (let i = 0; i < controller.axes.length; i++) {
				let stick = controller.axes[i];
				if (stick !== 0) {
					if (i == 0 || i == 1) {
						if (i == 0) {
							if (stick < -0.1) {
								new Key([65]).down();
							} else if (stick > 0.1) {
								new Key([68]).down();
							} else {
								new Key([65]).up(); new Key([68]).up();
							}
						} else if (i == 1) {
							if (stick < -0.1) {
								new Key([87]).down();
							} else if (stick > 0.1) {
								new Key([83]).down();
							} else {
								new Key([87]).up(); new Key([83]).up();
							}
						}
					}
					if (i == 2 || i == 3) {
						if (i == 2) {
							if (stick < -0.1) {
								new Key([37]).down();
							} else if (stick > 0.1) {
								new Key([39]).down();
							} else {
								new Key([37]).up(); new Key([39]).up();
							}
						}
					}
				}
			}
		} else {
			for (let i = 0; i < controller.buttons.length; i++) {
				let button = controller.buttons[i];
				let pressed = button == 1.0;
				let touched = false;
				if (typeof (button) == 'object') {
					pressed = button.pressed;
					if ('touched' in button) {
						touched = button.touched;
					}
					value = button.value;
				}
				switch (i) {
					case 4: button_L = (pressed || touched) ? true : false; break;
					case 5: button_R = (pressed || touched) ? true : false; break;
					case 9: (pressed || touched) ? viewer.play() : ''; break;
					case 16: (pressed || touched) ? document.location.reload() : ''; break;
				}
				if (button_L && button_R) {
					if (controller.vibrationActuator) {
						controller.vibrationActuator.playEffect('dual-rumble', vibrationPresets.weak);
					}
					viewer.play();
				}
			}
		}
	}
	window.requestAnimationFrame(updateStatus);
}

function scanGamepads() {
	let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
	for (let i = 0; i < gamepads.length; i++) {
		if (gamepads[i] && (gamepads[i].index in gamepadControllers)) {
			gamepadControllers[gamepads[i].index] = gamepads[i];
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	if (haveGamepadEvent) {
		window.addEventListener('gamepadconnected', connectHandler);
		window.addEventListener('gamepaddisconnected', disconnectHandler);
	}
});