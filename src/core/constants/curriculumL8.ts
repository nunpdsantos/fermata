import type { CurriculumUnit, CurriculumModule } from '../types/curriculum';

// ---------------------------------------------------------------------------
// Level 8, Unit 25: Fugue and Imitative Forms (3 modules)
// ---------------------------------------------------------------------------

const l8u25m1: CurriculumModule = {
  id: 'l8u25m1',
  unitId: 'u25',
  levelId: 'l8',
  title: 'Fugue: Exposition and Subject/Answer',
  subtitle: 'Fugue exposition structure, subject vs. answer, and the countersubject',
  objectives: [
    'Analyze the fugue exposition: voice entries, subject, answer, countersubject',
    'Distinguish real answer from tonal answer',
    'Identify the countersubject and its role in invertible counterpoint',
    'Understand double and triple fugue at awareness level',
  ],
  concepts: [
    {
      title: 'Fugue Exposition: Voice-by-Voice Entry',
      explanation:
        'A fugue is a contrapuntal composition built from a single melodic idea (the subject). The exposition introduces each voice in turn: the first voice states the subject alone in the tonic, the second voice enters with the answer at the dominant while the first continues with a countersubject, and subsequent voices follow the same alternating pattern — subject in tonic, answer in dominant. The exposition is complete once every voice has entered. The number of voices (typically 2 to 5) defines the fugue\'s textural density and determines how many entries the exposition contains.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See the tonic key a fugue subject would inhabit',
    },
    {
      title: 'Subject, Answer, and Countersubject',
      explanation:
        'The subject is the fugue\'s main theme, stated first in the tonic. A real answer transposes the subject exactly to the dominant. A tonal answer modifies the opening interval to preserve tonal coherence — typically converting an initial tonic-to-dominant leap into a dominant-to-tonic response (a 5th becomes a 4th). Tonal answers are used when the subject prominently features scale degrees 1 and 5. The countersubject is a secondary melodic line written in invertible counterpoint so it functions correctly whether placed above or below the subject. A well-crafted countersubject complements the subject in rhythm, contour, and intervallic content.',
      tryThisQuery: 'key of G',
      tryThisLabel: 'See the dominant key where the answer enters',
    },
    {
      title: 'Double and Triple Fugue',
      explanation:
        'A double fugue combines two subjects, either presenting them together from the start or introducing each in its own exposition before combining them in a culminating section. A triple fugue uses three subjects — Bach\'s Art of Fugue and its unfinished final fugue are the supreme examples. In the combined-presentation type, both subjects appear simultaneously in the opening exposition; in the separate-exposition type, the second subject gets its own full exposition before the two subjects are woven together contrapuntally. The challenge increases exponentially with each additional subject.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See C major — the key of Bach\'s first WTC fugue',
    },
  ],
  tasks: [
    {
      id: 'l8u25m1t1',
      instruction:
        'Listen to a Bach fugue (e.g., WTC Book I, C minor). Map the exposition: identify each voice\'s entry and whether the answer is real or tonal. How many voices are in the fugue?',
    },
    {
      id: 'l8u25m1t2',
      instruction:
        'In the same fugue, identify the countersubject. Does it appear consistently with every subject entry? Is it rhythmically complementary to the subject (filling in where the subject has long notes)?',
    },
    {
      id: 'l8u25m1t3',
      instruction:
        'Compare the subject and answer note by note. Where do they differ? If the answer is tonal, identify the specific interval that was adjusted and explain why (the subject\'s opening emphasized scale degrees 1 and 5).',
    },
  ],
  prerequisites: ['l7u23m5'],

};

const l8u25m2: CurriculumModule = {
  id: 'l8u25m2',
  unitId: 'u25',
  levelId: 'l8',
  title: 'Fugue: Episodes, Stretto, and Devices',
  subtitle: 'Transitional episodes, stretto technique, and subject transformations',
  objectives: [
    'Identify episodes and their motivic material (subject fragments, sequences)',
    'Recognize stretto passages and gauge the tightness of overlapping entries',
    'Understand augmentation, diminution, inversion, and retrograde of the subject',
    'Trace the tonal journey of middle entries through related keys',
  ],
  concepts: [
    {
      title: 'Episodes and Middle Entries',
      explanation:
        'After the exposition, episodes — transitional passages built from motivic fragments of the subject or countersubject, often deployed in sequence — modulate to new keys for middle entries. Each episode typically takes a short motive (a few notes from the subject\'s head or tail) and sequences it through a chain of keys, creating forward momentum. Middle entries restate the subject in related keys: the relative major or minor, the subdominant, or more remote tonal areas. The alternation of episodes and entries gives the fugue its characteristic sense of departure and return.',
      tryThisQuery: 'key of A minor',
      tryThisLabel: 'See A minor — a common key for middle entries from C major',
    },
    {
      title: 'Stretto: Overlapping Subject Entries',
      explanation:
        'Stretto occurs when a new entry of the subject begins before the previous one has finished, creating overlapping statements that generate contrapuntal density and climactic intensity. The tighter the stretto interval (the shorter the gap between entries), the more technically impressive and dramatically forceful the passage. Stretto is often reserved for the final section of a fugue, intensifying the return to the tonic. Not all fugue subjects are amenable to stretto — the ability to overlap depends on the subject\'s intervallic and rhythmic properties.',
      tryThisQuery: 'Bdim',
      tryThisLabel: 'Hear the diminished chord — tension fugues build toward',
    },
    {
      title: 'Compositional Devices: Augmentation, Diminution, Inversion, Retrograde',
      explanation:
        'Augmentation presents the subject in longer note values, effectively halving the tempo of the theme and lending it gravity and weight. Diminution uses shorter values, doubling the speed and creating urgency. Melodic inversion reverses all intervals — ascending motion becomes descending — transforming the subject\'s contour while preserving its rhythmic profile. Retrograde presents the subject backwards, though this is rare in fugues (more common in serial music). These devices can be combined: inverted augmentation, retrograde diminution. Bach\'s Art of Fugue demonstrates virtually every combination.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Play the scale ascending — then imagine it inverted, descending',
    },
  ],
  tasks: [
    {
      id: 'l8u25m2t1',
      instruction:
        'In a Bach fugue you have studied, locate the first episode after the exposition. What motivic material does it use — fragments of the subject, the countersubject, or both? Does it modulate, and if so, to what key?',
    },
    {
      id: 'l8u25m2t2',
      instruction:
        'Find any stretto passages near the end of the fugue. How closely do the entries overlap (how many beats apart)? Does the subject overlap with itself, with the answer, or both?',
    },
    {
      id: 'l8u25m2t3',
      instruction:
        'Does the fugue use augmentation, diminution, or inversion of the subject? If so, identify the specific passage. If not, write the subject\'s first 4-5 notes in inversion — reverse each interval\'s direction.',
    },
  ],
  prerequisites: ['l8u25m1'],

};

