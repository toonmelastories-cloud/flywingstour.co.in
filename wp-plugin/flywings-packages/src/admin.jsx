/**
 * Flywings Packages: the package editor.
 *
 * Runs inside WordPress's post edit screen, using WordPress's own React
 * (wp.element) and UI components (wp.components), so nothing extra is
 * downloaded. The whole package lives in one state object that is
 * mirrored into the hidden "fwp_data" field, so WordPress's normal Save
 * Draft / Publish / Update buttons save it.
 *
 * Build: see README.md in the plugin folder. The output is assets/admin.js.
 */

/* global wp */

const { useState, useEffect, useMemo, useRef, createPortal, createRoot, render } = wp.element;
const {
	Button,
	TextControl,
	TextareaControl,
	ToggleControl,
	SelectControl,
	FormTokenField,
	Modal,
	Notice,
} = wp.components;

const cfg = window.fwpAdmin;

/* ─── Helpers ──────────────────────────────────────────────────────────── */

const inr = (n) => {
	const v = Math.round(Number(n) || 0);
	return v > 0 ? '₹' + v.toLocaleString('en-IN') : '';
};

const durationLabel = (nights) =>
	nights < 1 ? '' : `${nights} ${nights === 1 ? 'Night' : 'Nights'} / ${nights + 1} Days`;

const slugify = (s) =>
	String(s || '')
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 90);

const today = () => new Date().toLocaleDateString('en-CA');

const move = (arr, from, to) => {
	const a = arr.slice();
	const [x] = a.splice(from, 1);
	a.splice(to, 0, x);
	return a;
};

const wordCount = (s) => (String(s).trim().match(/\S+/g) || []).length;

const emptyDay = () => ({ title: '', description: '', activities: [], meals: '', hotel: '' });

const dayIsEmpty = (d) => !d.title && !d.description && !d.activities.length && !d.meals && !d.hotel;

const BULLET = /^\s*(?:[-*•●▪◦✓✔☑➤>]+|\d{1,2}[.)])\s*/;
const cleanBullet = (s) => s.replace(BULLET, '').trim();

const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;

function normalize(raw) {
	const d = { ...raw };
	[
		'tripTypes', 'cities', 'images', 'itinerary', 'inclusions', 'exclusions', 'hotels',
		'pricingTiers', 'faqs', 'cancellationPolicy', 'relatedSlugs', 'keywords',
	].forEach((k) => {
		if (!Array.isArray(d[k])) d[k] = [];
	});
	d.itinerary = d.itinerary.map((x) => ({
		...emptyDay(),
		...x,
		activities: Array.isArray(x.activities) ? x.activities : [],
	}));
	['nights', 'startingPrice', 'originalPrice', 'featuredOrder', 'reviewCount'].forEach((k) => {
		d[k] = Number(d[k]) || 0;
	});
	d.rating = Number(d.rating) || 0;
	d.offer = { enabled: false, price: 0, comparePrice: 0, validTill: '', minPax: 2, note: '', ...(d.offer || {}) };
	d.slug = d.slug || '';
	return d;
}

async function ajax(action, body) {
	const fd = new FormData();
	fd.append('action', action);
	fd.append('nonce', cfg.nonce);
	Object.entries(body).forEach(([k, v]) => fd.append(k, v));
	const res = await fetch(cfg.ajaxUrl, { method: 'POST', body: fd, credentials: 'same-origin' });
	const json = await res.json().catch(() => null);
	if (!json || !json.success) {
		throw new Error((json && json.data && json.data.message) || 'Something went wrong. Please try again.');
	}
	return json.data;
}

/**
 * Splits pasted itinerary text into days. A line starting with "Day 1",
 * "DAY 01 -", "Day 2:" and so on opens a day; bullet lines become
 * activities; "Meals: ..." and "Overnight: ..." fill those fields; any
 * other line is the title (if the Day line had none) or description.
 */
