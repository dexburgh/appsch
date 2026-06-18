const enneagram = {
  1: {
    name: 'The Reformer',
    coreSentence: 'To do what’s right and improve the world.',
    funFact: 'Type 1s often become conscientious advocates.',
    compatibility: {
      best: ['9', '2'],
      challenging: ['8', '7'],
    },
    growthTip: 'Allow yourself to rest; imperfection is part of life.',
    poeticImagery: 'A blank canvas forgiving each brushstroke.',
  },
  2: {
    name: 'The Helper',
    coreSentence: 'To feel loved and needed by helping others.',
    funFact: 'Type 2s often sense emotional needs before others.',
    compatibility: {
      best: ['8', '4'],
      challenging: ['5', '7'],
    },
    growthTip: 'Pause and ask: what do *I* need right now?',
    poeticImagery: 'Outstretched hands longing for return.',
  },
  3: {
    name: 'The Achiever',
    coreSentence: 'To be seen as valuable through achievement.',
    funFact: 'Type 3s adjust image to meet expectations.',
    compatibility: {
      best: ['9', '6'],
      challenging: ['4', '8'],
    },
    growthTip: 'Rest your value in being, not doing.',
    poeticImagery: 'An arrow paused mid-flight, breathing.',
  },
  4: {
    name: 'The Individualist',
    coreSentence: 'To express uniqueness and emotional depth.',
    funFact: 'Type 4s often feel different from others.',
    compatibility: {
      best: ['5', '2'],
      challenging: ['3', '6'],
    },
    growthTip: 'Balance longing with gratitude for now.',
    poeticImagery: 'A single wildflower under storm skies.',
  },
  5: {
    name: 'The Investigator',
    coreSentence: 'To understand, observe, and maintain autonomy.',
    funFact: 'Type 5s often conserve energy and retreat.',
    compatibility: {
      best: ['4', '9'],
      challenging: ['2', '7'],
    },
    growthTip: 'Share your inner world — vulnerability builds connection.',
    poeticImagery: 'A lighthouse watching distant seas.',
  },
  6: {
    name: 'The Loyalist',
    coreSentence: 'To find security, support, and certainty.',
    funFact: 'Type 6s sense risk others often miss.',
    compatibility: {
      best: ['9', '3'],
      challenging: ['7', '8'],
    },
    growthTip: 'Trust yourself; not everything is threat.',
    poeticImagery: 'A sentinel at dusk, vigilant yet hopeful.',
  },
  7: {
    name: 'The Enthusiast',
    coreSentence: 'To pursue joy, novelty, and avoid constraints.',
    funFact: 'Type 7s juggle projects to avoid boredom.',
    compatibility: {
      best: ['2', '9'],
      challenging: ['1', '6'],
    },
    growthTip: 'Commit to one path even with discomfort.',
    poeticImagery: 'A spark tracing open horizons.',
  },
  8: {
    name: 'The Challenger',
    coreSentence: 'To be strong, protect, and resist weakness.',
    funFact: 'Type 8s often lead by taking charge.',
    compatibility: {
      best: ['2', '9'],
      challenging: ['1', '4'],
    },
    growthTip: 'Let your boundaries breathe with softness.',
    poeticImagery: 'An oak bending in fierce wind.',
  },
  9: {
    name: 'The Peacemaker',
    coreSentence: 'To maintain inner peace and harmony.',
    funFact: 'Type 9s often merge with others and lose their voice.',
    compatibility: {
      best: ['3', '6'],
      challenging: ['4', '8'],
    },
    growthTip: 'Speak your truth — your silence hides your path.',
    poeticImagery: 'A calm pond stirred by silent wind.',
  },
};

const attachment = {
  Secure: {
    name: 'Secure',
    coreSentence: 'You feel comfortable with intimacy and independence.',
    funFact: 'Secure attachment supports stable relationships.',
    compatibility: {
      best: ['Secure', 'Anxious'],
      challenging: ['Avoidant', 'Fearful‑Avoidant'],
    },
    growthTip: 'Continue modeling healthy vulnerability & boundaries.',
    poeticImagery: 'A sturdy bridge spanning two shores.',
  },
  Anxious: {
    name: 'Anxious / Preoccupied',
    coreSentence: 'You worry about abandonment and seek closeness.',
    funFact: 'Anxious folks often monitor relational cues intently.',
    compatibility: {
      best: ['Secure', 'Avoidant (balanced)'],
      challenging: ['Fearful‑Avoidant', 'Anxious'],
    },
    growthTip: 'Pause before reacting — ask, “What do I need?”',
    poeticImagery: 'A hummingbird fluttering near a blossom.',
  },
  Avoidant: {
    name: 'Avoidant / Dismissive',
    coreSentence: 'You prefer emotional distance and self-reliance.',
    funFact: 'Avoidants often suppress or downplay needs.',
    compatibility: {
      best: ['Secure', 'Anxious (if boundaries honored)'],
      challenging: ['Anxious', 'Fearful‑Avoidant'],
    },
    growthTip: 'Practice small emotional disclosure and trust.',
    poeticImagery: 'A lone lighthouse watching the sea.',
  },
  'Fearful‑Avoidant': {
    name: 'Fearful‑Avoidant / Disorganized',
    coreSentence: 'You both want closeness and fear it intensely.',
    funFact: 'This style often stems from conflicting early experiences.',
    compatibility: {
      best: ['Secure (with patience)', 'Anxious (stable)'],
      challenging: ['Avoidant', 'Fearful‑Avoidant'],
    },
    growthTip: 'Ground yourself before engaging in intimacy.',
    poeticImagery: 'A river branching between sea and storm.',
  },
};