const l8u25m3: CurriculumModule = {
  id: 'l8u25m3',
  unitId: 'u25',
  levelId: 'l8',
  title: 'Canon and Other Imitative Forms',
  subtitle: 'Canons at various intervals and special types',
  objectives: [
    'Understand canon at various intervals (unison, octave, 5th, 4th, etc.)',
    'Recognize special canon types (inversion, retrograde, augmentation/diminution)',
    'Know the difference between strict canon and free imitation',
  ],
  concepts: [
    {
      title: 'Strict Canon and Canonic Intervals',
      explanation:
        'In a strict canon, a leader voice (dux) presents a melody and a follower (comes) replicates it exactly after a fixed time delay, transposed by some interval. Canon at the unison repeats at the same pitch; canon at the octave shifts by an octave; canon at the fifth transposes up a perfect fifth. The compositional challenge is profound: the leader must generate a melody that produces valid counterpoint against a time-delayed copy of itself. The further the canonic interval from the unison, the more constrained the melodic possibilities become.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See the scale — the melodic raw material of a canon',
    },
    {
      title: 'Special Canon Types and the Round',
      explanation:
        'Mirror canon (canon by inversion) reverses all intervals in the follower — ascending motion in the dux becomes descending in the comes. Crab canon (retrograde) plays the follower\'s melody backwards. Augmentation canon doubles note values in the follower; diminution halves them. These can be combined — retrograde inversion, for instance. The round is the simplest canon: a perpetual canon at the unison where voices enter at regular intervals and the melody loops indefinitely. The ricercar, a predecessor to the fugue, uses imitative counterpoint more freely, without the fugue\'s formal exposition-episode structure.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See C major — the simplest key for canonic writing',
    },
    {
      title: 'Free Imitation vs. Strict Canon',
      explanation:
        'Strict canon maintains exact intervallic replication throughout; free imitation uses the subject as a starting point but allows departure when strict following would produce poor counterpoint or dissonance. Most Renaissance and Baroque polyphony uses free imitation — passages begin with canonic entries (called "points of imitation") but quickly diverge into independent counterpoint. Understanding the spectrum from strict canon to free imitation illuminates virtually all polyphonic music from Josquin through Bach.',
      tryThisQuery: 'A natural minor scale',
      tryThisLabel: 'Hear minor — common in Renaissance imitative writing',
    },
  ],
  tasks: [
    {
      id: 'l8u25m3t1',
      instruction:
        'Take a simple 4-bar melody you know. Sing or play it, then imagine it entering again one bar later at the same pitch. Where would dissonances occur? This reveals why canonic writing is so constrained.',
    },
    {
      id: 'l8u25m3t2',
      instruction:
        'Listen to the canon from Bach\'s Goldberg Variations (every third variation is a canon). Compare Canon at the Unison (Var. 3), Canon at the Second (Var. 6), and Canon at the Third (Var. 9). How does the canonic interval affect the character?',
    },
    {
      id: 'l8u25m3t3',
      instruction:
        'Write the first 4 notes of a melody, then write them in retrograde (backwards) and in inversion (reverse each interval\'s direction). Could any of these serve as a canon against the original?',
    },
  ],
  prerequisites: ['l8u25m2'],

};

// ---------------------------------------------------------------------------
// Level 8, Unit 26: Large Form and Orchestration (3 modules)
// ---------------------------------------------------------------------------