function parseItinerary(text) {
	const days = [];
	let cur = null;
	const dayRe = /^(?:[*#>\-•]\s*)?day\s*[-:]?\s*0?(\d{1,2})\b\s*(?:[:.)\-–—|]+\s*)?(.*)$/i;
	text.split(/\r?\n/).forEach((raw) => {
		const line = raw.replace(/\*\*|__/g, '').trim();
		if (!line) return;
		const m = line.match(dayRe);
		if (m) {
			cur = { ...emptyDay(), title: m[2].trim() };
			days.push(cur);
			return;
		}
		if (!cur) return;
		const meal = line.match(/^(?:meals?|food)\s*[:\-–]\s*(.+)$/i);
		if (meal) {
			cur.meals = meal[1].trim();
			return;
		}
		const stay = line.match(/^(?:overnight|stay|hotel|accommodation)(?:\s+(?:at|in))?\s*[:\-–]\s*(.+)$/i);
		if (stay) {
			cur.hotel = stay[1].trim();
			return;
		}
		if (BULLET.test(raw) && cleanBullet(line)) {
			cur.activities.push(cleanBullet(line));
			return;
		}
		if (!cur.title) {
			cur.title = line;
			return;
		}
		cur.description = cur.description ? `${cur.description} ${line}` : line;
	});
	return days;
}

/* ─── Checks (kept in step with FWP_Data::publish_errors) ──────────────── */

function runChecks(d, title) {
	const out = [];
	const err = (tab, msg) => out.push({ level: 'error', tab, msg });
	const warn = (tab, msg) => out.push({ level: 'warn', tab, msg });
	const days = d.nights + 1;

	if (!title.trim()) err('basics', 'Add the package title in the big box at the top.');
	if (!d.destination) err('basics', 'Choose a destination.');
	if (d.nights < 1) err('basics', 'Set the number of nights.');
	if (!d.shortTitle) warn('basics', 'Add a short name for the cards.');
	if (!d.tagline) warn('basics', 'Add a one-line tagline.');
	if (!d.cities.length) warn('basics', 'List the cities covered.');

	if (!d.images.length) err('photos', 'Add at least one photo.');
	else if (d.images.length < 2) warn('photos', 'Add a second photo so the gallery shows.');
	if (d.images.some((i) => !i.alt)) warn('photos', 'Describe every photo (helps Google and screen readers).');
	if (d.images.some((i) => i.w && i.w < 1200)) warn('photos', 'Some photos are under 1200px wide and may look blurry.');

	if (!d.overview.trim()) err('overview', 'Write the overview.');
	else if (wordCount(d.overview) < 60) warn('overview', 'Make the overview at least 60 words.');

	if (d.nights >= 1 && d.itinerary.length !== days) {
		err('itinerary', `The itinerary has ${plural(d.itinerary.length, 'day')} but the trip is ${days} days.`);
	}
	d.itinerary.forEach((day, i) => {
		if (!day.title.trim()) err('itinerary', `Day ${i + 1} needs a title.`);
	});
	if (d.itinerary.some((day) => day.title && !day.description.trim())) warn('itinerary', 'Some days have no description.');

	if (!d.inclusions.filter(Boolean).length) err('inclusions', 'List what is included.');
	if (!d.exclusions.filter(Boolean).length) warn('inclusions', 'List what is not included.');
	if (!d.hotels.length) warn('hotels', 'Add the hotels.');

	if (d.showPrice && !d.priceOnRequest && !(d.startingPrice > 0)) {
		err('pricing', 'Enter the starting price, or turn off "Show price on website".');
	}
	if (d.originalPrice && d.startingPrice && d.originalPrice <= d.startingPrice) {
		warn('pricing', 'The original price should be higher than the starting price.');
	}

	if (d.faqs.length < 3) warn('faqs', 'Add at least 3 FAQs.');
	if (!d.cancellationPolicy.filter(Boolean).length) warn('faqs', 'Add the cancellation policy.');

	const md = d.metaDescription.length;
	if (!md) warn('seo', 'Write the Google description.');
	else if (md < 120 || md > 160) warn('seo', `The Google description is ${md} characters; 120 to 160 works best.`);
	if (d.metaTitle.length > 65) warn('seo', 'The Google title is long and may be cut off.');

	if (d.offer.enabled && !(d.offer.price > 0)) err('visibility', 'Enter the offer price, or turn the offer off.');
	if (d.offer.enabled && d.offer.validTill && d.offer.validTill < today()) {
		warn('visibility', 'The offer end date has passed, so the offer is not showing.');
	}
	if (d.availableUntil && d.availableUntil < today()) {
		warn('visibility', 'The "Available until" date has passed, so the package is hidden from listings.');
	}
	return out;
}

const TABS = [
	{ id: 'basics', label: 'Basics', icon: 'admin-site-alt3' },
	{ id: 'photos', label: 'Photos', icon: 'format-gallery' },
	{ id: 'overview', label: 'Overview', icon: 'text-page' },
	{ id: 'itinerary', label: 'Itinerary', icon: 'calendar-alt' },
	{ id: 'inclusions', label: 'Inclusions', icon: 'yes-alt' },
	{ id: 'hotels', label: 'Hotels', icon: 'building' },
	{ id: 'pricing', label: 'Pricing', icon: 'tag' },
	{ id: 'faqs', label: 'FAQs & Policy', icon: 'editor-help' },
	{ id: 'seo', label: 'Google (SEO)', icon: 'search' },
	{ id: 'visibility', label: 'Visibility & Offer', icon: 'visibility' },
];

/* ─── Small building blocks ────────────────────────────────────────────── */

const Text = (p) => <TextControl __nextHasNoMarginBottom __next40pxDefaultSize {...p} />;
const Area = (p) => <TextareaControl __nextHasNoMarginBottom {...p} />;
const Toggle = (p) => <ToggleControl __nextHasNoMarginBottom {...p} />;
const Select = (p) => <SelectControl __nextHasNoMarginBottom __next40pxDefaultSize {...p} />;
const Tokens = (p) => <FormTokenField __nextHasNoMarginBottom __next40pxDefaultSize {...p} />;

function Section({ title, hint, actions, tone, children }) {
	return (
		<section className={'fwp-section' + (tone ? ` fwp-section--${tone}` : '')}>
			{(title || actions) && (
				<header className="fwp-section__head">
					<div>
						{title && <h3 className="fwp-section__title">{title}</h3>}
						{hint && <p className="fwp-section__hint">{hint}</p>}
					</div>
					{actions && <div className="fwp-section__actions">{actions}</div>}
				</header>
			)}
			<div className="fwp-section__body">{children}</div>
		</section>
	);
}

function Field({ label, help, children }) {
	return (
		<div className="fwp-field">
			{label && <span className="fwp-label">{label}</span>}
			{children}
			{help && <p className="fwp-help">{help}</p>}
		</div>
	);
}

function IconButton({ icon, label, onClick, disabled, tone }) {
	return (
		<Button
			icon={icon}
			label={label}
			showTooltip
			size="small"
			className={'fwp-icon-btn' + (tone ? ` is-${tone}` : '')}
			onClick={onClick}
			disabled={disabled}
		/>
	);
}

/** Drag to reorder: a handle starts the drag, any row accepts the drop. */
function useSortable(items, onChange) {
	const [from, setFrom] = useState(null);
	const [over, setOver] = useState(null);
	const end = () => {
		setFrom(null);
		setOver(null);
	};
	return {
		handle: (i) => ({
			draggable: true,
			onDragStart: (e) => {
				e.stopPropagation();
				setFrom(i);
				e.dataTransfer.effectAllowed = 'move';
				try {
					e.dataTransfer.setData('text/plain', 'fwp');
					const row = e.currentTarget.closest('[data-sort-row]');
					if (row) e.dataTransfer.setDragImage(row, 24, 24);
				} catch (x) {
					// Older browsers: the default drag image is fine.
				}
			},
			onDragEnd: end,
		}),
		row: (i) => ({
			'data-sort-row': '',
			onDragOver: (e) => {
				if (from === null) return;
				e.preventDefault();
				e.stopPropagation();
				if (over !== i) setOver(i);
			},
			onDrop: (e) => {
				if (from === null) return;
				e.preventDefault();
				e.stopPropagation();
				if (from !== i) onChange(move(items, from, i));
				end();
			},
		}),
		cls: (i) => (from === i ? ' is-dragging' : '') + (from !== null && over === i && from !== i ? ' is-over' : ''),
	};
}

function Handle(props) {
	return (
		<span className="fwp-handle" title="Drag to reorder" aria-hidden="true" {...props}>
			<span className="dashicons dashicons-move" />
		</span>
	);
}

/**
 * A list of one-line items. Enter adds the next item, Backspace on an
 * empty item removes it, and pasting several lines adds them all.
 */
function ListEditor({ items, onChange, placeholder, addLabel = 'Add item' }) {
	const refs = useRef([]);
	const [focus, setFocus] = useState(null);
	const s = useSortable(items, onChange);

	useEffect(() => {
		if (focus !== null && refs.current[focus]) {
			refs.current[focus].focus();
			setFocus(null);
		}
	}, [focus, items]);

	const setAt = (i, v) => {
		const a = items.slice();
		a[i] = v;
		onChange(a);
	};
	const insertAfter = (i) => {
		const a = items.slice();
		a.splice(i + 1, 0, '');
		onChange(a);
		setFocus(i + 1);
	};
	const removeAt = (i) => {
		const a = items.slice();
		a.splice(i, 1);
		onChange(a);
		setFocus(i > 0 ? i - 1 : null);
	};

	return (
		<div className="fwp-list">
			{items.map((item, i) => (
				<div key={i} className={'fwp-list__row' + s.cls(i)} {...s.row(i)}>
					<Handle {...s.handle(i)} />
					<input
						type="text"
						className="fwp-input"
						ref={(el) => {
							refs.current[i] = el;
						}}
						value={item}
						placeholder={placeholder}
						onChange={(e) => setAt(i, e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								insertAfter(i);
							} else if (e.key === 'Backspace' && item === '') {
								e.preventDefault();
								removeAt(i);
							}
						}}
						onPaste={(e) => {
							const text = e.clipboardData.getData('text');
							if (!text.includes('\n')) return;
							e.preventDefault();
							const lines = text.split(/\r?\n/).map(cleanBullet).filter(Boolean);
							const a = items.slice();
							a.splice(i, 1, ...(item ? [item, ...lines] : lines));
							onChange(a);
						}}
					/>
					<IconButton icon="no-alt" label="Remove" onClick={() => removeAt(i)} />
				</div>
			))}
			<Button
				variant="secondary"
				size="compact"
				icon="plus-alt2"
				className="fwp-add"
				onClick={() => {
					onChange([...items, '']);
					setFocus(items.length);
				}}
			>
				{addLabel}
			</Button>
		</div>
	);
}

/** One-click chips that add or remove a preset line from a list. */
function Presets({ presets, items, onChange }) {
	if (!presets.length) return null;
	return (
		<div className="fwp-presets">
			<span className="fwp-presets__label">Quick add:</span>
			{presets.map((p) => {
				const on = items.includes(p);
				return (
					<button
						key={p}
						type="button"
						className={'fwp-chip fwp-chip--small' + (on ? ' is-on' : '')}
						onClick={() => onChange(on ? items.filter((x) => x !== p) : [...items.filter(Boolean), p])}
					>
						<span className={'dashicons dashicons-' + (on ? 'yes' : 'plus-alt2')} />
						{p}
					</button>
				);
			})}
		</div>
	);
}

function PriceInput({ label, value, onChange, help, placeholder }) {
	return (
		<Field label={label} help={help}>
			<div className="fwp-price-input">
				<span className="fwp-price-input__cur">₹</span>
				<input
					type="number"
					min="0"
					step="1"
					inputMode="numeric"
					className="fwp-input"
					value={value || ''}
					placeholder={placeholder}
					onChange={(e) => onChange(Math.max(0, Math.round(Number(e.target.value) || 0)))}
				/>
			</div>
			{value > 0 && <span className="fwp-price-input__shown">Shows as {inr(value)}</span>}
		</Field>
	);
}

function Stars({ value, onChange }) {
	return (
		<div className="fwp-stars" role="group" aria-label="Hotel star rating">
			{[1, 2, 3, 4, 5].map((n) => (
				<button
					key={n}
					type="button"
					className={'fwp-star' + (n <= value ? ' is-on' : '')}
					aria-label={`${n} star`}
					aria-pressed={n <= value}
					onClick={() => onChange(n === value ? 0 : n)}
				>
					★
				</button>
			))}
		</div>
	);
}

/* ─── Tabs ─────────────────────────────────────────────────────────────── */

function BasicsTab({ d, set, update, title, destinations, setDestinations }) {
	const [adding, setAdding] = useState(false);
	const [newDest, setNewDest] = useState({ name: '', region: 'international' });
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');
	const dest = destinations.find((x) => x.slug === d.destination);
	const days = d.nights + 1;

	const setNights = (raw) =>
		update((x) => {
			const n = Math.max(0, Math.min(60, Math.round(Number(raw) || 0)));
			const want = n + 1;
			let it = x.itinerary;
			if (n >= 1 && it.length < want) {
				it = [...it, ...Array.from({ length: want - it.length }, emptyDay)];
			}
			while (n >= 1 && it.length > want && dayIsEmpty(it[it.length - 1])) {
				it = it.slice(0, -1);
			}
			return { ...x, nights: n, itinerary: it };
		});

	const addDestination = async () => {
		setBusy(true);
		setError('');
		try {
			const term = await ajax('fwp_add_destination', newDest);
			setDestinations((list) => (list.some((x) => x.slug === term.slug) ? list : [...list, term]));
			set('destination', term.slug);
			setAdding(false);
			setNewDest({ name: '', region: 'international' });
		} catch (e) {
			setError(e.message);
		}
		setBusy(false);
	};

	const shortSuggestion = dest && d.nights ? `${dest.name} ${d.nights}N/${days}D` : 'e.g. Dubai Luxury 5N/6D';

	return (
		<>
			<Section title="Destination" hint="Decides the filter on the packages page and whether it shows on the India or the International page.">
				<div className="fwp-chips">
					{destinations.map((x) => (
						<button
							key={x.slug}
							type="button"
							className={'fwp-chip' + (d.destination === x.slug ? ' is-on' : '')}
							onClick={() => set('destination', x.slug)}
						>
							{x.name}
						</button>
					))}
					{cfg.canAddTerms && (
						<button type="button" className="fwp-chip fwp-chip--add" onClick={() => setAdding(true)}>
							<span className="dashicons dashicons-plus-alt2" /> New destination
						</button>
					)}
				</div>
				{dest && (
					<p className="fwp-help">
						{dest.name} is listed under <strong>{dest.region === 'india' ? 'India' : 'International'}</strong> tours.
					</p>
				)}
				{cfg.tripTypes.length > 0 && (
					<Field label="Good for (optional)">
						<div className="fwp-chips">
							{cfg.tripTypes.map((t) => {
								const on = d.tripTypes.includes(t.slug);
								return (
									<button
										key={t.slug}
										type="button"
										className={'fwp-chip fwp-chip--small' + (on ? ' is-on' : '')}
										onClick={() =>
											set('tripTypes', on ? d.tripTypes.filter((s) => s !== t.slug) : [...d.tripTypes, t.slug])
										}
									>
										{t.name}
									</button>
								);
							})}
						</div>
					</Field>
				)}
			</Section>

			<Section title="Name">
				<div className="fwp-grid-2">
					<Text
						label="Short name for cards"
						value={d.shortTitle}
						placeholder={shortSuggestion}
						help="Shown on the package cards. The full title above is used on the package page."
						onChange={(v) => set('shortTitle', v)}
						maxLength={80}
					/>
					<Text
						label="Tagline"
						value={d.tagline}
						placeholder="One line that sells the trip"
						help="Shown under the title on the package page."
						onChange={(v) => set('tagline', v)}
						maxLength={250}
					/>
				</div>
				{!title.trim() && <p className="fwp-help is-warn">Type the full package title in the box at the top of the page.</p>}
			</Section>

			<Section title="Trip length">
				<div className="fwp-nights">
					<Button variant="secondary" icon="minus" label="One night less" onClick={() => setNights(d.nights - 1)} disabled={d.nights < 1} />
					<label className="fwp-nights__box">
						<input
							type="number"
							min="0"
							max="60"
							className="fwp-input"
							value={d.nights || ''}
							placeholder="0"
							onChange={(e) => setNights(e.target.value)}
							aria-label="Nights"
						/>
						<span>nights</span>
					</label>
					<Button variant="secondary" icon="plus" label="One night more" onClick={() => setNights(d.nights + 1)} />
					{d.nights > 0 && <span className="fwp-nights__label">{durationLabel(d.nights)}</span>}
				</div>
				<p className="fwp-help">The itinerary gets one day card per day automatically.</p>
			</Section>

			<Section title="What the trip covers">
				<Tokens
					label="Cities and places covered"
					value={d.cities}
					onChange={(v) => set('cities', v.map((t) => (typeof t === 'string' ? t : t.value)).filter(Boolean))}
					placeholder="Type a city and press Enter"
					suggestions={destinations.map((x) => x.name)}
				/>
				<div className="fwp-grid-3">
					<Text
						label="Hotel category"
						list="fwp-hotel-cats"
						value={d.hotelCategory}
						placeholder="e.g. 4 Star"
						onChange={(v) => set('hotelCategory', v)}
					/>
					<Text
						label="Meals"
						list="fwp-meals"
						value={d.mealsIncluded}
						placeholder="e.g. Breakfast + Dinner"
						onChange={(v) => set('mealsIncluded', v)}
					/>
					<Field label="Transfers">
						<Toggle
							label={d.transferIncluded ? 'Included' : 'Not included'}
							checked={d.transferIncluded}
							onChange={(v) => set('transferIncluded', v)}
						/>
					</Field>
				</div>
			</Section>

			{adding && (
				<Modal title="Add a destination" onRequestClose={() => setAdding(false)} className="fwp-modal">
					<Text label="Name" value={newDest.name} placeholder="e.g. Vietnam" onChange={(v) => setNewDest({ ...newDest, name: v })} />
					<Select
						label="Region"
						value={newDest.region}
						options={[
							{ value: 'international', label: 'International' },
							{ value: 'india', label: 'India' },
						]}
						onChange={(v) => setNewDest({ ...newDest, region: v })}
					/>
					{error && <Notice status="error" isDismissible={false}>{error}</Notice>}
					<div className="fwp-modal__actions">
						<Button variant="primary" onClick={addDestination} isBusy={busy} disabled={busy || !newDest.name.trim()}>
							Add destination
						</Button>
						<Button variant="tertiary" onClick={() => setAdding(false)}>
							Cancel
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
}

function PhotosTab({ d, update }) {
	const frame = useRef(null);
	const s = useSortable(d.images, (images) => update((x) => ({ ...x, images })));

	const openMedia = () => {
		if (!frame.current) {
			frame.current = wp.media({
				title: 'Choose package photos',
				button: { text: 'Add to package' },
				multiple: 'add',
				library: { type: 'image' },
			});
			frame.current.on('select', () => {
				const picked = frame.current
					.state()
					.get('selection')
					.toJSON()
					.map((a) => {
						const sizes = a.sizes || {};
						const thumb = (sizes.medium_large || sizes.large || sizes.medium || {}).url || a.url;
						return { id: a.id, url: a.url, thumb, alt: a.alt || '', w: a.width || 0, h: a.height || 0 };
					});
				update((x) => ({
					...x,
					images: [...x.images, ...picked.filter((p) => !x.images.some((i) => i.id && i.id === p.id))],
				}));
			});
		}
		frame.current.open();
	};

	const setImage = (i, patch) =>
		update((x) => {
			const images = x.images.slice();
			images[i] = { ...images[i], ...patch };
			return { ...x, images };
		});

	return (
		<Section
			title="Photos"
			hint="The first photo is the cover on cards and the package page. Drag to change the order. Landscape photos, 1600px wide or more, look best."
			actions={
				<Button variant="primary" icon="format-gallery" onClick={openMedia}>
					Add photos
				</Button>
			}
		>
			{d.images.length === 0 ? (
				<button type="button" className="fwp-dropzone" onClick={openMedia}>
					<span className="dashicons dashicons-format-image" />
					<strong>Add photos</strong>
					<span>Upload new photos or pick from the media library</span>
				</button>
			) : (
				<div className="fwp-photos">
					{d.images.map((img, i) => (
						<div key={(img.id || img.url) + '-' + i} className={'fwp-photo' + s.cls(i)} {...s.row(i)}>
							<div className="fwp-photo__img" {...s.handle(i)} title="Drag to reorder">
								<img src={img.thumb || img.url} alt="" draggable={false} />
								{i === 0 && <span className="fwp-photo__badge">Cover</span>}
								{img.w > 0 && img.w < 1200 && <span className="fwp-photo__badge is-warn">Small</span>}
							</div>
							<input
								type="text"
								className="fwp-input fwp-photo__alt"
								value={img.alt}
								placeholder="Describe the photo, e.g. Burj Khalifa at sunset"
								onChange={(e) => setImage(i, { alt: e.target.value })}
							/>
							<div className="fwp-photo__actions">
								{i > 0 && (
									<Button
										variant="link"
										onClick={() => update((x) => ({ ...x, images: move(x.images, i, 0) }))}
									>
										Make cover
									</Button>
								)}
								<Button
									variant="link"
									isDestructive
									onClick={() => update((x) => ({ ...x, images: x.images.filter((_, j) => j !== i) }))}
								>
									Remove
								</Button>
							</div>
						</div>
					))}
					<button type="button" className="fwp-photo fwp-photo--add" onClick={openMedia}>
						<span className="dashicons dashicons-plus-alt2" />
						Add more
					</button>
				</div>
			)}
		</Section>
	);
}

function OverviewTab({ d, set }) {
	const words = wordCount(d.overview);
	return (
		<Section
			title="Overview"
			hint="The opening description on the package page. Leave an empty line between paragraphs."
		>
			<Area
				label="Overview"
				hideLabelFromVision
				rows={12}
				value={d.overview}
				placeholder="Who is this trip for, what makes it special, and what is taken care of..."
				onChange={(v) => set('overview', v)}
			/>
			<p className={'fwp-help' + (words && words < 60 ? ' is-warn' : '')}>
				{plural(words, 'word')}. 80 to 200 words reads well and helps Google.
			</p>
		</Section>
	);
}

function PasteModal({ onClose, onApply, hasExisting }) {
	const [text, setText] = useState('');
	const parsed = useMemo(() => parseItinerary(text), [text]);
	return (
		<Modal title="Paste an itinerary" onRequestClose={onClose} className="fwp-modal" size="large">
			<p>
				Paste the itinerary from WhatsApp, Word or a supplier email. Each day should start with a line like
				"Day 1: Arrival". Bullet points become activities.
			</p>
			<Area
				label="Itinerary text"
				hideLabelFromVision
				rows={12}
				value={text}
				onChange={setText}
				placeholder={'Day 1: Arrival in Dubai\nMeet and greet at the airport, transfer to the hotel.\n- Dhow cruise with dinner\nMeals: Dinner\n\nDay 2: Dubai city tour\n...'}
			/>
			{parsed.length > 0 && (
				<div className="fwp-parsed">
					<strong>Found {plural(parsed.length, 'day')}:</strong>
					<ol>
						{parsed.map((p, i) => (
							<li key={i}>
								{p.title || <em>No title</em>}
								{p.activities.length > 0 && <small> · {plural(p.activities.length, 'activity', 'activities')}</small>}
							</li>
						))}
					</ol>
				</div>
			)}
			{text.trim() && !parsed.length && (
				<Notice status="warning" isDismissible={false}>
					No "Day 1", "Day 2" lines found yet.
				</Notice>
			)}
			<div className="fwp-modal__actions">
				<Button variant="primary" disabled={!parsed.length} onClick={() => onApply(parsed, 'replace')}>
					{hasExisting ? 'Replace the current itinerary' : 'Use this itinerary'}
				</Button>
				{hasExisting && (
					<Button variant="secondary" disabled={!parsed.length} onClick={() => onApply(parsed, 'append')}>
						Add after the current days
					</Button>
				)}
				<Button variant="tertiary" onClick={onClose}>
					Cancel
				</Button>
			</div>
		</Modal>
	);
}

function ItineraryTab({ d, update }) {
	const days = d.nights + 1;
	const count = d.itinerary.length;
	const [open, setOpen] = useState(() => (count ? [0] : []));
	const [pasting, setPasting] = useState(false);
	const setList = (itinerary) => update((x) => ({ ...x, itinerary }));
	const s = useSortable(d.itinerary, setList);

	const setDay = (i, patch) =>
		update((x) => {
			const it = x.itinerary.slice();
			it[i] = { ...it[i], ...patch };
			return { ...x, itinerary: it };
		});
	const isOpen = (i) => open.includes(i);
	const toggle = (i) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));

	const addDay = () => {
		setList([...d.itinerary, emptyDay()]);
		setOpen((o) => [...o, count]);
	};
	const removeDay = (i) => {
		if (!dayIsEmpty(d.itinerary[i]) && !window.confirm(`Delete Day ${i + 1}? What you typed for it will be lost.`)) return;
		setList(d.itinerary.filter((_, j) => j !== i));
		setOpen((o) => o.filter((x) => x !== i).map((x) => (x > i ? x - 1 : x)));
	};
	const duplicateDay = (i) => {
		const it = d.itinerary.slice();
		it.splice(i + 1, 0, { ...d.itinerary[i], activities: d.itinerary[i].activities.slice() });
		setList(it);
		setOpen((o) => [...o.map((x) => (x > i ? x + 1 : x)), i + 1]);
	};
	const apply = (parsed, mode) => {
		const list = mode === 'append' ? [...d.itinerary.filter((x) => !dayIsEmpty(x)), ...parsed] : parsed;
		update((x) => ({ ...x, itinerary: list, nights: x.nights >= 1 ? x.nights : Math.max(1, list.length - 1) }));
		setOpen(list.map((_, i) => i));
		setPasting(false);
	};

	const mismatch = d.nights >= 1 && count !== days;

	return (
		<Section
			title="Day by day itinerary"
			hint={d.nights >= 1 ? `${durationLabel(d.nights)}: one card per day.` : 'Set the number of nights on the Basics tab first, or paste an itinerary.'}
			actions={
				<>
					<Button variant="secondary" icon="clipboard" onClick={() => setPasting(true)}>
						Paste from text
					</Button>
					<Button
						variant="tertiary"
						onClick={() => setOpen(open.length === count ? [] : d.itinerary.map((_, i) => i))}
						disabled={!count}
					>
						{open.length === count && count ? 'Collapse all' : 'Expand all'}
					</Button>
				</>
			}
		>
			{mismatch && (
				<div className={'fwp-inline-alert' + (count > days ? ' is-error' : '')}>
					<span>
						The trip is {days} days but the itinerary has {plural(count, 'day')}.
					</span>
					{count < days ? (
						<Button variant="link" onClick={() => setList([...d.itinerary, ...Array.from({ length: days - count }, emptyDay)])}>
							Add {plural(days - count, 'missing day')}
						</Button>
					) : (
						<span>Delete the extra days below, or add nights on the Basics tab.</span>
					)}
				</div>
			)}

			<div className="fwp-days">
				{d.itinerary.map((day, i) => (
					<div key={i} className={'fwp-day' + s.cls(i) + (isOpen(i) ? ' is-open' : '')} {...s.row(i)}>
						<div className="fwp-day__head">
							<Handle {...s.handle(i)} />
							<button type="button" className="fwp-day__toggle" onClick={() => toggle(i)} aria-expanded={isOpen(i)}>
								<span className="fwp-day__num">
									<small>Day</small>
									{i + 1}
								</span>
								<span className="fwp-day__summary">
									<span className={'fwp-day__title' + (day.title ? '' : ' is-empty')}>
										{day.title || (i === count - 1 && count > 1 ? 'Departure day: add a title' : 'Add a title')}
									</span>
									<span className="fwp-day__meta">
										{[day.meals, day.activities.filter(Boolean).length ? plural(day.activities.filter(Boolean).length, 'activity', 'activities') : '']
											.filter(Boolean)
											.join(' · ')}
									</span>
								</span>
								<span className={'dashicons dashicons-arrow-' + (isOpen(i) ? 'up' : 'down') + '-alt2'} />
							</button>
							<div className="fwp-day__actions">
								<IconButton icon="arrow-up-alt2" label="Move up" disabled={i === 0} onClick={() => setList(move(d.itinerary, i, i - 1))} />
								<IconButton icon="arrow-down-alt2" label="Move down" disabled={i === count - 1} onClick={() => setList(move(d.itinerary, i, i + 1))} />
								<IconButton icon="admin-page" label="Duplicate day" onClick={() => duplicateDay(i)} />
								<IconButton icon="trash" label="Delete day" tone="danger" onClick={() => removeDay(i)} />
							</div>
						</div>
						{isOpen(i) && (
							<div className="fwp-day__body">
								<Text
									label="Title"
									value={day.title}
									placeholder={i === 0 ? 'e.g. Arrival in Dubai and Dhow Cruise' : i === count - 1 ? 'e.g. Departure' : 'e.g. Desert Safari with BBQ Dinner'}
									onChange={(v) => setDay(i, { title: v })}
								/>
								<Area
									label="What happens today"
									rows={3}
									value={day.description}
									onChange={(v) => setDay(i, { description: v })}
								/>
								<Field label="Activities and highlights">
									<ListEditor
										items={day.activities}
										onChange={(v) => setDay(i, { activities: v })}
										placeholder="e.g. Burj Khalifa 124th floor visit"
										addLabel="Add activity"
									/>
								</Field>
								<div className="fwp-grid-2">
									<Text label="Meals" list="fwp-day-meals" value={day.meals} placeholder="e.g. Breakfast + Dinner" onChange={(v) => setDay(i, { meals: v })} />
									<Text label="Overnight stay" value={day.hotel} placeholder="Hotel name or city" onChange={(v) => setDay(i, { hotel: v })} />
								</div>
							</div>
						)}
					</div>
				))}
			</div>
			<Button variant="secondary" icon="plus-alt2" className="fwp-add" onClick={addDay}>
				Add day
			</Button>
			{pasting && <PasteModal onClose={() => setPasting(false)} onApply={apply} hasExisting={d.itinerary.some((x) => !dayIsEmpty(x))} />}
		</Section>
	);
}

function InclusionsTab({ d, set }) {
	return (
		<div className="fwp-grid-2 fwp-grid-2--top">
			<Section title="Included" tone="good">
				<Presets presets={cfg.presets.inclusions} items={d.inclusions} onChange={(v) => set('inclusions', v)} />
				<ListEditor items={d.inclusions} onChange={(v) => set('inclusions', v)} placeholder="e.g. Desert safari with BBQ dinner" />
			</Section>
			<Section title="Not included" tone="bad">
				<Presets presets={cfg.presets.exclusions} items={d.exclusions} onChange={(v) => set('exclusions', v)} />
				<ListEditor items={d.exclusions} onChange={(v) => set('exclusions', v)} placeholder="e.g. Lunch" />
			</Section>
		</div>
	);
}

function HotelsTab({ d, set }) {
	const setHotel = (i, patch) => {
		const hotels = d.hotels.slice();
		hotels[i] = { ...hotels[i], ...patch };
		set('hotels', hotels);
	};
	return (
		<Section
			title="Hotels"
			hint="Shown in the Hotel Details section. Add each hotel, or each 'X or similar' option."
			actions={
				<Button
					variant="secondary"
					icon="plus-alt2"
					onClick={() => set('hotels', [...d.hotels, { name: '', stars: 4, location: '', roomType: '', upgradeOption: '' }])}
				>
					Add hotel
				</Button>
			}
		>
			{d.hotels.length === 0 && <p className="fwp-empty">No hotels added yet.</p>}
			{d.hotels.map((h, i) => (
				<div key={i} className="fwp-card-row">
					<div className="fwp-card-row__head">
						<strong>{h.name || `Hotel ${i + 1}`}</strong>
						<Stars value={h.stars} onChange={(v) => setHotel(i, { stars: v })} />
						<div className="fwp-card-row__actions">
							<IconButton icon="arrow-up-alt2" label="Move up" disabled={i === 0} onClick={() => set('hotels', move(d.hotels, i, i - 1))} />
							<IconButton icon="arrow-down-alt2" label="Move down" disabled={i === d.hotels.length - 1} onClick={() => set('hotels', move(d.hotels, i, i + 1))} />
							<IconButton icon="trash" label="Remove hotel" tone="danger" onClick={() => set('hotels', d.hotels.filter((_, j) => j !== i))} />
						</div>
					</div>
					<div className="fwp-grid-2">
						<Text label="Hotel name" value={h.name} placeholder="e.g. JW Marriott Marquis Dubai" onChange={(v) => setHotel(i, { name: v })} />
						<Text label="Location" value={h.location} placeholder="e.g. Business Bay, near Dubai Mall" onChange={(v) => setHotel(i, { location: v })} />
						<Text label="Room type" value={h.roomType} placeholder="e.g. Deluxe King Room" onChange={(v) => setHotel(i, { roomType: v })} />
						<Text label="Upgrade option (optional)" value={h.upgradeOption} placeholder="e.g. Sea view suite for +₹8,000/night" onChange={(v) => setHotel(i, { upgradeOption: v })} />
					</div>
				</div>
			))}
		</Section>
	);
}

function PricingTab({ d, set }) {
	const saving = d.originalPrice > d.startingPrice && d.startingPrice > 0 ? d.originalPrice - d.startingPrice : 0;
	const setTier = (i, patch) => {
		const tiers = d.pricingTiers.slice();
		tiers[i] = { ...tiers[i], ...patch };
		set('pricingTiers', tiers);
	};
	const missingPresets = cfg.presets.tiers.filter((p) => !d.pricingTiers.some((t) => t.label === p.label));

	return (
		<>
			<Section title="Price on the website">
				<Toggle
					label="Show the price on the website"
					checked={d.showPrice}
					onChange={(v) => set('showPrice', v)}
					help={
						d.showPrice
							? 'The card and the package page show "Starting from" with this price.'
							: 'Hidden: visitors see "Enquire Now" only, as the website does today.'
					}
				/>
				<Toggle
					label="Price on request"
					checked={d.priceOnRequest}
					onChange={(v) => set('priceOnRequest', v)}
					help="Use when the price changes often. No price is shown or shared anywhere."
				/>
			</Section>

			{!d.priceOnRequest && (
				<>
					<Section title="Starting price per person">
						<div className="fwp-grid-2">
							<PriceInput label="Starting price" value={d.startingPrice} placeholder="79999" onChange={(v) => set('startingPrice', v)} />
							<PriceInput
								label="Original price (optional)"
								value={d.originalPrice}
								placeholder="100000"
								help="Shown struck out next to the starting price."
								onChange={(v) => set('originalPrice', v)}
							/>
						</div>
						{saving > 0 && (
							<p className="fwp-saving">
								Visitors see a saving of {inr(saving)} ({Math.round((saving / d.originalPrice) * 100)}% off).
							</p>
						)}
					</Section>

					<Section title="Price options" hint="Twin, triple, solo and group prices, shown on the package page.">
						{d.pricingTiers.map((t, i) => (
							<div key={i} className="fwp-card-row">
								<div className="fwp-card-row__head">
									<strong>{t.label || `Option ${i + 1}`}</strong>
									<div className="fwp-card-row__actions">
										<IconButton icon="arrow-up-alt2" label="Move up" disabled={i === 0} onClick={() => set('pricingTiers', move(d.pricingTiers, i, i - 1))} />
										<IconButton icon="trash" label="Remove option" tone="danger" onClick={() => set('pricingTiers', d.pricingTiers.filter((_, j) => j !== i))} />
									</div>
								</div>
								<div className="fwp-grid-4">
									<Text label="Name" value={t.label} onChange={(v) => setTier(i, { label: v })} />
									<PriceInput label="Price" value={t.price} onChange={(v) => setTier(i, { price: v })} />
									<PriceInput label="Original price" value={t.originalPrice} onChange={(v) => setTier(i, { originalPrice: v })} />
									<Text label="Note" value={t.description} onChange={(v) => setTier(i, { description: v })} />
								</div>
							</div>
						))}
						<div className="fwp-presets">
							<span className="fwp-presets__label">Add:</span>
							{missingPresets.map((p) => (
								<button
									key={p.label}
									type="button"
									className="fwp-chip fwp-chip--small"
									onClick={() => set('pricingTiers', [...d.pricingTiers, { label: p.label, price: 0, originalPrice: 0, description: p.description }])}
								>
									<span className="dashicons dashicons-plus-alt2" />
									{p.label}
								</button>
							))}
							<button
								type="button"
								className="fwp-chip fwp-chip--small"
								onClick={() => set('pricingTiers', [...d.pricingTiers, { label: '', price: 0, originalPrice: 0, description: '' }])}
							>
								<span className="dashicons dashicons-plus-alt2" />
								Other
							</button>
						</div>
					</Section>

					<Section title="More">
						<div className="fwp-grid-2">
							<Text
								label="Child price (optional)"
								value={d.childPrice}
								placeholder="e.g. ₹35,000 (age 2-11, sharing parents' room)"
								onChange={(v) => set('childPrice', v)}
							/>
							<Field label="EMI">
								<Toggle label="EMI available" checked={d.emiAvailable} onChange={(v) => set('emiAvailable', v)} />
							</Field>
						</div>
					</Section>
				</>
			)}
		</>
	);
}

function FaqsTab({ d, set }) {
	const setFaq = (i, patch) => {
		const faqs = d.faqs.slice();
		faqs[i] = { ...faqs[i], ...patch };
		set('faqs', faqs);
	};
	const addStandard = () => {
		const have = new Set(d.faqs.map((f) => f.question.trim().toLowerCase()));
		set('faqs', [...d.faqs, ...cfg.defaultFaqs.filter((f) => !have.has(f.question.trim().toLowerCase()))]);
	};
	return (
		<>
			<Section
				title="FAQs"
				hint="Shown on the package page and given to Google as FAQ data."
				actions={
					<>
						<Button variant="tertiary" onClick={addStandard} disabled={!cfg.defaultFaqs.length}>
							Add standard FAQs
						</Button>
						<Button variant="secondary" icon="plus-alt2" onClick={() => set('faqs', [...d.faqs, { question: '', answer: '' }])}>
							Add FAQ
						</Button>
					</>
				}
			>
				{d.faqs.length === 0 && <p className="fwp-empty">No FAQs yet.</p>}
				{d.faqs.map((f, i) => (
					<div key={i} className="fwp-card-row">
						<div className="fwp-card-row__head">
							<strong>Question {i + 1}</strong>
							<div className="fwp-card-row__actions">
								<IconButton icon="arrow-up-alt2" label="Move up" disabled={i === 0} onClick={() => set('faqs', move(d.faqs, i, i - 1))} />
								<IconButton icon="arrow-down-alt2" label="Move down" disabled={i === d.faqs.length - 1} onClick={() => set('faqs', move(d.faqs, i, i + 1))} />
								<IconButton icon="trash" label="Remove FAQ" tone="danger" onClick={() => set('faqs', d.faqs.filter((_, j) => j !== i))} />
							</div>
						</div>
						<Text label="Question" hideLabelFromVision value={f.question} placeholder="Question" onChange={(v) => setFaq(i, { question: v })} />
						<Area label="Answer" hideLabelFromVision rows={3} value={f.answer} placeholder="Answer" onChange={(v) => setFaq(i, { answer: v })} />
					</div>
				))}
			</Section>
			<Section
				title="Cancellation policy"
				actions={
					<Button
						variant="tertiary"
						disabled={!cfg.defaultPolicy.length}
						onClick={() => {
							if (!d.cancellationPolicy.filter(Boolean).length || window.confirm('Replace this policy with the standard one from Settings?')) {
								set('cancellationPolicy', cfg.defaultPolicy.slice());
							}
						}}
					>
						Use standard policy
					</Button>
				}
			>
				<ListEditor items={d.cancellationPolicy} onChange={(v) => set('cancellationPolicy', v)} placeholder="One rule per line" addLabel="Add rule" />
			</Section>
		</>
	);
}

function SeoTab({ d, set, title }) {
	const host = cfg.siteUrl.replace(/^https?:\/\//, '');
	const slug = d.slug || slugify(title);
	const original = cfg.data.slug;
	const shownTitle = d.metaTitle || (title ? `${title} | Flywings` : 'Package title | Flywings');
	const shownDesc = d.metaDescription || d.tagline || d.overview.slice(0, 155);
	const mdLen = d.metaDescription.length;
	return (
		<>
			<Section title="Web address">
				<div className="fwp-slug">
					<span className="fwp-slug__base">{host}/packages/</span>
					<input
						type="text"
						className="fwp-input"
						value={d.slug}
						placeholder={slugify(title) || 'made-from-the-title'}
						onChange={(e) => set('slug', slugify(e.target.value) + (/[-\s]$/.test(e.target.value) ? '-' : ''))}
						onBlur={() => set('slug', slugify(d.slug))}
						aria-label="URL slug"
					/>
				</div>
				<p className="fwp-help">
					Leave empty to make it from the title.
					{cfg.status === 'publish' && original && slug !== original && ' The old link will keep working and send visitors to the new one.'}
				</p>
			</Section>
			<Section title="Google listing" hint="How the package can appear in Google search results.">
				<Text
					label="Google title"
					value={d.metaTitle}
					placeholder={shownTitle}
					help={`${d.metaTitle.length} characters. Up to 60 shows in full.`}
					onChange={(v) => set('metaTitle', v)}
				/>
				<Area
					label="Google description"
					rows={3}
					value={d.metaDescription}
					help={`${mdLen} characters. 120 to 160 works best.`}
					onChange={(v) => set('metaDescription', v)}
				/>
				<div className="fwp-serp" aria-label="Google preview">
					<div className="fwp-serp__url">
						{host} › packages › {slug || '...'}
					</div>
					<div className="fwp-serp__title">{shownTitle}</div>
					<div className="fwp-serp__desc">{shownDesc || 'Your description shows here.'}</div>
				</div>
				<Tokens
					label="Keywords (optional)"
					value={d.keywords}
					onChange={(v) => set('keywords', v.map((t) => (typeof t === 'string' ? t : t.value)).filter(Boolean))}
					placeholder="Type a search phrase and press Enter"
				/>
			</Section>
		</>
	);
}

function VisibilityTab({ d, set, update }) {
	const setOffer = (patch) => update((x) => ({ ...x, offer: { ...x.offer, ...patch } }));
	const compare = d.offer.comparePrice || d.startingPrice;
	const offerSaving = d.offer.price > 0 && compare > d.offer.price ? compare - d.offer.price : 0;
	const byTitle = new Map(cfg.otherPackages.map((p) => [p.title, p.slug]));
	const bySlug = new Map(cfg.otherPackages.map((p) => [p.slug, p.title]));

	return (
		<>
			<Section title="Where it shows">
				<Toggle
					label="Show on the packages page and in Google"
					checked={d.listed}
					onChange={(v) => set('listed', v)}
					help={
						d.listed
							? 'Listed on the packages page, in the destination filter, the India/International page and the sitemap.'
							: 'Private link only: hidden from listings and Google, but anyone with the link can open it. Good for a custom quote.'
					}
				/>
				<Toggle
					label="Feature on the homepage"
					checked={d.featured}
					onChange={(v) => set('featured', v)}
					help="Up to 6 featured packages show on the homepage."
				/>
				{d.featured && (
					<div className="fwp-grid-3">
						<Text
							type="number"
							min="1"
							max="99"
							label="Homepage position"
							value={d.featuredOrder || ''}
							placeholder="1"
							help="1 shows first."
							onChange={(v) => set('featuredOrder', Math.max(0, Math.round(Number(v) || 0)))}
						/>
					</div>
				)}
				<div className="fwp-grid-3">
					<Text label="Badge (optional)" list="fwp-badges" value={d.badge} placeholder="e.g. Best Seller" onChange={(v) => set('badge', v)} />
					<Text
						type="date"
						label="Available until (optional)"
						value={d.availableUntil}
						help="After this date it hides from listings by itself."
						onChange={(v) => set('availableUntil', v)}
					/>
					<Field label="Seats">
						<Toggle
							label="Sold out"
							checked={d.soldOut}
							onChange={(v) => set('soldOut', v)}
							help="The page stays live and asks visitors to enquire for other dates."
						/>
					</Field>
				</div>
			</Section>

			<Section title="Offer" hint="Puts this package on the Offers page with a special price and an end date.">
				<Toggle label="Put this package on the Offers page" checked={d.offer.enabled} onChange={(v) => setOffer({ enabled: v })} />
				{d.offer.enabled && (
					<>
						<div className="fwp-grid-4">
							<PriceInput label="Offer price per person" value={d.offer.price} onChange={(v) => setOffer({ price: v })} />
							<PriceInput
								label="Compare with"
								value={d.offer.comparePrice}
								placeholder={d.startingPrice ? String(d.startingPrice) : ''}
								help="Empty uses the starting price."
								onChange={(v) => setOffer({ comparePrice: v })}
							/>
							<Text type="date" label="Offer ends" value={d.offer.validTill} help="Disappears after this date." onChange={(v) => setOffer({ validTill: v })} />
							<Text
								type="number"
								min="1"
								label="Minimum travellers"
								value={d.offer.minPax || ''}
								onChange={(v) => setOffer({ minPax: Math.max(1, Math.round(Number(v) || 1)) })}
							/>
						</div>
						<Text label="Note (optional)" value={d.offer.note} placeholder="e.g. Valid for travel till 31 March" onChange={(v) => setOffer({ note: v })} />
						{offerSaving > 0 && <p className="fwp-saving">The offer card shows a saving of {inr(offerSaving)}.</p>}
					</>
				)}
			</Section>

			<Section title="Rating (optional)" hint="Use your real Google rating. Leave at 0 to hide the stars.">
				<div className="fwp-grid-3">
					<Text
						type="number"
						step="0.1"
						min="0"
						max="5"
						label="Stars (0 to 5)"
						value={d.rating || ''}
						onChange={(v) => set('rating', Math.max(0, Math.min(5, Number(v) || 0)))}
					/>
					<Text
						type="number"
						min="0"
						label="Number of reviews"
						value={d.reviewCount || ''}
						onChange={(v) => set('reviewCount', Math.max(0, Math.round(Number(v) || 0)))}
					/>
				</div>
			</Section>

			<Section title="Related packages (optional)" hint="Leave empty and the website picks packages from the same destination.">
				<Tokens
					label="Related packages"
					hideLabelFromVision
					value={d.relatedSlugs.map((slug) => bySlug.get(slug) || slug)}
					suggestions={cfg.otherPackages.map((p) => p.title)}
					maxSuggestions={12}
					__experimentalExpandOnFocus
					onChange={(tokens) =>
						set(
							'relatedSlugs',
							tokens
								.map((t) => (typeof t === 'string' ? t : t.value))
								.map((t) => byTitle.get(t) || (bySlug.has(t) ? t : null))
								.filter(Boolean)
								.slice(0, 6)
						)
					}
					placeholder="Start typing a package name"
				/>
			</Section>
		</>
	);
}

/* ─── Sidebar: card preview and checklist ──────────────────────────────── */

function CardPreview({ d, title, destinations }) {
	const img = d.images[0];
	const dest = destinations.find((x) => x.slug === d.destination);
	const flights = d.inclusions.some((i) => /flight|airfare/i.test(i));
	const pills = [flights && 'Flights', d.hotelCategory, d.mealsIncluded.split(' ')[0], d.transferIncluded && 'Transfers'].filter(Boolean);
	const price = d.showPrice && !d.priceOnRequest ? inr(d.startingPrice) : '';
	return (
		<div className="fwp-preview">
			<div className="fwp-preview__img">
				{img ? <img src={img.thumb || img.url} alt="" /> : <span className="fwp-preview__noimg">Cover photo</span>}
				{d.badge && <span className="fwp-preview__badge">{d.badge}</span>}
				{d.soldOut && <span className="fwp-preview__sold">Sold out</span>}
				{d.rating > 0 && (
					<span className="fwp-preview__rating">
						★ {d.rating} ({d.reviewCount})
					</span>
				)}
			</div>
			<div className="fwp-preview__body">
				<div className="fwp-preview__dur">{durationLabel(d.nights) || 'Nights / Days'}</div>
				<div className="fwp-preview__title">{d.shortTitle || title || 'Package name'}</div>
				{d.cities.length > 0 && (
					<div className="fwp-preview__tags">
						{d.cities.slice(0, 3).map((c) => (
							<span key={c}>{c}</span>
						))}
					</div>
				)}
				{pills.length > 0 && (
					<div className="fwp-preview__pills">
						{pills.map((p) => (
							<span key={p}>{p}</span>
						))}
					</div>
				)}
				{d.priceOnRequest && <div className="fwp-preview__price">Price on request</div>}
				{price && (
					<div className="fwp-preview__price">
						From <strong>{price}</strong> per person {d.originalPrice > d.startingPrice && <s>{inr(d.originalPrice)}</s>}
					</div>
				)}
				<div className="fwp-preview__btns">
					<span>View Details</span>
					<span className="is-gold">Enquire Now</span>
				</div>
			</div>
			<div className="fwp-preview__where">
				{dest && <span>{dest.region === 'india' ? 'India' : 'International'} · {dest.name}</span>}
				{!d.listed && <span className="is-muted">Private link only</span>}
				{d.featured && <span className="is-gold">Homepage</span>}
				{d.offer.enabled && <span className="is-gold">On offer</span>}
			</div>
		</div>
	);
}

function Checklist({ checks, onJump }) {
	const errors = checks.filter((c) => c.level === 'error');
	const warns = checks.filter((c) => c.level === 'warn');
	const pct = Math.max(6, Math.min(100, 100 - errors.length * 12 - warns.length * 4));
	return (
		<div className="fwp-check">
			<div className={'fwp-check__head ' + (errors.length ? 'is-error' : 'is-ok')}>
				<span className={'dashicons dashicons-' + (errors.length ? 'warning' : 'yes-alt')} />
				{errors.length ? `${plural(errors.length, 'thing')} to fix before publishing` : 'Ready to publish'}
			</div>
			<div className="fwp-meter" aria-hidden="true">
				<span style={{ width: pct + '%' }} className={errors.length ? 'is-error' : warns.length ? 'is-warn' : 'is-ok'} />
			</div>
			{checks.length > 0 ? (
				<ul className="fwp-check__list">
					{[...errors, ...warns].map((c, i) => (
						<li key={i} className={'is-' + c.level}>
							<button type="button" onClick={() => onJump(c.tab)}>
								{c.msg}
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className="fwp-check__done">Everything is filled in. Nice work.</p>
			)}
			{warns.length > 0 && !errors.length && <p className="fwp-check__note">Amber items are suggestions. You can publish without them.</p>}
		</div>
	);
}

/* ─── App ──────────────────────────────────────────────────────────────── */

function useTitle() {
	const el = document.getElementById('title');
	const [title, setTitle] = useState(el ? el.value : '');
	useEffect(() => {
		if (!el) return undefined;
		const h = () => setTitle(el.value);
		el.addEventListener('input', h);
		el.addEventListener('change', h);
		return () => {
			el.removeEventListener('input', h);
			el.removeEventListener('change', h);
		};
	}, [el]);
	return title;
}

function App() {
	const [d, setD] = useState(() => normalize(cfg.data));
	const title = useTitle();
	const [tab, setTabState] = useState(() => {
		try {
			return window.sessionStorage.getItem('fwp-tab-' + cfg.postId) || 'basics';
		} catch (e) {
			return 'basics';
		}
	});
	const [destinations, setDestinations] = useState(cfg.destinations);
	const [previewing, setPreviewing] = useState(false);
	const [message, setMessage] = useState(null);
	const [blocked, setBlocked] = useState(null);
	const dirty = useRef(false);
	const first = useRef(true);
	const checks = useMemo(() => runChecks(d, title), [d, title]);
	const checksRef = useRef(checks);
	checksRef.current = checks;
	const sidebar = document.getElementById('fwp-sidebar-root');

	const set = (key, value) => setD((x) => ({ ...x, [key]: value }));
	const update = setD;

	const setTab = (id) => {
		setTabState(id);
		try {
			window.sessionStorage.setItem('fwp-tab-' + cfg.postId, id);
		} catch (e) {
			// Private mode: the tab just is not remembered.
		}
	};
	const jump = (id) => {
		setTab(id);
		setBlocked(null);
		const box = document.getElementById('fwp-editor');
		if (box) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	// Mirror the package into the hidden field the post form submits.
	useEffect(() => {
		const input = document.getElementById('fwp-data-input');
		if (input) input.value = JSON.stringify(d);
		if (first.current) {
			first.current = false;
			return;
		}
		dirty.current = true;
	}, [d]);

	// Warn before leaving with unsaved edits; stop Publish while something required is missing.
	useEffect(() => {
		const form = document.getElementById('post');
		const onSubmit = () => {
			dirty.current = false;
		};
		const onLeave = (e) => {
			if (dirty.current) {
				e.preventDefault();
				e.returnValue = '';
			}
		};
		const publish = document.getElementById('publish');
		const onPublish = (e) => {
			const errors = checksRef.current.filter((c) => c.level === 'error');
			if (errors.length) {
				e.preventDefault();
				e.stopImmediatePropagation();
				setBlocked(errors);
			}
		};
		if (form) form.addEventListener('submit', onSubmit);
		window.addEventListener('beforeunload', onLeave);
		if (publish) publish.addEventListener('click', onPublish, true);
		return () => {
			if (form) form.removeEventListener('submit', onSubmit);
			window.removeEventListener('beforeunload', onLeave);
			if (publish) publish.removeEventListener('click', onPublish, true);
		};
	}, []);

	const preview = async () => {
		// Opened straight away so the browser does not treat it as a pop-up.
		const win = window.open('', '_blank');
		if (win) {
			win.document.write('<p style="font:16px/1.5 -apple-system,Segoe UI,sans-serif;padding:48px;color:#555">Opening the preview...</p>');
		}
		setPreviewing(true);
		try {
			const res = await ajax('fwp_preview', { postId: cfg.postId, title, data: JSON.stringify(d) });
			if (win) win.location.href = res.url;
			else window.open(res.url, '_blank');
		} catch (e) {
			if (win) win.close();
			setMessage({ status: 'error', text: e.message });
		}
		setPreviewing(false);
	};

	const levelFor = (id) => {
		const own = checks.filter((c) => c.tab === id);
		if (own.some((c) => c.level === 'error')) return 'error';
		if (own.some((c) => c.level === 'warn')) return 'warn';
		return 'ok';
	};
	const index = TABS.findIndex((t) => t.id === tab);
	const props = { d, set, update, title, destinations, setDestinations };
	const host = cfg.siteUrl.replace(/^https?:\/\//, '');
	const futureSlug = d.slug || slugify(title) || '...';

	return (
		<div
			className="fwp-root"
			onKeyDown={(e) => {
				// Enter in a text box must not submit the whole post form.
				if (e.key === 'Enter' && e.target.tagName === 'INPUT') e.preventDefault();
			}}
		>
			<div className="fwp-topbar">
				<div className="fwp-topbar__url">
					{cfg.liveUrl ? (
						<>
							<span className="fwp-dot is-live" /> Live at{' '}
							<a href={cfg.liveUrl} target="_blank" rel="noopener noreferrer">
								{cfg.liveUrl.replace(/^https?:\/\//, '')}
							</a>
						</>
					) : (
						<>
							<span className="fwp-dot" /> Not live yet. Will be at{' '}
							<code>
								{host}/packages/{futureSlug}
							</code>
						</>
					)}
				</div>
				<div className="fwp-topbar__actions">
					{cfg.duplicateUrl && (
						<Button variant="tertiary" icon="admin-page" href={cfg.duplicateUrl}>
							Duplicate
						</Button>
					)}
					<Button variant="secondary" icon="visibility" onClick={preview} isBusy={previewing} disabled={previewing}>
						Preview on website
					</Button>
				</div>
			</div>

			{cfg.refused && (
				<Notice status="warning" isDismissible={false} className="fwp-notice">
					These edits are not saved yet, and the live page has not changed. Fix the red items in the checklist, then click Update.
				</Notice>
			)}
			{message && (
				<Notice status={message.status} onRemove={() => setMessage(null)} className="fwp-notice">
					{message.text}
				</Notice>
			)}

			<div className="fwp-layout">
				<nav className="fwp-tabs" aria-label="Package sections">
					{TABS.map((t) => {
						const level = levelFor(t.id);
						return (
							<button
								key={t.id}
								type="button"
								className={'fwp-tab' + (tab === t.id ? ' is-active' : '')}
								onClick={() => setTab(t.id)}
								aria-current={tab === t.id ? 'page' : undefined}
							>
								<span className={'dashicons dashicons-' + t.icon} />
								<span className="fwp-tab__label">{t.label}</span>
								<span className={'fwp-tab__state is-' + level} aria-label={level === 'error' ? 'needs attention' : level === 'warn' ? 'suggestions' : 'done'} />
							</button>
						);
					})}
				</nav>

				<div className="fwp-panel">
					{tab === 'basics' && <BasicsTab {...props} />}
					{tab === 'photos' && <PhotosTab {...props} />}
					{tab === 'overview' && <OverviewTab {...props} />}
					{tab === 'itinerary' && <ItineraryTab {...props} />}
					{tab === 'inclusions' && <InclusionsTab {...props} />}
					{tab === 'hotels' && <HotelsTab {...props} />}
					{tab === 'pricing' && <PricingTab {...props} />}
					{tab === 'faqs' && <FaqsTab {...props} />}
					{tab === 'seo' && <SeoTab {...props} />}
					{tab === 'visibility' && <VisibilityTab {...props} />}

					<div className="fwp-steps">
						{index > 0 ? (
							<Button variant="tertiary" icon="arrow-left-alt2" onClick={() => setTab(TABS[index - 1].id)}>
								{TABS[index - 1].label}
							</Button>
						) : (
							<span />
						)}
						{index < TABS.length - 1 && (
							<Button variant="secondary" onClick={() => setTab(TABS[index + 1].id)}>
								Next: {TABS[index + 1].label} <span className="dashicons dashicons-arrow-right-alt2" />
							</Button>
						)}
					</div>
				</div>
			</div>

			<datalist id="fwp-hotel-cats">
				{cfg.presets.hotelCategories.map((x) => (
					<option key={x} value={x} />
				))}
			</datalist>
			<datalist id="fwp-meals">
				{cfg.presets.meals.map((x) => (
					<option key={x} value={x} />
				))}
			</datalist>
			<datalist id="fwp-day-meals">
				{cfg.presets.dayMeals.map((x) => (
					<option key={x} value={x} />
				))}
			</datalist>
			<datalist id="fwp-badges">
				{cfg.presets.badges.map((x) => (
					<option key={x} value={x} />
				))}
			</datalist>

			{blocked && (
				<Modal title="Not ready to publish yet" onRequestClose={() => setBlocked(null)} className="fwp-modal">
					<p>
						{cfg.status === 'publish'
							? 'Fix these first. The live page stays as it is until then.'
							: 'Fix these first, or click Save Draft to keep working later.'}
					</p>
					<ul className="fwp-check__list">
						{blocked.map((c, i) => (
							<li key={i} className="is-error">
								<button type="button" onClick={() => jump(c.tab)}>
									{c.msg}
								</button>
							</li>
						))}
					</ul>
					<div className="fwp-modal__actions">
						<Button variant="primary" onClick={() => jump(blocked[0].tab)}>
							Fix the first one
						</Button>
					</div>
				</Modal>
			)}

			{sidebar &&
				createPortal(
					<div className="fwp-side">
						<CardPreview d={d} title={title} destinations={destinations} />
						<Button variant="secondary" icon="visibility" onClick={preview} isBusy={previewing} disabled={previewing} className="fwp-side__preview">
							Preview the full page
						</Button>
						<Checklist checks={checks} onJump={jump} />
						{cfg.ping && cfg.ping.text && <p className={'fwp-ping ' + (cfg.ping.ok ? 'is-ok' : 'is-bad')}>{cfg.ping.text}</p>}
					</div>,
					sidebar
				)}
		</div>
	);
}

const mount = document.getElementById('fwp-app');
if (mount && cfg) {
	if (createRoot) createRoot(mount).render(<App />);
	else render(<App />, mount);
}