const mbti = {
  INTJ: {
    name: 'The Architect',
    coreSentence: 'You value insight, structure, and future vision.',
    funFact: 'INTJs are relatively rare and often seen as strategists.',
    compatibility: {
      best: ['ENFP', 'ENTP'],
      challenging: ['ESFP', 'ISFJ'],
    },
    growthTip: 'Balance logic with relational warmth.',
    poeticImagery: 'A telescope mapping stars unseen by others.',
  },
  INTP: {
    name: 'The Thinker',
    coreSentence: 'You savor ideas, frameworks, and theoretical exploration.',
    funFact: 'INTPs often hold multiple possibilities open.',
    compatibility: {
      best: ['ENTJ', 'ENFJ'],
      challenging: ['ESFJ', 'ISFJ'],
    },
    growthTip: 'Translate insights into actionable clarity.',
    poeticImagery: 'A quiet library of thoughts waiting to be activated.',
  },
  ENTJ: {
    name: 'The Commander',
    coreSentence: 'You lead, organize, and drive progress.',
    funFact: 'ENTJs often take charge in systems and groups.',
    compatibility: {
      best: ['INTP', 'INFJ'],
      challenging: ['ISFP', 'INFP'],
    },
    growthTip: 'Lead with humility as well as direction.',
    poeticImagery: 'A chessboard king mapping moves ahead.',
  },
  ENTP: {
    name: 'The Debater',
    coreSentence: 'You explore ideas, challenge norms, and pivot often.',
    funFact: 'ENTPs argue both sides to refine truth.',
    compatibility: {
      best: ['INFJ', 'INTJ'],
      challenging: ['ISFJ', 'ISTJ'],
    },
    growthTip: 'Decide when to debate and when to commit.',
    poeticImagery: 'A prism splitting thoughts into possibility.',
  },
  INFJ: {
    name: 'The Advocate',
    coreSentence: 'You seek meaning and growth, helping others along the way.',
    funFact: 'INFJs are visionaries and empathic guides.',
    compatibility: {
      best: ['ENFP', 'ENTP'],
      challenging: ['ESTP', 'ESFP'],
    },
    growthTip: 'Set boundaries to protect your energy.',
    poeticImagery: 'A subtle compass rose pointing inward and outward.',
  },
  INFP: {
    name: 'The Mediator',
    coreSentence: 'You live by values, empathy, and inner authenticity.',
    funFact: 'INFPs often feel a calling beyond themselves.',
    compatibility: {
      best: ['ENFJ', 'ESFJ'],
      challenging: ['ESTJ', 'ENTJ'],
    },
    growthTip: 'Manifest your values in visible acts.',
    poeticImagery: 'A gently flowing river shaping quiet terrain.',
  },
  ENFJ: {
    name: 'The Protagonist',
    coreSentence: 'You inspire, unify, and help others grow.',
    funFact: 'ENFJs often become leaders of people’s potential.',
    compatibility: {
      best: ['INFP', 'INTP'],
      challenging: ['ISTP', 'ISFP'],
    },
    growthTip: 'Let others lead and share the stage.',
    poeticImagery: 'A lighthouse beacon drawing diverse vessels.',
  },
  ENFP: {
    name: 'The Campaigner',
    coreSentence: 'You chase possibility, connection, and meaning.',
    funFact: 'ENFPs pivot often while chasing a deeper path.',
    compatibility: {
      best: ['INFJ', 'INTJ'],
      challenging: ['ISTJ', 'ISFJ'],
    },
    growthTip: 'Anchor your passion in choices, not many directions.',
    poeticImagery: 'A kite dancing in crosswinds of ideas.',
  },
  ISTJ: {
    name: 'The Logistician',
    coreSentence: 'You value order, reliability, and tradition.',
    funFact: 'ISTJs excel at systems, plans, and follow-through.',
    compatibility: {
      best: ['ESFP', 'ESTP'],
      challenging: ['ENFP', 'ENTP'],
    },
    growthTip: 'Allow flexibility and emotion to soften structure.',
    poeticImagery: 'A carefully kept ledger in candlelight.',
  },
  ISFJ: {
    name: 'The Defender',
    coreSentence: 'You support, protect, and nurture others quietly.',
    funFact: 'ISFJs remember personal details that others forget.',
    compatibility: {
      best: ['ESTP', 'ESFP'],
      challenging: ['ENTP', 'ENFP'],
    },
    growthTip: 'Express your own needs gently and clearly.',
    poeticImagery: 'A hearth glowing in the heart’s room.',
  },
  ESTJ: {
    name: 'The Executive',
    coreSentence: 'You lead with responsibility, structure, and decisiveness.',
    funFact: 'ESTJs often become pillars in organizations.',
    compatibility: {
      best: ['ISFJ', 'ISTJ'],
      challenging: ['INFP', 'ENFP'],
    },
    growthTip: 'Allow space for spontaneity and relationship.',
    poeticImagery: 'A carved oak door opening confidently.',
  },
  ESFJ: {
    name: 'The Consul',
    coreSentence: 'You build harmony and care for others’ wellbeing.',
    funFact: 'ESFJs sense needs often before they’re spoken.',
    compatibility: {
      best: ['INFP', 'ISFP'],
      challenging: ['INTP', 'ENTP'],
    },
    growthTip: 'Balance caring for others with caring for you.',
    poeticImagery: 'A living room filled with warm voices.',
  },
  ESTP: {
    name: 'The Dynamo',
    coreSentence: 'You live in action, respond quickly to challenge.',
    funFact: 'ESTPs often learn by doing rather than planning.',
    compatibility: {
      best: ['ISFJ', 'ISTJ'],
      challenging: ['INFJ', 'INFP'],
    },
    growthTip: 'Pause occasionally to reflect and recharge.',
    poeticImagery: 'A rapid river leaping over stones.',
  },
  ISFP: {
    name: 'The Composer',
    coreSentence: 'You express through senses, passion, and aesthetic harmony.',
    funFact: 'ISFPs live in a rich internal world of beauty.',
    compatibility: {
      best: ['ENFJ', 'ESFJ'],
      challenging: ['ENTJ', 'ESTJ'],
    },
    growthTip: 'Speak your vision — it\'s valuable to others.',
    poeticImagery: 'A single brushstroke across a blank canvas.',
  },
};