const l8u26m1: CurriculumModule = {
  id: 'l8u26m1',
  unitId: 'u26',
  levelId: 'l8',
  title: 'Sonata Form in Depth',
  subtitle: 'Exposition, development, and recapitulation in full sectional detail',
  objectives: [
    'Analyze sonata-form exposition: FTG, TR, medial caesura, STG, CT',
    'Identify development techniques: fragmentation, sequence, false recapitulation, retransition',
    'Understand the recapitulation\'s tonal resolution and Beethoven\'s expanded coda',
    'Recognize concerto form as a double-exposition adaptation of sonata principles',
  ],
  concepts: [
    {
      title: 'Sonata Form: The Exposition',
      explanation:
        'The exposition contains a first theme group (FTG) in the tonic that establishes character and key, a modulatory transition (TR) that builds energy and shifts tonal center, a medial caesura (MC) — the dramatic pause marking arrival in the new key — a second theme group (STG) in the secondary key (typically V in major, III in minor) offering contrasting character, and closing material (CT) that reinforces the new key with potentially multiple closing ideas. The repeat sign at the end of the exposition is structurally significant: it ensures the listener internalizes the tonal polarity between tonic and dominant before the development dismantles it.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See the tonic key — home base of sonata form',
    },
    {
      title: 'Development and Recapitulation',
      explanation:
        'The development fragments themes into motives, deploys them in sequences across remote keys, may stage a false recapitulation (a deceptive return of the FTG in the wrong key), and builds a retransition on the dominant to prepare the return. The recapitulation restates all material in the tonic — critically, the STG now appears in the tonic, resolving the exposition\'s tonal tension. The TR is modified to avoid modulating away. Beethoven\'s codas often function as second developments, substantially extending the form with new thematic working and dramatic climaxes.',
      tryThisQuery: 'G7',
      tryThisLabel: 'Hear the dominant seventh — the chord that drives recapitulation',
    },
    {
      title: 'Concerto Form: Double Exposition',
      explanation:
        'Concerto form adapts sonata principles with a double exposition: the orchestral exposition presents both themes in the tonic, then the soloist\'s exposition restates the first theme in tonic and the second in the dominant, following standard sonata tonal logic. The development features solo-orchestral interplay. The recapitulation resolves both themes to the tonic. A cadenza — the soloist\'s unaccompanied virtuosic passage — typically precedes the final coda, originally improvised but increasingly written out from Beethoven onward.',
      tryThisQuery: 'circle of fifths',
      tryThisLabel: 'See the key relationships that sonata forms traverse',
    },
  ],
  tasks: [
    {
      id: 'l8u26m1t1',
      instruction:
        'Choose a Classical-era sonata movement (e.g., Mozart K.545, first movement). Create a formal timeline: label the FTG, TR, medial caesura, STG, CT, development, and recapitulation. At what measure does the STG appear in the tonic during the recapitulation?',
    },
    {
      id: 'l8u26m1t2',
      instruction:
        'In the development section, identify at least two developmental techniques: fragmentation, sequence, pedal point, or false recapitulation. What keys does the development pass through before the retransition?',
    },
    {
      id: 'l8u26m1t3',
      instruction:
        'Compare the transition (TR) in the exposition versus the recapitulation. How is the recapitulation\'s TR modified to keep the STG in the tonic? Does the composer simply cut the modulation or recompose the passage?',
    },
  ],
  prerequisites: ['l8u25m3'],

};

const l8u26m2: CurriculumModule = {
  id: 'l8u26m2',
  unitId: 'u26',
  levelId: 'l8',
  title: 'Variation, Rondo, and Ritornello Forms',
  subtitle: 'Theme and variations, chaconne, passacaglia, rondo, and ritornello',
  objectives: [
    'Distinguish sectional theme-and-variations from continuous variation forms',
    'Analyze chaconne (repeating harmonic pattern) and passacaglia (ground bass)',
    'Identify rondo forms (5-part, 7-part) and sonata-rondo hybrids',
    'Understand Baroque ritornello form and its relationship to rondo',
  ],
  concepts: [
    {
      title: 'Theme and Variations, Chaconne, and Passacaglia',
      explanation:
        'Variation forms include the sectional theme and variations (each variation is self-contained, separated by clear cadences), the chaconne (continuous variations over a repeating harmonic pattern, typically 4 or 8 bars), and the passacaglia (continuous variations over a repeating bass line — the ground bass). The distinction between chaconne and passacaglia is historically blurred, but the ground bass is the passacaglia\'s defining feature. In all variation forms, the compositional art lies in transforming melody, rhythm, texture, and register while maintaining an audible connection to the theme or pattern.',
      tryThisQuery: 'Am',
      tryThisLabel: 'Hear A minor — common key for chaconnes and passacaglias',
    },
    {
      title: 'Rondo Forms: Five-Part, Seven-Part, and Sonata-Rondo',
      explanation:
        'Rondo form features a recurring refrain (A) alternating with contrasting episodes: five-part rondo (A-B-A-C-A), seven-part (A-B-A-C-A-B-A or A-B-A-C-A-D-A). The refrain typically returns in the tonic each time, providing structural stability. Sonata-rondo hybridizes the two forms — A-B-A-development-A-B-A — combining rondo\'s structural clarity with sonata\'s developmental ambition. The B section returns in the tonic during the second half, mirroring sonata form\'s tonal resolution. This hybrid dominates Classical-era finales.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See C major — the tonic that each rondo refrain reaffirms',
    },
    {
      title: 'Ritornello Form',
      explanation:
        'Baroque ritornello form alternates a recurring orchestral passage (the ritornello) with solo episodes. The full ritornello appears in the tonic at the start and end; fragments of it return in different keys between solo episodes, creating a tonal journey. Conceptually similar to rondo but more fluid — the ritornello is rarely restated complete in the middle, and the solo episodes are more improvisatory. Vivaldi\'s concertos epitomize the form: bold opening ritornello, virtuosic solo passages, ritornello fragments in related keys, complete ritornello return at the close.',
      tryThisQuery: 'circle of fifths',
      tryThisLabel: 'See the key relationships that ritornello traverses',
    },
  ],
  tasks: [
    {
      id: 'l8u26m2t1',
      instruction:
        'Compare a chaconne (e.g., Bach\'s Chaconne in D minor for solo violin) with a theme-and-variations (e.g., Beethoven\'s "Diabelli" Variations). How does the continuous vs. sectional structure change the listening experience?',
    },
    {
      id: 'l8u26m2t2',
      instruction:
        'Listen to a sonata-rondo finale (e.g., Beethoven\'s "Pathetique" Sonata, third movement). Identify each return of the refrain (A) and label the episodes. Where does the "development" section occur within the rondo structure?',
    },
    {
      id: 'l8u26m2t3',
      instruction:
        'Listen to a Vivaldi concerto first movement (e.g., "Spring" from The Four Seasons). Map the ritornello returns: which key is each fragment in? How much of the original ritornello is restated each time?',
    },
  ],
  prerequisites: ['l8u26m1'],

};

