/**
 * STUB DATA — the Salon has no backend yet.
 * Everything the Salon/Annotations channels and the /salon page render comes
 * from here, so wiring a real endpoint later is a one-file change: replace
 * these exports with fetches and keep the shapes.
 */

export const SALON_THREADS = [
    {
        id: 'oakmoss',
        kind: { label: 'Thread' },
        title: 'On the disappearance of true oakmoss, and what we lost with it.',
        excerpt: "Since IFRA's '08 restrictions, classical chypres have been quietly rewritten. Has anyone found a modern composition that genuinely replaces the wet-forest-floor sensation of vintage Mitsouko?",
        tags: ['Chypre', 'Oakmoss', 'Vintage', 'IFRA'],
        meta: { name: 'Olivier C.', lines: ['2 days ago', 'cited 12 frag.'] },
        stats: { big: '47', accent: true, rows: ['annotations', '✦ 88 saved'] },
    },
    {
        id: 'aventus',
        kind: { label: 'Question', variant: 'question' },
        title: 'Is Aventus — honestly — still good, or have we been re-buying it out of habit?',
        excerpt: "Batch variation aside. I'm interested in whether the composition itself feels dated, or if the issue is purely fatigue of ubiquity. Looking for unfashionable opinions.",
        tags: ['Creed', 'Aventus', 'Hot take'],
        meta: { name: 'Hideo T.', lines: ['3 days ago', 'cited 8 frag.'] },
        stats: { big: '89', accent: true, rows: ['annotations', '✦ 142 saved'] },
    },
    {
        id: 'malle-qa',
        kind: { label: 'Thread · perfumer in residence' },
        title: 'Frédéric Malle on the ethics of a 32-ingredient formula.',
        excerpt: 'An open Q&A through Thursday. Submit a question; the most-saved three will be answered in long form. Past sessions are archived in the salon library.',
        tags: ['Q&A', 'Frédéric Malle', 'Perfumer'],
        meta: { name: 'Editorial', lines: ['1 week ago', 'open until Thu'] },
        stats: { big: '156', rows: ['questions', '✦ 412 saved'] },
    },
    {
        id: 'skin-scents',
        kind: { label: 'Thread' },
        title: 'The case for scents nobody else can smell.',
        excerpt: 'Skin scents as private luxury: if a fragrance projects nothing, whom is it for? A running defence of the near-invisible wardrobe.',
        tags: ['Skin scent', 'Musk', 'Philosophy'],
        meta: { name: 'Anya R.', lines: ['1 week ago', 'cited 5 frag.'] },
        stats: { big: '34', accent: true, rows: ['annotations', '✦ 61 saved'] },
    },
    {
        id: 'winter-rotation',
        kind: { label: 'Question', variant: 'question' },
        title: 'What earns a permanent place in a winter rotation?',
        excerpt: 'Not the seasonal hype list — the bottles you actually reach for when it is minus five and dark by four. Defend one choice.',
        tags: ['Winter', 'Rotation', 'Amber'],
        meta: { name: 'Lior K.', lines: ['2 weeks ago', 'cited 9 frag.'] },
        stats: { big: '58', accent: true, rows: ['annotations', '✦ 96 saved'] },
    },
];

export const SALON_ANNOTATIONS = [
    {
        id: 'tv-winter',
        kind: { label: 'Annotation · 6 months in', variant: 'review' },
        title: 'Tobacco Vanille — after a winter.',
        excerpt: "A long-form revisit. The opening still announces itself, but the drydown has revealed a softness I didn't notice in October — almost a tonka-pipe sweetness, very late evening, very 'old library'.",
        tags: ['Tom Ford', 'Tobacco', 'Long-wear'],
        meta: { name: 'Margaux V.', lines: ['5 days ago', '★★★★★ 5 of 5'] },
        stats: { big: '23', rows: ['marginalia', '✦ 211 saved'] },
    },
    {
        id: 'mojave',
        kind: { label: 'Annotation', variant: 'review' },
        title: 'Mojave Ghost — a quiet skin scent that takes a season to read.',
        excerpt: 'Restrained to the point of frustration on first wear; on the fourth, suddenly indispensable. A study in patience and proximity — the rare bottle that asks the wearer to lean in.',
        tags: ['Byredo', 'Ambrette', 'Skin scent'],
        meta: { name: 'Anya R.', lines: ['1 week ago', '★★★★ 4 of 5'] },
        stats: { big: '11', rows: ['marginalia', '✦ 67 saved'] },
    },
    {
        id: 'bal',
        kind: { label: 'Annotation · revisited', variant: 'review' },
        title: "Bal d'Afrique — the case for keeping it on the shelf.",
        excerpt: 'Often dismissed as a beginner Byredo; an unfair reputation. Worn in late summer evenings it reveals a violet-cedar quietness that nothing else in the lineup quite manages.',
        tags: ['Byredo', 'Neroli', 'Summer'],
        meta: { name: 'Lior K.', lines: ['2 weeks ago', '★★★★ 4 of 5'] },
        stats: { big: '31', rows: ['marginalia', '✦ 104 saved'] },
    },
];

export const TONIGHT_THREAD = {
    question: 'Is the disappearance of true oakmoss the greatest loss in modern perfumery?',
    emphasis: 'true oakmoss',
    by: '— posed by Olivier C. · 2 days · 47 annotations',
};

export const SALON_COUNTS = {
    threads: 218,
    annotations: 1422,
    residencies: 14,
};
