// Progressive-enhancement interactive diagrams.
// Each post figure marked `<figure class="diagram-live" data-diagram="…">`
// gets its static <img> replaced with a live canvas widget. Without JS the
// static SVG remains, so nothing is lost.

type Colors = {
	ink: string;
	inkSecondary: string;
	inkFaint: string;
	rule: string;
	accent: string;
	codeBg: string;
	bg: string;
};

function colors(): Colors {
	const s = getComputedStyle(document.documentElement);
	const v = (n: string) => s.getPropertyValue(n).trim();
	return {
		ink: v('--ink'),
		inkSecondary: v('--ink-secondary'),
		inkFaint: v('--ink-faint'),
		rule: v('--rule'),
		accent: v('--accent'),
		codeBg: v('--code-bg'),
		bg: v('--bg'),
	};
}

function el<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	cls?: string
): HTMLElementTagNameMap[K] {
	const node = document.createElement(tag);
	if (cls) node.className = cls;
	return node;
}

// A canvas that tracks its container width and device pixel ratio.
function makeCanvas(host: HTMLElement, cssH: number) {
	const canvas = el('canvas');
	host.appendChild(canvas);
	let w = 0;
	const h = cssH;
	const ctx = canvas.getContext('2d')!;
	function fit() {
		const cssW = Math.max(260, Math.min(host.clientWidth, 640));
		const dpr = window.devicePixelRatio || 1;
		canvas.width = Math.round(cssW * dpr);
		canvas.height = Math.round(h * dpr);
		canvas.style.width = cssW + 'px';
		canvas.style.height = h + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		w = cssW;
	}
	fit();
	return { canvas, ctx, get w() { return w; }, h, fit };
}

type Slider = { row: HTMLElement; get: () => number };

function slider(
	label: (v: number) => string,
	min: number,
	max: number,
	step: number,
	value: number,
	onInput: (v: number) => void
): Slider {
	const row = el('div', 'idiagram-control');
	const lab = el('label', 'idiagram-label');
	lab.textContent = label(value);
	const input = el('input');
	input.type = 'range';
	input.min = String(min);
	input.max = String(max);
	input.step = String(step);
	input.value = String(value);
	input.addEventListener('input', () => {
		const v = parseFloat(input.value);
		lab.textContent = label(v);
		onInput(v);
	});
	row.append(lab, input);
	return { row, get: () => parseFloat(input.value) };
}

const renderers: Array<() => void> = [];