const l8u26m3: CurriculumModule = {
  id: 'l8u26m3',
  unitId: 'u26',
  levelId: 'l8',
  title: 'Orchestration and Instrumentation Awareness',
  subtitle: 'Orchestral families, ranges, timbres, and transposition',
  objectives: [
    'Know the four orchestral families and their characteristics',
    'Identify instrument ranges and timbres',
    'Understand transposing instruments in orchestral context',
  ],
  concepts: [
    {
      title: 'The Four Orchestral Families',
      explanation:
        'Strings (violin, viola, cello, double bass) form the orchestra\'s backbone — they sustain, articulate, and span the widest dynamic range through techniques like pizzicato, tremolo, harmonics, and col legno. Woodwinds (flute, oboe, clarinet, bassoon and their auxiliaries) contribute distinct timbral colors and excel in melodic writing. Brass (horn, trumpet, trombone, tuba) deliver power and brilliance, dominating climaxes. Percussion divides into pitched (timpani, xylophone, glockenspiel, vibraphone, marimba, celesta) and unpitched (snare drum, bass drum, cymbals, triangle), providing rhythmic definition, color, and structural punctuation.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See the range — strings span nearly this entire keyboard',
    },
    {
      title: 'Transposing Instruments and Score Reading',
      explanation:
        'A transposing instrument\'s written C sounds as a different pitch. Clarinet in Bb sounds a major second lower than written; horn in F sounds a perfect fifth lower; trumpet in Bb sounds a major second lower. To read a transposing score at concert pitch, reverse the transposition: for a Bb clarinet, transpose the written part down a major second (or read it a second lower). Standard orchestral score order from top to bottom: flutes, oboes, clarinets, bassoons, horns, trumpets, trombones, tuba, timpani, percussion, harp, violins I & II, violas, cellos, double basses.',
      tryThisQuery: 'key of Bb',
      tryThisLabel: 'See Bb — the concert pitch when a Bb clarinet reads C',
    },
    {
      title: 'Orchestral Texture and Doubling',
      explanation:
        'Orchestration is the art of distributing musical ideas across the ensemble for maximum effect. Octave doubling (e.g., flute and violin an octave apart) thickens a melody without changing its character. Unison doubling (e.g., oboe and violin at the same pitch) blends timbres to create a composite color unavailable from either instrument alone. Choir scoring assigns a complete chord to one family (a brass chorale or woodwind choir). The choice of which instrument carries the melody, which provides harmonic fill, and which supplies rhythmic energy defines the character of every orchestral passage.',
      tryThisQuery: 'key of F',
      tryThisLabel: 'See F major — the sounding key of a horn reading in C',
    },
  ],
  tasks: [
    {
      id: 'l8u26m3t1',
      instruction:
        'Examine an orchestral score page (e.g., Beethoven Symphony No. 5, first page). Identify the score order — which instruments are at the top, which at the bottom? Which instruments are transposing?',
    },
    {
      id: 'l8u26m3t2',
      instruction:
        'A clarinet in Bb plays a written D. What pitch sounds at concert? (Answer: C — a major 2nd lower.) Now: a horn in F plays a written G. What concert pitch sounds? (Answer: C — a perfect 5th lower.)',
    },
    {
      id: 'l8u26m3t3',
      instruction:
        'Listen to the opening of Ravel\'s "Bolero." Each repetition of the theme uses a different instrument or combination. List the timbral changes across the first five statements. How does Ravel use doubling to build intensity?',
    },
  ],
  prerequisites: ['l8u26m2'],

};

// ---------------------------------------------------------------------------
// Level 8, Unit 27: Post-Tonal and Contemporary (5 modules)
// ---------------------------------------------------------------------------

