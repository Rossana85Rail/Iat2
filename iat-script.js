let timeline = [];

let subject_id = "";

let id_code = {
  type: jsPsychSurveyText,
  questions: [
    {prompt: "Inserisci le prime 3 lettere del tuo nome e le prime 3 del tuo cognome:", name: 'codice_id'}
  ],
  on_finish: function(data){
    subject_id = JSON.parse(data.responses)['codice_id'];
  }
};
timeline.push(id_code);

let instructions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Benvenuto al test IAT sull’orientamento sessuale.</p>
    <p>Premi <strong>E</strong> per le parole/immagini a sinistra e <strong>I</strong> per quelle a destra.</p>
    <p>Premi SPAZIO per iniziare.</p>`,
  choices: [' ']
};
timeline.push(instructions);

const categories = {
  "Omosessuali": [
    { stimulus: "gay", correct_response: 'e' },
    { stimulus: "lesbica", correct_response: 'e' },
    { stimulus: "immagini/gay1.jpg", is_image: true, correct_response: 'e' },
    { stimulus: "immagini/gay2.jpg", is_image: true, correct_response: 'e' }
  ],
  "Eterosessuali": [
    { stimulus: "etero", correct_response: 'i' },
    { stimulus: "coppia", correct_response: 'i' },
    { stimulus: "immagini/etero1.jpg", is_image: true, correct_response: 'i' },
    { stimulus: "immagini/etero2.jpg", is_image: true, correct_response: 'i' }
  ],
  "Positivo": [
    { stimulus: "felice", correct_response: 'e' },
    { stimulus: "amore", correct_response: 'e' }
  ],
  "Negativo": [
    { stimulus: "triste", correct_response: 'i' },
    { stimulus: "odio", correct_response: 'i' }
  ]
};

function create_trials(left_cat, right_cat, n=4) {
  let trials = [];
  let stimuli = categories[left_cat].concat(categories[right_cat]);
  for (let i = 0; i < n; i++) {
    let stim = jsPsych.randomization.sampleWithoutReplacement(stimuli, 1)[0];
    let trial = stim.is_image ? {
      type: jsPsychImageKeyboardResponse,
      stimulus: stim.stimulus,
      choices: ['e', 'i'],
      data: {stimulus: stim.stimulus, correct_response: stim.correct_response, category: stim.is_image ? "image" : "word"},
      on_finish: function(data){
        data.correct = data.response === stim.correct_response;
        data.subject_id = subject_id;
      }
    } : {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<p style="font-size: 48px;">${stim.stimulus}</p>`,
      choices: ['e', 'i'],
      data: {stimulus: stim.stimulus, correct_response: stim.correct_response, category: "word"},
      on_finish: function(data){
        data.correct = data.response === stim.correct_response;
        data.subject_id = subject_id;
      }
    };
    trials.push(trial);
  }
  return trials;
}

timeline.push(...create_trials("Omosessuali", "Eterosessuali"));
timeline.push(...create_trials("Positivo", "Negativo"));
timeline.push(...create_trials("Omosessuali", "Negativo"));
timeline.push(...create_trials("Eterosessuali", "Positivo"));

let debrief = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    return `<p>Grazie per aver partecipato!</p><p>Premi SPAZIO per terminare.</p>`;
  },
  choices: [' ']
};
timeline.push(debrief);

jsPsych.run(timeline);
