const timeline = [];

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p><strong>Benvenuto/a nel test IAT sull'orientamento sessuale</strong></p>
    <p>Ti chiediamo di inserire un codice identificativo composto dalle prime tre lettere del tuo nome e del tuo cognome.</p>
    <p><input id="codice" name="codice" type="text" /></p>
    <p>Premi SPAZIO per iniziare il test.</p>
  `,
  choices: [" "]
});

const categorie = {
  gay: ['immagini/gay1.PNG', 'immagini/gay2.PNG'],
  etero: ['immagini/etero1.PNG', 'immagini/etero2.PNG'],
  positivo: ['Amore', 'Gioia', 'Pace', 'Felicità'],
  negativo: ['Odio', 'Paura', 'Tristezza', 'Dolore']
};

function createImageStimuli(category, label) {
  return categorie[category].map(stim => ({
    stimulus: `<img src="${stim}" style="max-height:200px;">`,
    data: { category: label }
  }));
}

function createWordStimuli(words, label) {
  return words.map(word => ({
    stimulus: `<p style="font-size: 40px;">${word}</p>`,
    data: { category: label }
  }));
}

const trialsBlock1 = jsPsych.randomization.shuffle([
  ...createImageStimuli('gay', 'Gay'),
  ...createImageStimuli('etero', 'Etero')
]);

const trialsBlock2 = jsPsych.randomization.shuffle([
  ...createWordStimuli(categorie.positivo, 'Positivo'),
  ...createWordStimuli(categorie.negativo, 'Negativo')
]);

timeline.push({
  type: jsPsychImageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['f', 'j'],
  data: jsPsych.timelineVariable('data'),
  timeline: trialsBlock1.concat(trialsBlock2),
  prompt: "<p>Premi 'F' per categoria a sinistra, 'J' per categoria a destra.</p>"
});

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<p>Grazie per aver completato il test!</p><p>Puoi chiudere la finestra.</p>",
  choices: "NO_KEYS",
  trial_duration: 3000
});

jsPsych.run(timeline);