const l8u27m1: CurriculumModule = {
  id: 'l8u27m1',
  unitId: 'u27',
  levelId: 'l8',
  title: 'Pitch-Class Sets and Set Theory',
  subtitle: 'Pitch class, interval class, normal order, prime form, ICV, and Forte numbers',
  objectives: [
    'Understand pitch class and the integer notation system (0-11)',
    'Calculate interval class (IC) and the interval class vector (ICV)',
    'Find normal order and prime form of pitch-class sets',
    'Identify sets by their Forte catalog numbers',
  ],
  concepts: [
    {
      title: 'Pitch Class, Integer Notation, and Interval Class',
      explanation:
        'Post-tonal theory collapses all octave-equivalent pitches into 12 pitch classes numbered 0 through 11 (C=0, C#/Db=1, D=2, ... B=11). Enharmonic spellings become irrelevant — F# and Gb are both pitch class 6. Interval class (IC) measures the shortest distance between two pitch classes on the mod-12 clock: the interval between PC 0 and PC 4 is IC 4 (not 8, because we take the smaller complement). IC values range from 1 to 6, since any interval larger than 6 semitones has a smaller complement. This stripping away of octave, spelling, and directional distinctions reveals the abstract intervallic skeleton of any sonority.',
      tryThisQuery: 'C chromatic scale',
      tryThisLabel: 'See all 12 pitch classes laid out chromatically',
    },
    {
      title: 'Pitch-Class Sets: Normal Order and Prime Form',
      explanation:
        'A pitch-class set is an unordered collection of distinct pitch classes — the post-tonal equivalent of a chord. Normal order is the most compact ascending arrangement: rotate the set until the span from first to last element is smallest (using left-packing to break ties). Prime form transposes the normal order to start on 0, then compares with the inversion to select whichever is more tightly packed to the left. {C, E, G} has normal order [0,4,7]; its inversion gives [0,3,7], which is more tightly left-packed, so prime form = [0,3,7]. {D, F, A} reduces directly to [0,3,7]. Allen Forte\'s catalog assigns each prime form a number — 3-11 for [0, 3, 7] — creating a universal classification system for post-tonal sonorities. Two packing conventions exist — Forte\'s "packed to the left" (used here) and Rahn\'s "packed from the right" — and they disagree for a handful of set classes (none used in this level).',
      tryThisQuery: 'Cm',
      tryThisLabel: 'See C minor — Forte set 3-11, prime form [0,3,7]',
    },
    {
      title: 'Interval Class Vector and Z-Relations',
      explanation:
        'The interval class vector (ICV) is a six-digit fingerprint counting every IC present in a set. For [0, 4, 7] (major triad), the ICV is <0,0,1,1,1,0>: one IC3, one IC4, one IC5. Two sets with identical ICVs but different prime forms are Z-related — structurally distinct, yet sharing exactly the same interval content. Z-related pairs are relatively rare in the catalog and are a central curiosity of set theory. The ICV provides an efficient way to compare the sonorous character of sets: sets with similar ICVs share harmonic "color" even if their pitch-class content differs entirely.',
      tryThisQuery: 'C major chord',
      tryThisLabel: 'See the major triad — ICV <0,0,1,1,1,0>',
    },
  ],
  tasks: [
    {
      id: 'l8u27m1t1',
      instruction:
        'Convert the following notes to pitch-class integers: E, Bb, F#, C. (Answers: 4, 10, 6, 0.) Now find the interval class between each adjacent pair. What is the IC between 4 and 10? (Answer: 6 — the tritone.)',
    },
    {
      id: 'l8u27m1t2',
      instruction:
        'Take the set {C, Db, E} = {0, 1, 4}. Find the normal order by trying all rotations: [0,1,4] (span 4), [1,4,0]=[1,4,12] (span 11), [4,0,1]=[4,12,13] (span 9). Normal order is [0,1,4]. Is this also the prime form? Compare with the inversion: [0,11,8] normalized to [0,3,4] — which is more left-packed?',
    },
    {
      id: 'l8u27m1t3',
      instruction:
        'Compute the interval class vector for set [0, 1, 4]: pairs are (0,1)=IC1, (0,4)=IC4, (1,4)=IC3. ICV = <1,0,1,1,0,0>. Now do the same for [0, 3, 4] and verify you get the identical ICV. This is expected — [0,3,4] is the inversion of [0,1,4], so they belong to the same set class (3-3). The Z-relation is when two sets share an interval vector without being related by transposition or inversion; the smallest true Z-pair is 4-Z15 [0,1,4,6] and 4-Z29 [0,1,3,7].',
    },
  ],
  prerequisites: ['l8u26m3'],

};

const l8u27m2: CurriculumModule = {
  id: 'l8u27m2',
  unitId: 'u27',
  levelId: 'l8',
  title: 'Twelve-Tone Technique',
  subtitle: 'Tone rows, P/R/I/RI forms, the twelve-tone matrix, and combinatoriality',
  objectives: [
    'Construct a twelve-tone row using all 12 pitch classes exactly once',
    'Derive all four row forms: Prime (P), Retrograde (R), Inversion (I), Retrograde-Inversion (RI)',
    'Build and read a 12x12 twelve-tone matrix',
    'Understand combinatoriality and hexachordal aggregate completion',
  ],
  concepts: [
    {
      title: 'The Tone Row and Its Four Forms',
      explanation:
        'In twelve-tone (serial) composition, all 12 pitch classes are ordered into a specific sequence — the tone row. This row is the raw material for the entire composition: melody, harmony, and counterpoint all derive from it. The row is manipulated through four transformations: Prime (P) — the original row; Retrograde (R) — the row played backwards; Inversion (I) — each interval flipped, ascending becomes descending; Retrograde Inversion (RI) — the inversion played backwards. These four operations preserve the row\'s intervallic DNA while generating maximally diverse melodic shapes.',
      tryThisQuery: 'C chromatic scale',
      tryThisLabel: 'See all 12 pitch classes — the raw material of a tone row',
    },
    {
      title: 'The Twelve-Tone Matrix',
      explanation:
        'Each of the four row forms can be transposed to start on any of the 12 pitch classes, yielding 48 row forms total (P0-P11, R0-R11, I0-I11, RI0-RI11). These are organized into a 12x12 matrix: P forms read left to right, R forms read right to left, I forms read top to bottom, and RI forms read bottom to top. The matrix is the composer\'s complete toolkit — every possible serial derivation of the row is visible at a glance. Webern favored rows with high internal symmetry, where some forms are identical to others, effectively reducing the 48 to fewer distinct series.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'See 7 of the 12 pitch classes — a row uses all 12',
    },
    {
      title: 'Combinatoriality and Hexachordal Completion',
      explanation:
        'Combinatoriality is a row property where the first hexachord (first 6 notes) of one row form and the first hexachord of a specific other row form together produce all 12 pitch classes — an aggregate. This ensures harmonic completeness when two row forms sound simultaneously, avoiding pitch-class duplication. All-combinatorial rows (like Babbitt\'s) achieve aggregate completion under P, I, R, and RI relationships. Schoenberg\'s later works exploit combinatoriality to control the vertical (harmonic) dimension of serial music, not just the horizontal (melodic).',
      tryThisQuery: 'C diminished 7th chord',
      tryThisLabel: 'Hear a symmetrical chord — serial rows prize symmetry',
    },
  ],
  tasks: [
    {
      id: 'l8u27m2t1',
      instruction:
        'Create your own 12-tone row by ordering all integers 0-11 without repetition. Set P0 to begin on pitch class 0 for this exercise. Write your P0. Now derive R0 (reverse the order), I0 (subtract each element from 12, mod 12), and RI0 (reverse the inversion).',
    },
    {
      id: 'l8u27m2t2',
      instruction:
        'Using your P0, build the first two rows of a 12-tone matrix. Row 1 is P0 itself. Row 2 starts on I0\'s second pitch class: transpose P to start on that pitch class (add a constant mod 12 to each element of P0). Verify that column 1 reads the I0 form top to bottom.',
    },
    {
      id: 'l8u27m2t3',
      instruction:
        'Check your row for combinatoriality: list the first 6 pitch classes of P0. Now list the first 6 pitch classes of I5 (or another inversion). Do the two hexachords together contain all 12 pitch classes with no duplicates? If not, try a different transposition of I.',
    },
  ],
  prerequisites: ['l8u27m1'],

};