// ------------------------------------------------------------------
// PWM: duty-cycle → square wave + average power
// ------------------------------------------------------------------
function buildPwm(host: HTMLElement) {
	const cv = makeCanvas(host, 210);
	const controls = el('div', 'idiagram-controls');
	const readout = el('p', 'idiagram-readout');
	let duty = 0.6;

	function draw() {
		const c = colors();
		const { ctx, w, h } = cv;
		ctx.clearRect(0, 0, w, h);
		const padX = 34;
		const top = 26;
		const bot = h - 30;
		const left = padX;
		const right = w - 12;
		const span = right - left;
		const hi = top;
		const lo = bot;
		const avgY = lo - duty * (lo - hi);
		const periods = 4;
		const pw = span / periods;

		// on-time fill
		ctx.fillStyle = c.accent;
		ctx.globalAlpha = 0.12;
		for (let p = 0; p < periods; p++) {
			const x0 = left + p * pw;
			ctx.fillRect(x0, hi, duty * pw, lo - hi);
		}
		ctx.globalAlpha = 1;

		// square wave
		ctx.strokeStyle = c.ink;
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		if (duty <= 0) {
			ctx.moveTo(left, lo);
			ctx.lineTo(right, lo);
		} else if (duty >= 1) {
			ctx.moveTo(left, hi);
			ctx.lineTo(right, hi);
		} else {
			ctx.moveTo(left, hi);
			for (let p = 0; p < periods; p++) {
				const x0 = left + p * pw;
				const xOn = x0 + duty * pw;
				const x1 = x0 + pw;
				ctx.lineTo(xOn, hi);
				ctx.lineTo(xOn, lo);
				ctx.lineTo(x1, lo);
				if (p < periods - 1) ctx.lineTo(x1, hi);
			}
		}
		ctx.stroke();

		// average line
		ctx.strokeStyle = c.accent;
		ctx.lineWidth = 1.4;
		ctx.setLineDash([5, 4]);
		ctx.beginPath();
		ctx.moveTo(left, avgY);
		ctx.lineTo(right, avgY);
		ctx.stroke();
		ctx.setLineDash([]);

		// labels
		ctx.fillStyle = c.inkFaint;
		ctx.font = '11px ui-monospace, Menlo, monospace';
		ctx.textAlign = 'right';
		ctx.fillText('5V', left - 8, hi + 4);
		ctx.fillText('0V', left - 8, lo + 4);
		ctx.fillStyle = c.accent;
		ctx.textAlign = 'right';
		ctx.fillText('avg', right - 4, avgY - 6);
	}

	function refresh() {
		draw();
		readout.textContent = `On ${Math.round(duty * 100)}% of the time → the motor feels ${Math.round(duty * 100)}% of full power.`;
	}

	const s = slider(
		(v) => `Duty cycle: ${Math.round(v)}%`,
		0,
		100,
		1,
		60,
		(v) => {
			duty = v / 100;
			refresh();
		}
	);
	controls.append(s.row);
	host.append(controls, readout);
	renderers.push(() => {
		cv.fit();
		refresh();
	});
	refresh();
}

