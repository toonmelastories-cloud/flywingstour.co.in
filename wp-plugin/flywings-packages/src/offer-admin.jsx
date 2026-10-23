/**
 * Flywings Packages: the offer editor.
 *
 * Runs inside WordPress's post edit screen for the Offers menu, using
 * WordPress's own React (wp.element) and UI components (wp.components),
 * so nothing extra is downloaded. The whole offer lives in one state
 * object mirrored into the hidden "fwo_data" field, so WordPress's
 * normal Save Draft / Publish / Update buttons save it.
 *
 * The small building blocks below (Section, Field, ListEditor and the
 * rest) are deliberately a copy of the ones in admin.jsx rather than a
 * shared import: admin.jsx is the live package editor and there is no
 * way to exercise it outside WordPress, so it is left untouched. Worth
 * lifting into one module the next time that file is opened anyway.
 *
 * Build: see README.md in the plugin folder. The output is
 * assets/offer-admin.js.
 */

/* global wp */

const { useState, useEffect, useMemo, useRef, createPortal, createRoot, render } = wp.element;
const { Button, TextControl, ToggleControl, TextareaControl, Modal, Notice } = wp.components;

const cfg = window.fwoAdmin;

/* ─── Helpers ──────────────────────────────────────────────────────────── */

const inr = (n) => {
	const v = Math.round(Number(n) || 0);
	return v > 0 ? '₹' + v.toLocaleString('en-IN') : '';
};

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

const BULLET = /^\s*(?:[-*•●▪◦✓✔☑➤>]+|\d{1,2}[.)])\s*/;
const cleanBullet = (s) => s.replace(BULLET, '').trim();

const list = (v) => (Array.isArray(v) ? v : []);

/** Saved offer merged over the shape the editor expects. */
function normalize(raw) {
	const d = { ...raw };
	d.cities = list(d.cities);
	d.itinerary = list(d.itinerary);
	d.inclusions = list(d.inclusions);
	d.image = { id: 0, url: '', alt: '', ...(d.image || {}) };
	d.compare = { enabled: false, label: '', price: 0, href: '', sameTrip: false, note: '', ...(d.compare || {}) };
	d.minPax = Number(d.minPax) || 2;
	d.startingPrice = Number(d.startingPrice) || 0;
	d.listed = d.listed !== false;
	return d;
}

/**
 * Turns "Day 1: Arrive Hanoi" pasted from a rate sheet into one line
 * per day, dropping blank lines and bullet characters.
 */
function parseDays(text) {
	return String(text || '')
		.split(/\r?\n/)
		.map(cleanBullet)
		.filter(Boolean)
		.slice(0, 30);
}

/* ─── Checks (kept in step with FWO_Data::publish_errors) ──────────────── */

function runChecks(d, title) {
	const out = [];
	const err = (tab, msg) => out.push({ level: 'error', tab, msg });
	const warn = (tab, msg) => out.push({ level: 'warn', tab, msg });

	if (!String(title).trim()) {
		err('basics', 'Give the offer a name, for example "Hanoi, Halong Bay & Ninh Binh 5 Days".');
	}
	if (!d.region.trim()) err('basics', 'Say which country or region this is, for example "Vietnam".');
	if (!d.duration.trim()) err('basics', 'Say how long the trip is, for example "4 Nights / 5 Days".');
	if (d.startingPrice <= 0) err('pricing', 'Add the starting price per person. An offer with no price is not an offer.');
	if (!d.inclusions.filter(Boolean).length) err('details', 'List what the rate includes. Visitors will not enquire without it.');
	if (d.validTill && d.validTill < today()) {
		err('pricing', 'The hold date has already passed, so this offer would never show. Clear it or move it forward.');
	}
	if (d.compare.enabled) {
		if (!d.compare.label.trim()) err('pricing', 'Name what this rate is compared with.');
		if (d.compare.price <= 0) err('pricing', 'Add the price being compared against, or switch the comparison off.');
		if (!d.compare.href.trim()) err('pricing', 'Pick the page being compared with, so a visitor can check the figure.');
		if (d.compare.sameTrip && d.compare.price > 0 && d.compare.price <= d.startingPrice) {
			err('pricing', 'The compared price is not higher than this offer, so there is no saving to show.');
		}
	}

	if (!d.image.url) warn('photo', 'No photo, so the card shows a plain panel. Add one if we hold a picture of the place.');
	else if (!d.image.alt.trim()) warn('photo', 'The photo has no description, which screen readers and Google both read.');
	if (!d.itinerary.filter(Boolean).length) warn('details', 'No day-by-day. Offers that show the days get more enquiries.');
	if (!d.cities.filter(Boolean).length) warn('basics', 'No cities listed, so the card cannot say where the trip goes.');
	if (!d.hotelCategory.trim()) warn('basics', 'No hotel category, for example "3 Star" or "Hotel, category on request".');
	if (!d.validTill) warn('pricing', 'No hold date. The offer stays up until someone takes it down by hand.');
	return out;
}