const l8u27m3: CurriculumModule = {
  id: 'l8u27m3',
  unitId: 'u27',
  levelId: 'l8',
  title: '20th-Century Techniques: Planing, Polytonality, Pandiatonicism',
  subtitle: 'Quartal harmony, parallel motion, bitonality, and free diatonicism',
  objectives: [
    'Identify quartal/quintal harmony as a complete harmonic language',
    'Distinguish chromatic planing from diatonic planing',
    'Recognize polytonality, polymodality, and pandiatonicism in context',
  ],
  concepts: [
    {
      title: 'Quartal/Quintal Harmony and Planing',
      explanation:
        'Quartal harmony builds chords from stacked perfect fourths rather than thirds, producing sonorities that are neither major nor minor — open, ambiguous, and characteristic of Hindemith, Bartok, and Copland. Quintal harmony uses stacked fifths (inversionally equivalent to fourths). Planing moves an entire chord structure in parallel: chromatic planing transposes every note by the same number of semitones (preserving exact chord quality), while diatonic planing moves within a scale (changing quality to fit the key). Debussy\'s parallel ninth chords and Ravel\'s parallel triads exemplify planing as a structural harmonic technique, not merely a coloristic device.',
      tryThisQuery: 'whole tone scale',
      tryThisLabel: 'Hear the whole tone scale — pure symmetric territory for planing',
    },
    {
      title: 'Polytonality, Polymodality, and Pandiatonicism',
      explanation:
        'Polytonality layers two or more keys simultaneously — Milhaud\'s bitonality might place C major in the right hand against F# major in the left, creating a dense, shimmering sonority that is neither tonal nor atonal. Polymodality superimposes different modes on the same tonic: C Lydian in the melody with C Mixolydian in the accompaniment produces nine distinct pitch classes \u2014 the standard seven plus F# (from Lydian) and Bb (from Mixolydian) \u2014 with conflicting modal inflections across voices. Pandiatonicism uses all notes of a diatonic scale freely, discarding functional harmonic rules — any combination is valid, producing music that sounds tonal but resists resolution. Stravinsky\'s neoclassical works epitomize this technique.',
      tryThisQuery: 'C augmented chord',
      tryThisLabel: 'Hear C augmented — the whole-tone triad, no tonal center',
    },
    {
      title: 'Microtonality and Spectral Awareness',
      explanation:
        'Microtonality extends the pitch continuum beyond 12 equal divisions: quarter tones divide each semitone in half (24 notes per octave), just intonation tunes intervals to pure frequency ratios, and spectral tuning, pioneered by Gérard Grisey and Tristan Murail, derives intervals from the overtone series. Alternative equal temperaments — 19-TET, 31-TET, 53-TET — offer different compromises between consonance and flexibility. While the app\'s engine operates in standard 12-TET, awareness of microtonal systems reveals that the 12-note chromatic scale is a historical convention, not an acoustic inevitability.',
      tryThisQuery: 'C chromatic scale',
      tryThisLabel: 'Hear the 12-TET chromatic scale — one of many possible divisions',
    },
  ],
  tasks: [
    {
      id: 'l8u27m3t1',
      instruction:
        'Build a quartal chord on C: stack fourths (C-F-Bb-Eb). Compare its sound to a C major triad. The quartal chord has no clear major or minor quality — describe its character in your own words.',
    },
    {
      id: 'l8u27m3t2',
      instruction:
        'Play a C whole tone scale, then a C diminished (octatonic) scale. Both are symmetric — the whole tone divides the octave into 6 equal steps, the octatonic alternates whole and half steps. Neither has a dominant or leading tone. How does this affect the sense of tonal gravity?',
    },
    {
      id: 'l8u27m3t3',
      instruction:
        'Imagine playing a C major triad in the right hand and an F# major triad in the left hand simultaneously. List the pitch classes in both triads; how many are distinct? (This is Petrushka\'s famous bitonal chord.)',
    },
  ],
  prerequisites: ['l8u27m2'],
};