const DEFAULT_PERSONALITY_PROJECT_KEY = 'mediburgh';

const SUPPORTED_PERSONALITY_PROJECTS = Object.freeze({
  mediburgh: {
    name: 'MediBurgh',
    repo: 'mediburgh',
    instructions: 'Send codes to MediBurgh repo.',
  },
  manix: {
    name: 'Manix',
    repo: 'manix',
    instructions: 'Send codes to Manix repo.',
  },
});

function sanitizeProjectInput(projectInput) {
  if (projectInput == null) {
    return '';
  }

  return String(projectInput).trim();
}

function normalizeProjectKey(projectInput) {
  return sanitizeProjectInput(projectInput).toLowerCase();
}

function getDefaultProjectKey() {
  const envDefault = normalizeProjectKey(process.env.DEFAULT_PROJECT);

  if (envDefault && SUPPORTED_PERSONALITY_PROJECTS[envDefault]) {
    return envDefault;
  }

  return DEFAULT_PERSONALITY_PROJECT_KEY;
}

function buildProjectResponse(projectKey, { isFallback = false, requested } = {}) {
  const project = SUPPORTED_PERSONALITY_PROJECTS[projectKey] ??
    SUPPORTED_PERSONALITY_PROJECTS[DEFAULT_PERSONALITY_PROJECT_KEY];

  const response = {
    key: projectKey,
    name: project.name,
    repo: project.repo,
    instructions: project.instructions,
    isFallback,
  };

  if (requested) {
    response.requested = requested;
  }

  return response;
}

export function resolvePersonalityProject(projectInput) {
  const sanitizedRequested = sanitizeProjectInput(projectInput);
  const normalizedRequested = sanitizedRequested.toLowerCase();
  const defaultKey = getDefaultProjectKey();

  if (normalizedRequested && SUPPORTED_PERSONALITY_PROJECTS[normalizedRequested]) {
    return buildProjectResponse(normalizedRequested);
  }

  if (!normalizedRequested) {
    return buildProjectResponse(defaultKey);
  }

  return buildProjectResponse(defaultKey, {
    isFallback: true,
    requested: sanitizedRequested || projectInput,
  });
}

function cloneMatrix(matrix) {
  return JSON.parse(JSON.stringify(matrix));
}

export function getPersonalityMatrix() {
  return {
    enneagram: cloneMatrix(enneagram),
    attachment: cloneMatrix(attachment),
    mbti: cloneMatrix(mbti),
  };
}

export const personalityMatrix = Object.freeze(getPersonalityMatrix());

export function getPersonalitySummary() {
  const summary = {
    enneagramTypes: Object.keys(enneagram).length,
    attachmentStyles: Object.keys(attachment).length,
    mbtiTypes: Object.keys(mbti).length,
  };

  summary.totalEntries = summary.enneagramTypes + summary.attachmentStyles + summary.mbtiTypes;

  return summary;
}