const TABS = [
	{ id: 'basics', label: 'Basics', icon: 'admin-site-alt3' },
	{ id: 'photo', label: 'Photo', icon: 'format-image' },
	{ id: 'details', label: 'Days & Inclusions', icon: 'editor-ul' },
	{ id: 'pricing', label: 'Price & Saving', icon: 'tag' },
	{ id: 'visibility', label: 'Visibility', icon: 'visibility' },
];

/* ─── Small building blocks ────────────────────────────────────────────── */

const Text = (p) => <TextControl __nextHasNoMarginBottom __next40pxDefaultSize {...p} />;
const Area = (p) => <TextareaControl __nextHasNoMarginBottom {...p} />;
const Toggle = (p) => <ToggleControl __nextHasNoMarginBottom {...p} />;

function Section({ title, hint, actions, children }) {
	return (
		<section className="fwp-section">
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

function IconButton({ icon, label, onClick, disabled }) {
	return <Button icon={icon} label={label} showTooltip size="small" className="fwp-icon-btn" onClick={onClick} disabled={disabled} />;
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
					e.dataTransfer.setData('text/plain', 'fwo');
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

/* ─── Tabs ─────────────────────────────────────────────────────────────── */

function BasicsTab({ d, set, title }) {
	return (
		<>
			<Section title="What and where" hint="This is the line under the offer name on the card.">
				<Field label="Country or region" help='Shown on the card and used by AI assistants matching a search. For example "Vietnam".'>
					<Text value={d.region} onChange={(v) => set('region', v)} placeholder="Vietnam" />
				</Field>
				<Field label="How long" help='Exactly as you quote it. For example "4 Nights / 5 Days".'>
					<Text value={d.duration} onChange={(v) => set('duration', v)} placeholder="4 Nights / 5 Days" />
				</Field>
				<Field label="Cities" help="One per line, in the order the trip visits them.">
					<ListEditor
						items={d.cities}
						onChange={(v) => set('cities', v)}
						placeholder="Hanoi"
						addLabel="Add city"
					/>
				</Field>
				<Field label="Hotel category" help='For example "3 Star", or "Hotel, category on request" when the supplier confirms it at booking.'>
					<Text value={d.hotelCategory} onChange={(v) => set('hotelCategory', v)} placeholder="3 Star" list="fwo-hotel-cats" />
				</Field>
			</Section>

			<Section title="Link on the Offers page" hint="Every offer lives on one page, so this is the anchor people are sent to.">
				<Field label="Anchor" help={`Leave it alone unless you have a reason. It becomes ${cfg.offersUrl}#${d.slug || slugify(title) || 'offer-name'}`}>
					<Text
						value={d.slug}
						onChange={(v) => set('slug', slugify(v))}
						placeholder={slugify(title) || 'vietnam-hanoi-halong-5d'}
					/>
				</Field>
			</Section>
		</>
	);
}

function PhotoTab({ d, update }) {
	const pick = () => {
		const frame = wp.media({
			title: 'Choose the offer photo',
			library: { type: 'image' },
			button: { text: 'Use this photo' },
			multiple: false,
		});
		frame.on('select', () => {
			const a = frame.state().get('selection').first().toJSON();
			update((x) => ({
				...x,
				image: { id: a.id, url: a.url, alt: a.alt || x.image.alt || '' },
			}));
		});
		frame.open();
	};

	return (
		<Section
			title="Card photo"
			hint="Landscape, 1200px wide or more. Leave it empty rather than borrow a photo of somewhere else: the card shows a tidy branded panel instead, and a traveller notices a picture of the wrong place."
			actions={
				d.image.url ? (
					<Button variant="tertiary" isDestructive onClick={() => update((x) => ({ ...x, image: { id: 0, url: '', alt: '' } }))}>
						Remove
					</Button>
				) : null
			}
		>
			{d.image.url ? (
				<>
					<div className="fwp-photo">
						<img src={d.image.url} alt="" />
					</div>
					<Field label="Describe the photo" help="What is in the picture, in a few words. Screen readers and Google both read this.">
						<Text
							value={d.image.alt}
							onChange={(v) => update((x) => ({ ...x, image: { ...x.image, alt: v } }))}
							placeholder="Traditional junk boat sailing past limestone karsts in Ha Long Bay, Vietnam"
						/>
					</Field>
					<Button variant="secondary" icon="format-image" onClick={pick}>
						Change photo
					</Button>
				</>
			) : (
				<Button variant="primary" icon="format-image" onClick={pick}>
					Choose a photo
				</Button>
			)}
		</Section>
	);
}

function DetailsTab({ d, set, update }) {
	const [paste, setPaste] = useState(false);
	return (
		<>
			<Section
				title="Day by day"
				hint="One line per day, as brief as the rate sheet. For example: Day 1: Arrive Hanoi, half day city tour (lunch)."
				actions={
					<Button variant="secondary" size="compact" icon="clipboard" onClick={() => setPaste(true)}>
						Paste a whole itinerary
					</Button>
				}
			>
				<ListEditor
					items={d.itinerary}
					onChange={(v) => set('itinerary', v)}
					placeholder="Day 1: Arrive Hanoi, half day city tour (lunch)"
					addLabel="Add day"
				/>
			</Section>

			<Section title="What the rate includes" hint="Straight off the supplier's sheet. This is what a visitor reads before enquiring.">
				<ListEditor
					items={d.inclusions}
					onChange={(v) => set('inclusions', v)}
					placeholder="3 star accommodation"
					addLabel="Add inclusion"
				/>
				<Presets presets={cfg.inclusionPresets} items={d.inclusions} onChange={(v) => set('inclusions', v)} />
			</Section>

			{paste && (
				<PasteModal
					onClose={() => setPaste(false)}
					hasExisting={d.itinerary.filter(Boolean).length > 0}
					onApply={(lines, replace) => {
						update((x) => ({
							...x,
							itinerary: replace ? lines : [...x.itinerary.filter(Boolean), ...lines],
						}));
						setPaste(false);
					}}
				/>
			)}
		</>
	);
}

function PasteModal({ onClose, onApply, hasExisting }) {
	const [text, setText] = useState('');
	const lines = parseDays(text);
	return (
		<Modal title="Paste the itinerary" onRequestClose={onClose} className="fwp-modal">
			<p>Paste it from WhatsApp, Word or an email. Each line becomes one day.</p>
			<Area
				value={text}
				onChange={setText}
				rows={10}
				placeholder={'Day 1: Arrive Hanoi, half day city tour (lunch)\nDay 2: Hoa Lu, Tam Coc and Mua Cave (breakfast, lunch)'}
			/>
			<p className="fwp-help">
				{lines.length ? `${lines.length} day${lines.length === 1 ? '' : 's'} found.` : 'Nothing to add yet.'}
			</p>
			<div className="fwp-modal__actions">
				{hasExisting && (
					<Button variant="secondary" disabled={!lines.length} onClick={() => onApply(lines, false)}>
						Add to the days already there
					</Button>
				)}
				<Button variant="primary" disabled={!lines.length} onClick={() => onApply(lines, true)}>
					{hasExisting ? 'Replace all days' : 'Add these days'}
				</Button>
			</div>
		</Modal>
	);
}

function PricingTab({ d, set, update }) {
	const c = d.compare;
	const setC = (key, value) => update((x) => ({ ...x, compare: { ...x.compare, [key]: value } }));
	const saving = c.sameTrip && c.price > d.startingPrice ? c.price - d.startingPrice : 0;

	return (
		<>
			<Section title="The rate" hint="Per person, land only, the lowest the offer starts at.">
				<PriceInput
					label="Starting price per person"
					value={d.startingPrice}
					onChange={(v) => set('startingPrice', v)}
					placeholder="27999"
				/>
				<Field label="Smallest group this rate holds for" help="Printed on the card, because a per-person price without it is not a price anyone can book.">
					<input
						type="number"
						min="1"
						max="99"
						className="fwp-input"
						value={d.minPax}
						onChange={(e) => set('minPax', Math.min(99, Math.max(1, Math.round(Number(e.target.value) || 1))))}
					/>
				</Field>
				<Field
					label="Hold the rate until"
					help="The offer disappears from the website by itself the day after this. Leave it empty for a rate with no end date, and remember to take it down by hand."
				>
					<input
						type="date"
						className="fwp-input"
						value={d.validTill}
						min={today()}
						onChange={(e) => set('validTill', e.target.value)}
					/>
				</Field>
			</Section>

			<Section
				title="Compare with a package"
				hint="Shows the visitor what the offer is worth, linked to the package page so they can check the figure for themselves."
			>
				<Toggle
					label="Compare this rate with one of our packages"
					checked={c.enabled}
					onChange={(v) => setC('enabled', v)}
				/>
				{c.enabled && (
					<>
						<Field label="Which package" help="Only published packages appear here, so the link always goes somewhere real.">
							<select
								className="fwp-input"
								value={c.href}
								onChange={(e) => {
									const pick = cfg.packages.find((p) => p.href === e.target.value);
									update((x) => ({
										...x,
										compare: {
											...x.compare,
											href: e.target.value,
											label: pick ? 'our ' + pick.label + ' package' : x.compare.label,
											price: pick && pick.price ? pick.price : x.compare.price,
										},
									}));
								}}
							>
								<option value="">Choose a package...</option>
								{cfg.packages.map((p) => (
									<option key={p.href} value={p.href}>
										{p.label}
										{p.price ? ` — ${inr(p.price)}` : ''}
									</option>
								))}
							</select>
						</Field>
						<Field label="Call it" help='How the card names it, for example "our Kuala Lumpur 3N/4D package".'>
							<Text value={c.label} onChange={(v) => setC('label', v)} placeholder="our Kuala Lumpur 3N/4D package" />
						</Field>
						<PriceInput label="That package's price" value={c.price} onChange={(v) => setC('price', v)} placeholder="25000" />
						<Toggle
							label="It is the same trip at the same length"
							help={
								c.sameTrip
									? 'The card prints the package price struck out and the difference as a saving.'
									: 'The card only points at the other package. Leave this off when the trips differ in length or standard: calling that a saving claims a discount we have not given.'
							}
							checked={c.sameTrip}
							onChange={(v) => setC('sameTrip', v)}
						/>
						{c.sameTrip && saving > 0 && (
							<Notice status="success" isDismissible={false} className="fwp-notice">
								The card will say: Save {inr(saving)}
							</Notice>
						)}
						{c.sameTrip && c.price > 0 && c.price <= d.startingPrice && (
							<Notice status="error" isDismissible={false} className="fwp-notice">
								The compared price is not higher than this offer, so there is no saving to show.
							</Notice>
						)}
						<Field
							label="What is different"
							help="Printed under the saving. Say plainly what the cheaper rate gives up, for example a hotel confirmed at booking rather than a named 4 star."
						>
							<Text value={c.note} onChange={(v) => setC('note', v)} placeholder="Same 3 nights and the same sightseeing. The package page rate is on a confirmed 4 star hotel; this one is on a hotel confirmed at booking." />
						</Field>
					</>
				)}
			</Section>
		</>
	);
}

function VisibilityTab({ d, set }) {
	return (
		<Section title="On the website" hint="Publishing puts the offer on the Offers page. This switch takes it off again without unpublishing it.">
			<Toggle
				label="Show this offer on the Offers page"
				help={d.listed ? 'It appears with the others.' : 'It is kept off the page. Use this to park an offer you are about to bring back.'}
				checked={d.listed}
				onChange={(v) => set('listed', v)}
			/>
		</Section>
	);
}

/* ─── Sidebar: card preview and checklist ──────────────────────────────── */

function CardPreview({ d, title }) {
	const saving = d.compare.enabled && d.compare.sameTrip && d.compare.price > d.startingPrice ? d.compare.price - d.startingPrice : 0;
	return (
		<div className="fwp-card">
			<div className="fwp-card__media">
				{d.image.url ? <img src={d.image.url} alt="" /> : <span className="fwp-card__placeholder">{d.region || 'No photo'}</span>}
				{d.duration && <span className="fwp-card__badge">{d.duration}</span>}
			</div>
			<div className="fwp-card__body">
				<strong className="fwp-card__title">{title || 'Offer name'}</strong>
				{!!d.cities.filter(Boolean).length && <p className="fwp-card__meta">{d.cities.filter(Boolean).join(' · ')}</p>}
				<p className="fwp-card__price">
					{d.startingPrice > 0 ? inr(d.startingPrice) : '—'}
					<span> /person</span>
					{saving > 0 && <span className="fwp-card__was"> {inr(d.compare.price)}</span>}
				</p>
				{saving > 0 && <p className="fwp-card__meta">Save {inr(saving)}</p>}
				<p className="fwp-card__meta">Min {d.minPax} travellers</p>
			</div>
		</div>
	);
}

function Checklist({ checks, onJump }) {
	const errors = checks.filter((c) => c.level === 'error');
	const warns = checks.filter((c) => c.level === 'warn');
	return (
		<div className="fwp-check">
			<h4 className="fwp-check__title">
				{errors.length ? `${errors.length} to fix before publishing` : warns.length ? 'Ready. A few suggestions:' : 'Ready to publish'}
			</h4>
			<ul className="fwp-check__list">
				{[...errors, ...warns].map((c, i) => (
					<li key={i} className={'is-' + c.level}>
						<button type="button" onClick={() => onJump(c.tab)}>
							{c.msg}
						</button>
					</li>
				))}
			</ul>
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
	const [tab, setTab] = useState('basics');
	const [blocked, setBlocked] = useState(null);
	const dirty = useRef(false);
	const first = useRef(true);
	const checks = useMemo(() => runChecks(d, title), [d, title]);
	const checksRef = useRef(checks);
	checksRef.current = checks;
	const sidebar = document.getElementById('fwo-sidebar-root');

	const set = (key, value) => setD((x) => ({ ...x, [key]: value }));
	const update = setD;

	const jump = (id) => {
		setTab(id);
		setBlocked(null);
		const box = document.getElementById('fwo-editor');
		if (box) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	// Mirror the offer into the hidden field the post form submits.
	useEffect(() => {
		const input = document.getElementById('fwo-data-input');
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

	const levelFor = (id) => {
		const own = checks.filter((c) => c.tab === id);
		if (own.some((c) => c.level === 'error')) return 'error';
		if (own.some((c) => c.level === 'warn')) return 'warn';
		return 'ok';
	};
	const index = TABS.findIndex((t) => t.id === tab);
	const props = { d, set, update, title };

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
					<span className="fwp-dot is-live" /> Offers page:{' '}
					<a href={cfg.offersUrl} target="_blank" rel="noopener noreferrer">
						{cfg.offersUrl.replace(/^https?:\/\//, '')}
					</a>
				</div>
				<div className="fwp-topbar__actions">
					{cfg.duplicateUrl && (
						<Button variant="tertiary" icon="admin-page" href={cfg.duplicateUrl}>
							Duplicate
						</Button>
					)}
				</div>
			</div>

			{cfg.refused && (
				<Notice status="warning" isDismissible={false} className="fwp-notice">
					These edits are not saved yet, and the offer on the website has not changed. Fix the red items in the checklist, then click Update.
				</Notice>
			)}

			<div className="fwp-layout">
				<nav className="fwp-tabs" aria-label="Offer sections">
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
								<span
									className={'fwp-tab__state is-' + level}
									aria-label={level === 'error' ? 'needs attention' : level === 'warn' ? 'suggestions' : 'done'}
								/>
							</button>
						);
					})}
				</nav>

				<div className="fwp-panel">
					{tab === 'basics' && <BasicsTab {...props} />}
					{tab === 'photo' && <PhotoTab {...props} />}
					{tab === 'details' && <DetailsTab {...props} />}
					{tab === 'pricing' && <PricingTab {...props} />}
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

			<datalist id="fwo-hotel-cats">
				{['3 Star', '4 Star', '5 Star', 'Hotel, category on request', 'Resort', 'Houseboat'].map((x) => (
					<option key={x} value={x} />
				))}
			</datalist>

			{blocked && (
				<Modal title="Not ready to publish yet" onRequestClose={() => setBlocked(null)} className="fwp-modal">
					<p>Fix these first, or click Save Draft to keep working later.</p>
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
						<CardPreview d={d} title={title} />
						<Checklist checks={checks} onJump={jump} />
						{cfg.ping && cfg.ping.text && <p className={'fwp-ping ' + (cfg.ping.ok ? 'is-ok' : 'is-bad')}>{cfg.ping.text}</p>}
					</div>,
					sidebar
				)}
		</div>
	);
}

const mount = document.getElementById('fwo-app');
if (mount && cfg) {
	if (createRoot) createRoot(mount).render(<App />);
	else render(<App />, mount);
}