// ------------------------------------------------------------------
// Gear coverage: scrub road speed → the gearbox picks a gear
// ------------------------------------------------------------------
function buildGear(host: HTMLElement) {
	const cv = makeCanvas(host, 280);
	const controls = el('div', 'idiagram-controls');
	const readout = el('p', 'idiagram-readout');
	const ks = [325, 171, 108, 76, 54]; // rpm per km/h, gears 1..5
	const idle = 800;
	const redline = 6500;
	const maxSpeed = 120;
	let speed = 50;

	// Ride each gear up toward redline, then upshift — the lowest gear (steepest
	// line, highest rpm) that still keeps the engine under redline.
	function pickGear(sp: number): number {
		for (let i = 0; i < ks.length; i++) {
			const rpm = ks[i] * sp;
			if (rpm >= idle && rpm <= redline) return i;
		}
		return ks[0] * sp < idle ? 0 : ks.length - 1;
	}

	function draw() {
		const c = colors();
		const { ctx, w, h } = cv;
		ctx.clearRect(0, 0, w, h);
		const left = 44;
		const right = w - 14;
		const top = 18;
		const bot = h - 30;
		const X = (sp: number) => left + (sp / maxSpeed) * (right - left);
		const Y = (rpm: number) => bot - (rpm / redline) * (bot - top);
		const active = pickGear(speed);

		// axes
		ctx.strokeStyle = c.rule;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(left, top);
		ctx.lineTo(left, bot);
		ctx.lineTo(right, bot);
		ctx.stroke();

		// idle + redline guides
		ctx.setLineDash([4, 4]);
		ctx.strokeStyle = c.rule;
		for (const r of [idle, redline]) {
			ctx.beginPath();
			ctx.moveTo(left, Y(r));
			ctx.lineTo(right, Y(r));
			ctx.stroke();
		}
		ctx.setLineDash([]);
		ctx.fillStyle = c.inkFaint;
		ctx.font = '10px ui-monospace, Menlo, monospace';
		ctx.textAlign = 'right';
		ctx.fillText('redline', left - 6, Y(redline) + 3);
		ctx.fillText('idle', left - 6, Y(idle) + 3);

		// gear lines
		for (let i = 0; i < ks.length; i++) {
			const spAtRed = redline / ks[i];
			const xEnd = Math.min(spAtRed, maxSpeed);
			ctx.strokeStyle = i === active ? c.accent : c.inkFaint;
			ctx.lineWidth = i === active ? 2.4 : 1;
			ctx.globalAlpha = i === active ? 1 : 0.5;
			ctx.beginPath();
			ctx.moveTo(X(0), Y(0));
			ctx.lineTo(X(xEnd), Y(ks[i] * xEnd));
			ctx.stroke();
			ctx.globalAlpha = 1;
			// gear number at line end
			ctx.fillStyle = i === active ? c.accent : c.inkFaint;
			ctx.font = '11px ui-monospace, Menlo, monospace';
			ctx.textAlign = 'left';
			ctx.fillText(String(i + 1), X(xEnd) + 3, Y(ks[i] * xEnd) + 4);
		}

		// current speed marker
		const rpm = ks[active] * speed;
		ctx.strokeStyle = c.accent;
		ctx.lineWidth = 1;
		ctx.setLineDash([3, 3]);
		ctx.beginPath();
		ctx.moveTo(X(speed), bot);
		ctx.lineTo(X(speed), Y(rpm));
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.fillStyle = c.accent;
		ctx.beginPath();
		ctx.arc(X(speed), Y(rpm), 4, 0, Math.PI * 2);
		ctx.fill();

		// axis labels
		ctx.fillStyle = c.inkFaint;
		ctx.font = '10px ui-monospace, Menlo, monospace';
		ctx.textAlign = 'center';
		ctx.fillText('road speed →', (left + right) / 2, h - 8);
		ctx.save();
		ctx.translate(12, (top + bot) / 2);
		ctx.rotate(-Math.PI / 2);
		ctx.fillText('engine rpm', 0, 0);
		ctx.restore();
	}

	function refresh() {
		draw();
		const g = pickGear(speed);
		const rpm = Math.round(ks[g] * speed);
		readout.textContent = `At ${Math.round(speed)} km/h the gearbox holds gear ${g + 1}, keeping the engine near ${rpm.toLocaleString()} rpm.`;
	}

	const s = slider(
		(v) => `Road speed: ${Math.round(v)} km/h`,
		0,
		maxSpeed,
		1,
		50,
		(v) => {
			speed = v;
			refresh();
		}
	);
	controls.append(s.row);
	host.append(controls, readout);
	renderers.push(() => {
		cv.fit();
		refresh();
	});
	refresh();
}