const l8u27m4: CurriculumModule = {
  id: 'l8u27m4',
  unitId: 'u27',
  levelId: 'l8',
  title: 'Minimalism, Aleatory, and Extended Techniques',
  subtitle: 'Phase shifting, additive process, chance music, and new sonic resources',
  objectives: [
    'Understand minimalist compositional processes: phase shifting, additive process, pulse-based evolution',
    'Distinguish Cage\'s chance operations from Lutoslawski\'s controlled aleatory',
    'Recognize extended techniques: prepared piano, multiphonics, sprechstimme',
    'Survey mobile form and indeterminate notation at awareness level',
  ],
  concepts: [
    {
      title: 'Minimalism: Phase Shifting and Additive Process',
      explanation:
        'Minimalism employs repetitive structures that evolve gradually. Steve Reich\'s phase shifting starts two identical patterns in perfect sync, then nudges one slightly ahead — the resulting interference patterns create constantly shifting rhythmic and melodic relationships until the two parts eventually realign. Philip Glass\'s additive process expands patterns by adding notes incrementally: a 4-note cell becomes 5, then 6, then 8, building complexity from the simplest possible starting material. Pulse-based minimalism (La Monte Young, Terry Riley) sustains a steady rhythmic pulse while harmony evolves slowly over long time spans, transforming the listener\'s perception of time itself.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Play a repeating pattern from these notes — minimalism\'s raw material',
    },
    {
      title: 'Aleatory and Chance Music',
      explanation:
        'Aleatory (chance music) introduces indeterminacy into composition or performance. John Cage used I Ching operations, coin tosses, and star charts to determine pitches, durations, and dynamics — removing the composer\'s subjective choices entirely. Witold Lutoslawski developed controlled aleatory: performers choose freely within defined boundaries (pitch content fixed, rhythm free), creating passages of controlled chaos. Mobile form (Stockhausen\'s Klavierstuck XI, Boulez\'s Third Piano Sonata) lets performers play sections in any order, so each performance creates a unique formal trajectory. These approaches questioned the very definition of a musical "work."',
      tryThisQuery: 'C chromatic scale',
      tryThisLabel: 'See all 12 pitch classes — aleatory draws from the full spectrum',
    },
    {
      title: 'Extended Techniques',
      explanation:
        'Extended techniques transform instruments beyond their conventional sound palette. Prepared piano (John Cage) places bolts, screws, rubber, and felt between strings, converting the piano into a one-person percussion ensemble with unpredictable timbres. Multiphonics coax multiple simultaneous pitches from a single wind instrument through specialized fingering and embouchure. Sul ponticello (bowing near the bridge) and col legno (striking with the wood of the bow) radically alter string timbre. Sprechstimme (half-sung, half-spoken vocal delivery, developed by Schoenberg) inhabits the territory between speech and song. These techniques redefined what constitutes musical material itself.',
      tryThisQuery: 'C diminished scale',
      tryThisLabel: 'Hear the octatonic scale — Bartok and Stravinsky\'s resource',
    },
  ],
  tasks: [
    {
      id: 'l8u27m4t1',
      instruction:
        'Clap a simple 4-note rhythmic pattern in a steady loop. Now imagine a second person clapping the same pattern, but gradually speeding up by a tiny amount. What happens to the composite rhythm over 30 seconds? This is phase shifting.',
    },
    {
      id: 'l8u27m4t2',
      instruction:
        'Design a 3-note melodic cell (e.g., C-E-G). Now apply additive process: play C-E (2 notes), then C-E-G (3 notes), then C-E-G-E (4 notes), then C-E-G-E-C (5 notes). How does the pattern\'s character change as it grows?',
    },
    {
      id: 'l8u27m4t3',
      instruction:
        'Write 4 short musical fragments (2-4 notes each) on index cards. Shuffle the cards and play them in whatever order they appear. Repeat with a different shuffle. How does the form change? This is a simplified mobile form.',
    },
  ],
  prerequisites: ['l8u27m3'],
};

