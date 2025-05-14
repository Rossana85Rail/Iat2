const jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData('csv');
  }
});

const timeline = [];

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p><strong>Benvenuto!</strong></p>
    <p>Questo è un test IAT sull'omofobia.</p>
    <p>Per favore inserisci le prime tre lettere del tuo <strong>nome</strong> e del tuo <strong>cognome</strong> come codice identificativo.</p>
    <p>Scrivile nella casella qui sotto e premi INVIO.</p>
    <input id="codice" name="codice" type="text" />
  `,
  choices: ["Enter"],
  on_finish: function () {
    const codice = document.querySelector('#codice').value;
    jsPsych.data.addProperties({ codice: codice });
  }
});

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Premi il tasto "E" per le parole a sinistra, e "I" per le parole a destra.</p>
    <p>Rispondi il più rapidamente e accuratamente possibile.</p>
    <p>Premi la barra spaziatrice per iniziare.</p>
  `,
  choices: [" "]
});

// Categorie
const categorie = {
  omo: ["coppia gay", "omosessuali", "lesbica", "relazione omosessuale"],
  etero: ["coppia etero", "eterosessuali", "marito e moglie", "fidanzati"],
  positivo: ["felice", "amore", "rispetto", "gentile"],
  negativo: ["odio", "paura", "disgusto", "vergogna"]
};

// Fase: Associazione categorie
function creaTrialsStimuli(categoriaSx, categoriaDx) {
  const stimoli = [];
  categorie[categoriaSx].forEach(word => {
    stimoli.push({
      stimulus: word,
      data: { categoria: categoriaSx, corretta: 'e' }
    });
  });
  categorie[categoriaDx].forEach(word => {
    stimoli.push({
      stimulus: word,
      data: { categoria: categoriaDx, corretta: 'i' }
    });
  });
  return jsPsych.randomization.shuffle(stimoli);
}

function creaBlock(stimuli) {
  return {
    timeline: [{
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        return `<p style="font-size:32px;">${jsPsych.timelineVariable('stimulus', true)}</p>`;
      },
      choices: ['e', 'i'],
      data: jsPsych.timelineVariable('data'),
      on_finish: function (data) {
        data.correct = data.response === data.corretta;
      }
    }],
    timeline_variables: stimuli,
    repetitions: 1
  };
}

// Blocco 1: Omo (E) vs Etero (I)
timeline.push(creaBlock(creaTrialsStimuli("omo", "etero")));

// Blocco 2: Positivo (E) vs Negativo (I)
timeline.push(creaBlock(creaTrialsStimuli("positivo", "negativo")));

// Blocco 3: Omo+Negativo (E) vs Etero+Positivo (I)
const stim3 = creaTrialsStimuli("omo", "etero").concat(creaTrialsStimuli("negativo", "positivo"));
timeline.push(creaBlock(jsPsych.randomization.shuffle(stim3)));

// Blocco 4: Omo+Positivo (E) vs Etero+Negativo (I)
const stim4 = creaTrialsStimuli("omo", "etero").concat(creaTrialsStimuli("positivo", "negativo"));
timeline.push(creaBlock(jsPsych.randomization.shuffle(stim4)));

jsPsych.run(timeline);