// ------------------------------------------------------------------
// PID: tune Kp/Ki/Kd and watch a plant chase a step setpoint
// ------------------------------------------------------------------
function buildPid(host: HTMLElement) {
	const cv = makeCanvas(host, 250);
	const controls = el('div', 'idiagram-controls');
	const readout = el('p', 'idiagram-readout');
	let kp = 3,
		ki = 0.6,
		kd = 1.2;

	// simulate a load being held at a setpoint: mass with damping + a
	// constant load force the controller must overcome.
	function simulate() {
		const dt = 0.04;
		const steps = 250;
		const m = 1,
			b = 0.8,
			load = 0.4,
			sp = 1;
		let x = 0,
			v = 0,
			integ = 0,
			lastErr = sp;
		const ys: number[] = [];
		for (let i = 0; i < steps; i++) {
			const err = sp - x;
			integ += err * dt;
			integ = Math.max(-20, Math.min(20, integ));
			const deriv = (err - lastErr) / dt;
			lastErr = err;
			let u = kp * err + ki * integ + kd * deriv;
			u = Math.max(-40, Math.min(40, u));
			const a = (u - b * v - load) / m;
			v += a * dt;
			x += v * dt;
			ys.push(x);
		}
		return ys;
	}

	function draw(ys: number[]) {
		const c = colors();
		const { ctx, w, h } = cv;
		ctx.clearRect(0, 0, w, h);
		const left = 30;
		const right = w - 12;
		const top = 16;
		const bot = h - 26;
		const yMin = -0.15,
			yMax = 1.7;
		const X = (i: number) => left + (i / (ys.length - 1)) * (right - left);
		const Y = (val: number) =>
			bot - ((val - yMin) / (yMax - yMin)) * (bot - top);

		// setpoint
		ctx.strokeStyle = c.inkFaint;
		ctx.lineWidth = 1.2;
		ctx.setLineDash([5, 4]);
		ctx.beginPath();
		ctx.moveTo(left, Y(1));
		ctx.lineTo(right, Y(1));
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.fillStyle = c.inkFaint;
		ctx.font = '10px ui-monospace, Menlo, monospace';
		ctx.textAlign = 'left';
		ctx.fillText('setpoint', left + 4, Y(1) - 5);

		// zero baseline
		ctx.strokeStyle = c.rule;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(left, Y(0));
		ctx.lineTo(right, Y(0));
		ctx.stroke();

		// response
		ctx.strokeStyle = c.accent;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ys.forEach((val, i) => {
			const yy = Y(Math.max(yMin, Math.min(yMax, val)));
			if (i === 0) ctx.moveTo(X(i), yy);
			else ctx.lineTo(X(i), yy);
		});
		ctx.stroke();

		ctx.fillStyle = c.inkFaint;
		ctx.textAlign = 'center';
		ctx.fillText('time →', (left + right) / 2, h - 8);
	}

	function refresh() {
		const ys = simulate();
		draw(ys);
		const final = ys[ys.length - 1];
		const peak = Math.max(...ys);
		const overshoot = Math.max(0, ((peak - 1) / 1) * 100);
		const ssErr = Math.abs(1 - final) * 100;
		readout.textContent = `Overshoot ${overshoot.toFixed(0)}% · steady-state error ${ssErr.toFixed(1)}%. ${
			ki < 0.05
				? 'With no I term, a gap to the setpoint remains.'
				: overshoot > 25
					? 'High overshoot — add D to damp it.'
					: 'Nicely tracked.'
		}`;
	}

	const sp = slider((v) => `Kp  ${v.toFixed(1)}`, 0, 10, 0.1, kp, (v) => {
		kp = v;
		refresh();
	});
	const si = slider((v) => `Ki  ${v.toFixed(2)}`, 0, 3, 0.05, ki, (v) => {
		ki = v;
		refresh();
	});
	const sd = slider((v) => `Kd  ${v.toFixed(1)}`, 0, 5, 0.1, kd, (v) => {
		kd = v;
		refresh();
	});
	controls.append(sp.row, si.row, sd.row);
	host.append(controls, readout);
	renderers.push(() => {
		cv.fit();
		refresh();
	});
	refresh();
}

const builders: Record<string, (host: HTMLElement) => void> = {
	pwm: buildPwm,
	gear: buildGear,
	pid: buildPid,
};

function hydrate() {
	const figures =
		document.querySelectorAll<HTMLElement>('figure.diagram-live');
	for (const fig of figures) {
		const kind = fig.dataset.diagram ?? '';
		const build = builders[kind];
		if (!build) continue;
		const host = el('div', 'idiagram');
		build(host);
		const img = fig.querySelector('img');
		const fallback = fig.querySelector('.idiagram-fallback');
		if (img) img.replaceWith(host);
		else if (fallback) fallback.replaceWith(host);
		else fig.prepend(host);
	}

	if (renderers.length === 0) return;

	// redraw on resize (debounced) and on theme change
	let t: number | undefined;
	window.addEventListener('resize', () => {
		if (t) clearTimeout(t);
		t = window.setTimeout(() => renderers.forEach((r) => r()), 120);
	});
	new MutationObserver(() => renderers.forEach((r) => r())).observe(
		document.documentElement,
		{ attributes: true, attributeFilter: ['data-theme'] }
	);
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', hydrate);
} else {
	hydrate();
}