const l8u27m5: CurriculumModule = {
  id: 'l8u27m5',
  unitId: 'u27',
  levelId: 'l8',
  title: 'Advanced Rhythm: Polyrhythm, Hemiola, Metric Modulation',
  subtitle: 'Complex tuplets, cross-rhythms, polyrhythm, and metric modulation',
  objectives: [
    'Execute and hear complex tuplets and cross-rhythms',
    'Understand polyrhythm vs. polymeter',
    'Recognize hemiola and metric modulation',
  ],
  concepts: [
    {
      title: 'Complex Tuplets and Cross-Rhythms',
      explanation:
        'Beyond simple triplets, complex tuplets subdivide beats into quintuplets (5 in the space of 4), septuplets (7:4 or 7:6), and nested tuplets (triplets within triplets, yielding 9 subdivisions). Cross-rhythms layer different groupings simultaneously: 3-against-2 (three even notes in one voice against two in another), 4-against-3, or 5-against-4. The key perceptual insight is that cross-rhythms create rhythmic dissonance analogous to harmonic dissonance — the conflicting pulse streams generate tension that resolves when they realign on a shared downbeat. This principle underlies much of Chopin\'s rubato, Brahms\'s rhythmic complexity, and virtually all sub-Saharan African drumming.',
      tryThisQuery: 'C major scale',
      tryThisLabel: 'Play the scale — try grouping notes in 3s then 2s',
    },
    {
      title: 'Polyrhythm vs. Polymeter and Hemiola',
      explanation:
        'Polyrhythm and polymeter are often confused but structurally distinct. Polyrhythm layers different rhythmic groupings within a shared meter — the downbeats still align (3-against-2 within a single bar of 6/8). Polymeter layers different meters simultaneously — one voice in 3/4 against another in 4/4 — so downbeats diverge and realign only at the lowest common multiple (every 12 beats). Hemiola is a specific and historically ubiquitous cross-rhythm: two bars of triple meter (3+3) reinterpreted as three groups of duple (2+2+2), or vice versa in compound time. Hemiola pervades Handel, Brahms, and Latin American music, creating a momentary metric ambiguity that energizes cadential and transitional passages.',
      tryThisQuery: 'A harmonic minor scale',
      tryThisLabel: 'Play in groups of 2, then 3 — feel the cross-rhythm',
    },
    {
      title: 'Metric Modulation and Additive Rhythm',
      explanation:
        'Metric modulation (Elliott Carter\'s signature technique) uses a shared rhythmic value to pivot between tempos with mathematical precision. If triplet eighth notes in the old tempo become regular eighth notes in the new tempo, the new tempo is exactly 3/2 of the old. Quintuplet-based modulations yield 5:4 ratios; the technique chains to traverse multiple tempos. Additive rhythms build patterns from unequal groupings — 2+2+3, 3+2+2+3 — producing asymmetric meters central to Balkan music (aksak), Bartok, Stravinsky, and progressive rock. Irrational time signatures (e.g., 4/3, 5/6) extend this logic further, specifying tempo relationships rather than traditional beat divisions.',
      tryThisQuery: 'D dorian scale',
      tryThisLabel: 'Play the Dorian mode — try accenting every 5th note',
    },
  ],
  tasks: [
    {
      id: 'l8u27m5t1',
      instruction:
        'Clap a steady pulse of 4 beats. Now try fitting 3 evenly-spaced claps into the same span with your other hand. Where do the hands coincide? (Only on beat 1.) This is the fundamental 3-against-2 cross-rhythm — the basis of all polyrhythmic complexity.',
    },
    {
      id: 'l8u27m5t2',
      instruction:
        'Take a passage in 3/4 time and count 6 beats across two bars (1-2-3-1-2-3). Now regroup those same 6 beats as 2+2+2. The melody that was in triple meter is now perceived in duple — you have created a hemiola. Where does this appear in music you know?',
    },
    {
      id: 'l8u27m5t3',
      instruction:
        'Calculate a metric modulation: if the current tempo is quarter note = 120 BPM and triplet eighth notes become the new eighth note, what is the new tempo? (The triplet eighth = 1/3 of a quarter = 360 per minute. As the new eighth, two of them = one new quarter, so the new quarter = 180 BPM. Ratio: 3:2.)',
    },
  ],
  prerequisites: ['l8u27m4'],

};

// ---------------------------------------------------------------------------
// Exported units
// ---------------------------------------------------------------------------

export const L8_UNITS: CurriculumUnit[] = [
  {
    id: 'u25',
    levelId: 'l8',
    title: 'Fugue and Imitative Forms',
    description: 'Fugue analysis, canon types, and imitative compositional techniques',
    icon: 'harmony',
    modules: [l8u25m1, l8u25m2, l8u25m3],
    milestone: {
      skillsSummary: [
        'Analyze fugue exposition: subject, answer (real vs. tonal), and countersubject',
        'Identify episodes, stretto, augmentation, diminution, and inversion in fugues',
        'Classify canons by interval, transformation type, and degree of strictness',
      ],
      bridgeText:
        'You can now dissect the most sophisticated contrapuntal forms in Western music. Next: large-scale formal analysis and the orchestral palette.',
      tryThisQuery: 'key of C',
      tryThisLabel: 'See C major — the key of Bach\'s first WTC fugue',
      tryThisPrompt: 'How many voices does the C major fugue from WTC Book I use?',
    },
  },
  {
    id: 'u26',
    levelId: 'l8',
    title: 'Large Form and Orchestration',
    description: 'Advanced formal analysis, orchestral families, and instrumentation',
    icon: 'scales',
    modules: [l8u26m1, l8u26m2, l8u26m3],
    milestone: {
      skillsSummary: [
        'Analyze sonata form in full detail: FTG, TR, STG, CT, development, and recapitulation',
        'Distinguish variation structures: theme-and-variations, chaconne, passacaglia, rondo, and ritornello',
        'Identify orchestral families, instrument ranges, and transposing instruments',
      ],
      bridgeText:
        'You now command the analytical vocabulary for the largest forms and the full orchestra. The final unit crosses the boundary from tonal to post-tonal music.',
      tryThisQuery: 'G7',
      tryThisLabel: 'Hear G7 — the dominant that launches a recapitulation',
      tryThisPrompt: 'In a sonata in C major, what key does the STG typically appear in during the exposition?',
    },
  },
  {
    id: 'u27',
    levelId: 'l8',
    title: 'Post-Tonal and Contemporary',
    description: 'Set theory, twelve-tone technique, and twentieth-century compositional methods',
    icon: 'chords',
    modules: [l8u27m1, l8u27m2, l8u27m3, l8u27m4, l8u27m5],
    milestone: {
      skillsSummary: [
        'Analyze pitch-class sets using integer notation, normal order, prime form, and interval vectors',
        'Construct twelve-tone rows, derive all 48 forms, and build a matrix',
        'Identify planing, polytonality, pandiatonicism, and minimalist processes',
        'Distinguish polyrhythm from polymeter, recognize hemiola, and calculate metric modulations',
      ],
      bridgeText: '',
      tryThisQuery: 'C whole tone scale',
      tryThisLabel: 'Hear the whole tone scale — beyond tonality',
      tryThisPrompt: 'How many transpositions of the whole tone scale exist? (Answer: only 2.)',
    },
  },
];
